import fs from 'fs/promises';
import path from 'path';

export interface StoredOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  notes?: string;
  items: {
    id: string;
    title: string;
    size: string;
    colorName: string;
    quantity: number;
    priceGHS: number;
  }[];
  subtotalGHS: number;
  deliveryFeeGHS: number;
  totalGHS: number;
  status: 'received' | 'confirmed' | 'dispatched' | 'completed';
  createdAt: string;
}

const ORDERS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'orders.json');

let inMemoryOrders: StoredOrder[] = [];

export async function getStoredOrders(): Promise<StoredOrder[]> {
  try {
    const fileContent = await fs.readFile(ORDERS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(fileContent);
    if (Array.isArray(parsed)) {
      inMemoryOrders = parsed;
      return parsed;
    }
  } catch {
    // If file doesn't exist yet, return in-memory
  }
  return inMemoryOrders;
}

export async function saveStoredOrders(orders: StoredOrder[]): Promise<void> {
  inMemoryOrders = orders;
  try {
    await fs.writeFile(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (error) {
    console.error('[orderStore] Error saving orders to disk:', error);
  }
}

export async function addStoredOrder(order: Omit<StoredOrder, 'id' | 'createdAt' | 'status'>): Promise<StoredOrder> {
  const orders = await getStoredOrders();
  const newOrder: StoredOrder = {
    ...order,
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    status: 'received',
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  await saveStoredOrders(orders);
  return newOrder;
}

export async function updateOrderStatus(
  orderId: string,
  status: StoredOrder['status']
): Promise<StoredOrder | null> {
  const orders = await getStoredOrders();
  const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;

  order.status = status;
  await saveStoredOrders(orders);
  return order;
}
