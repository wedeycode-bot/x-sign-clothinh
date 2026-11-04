import React from 'react';
import { CartItem, ShippingAddress, PaymentMethod } from '@/types/cart';
import { BRAND_CONFIG } from '@/config/brand';

export function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export interface BuildWhatsAppOrderParams {
  orderId: string;
  cart: CartItem[];
  address: ShippingAddress;
  isInternational: boolean;
  selectedRegion: string;
  subtotalGHS: number;
  shippingFeeGHS: number;
  grandTotalGHS: number;
  paymentMethod?: PaymentMethod;
}

export function formatWhatsAppOrderMessage({
  orderId,
  cart,
  address,
  isInternational,
  selectedRegion,
  subtotalGHS,
  shippingFeeGHS,
  grandTotalGHS,
}: BuildWhatsAppOrderParams): string {
  const itemsText = cart
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.title}*\n   • Qty: ${item.quantity} | Size: ${item.selectedSize} | Color: ${item.selectedColor.name}\n   • Price: GH₵ ${(item.product.priceGHS * item.quantity).toLocaleString()}`
    )
    .join('\n\n');

  const destination = isInternational
    ? `${address.streetAddress || 'N/A'}, ${address.city || 'N/A'}, ${address.country || 'International'}`
    : `${address.streetAddress || 'N/A'}, ${address.city || 'Accra'}, ${selectedRegion}`;

  const message = `🔥 *NEW ORDER — ${BRAND_CONFIG.name} STORE*
━━━━━━━━━━━━━━━━━━━━
*Order Ref:* \`${orderId}\`

👤 *CUSTOMER DETAILS:*
• *Name:* ${address.fullName || 'Valued Collector'}
• *Phone:* ${address.phone || 'N/A'}
• *Email:* ${address.email || 'N/A'}
• *Delivery Address:* ${destination}
${address.digitalAddress ? `• *Ghana Post GPS:* ${address.digitalAddress}\n` : ''}${address.notes ? `• *Special Instructions:* ${address.notes}\n` : ''}
🛍️ *ORDER PIECES (${cart.reduce((sum, item) => sum + item.quantity, 0)} items):*
${itemsText}

━━━━━━━━━━━━━━━━━━━━
💰 *PAYMENT:*
• *Total Payable:* *GH₵ ${grandTotalGHS.toLocaleString()}*
• *Payment Channel:* WhatsApp Direct Pay
━━━━━━━━━━━━━━━━━━━━

Hello ${BRAND_CONFIG.name} Atelier team! 👋
I am ready to complete payment for this order via WhatsApp. Please send payment details!`;

  return message;
}

export function getWhatsAppOrderUrl(params: BuildWhatsAppOrderParams): string {
  const cleanNumber = BRAND_CONFIG.whatsappPhoneClean || '233530813362';
  const message = formatWhatsAppOrderMessage(params);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppCartUrl(cart: CartItem[], subtotalGHS: number): string {
  const cleanNumber = BRAND_CONFIG.whatsappPhoneClean || '233530813362';
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const itemsText = cart
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.title}* (Size: ${item.selectedSize}, Color: ${item.selectedColor.name}, Qty: ${item.quantity}) — GH₵ ${(item.product.priceGHS * item.quantity).toLocaleString()}`
    )
    .join('\n');

  const message = `👋 Hello ${BRAND_CONFIG.name} Atelier!
I would like to place an order for the following items in my bag (${totalItems} items):

${itemsText}

*Estimated Subtotal:* GH₵ ${subtotalGHS.toLocaleString()}

Please let me know how to make payment and confirm delivery!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
