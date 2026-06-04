import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';
import { getOrders } from '@/lib/orders';

async function isAuthorized() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  const decoded = await verifyJwt(token);
  return !!decoded;
}

export async function GET() {
  try {
    if (!(await isAuthorized())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
