import crypto from 'crypto';

interface FlittRequestParams {
  merchant_id: number;
  order_id: string;
  amount: number;
  currency: string;
  order_desc: string;
  response_url: string;
  server_callback_url: string;
  signature?: string;
  [key: string]: any;
}

interface FlittResponse {
  response: {
    response_status: 'success' | 'failure';
    checkout_url?: string;
    payment_id?: string;
    error_message?: string;
    error_code?: string;
  };
}

const MERCHANT_ID = parseInt(process.env.FLITT_MERCHANT_ID || '1549901', 10);
const SECRET_KEY = process.env.FLITT_SECRET || 'test';
const BASE_URL = 'https://pay.flitt.com';

/**
 * Generates the SHA1 signature for Flitt requests and callbacks.
 * 1. Filter out empty parameters (null, undefined, empty string) and the 'signature' parameter itself.
 * 2. Sort the remaining parameter keys alphabetically.
 * 3. Prepend the merchant secret key to the parameter values.
 * 4. Join all values with a '|' character.
 * 5. Compute the SHA1 hash of the resulting string.
 */
export function generateFlittSignature(params: Record<string, any>, secret: string = SECRET_KEY): string {
  const filteredParams: Record<string, string | number> = {};
  
  for (const key of Object.keys(params)) {
    const val = params[key];
    // Exclude signature and any empty values
    if (key !== 'signature' && val !== undefined && val !== null && val !== '') {
      filteredParams[key] = val;
    }
  }

  // Sort keys alphabetically
  const sortedKeys = Object.keys(filteredParams).sort();

  // Map to sorted values
  const values = sortedKeys.map(key => filteredParams[key]);

  // Prepend secret key and join with pipe
  const stringToHash = [secret, ...values].join('|');

  // Return SHA1 hash
  return crypto.createHash('sha1').update(stringToHash).digest('hex');
}

/**
 * Initiates a checkout URL with Flitt.
 * @param amount - The order amount (in GEL/USD/EUR). It will be converted to subunits (tetri/cents) automatically.
 * @param orderId - The unique merchant-side order ID.
 * @param returnUrl - The URL to redirect the user's browser to after checkout completes.
 */
export async function createFlittCheckoutUrl(
  amount: number,
  orderId: string,
  returnUrl: string
): Promise<{ checkoutUrl: string; paymentId: string }> {
  
  // Flitt expects amount in subunits (e.g. 100 for 1.00 GEL, 12050 for 120.50 GEL)
  const amountSubunits = Math.round(amount * 100);

  const requestUrl = new URL(returnUrl);
  // Ensure the server callback URL goes to our flitt webhook handler
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${requestUrl.protocol}//${requestUrl.host}`;
  const callbackUrl = `${siteUrl}/api/payments/flitt/callback`;

  const params: FlittRequestParams = {
    merchant_id: MERCHANT_ID,
    order_id: orderId,
    amount: amountSubunits,
    currency: 'GEL',
    order_desc: `Lilyrose Shop Order ${orderId}`,
    response_url: returnUrl,
    server_callback_url: callbackUrl,
  };

  // Generate signature
  const signature = generateFlittSignature(params, SECRET_KEY);
  params.signature = signature;

  const response = await fetch(`${BASE_URL}/api/checkout/url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ request: params }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Flitt checkout url creation failed:', errText);
    throw new Error(`Failed to create Flitt checkout URL: ${response.statusText}`);
  }

  const data = (await response.json()) as FlittResponse;
  
  if (data.response.response_status === 'failure') {
    throw new Error(data.response.error_message || `Flitt API error code ${data.response.error_code}`);
  }

  if (!data.response.checkout_url || !data.response.payment_id) {
    throw new Error('Invalid response structure from Flitt checkout URL API.');
  }

  return {
    checkoutUrl: data.response.checkout_url,
    paymentId: data.response.payment_id.toString(),
  };
}

/**
 * Validates the authenticity of a callback from Flitt by re-computing the signature.
 */
export function validateFlittCallbackSignature(params: Record<string, any>, receivedSignature: string): boolean {
  if (!receivedSignature) return false;
  const computedSignature = generateFlittSignature(params, SECRET_KEY);
  return computedSignature.toLowerCase() === receivedSignature.toLowerCase();
}

interface FlittStatusResponse {
  response: {
    response_status: 'success' | 'failure';
    order_status?: 'created' | 'processing' | 'declined' | 'approved' | 'expired' | 'reversed';
    error_message?: string;
    error_code?: string;
    [key: string]: any;
  };
}

/**
 * Queries the status of an order directly from Flitt.
 * @param orderId - The unique merchant-side order ID.
 */
export async function getFlittOrderStatus(orderId: string): Promise<FlittStatusResponse['response']> {
  const params = {
    order_id: orderId,
    version: '1.0.1',
    merchant_id: MERCHANT_ID,
  };

  const signature = generateFlittSignature(params, SECRET_KEY);
  const requestBody = {
    request: {
      ...params,
      signature,
    },
  };

  const response = await fetch(`${BASE_URL}/api/status/order_id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`Flitt status query failed for order ${orderId}:`, errText);
    throw new Error(`Failed to query Flitt order status: ${response.statusText}`);
  }

  const data = (await response.json()) as FlittStatusResponse;
  return data.response;
}

