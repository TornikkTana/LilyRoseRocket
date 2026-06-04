import { NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/lib/orders';
import { validateFlittCallbackSignature } from '@/lib/flitt';

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      console.warn('Empty or non-JSON body in Flitt callback.');
      return NextResponse.json({ error: 'Empty body' }, { status: 400 });
    }

    console.log('Received Flitt Callback Body:', JSON.stringify(body));

    const signature = body.signature;
    const orderId = body.order_id;
    const orderStatus = body.order_status;

    if (!orderId) {
      console.error('Flitt callback received without order_id.');
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    // Validate Signature
    const isValid = validateFlittCallbackSignature(body, signature);
    if (!isValid) {
      console.error(`Invalid Flitt callback signature for order: ${orderId}. Received: ${signature}`);
      return NextResponse.json({ error: 'Invalid signature verification' }, { status: 400 });
    }

    console.log(`Validated Flitt callback signature for order: ${orderId}`);

    // Verify order exists locally
    const order = await getOrderById(orderId);
    if (!order) {
      console.warn(`Order with orderId ${orderId} not found in local orders.json.`);
      // Return 200 so Flitt stops retrying
      return NextResponse.json({ success: true, message: 'Order not found locally.' });
    }

    // Map Flitt order_status to local Order status
    // Flitt status: 'created' | 'processing' | 'declined' | 'approved' | 'expired' | 'reversed'
    let finalStatus: typeof order.status = 'Pending';

    if (orderStatus === 'approved') {
      finalStatus = 'Succeeded';
    } else if (orderStatus === 'declined') {
      finalStatus = 'Failed';
    } else if (orderStatus === 'expired') {
      finalStatus = 'Expired';
    } else if (orderStatus === 'processing' || orderStatus === 'created') {
      finalStatus = 'Processing';
    }

    await updateOrderStatus(orderId, finalStatus);
    console.log(`Successfully updated order ${orderId} status to ${finalStatus} via Flitt callback`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in Flitt callback handler:', error);
    // Return 200 so Flitt stops retrying if it's an unrecoverable server error
    return NextResponse.json({ error: error.message || 'Callback handling failed' }, { status: 200 });
  }
}
