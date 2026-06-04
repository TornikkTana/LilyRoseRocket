import { NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/lib/orders';
import { getFlittOrderStatus } from '@/lib/flitt';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId parameter.' }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // Call Flitt get order status
    try {
      const flittDetails = await getFlittOrderStatus(orderId);
      
      // Map Flitt status to our Order status
      // Flitt status strings: 'created' | 'processing' | 'declined' | 'approved' | 'expired' | 'reversed'
      let finalStatus: typeof order.status = 'Pending';
      
      if (flittDetails.order_status === 'approved') {
        finalStatus = 'Succeeded';
      } else if (flittDetails.order_status === 'declined') {
        finalStatus = 'Failed';
      } else if (flittDetails.order_status === 'expired') {
        finalStatus = 'Expired';
      } else if (flittDetails.order_status === 'processing' || flittDetails.order_status === 'created') {
        finalStatus = 'Processing';
      }

      if (order.status !== finalStatus) {
        await updateOrderStatus(orderId, finalStatus);
        order.status = finalStatus;
      }
    } catch (flittError) {
      console.error('Error fetching details from Flitt:', flittError);
      // Fallback: return the local order status if we couldn't talk to Flitt
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Order status endpoint error:', error);
    return NextResponse.json({ error: error.message || 'Failed to check order status.' }, { status: 500 });
  }
}
