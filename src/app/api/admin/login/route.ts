import { NextResponse } from 'next/server';
import { signToken, validateCredentials } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const payload = {
      username,
      role: 'administrator',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    const token = signToken(payload);

    const response = NextResponse.json({ success: true });
    
    // Set admin_session cookie
    response.cookies.set('admin_session', token, {
      httpOnly: false, // Can be read by client JS (required for client-side session checks)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}
