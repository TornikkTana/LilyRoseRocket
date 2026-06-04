import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';
import { getBouquets, saveBouquet, deleteBouquet, updateBouquet } from '@/lib/bouquets';

// Helper to check authorization
async function isAuthorized() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  const decoded = await verifyJwt(token);
  return !!decoded;
}

export async function GET() {
  try {
    const bouquets = await getBouquets();
    return NextResponse.json(bouquets);
  } catch (error) {
    console.error('Error fetching bouquets:', error);
    return NextResponse.json({ error: 'Failed to fetch bouquets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthorized())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, price, category, description, image } = body;

    if (!name || !price || !category || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBouquet = await saveBouquet({
      name,
      price: `₾ ${price}`,
      category,
      description: description || '',
      src: image,
      alt: description || name,
    });

    return NextResponse.json({ success: true, bouquet: newBouquet });
  } catch (error) {
    console.error('Error saving bouquet:', error);
    return NextResponse.json({ error: 'Failed to save bouquet' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAuthorized())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    if (!idStr) {
      return NextResponse.json({ error: 'Missing bouquet ID' }, { status: 400 });
    }

    const id = parseInt(idStr, 10);
    const success = await deleteBouquet(id);
    if (!success) {
      return NextResponse.json({ error: 'Bouquet not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bouquet:', error);
    return NextResponse.json({ error: 'Failed to delete bouquet' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAuthorized())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, price, category, description, image } = body;

    if (!id || !name || !price || !category || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure the price has the ₾ sign or format it
    // If they input "₾ 120", keep it. If they input "120", format it as "₾ 120".
    const rawPrice = price.replace(/[^\d.]/g, '').trim();
    const formattedPrice = `₾ ${rawPrice}`;

    const updated = await updateBouquet(id, {
      name,
      price: formattedPrice,
      category,
      description: description || '',
      src: image,
      alt: description || name,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Bouquet not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, bouquet: updated });
  } catch (error) {
    console.error('Error updating bouquet:', error);
    return NextResponse.json({ error: 'Failed to update bouquet' }, { status: 500 });
  }
}
