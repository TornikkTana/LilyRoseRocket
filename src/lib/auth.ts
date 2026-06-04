import crypto from 'crypto';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lilyrose2026';
const JWT_SECRET = process.env.JWT_SECRET || 'lilyrose-secret-key-1234567890-abcdef';

export async function verifyJwt(token: string) {
  try {
    if (!token) return null;
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return null;
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(payloadBase64)
      .digest('hex');
      
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    if (payload.expiresAt < Date.now()) return null;
    
    return payload;
  } catch {
    return null;
  }
}

export function signToken(payload: any) {
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(payloadBase64)
    .digest('hex');
  return `${payloadBase64}.${signature}`;
}

export function validateCredentials(username?: string, password?: string) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

