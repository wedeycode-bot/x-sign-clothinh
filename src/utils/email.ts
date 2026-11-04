import { Resend } from 'resend';
import { BRAND_CONFIG } from '@/config/brand';

interface OrderItem {
  id: string;
  title: string;
  size: string;
  colorName: string;
  quantity: number;
  priceGHS: number;
}

interface OrderData {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  notes?: string;
  items: OrderItem[];
  subtotalGHS: number;
  deliveryFeeGHS: number;
  totalGHS: number;
  orderNumber?: string;
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new Resend(apiKey.trim());
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== '');
}

export async function sendOrderNotificationEmails(order: OrderData): Promise<{
  success: boolean;
  customerSent: boolean;
  adminSent: boolean;
  error?: string;
}> {
  const resend = getResendClient();

  if (!resend) {
    console.warn('[email] RESEND_API_KEY is not configured in .env.local. Skipping email dispatch.');
    return {
      success: false,
      customerSent: false,
      adminSent: false,
      error: 'RESEND_API_KEY not configured',
    };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'X-SIGN Atelier <onboarding@resend.dev>';
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || BRAND_CONFIG.contactEmail;
  const orderRef = order.orderNumber || `XSN-${Math.floor(100000 + Math.random() * 900000)}`;

  const itemsHtml = order.items
    .map(
      (item) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 12px 0;">
            <strong style="color: #ffffff; font-size: 14px;">${item.title}</strong><br />
            <span style="color: #a1a1aa; font-size: 12px;">Color: ${item.colorName} • Size: ${item.size}</span>
          </td>
          <td style="padding: 12px 0; text-align: center; color: #d4d4d8; font-size: 13px;">
            ${item.quantity}
          </td>
          <td style="padding: 12px 0; text-align: right; color: #ffffff; font-weight: 600; font-size: 14px;">
            GH₵ ${item.priceGHS * item.quantity}
          </td>
        </tr>
      `
    )
    .join('');

  let customerSent = false;
  let adminSent = false;

  // 1. Send Order Alert to Brand Owner / Manager
  try {
    const adminHtml = `
      <div style="background-color: #08080a; color: #ffffff; padding: 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px;">
          <span style="font-size: 10px; font-family: monospace; letter-spacing: 2px; color: #10b981; text-transform: uppercase;">New Order Received</span>
          <h1 style="margin: 6px 0 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">ORDER #${orderRef}</h1>
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #a1a1aa;">Customer Information</h3>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Name:</strong> ${order.customerName}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Phone / WhatsApp:</strong> <a href="https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}" style="color: #25D366; text-decoration: none;">${order.customerPhone} (Click to Chat)</a></p>
          ${order.customerEmail ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> ${order.customerEmail}</p>` : ''}
          <p style="margin: 4px 0; font-size: 14px;"><strong>Delivery Location:</strong> ${order.deliveryCity} — ${order.deliveryAddress}</p>
          ${order.notes ? `<p style="margin: 4px 0; font-size: 14px; color: #fbbf24;"><strong>Notes:</strong> ${order.notes}</p>` : ''}
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.15); color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
              <th style="padding-bottom: 8px; text-align: left;">Piece</th>
              <th style="padding-bottom: 8px; text-align: center;">Qty</th>
              <th style="padding-bottom: 8px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; color: #a1a1aa; margin-bottom: 6px;">
            <span>Subtotal:</span>
            <span>GH₵ ${order.subtotalGHS}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #ffffff; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.1);">
            <span>TOTAL:</span>
            <span style="color: #10b981;">GH₵ ${order.totalGHS}</span>
          </div>
        </div>

        <div style="text-align: center; padding-top: 12px;">
          <a href="https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${order.customerName}, this is X-SIGN Atelier regarding your order #${orderRef}.`)}" style="display: inline-block; background-color: #25D366; color: #000000; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 10px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
            Open WhatsApp With Customer
          </a>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `⚡ New Order: GH₵ ${order.totalGHS} • ${order.customerName} (#${orderRef})`,
      html: adminHtml,
    });
    adminSent = true;
  } catch (err) {
    console.error('[email] Failed to send admin order email:', err);
  }

  // 2. Send Receipt to Customer (if customer provided an email address)
  if (order.customerEmail && order.customerEmail.includes('@')) {
    try {
      const customerHtml = `
        <div style="background-color: #0c0d12; color: #ffffff; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 24px; margin-bottom: 28px;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 4px;">X-SIGN</h1>
            <span style="font-size: 11px; font-family: monospace; letter-spacing: 2px; color: #a1a1aa; text-transform: uppercase;">Official Atelier Order Confirmation</span>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #e4e4e7;">
            Hi <strong>${order.customerName}</strong>,<br />
            Thank you for shopping with X-SIGN. Your order has been placed successfully and logged with our Accra fulfillment team.
          </p>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; margin: 24px 0;">
            <div style="font-size: 11px; font-family: monospace; color: #71717a; text-transform: uppercase; margin-bottom: 4px;">Reference Code</div>
            <div style="font-size: 18px; font-weight: 700; color: #ffffff; font-family: monospace;">#${orderRef}</div>
          </div>

          <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #a1a1aa; margin: 24px 0 12px;">Pieces in this Order</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.15); color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                <th style="padding-bottom: 8px; text-align: left;">Item</th>
                <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                <th style="padding-bottom: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px; margin-bottom: 28px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #a1a1aa; margin-bottom: 6px;">
              <span>Subtotal:</span>
              <span>GH₵ ${order.subtotalGHS}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #ffffff; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.1);">
              <span>TOTAL:</span>
              <span style="color: #ffffff;">GH₵ ${order.totalGHS}</span>
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <h4 style="margin: 0 0 8px; font-size: 14px; font-weight: 700;">Delivery & Dispatch Next Steps</h4>
            <p style="margin: 0; font-size: 12px; color: #a1a1aa; line-height: 1.5;">
              Our team will reach out via WhatsApp at <strong>${order.customerPhone}</strong> to confirm dispatch timing and dispatch details.
            </p>
          </div>

          <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
            <p style="margin: 0; font-size: 11px; font-family: monospace; color: #52525b;">
              X-SIGN ATELIER • ACCRA, GHANA • ${BRAND_CONFIG.contactPhone}
            </p>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: fromEmail,
        to: order.customerEmail,
        subject: `Order Confirmation #${orderRef} • X-SIGN Atelier`,
        html: customerHtml,
      });
      customerSent = true;
    } catch (err) {
      console.error('[email] Failed to send customer receipt email:', err);
    }
  }

  return {
    success: adminSent || customerSent,
    customerSent,
    adminSent,
  };
}

export async function sendTestNotificationEmail(targetEmail: string): Promise<{ success: boolean; message: string }> {
  const resend = getResendClient();
  if (!resend) {
    return {
      success: false,
      message: 'RESEND_API_KEY is not defined in .env.local. Add your key first.',
    };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'X-SIGN Atelier <onboarding@resend.dev>';

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: targetEmail,
      subject: '✓ X-SIGN Atelier • Test Email Notification',
      html: `
        <div style="background-color: #0c0d12; color: #ffffff; padding: 40px; font-family: sans-serif; max-width: 500px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 800; letter-spacing: 2px;">X-SIGN ATELIER</h1>
          <p style="color: #10b981; font-weight: 600; font-size: 14px;">✓ Resend Integration Active & Verified</p>
          <p style="color: #a1a1aa; font-size: 13px; line-height: 1.6;">
            Your email notifications are functioning properly. When a customer places an order on your storefront, you will receive real-time notifications directly to this inbox.
          </p>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 11px; color: #71717a; font-family: monospace;">
            TIMESTAMP: ${new Date().toISOString()}
          </div>
        </div>
      `,
    });

    if (data.error) {
      return { success: false, message: data.error.message };
    }

    return { success: true, message: `Test email sent successfully to ${targetEmail}!` };
  } catch (err: any) {
    return { success: false, message: err.message || 'Error sending test email' };
  }
}

export async function sendStatusUpdateEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  status: 'confirmed' | 'dispatched' | 'completed'
): Promise<{ success: boolean; message: string }> {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, message: 'Resend API key missing' };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'X-SIGN Atelier <onboarding@resend.dev>';

  let title = 'Order Update';
  let bodyMessage = '';

  if (status === 'confirmed') {
    title = 'Order Confirmed & Atelier Packaged';
    bodyMessage = `Your order <strong>#${orderNumber}</strong> has been verified by the X-SIGN team. Our pattern-makers and finishing crew have packaged your pieces.`;
  } else if (status === 'dispatched') {
    title = 'Out for Delivery / Dispatched';
    bodyMessage = `Your order <strong>#${orderNumber}</strong> has been handed over to our dispatch courier and is on its way to your delivery address!`;
  } else if (status === 'completed') {
    title = 'Order Delivered';
    bodyMessage = `Your order <strong>#${orderNumber}</strong> has been marked as delivered. Wear it with pride and tag us on Instagram <strong>${BRAND_CONFIG.socials.instagram}</strong>!`;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject: `Order Update: ${title} • #${orderNumber}`,
      html: `
        <div style="background-color: #0c0d12; color: #ffffff; padding: 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 24px;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 3px;">X-SIGN</h1>
            <span style="font-size: 11px; font-family: monospace; letter-spacing: 2px; color: #10b981; text-transform: uppercase;">${title}</span>
          </div>

          <p style="font-size: 15px; color: #e4e4e7; line-height: 1.6;">
            Hi <strong>${customerName}</strong>,
          </p>

          <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">
            ${bodyMessage}
          </p>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; margin: 24px 0;">
            <div style="font-size: 11px; font-family: monospace; color: #71717a; text-transform: uppercase;">Order Reference</div>
            <div style="font-size: 16px; font-weight: 700; color: #ffffff; font-family: monospace;">#${orderNumber}</div>
          </div>

          <div style="text-align: center; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08);">
            <p style="margin: 0; font-size: 11px; color: #71717a; font-family: monospace;">
              Need help? WhatsApp us directly at ${BRAND_CONFIG.contactPhone}
            </p>
          </div>
        </div>
      `,
    });
    return { success: true, message: `Notification sent to ${customerEmail}` };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to dispatch email update' };
  }
}
