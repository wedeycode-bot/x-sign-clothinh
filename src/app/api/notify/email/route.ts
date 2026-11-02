import { NextResponse } from 'next/server';
import { sendOrderNotificationEmails, sendTestNotificationEmail, isEmailConfigured } from '@/utils/email';

export async function GET() {
  return NextResponse.json({
    configured: isEmailConfigured(),
    adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'xsignclothing@gmail.com',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if this is a test email request
    if (body.action === 'test') {
      const target = body.targetEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'xsignclothing@gmail.com';
      const result = await sendTestNotificationEmail(target);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    // Otherwise, process order notification
    const { order } = body;
    if (!order || !order.customerName || !order.items) {
      return NextResponse.json({ success: false, message: 'Invalid order data provided' }, { status: 400 });
    }

    const result = await sendOrderNotificationEmails(order);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Email API route error:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Server error' }, { status: 500 });
  }
}
