import { NextResponse } from 'next/server';
import { getBouquets } from '@/lib/bouquets';
import { saveOrder, Order } from '@/lib/orders';
import { createFlittCheckoutUrl } from '@/lib/flitt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, district, address, cartItems } = body;

    if (!name || !phone || !district || !address || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Missing required checkout information or empty cart.' }, { status: 400 });
    }

    // Fetch bouquets from our local DB to calculate prices securely
    const dbBouquets = await getBouquets();
    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const bouquetId = item.bouquet?.id;
      const quantity = item.quantity;
      if (!bouquetId || !quantity || quantity <= 0) {
        return NextResponse.json({ error: 'Invalid cart items.' }, { status: 400 });
      }

      // Find the bouquet in our database
      const dbBouquet = dbBouquets.find(b => b.id === bouquetId);
      if (!dbBouquet) {
        return NextResponse.json({ error: `Bouquet with ID ${bouquetId} not found in catalog.` }, { status: 400 });
      }

      // Parse the price (e.g. "₾ 120" or "120" -> 120)
      const numericPrice = parseFloat(dbBouquet.price.replace(/[^\d.]/g, ''));
      if (isNaN(numericPrice)) {
        return NextResponse.json({ error: `Invalid price format for bouquet: ${dbBouquet.name}` }, { status: 500 });
      }

      calculatedTotal += numericPrice * quantity;
      orderItems.push({
        bouquetId: dbBouquet.id,
        name: dbBouquet.name || dbBouquet.nameKey || 'Bouquet',
        quantity,
        price: numericPrice,
      });
    }

    // Generate unique Order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Build return url
    const requestUrl = new URL(request.url);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${requestUrl.protocol}//${requestUrl.host}`;
    const returnUrl = `${siteUrl}/?orderId=${orderId}`;

    // Create payment in Flitt
    const flittResponse = await createFlittCheckoutUrl(calculatedTotal, orderId, returnUrl);

    // Save the order with "Pending" status (waiting for successful payment)
    const newOrder: Order = {
      id: orderId,
      payId: flittResponse.paymentId,
      name,
      phone,
      district,
      address,
      items: orderItems,
      totalPrice: calculatedTotal,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    await saveOrder(newOrder);

    return NextResponse.json({
      redirectUrl: flittResponse.checkoutUrl,
      orderId,
      payId: flittResponse.paymentId,
    });
  } catch (error: any) {
    console.error('Checkout initiate error:', error);
    return NextResponse.json({ error: error.message || 'Failed to initiate checkout.' }, { status: 500 });
  }
}
