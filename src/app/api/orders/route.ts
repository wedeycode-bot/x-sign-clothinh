import { NextResponse } from 'next/server';
import { getStoredOrders, addStoredOrder, updateOrderStatus } from '@/utils/orderStore';
import { sendOrderNotificationEmails, sendStatusUpdateEmail } from '@/utils/email';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await getStoredOrders();
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order } = body;

    if (!order || !order.customerName || !order.items) {
      return NextResponse.json({ success: false, message: 'Invalid order data' }, { status: 400 });
    }

    const saved = await addStoredOrder(order);

    // Trigger emails in background
    sendOrderNotificationEmails(order).catch((err) =>
      console.warn('[orders API] Background email failure:', err)
    );

    return NextResponse.json({ success: true, order: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status, sendEmail } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, message: 'Missing orderId or status' }, { status: 400 });
    }

    const updated = await updateOrderStatus(orderId, status);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // If requested and customer has email, send dispatch update
    if (sendEmail && updated.customerEmail && updated.customerEmail.includes('@')) {
      sendStatusUpdateEmail(
        updated.customerEmail,
        updated.customerName,
        updated.orderNumber,
        status
      ).catch((err) => console.warn('[orders API] Status email dispatch error:', err));
    }

    return NextResponse.json({
      success: true,
      order: updated,
      message: `Order #${updated.orderNumber} updated to ${status}.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
