import fs from 'fs/promises';
import path from 'path';

export interface OrderItem {
  bouquetId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string; // Our generated orderId (e.g. order_123456...)
  payId: string; // Flitt payment ID
  name: string;
  phone: string;
  district: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Created' | 'Processing' | 'Succeeded' | 'Failed' | 'Expired' | 'Pending';
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'orders.json');

export async function getOrders(): Promise<Order[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data) as Order[];
    // Sort by createdAt descending
    return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    // If the file does not exist, return an empty array
    return [];
  }
}

export async function saveOrder(order: Order): Promise<Order> {
  const orders = await getOrders();
  // Remove duplicate if it somehow exists (e.g. retry)
  const filtered = orders.filter(o => o.id !== order.id);
  filtered.push(order);
  
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find(o => o.id === id) || null;
}

export async function getOrderByPayId(payId: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find(o => o.payId === payId) || null;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  const orders = await getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;
  
  orders[index].status = status;
  
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  return orders[index];
}

export async function updateOrderStatusByPayId(payId: string, status: Order['status']): Promise<Order | null> {
  const orders = await getOrders();
  const index = orders.findIndex(o => o.payId === payId);
  if (index === -1) return null;
  
  orders[index].status = status;
  
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  return orders[index];
}
