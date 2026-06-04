import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear admin_session cookie
  response.cookies.set('admin_session', '', {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // Set expiry in the past to delete it
  });

  return response;
}
