'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { useSound } from '@/context/SoundContext';
import { ShippingAddress } from '@/types/cart';
import { BRAND_CONFIG } from '@/config/brand';
import { getWhatsAppOrderUrl, WhatsAppIcon } from '@/utils/whatsapp';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Package,
  ExternalLink,
} from 'lucide-react';

export default function CheckoutPage() {
  const { cart, subtotalGHS, formatPrice, currency, clearCart } = useCart();
  const { playSuccess, playClick } = useSound();

  const [isInternational, setIsInternational] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('Greater Accra');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // Complimentary delivery on all orders
  const shippingFeeGHS = 0;
  const grandTotalGHS = subtotalGHS;

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    country: 'Ghana',
    region: 'Greater Accra',
    city: 'Accra',
    streetAddress: '',
    digitalAddress: '',
    notes: '',
  });

  const ghanaRegions = [
    'Greater Accra',
    'Ashanti (Kumasi)',
    'Western (Takoradi)',
    'Central (Cape Coast)',
    'Eastern (Koforidua)',
    'Volta (Ho)',
    'Northern (Tamale)',
    'Bono (Sunyani)',
    'Upper East',
    'Upper West',
  ];

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    playClick();

    const generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const waUrl = getWhatsAppOrderUrl({
      orderId: generatedOrderId,
      cart,
      address,
      isInternational,
      selectedRegion,
      subtotalGHS,
      shippingFeeGHS,
      grandTotalGHS,
      paymentMethod: 'whatsapp',
    });

    setOrderId(generatedOrderId);
    setWhatsappUrl(waUrl);

    // Save order record and send automated customer/admin email notifications via Resend
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: {
          orderNumber: generatedOrderId,
          customerName: address.fullName,
          customerEmail: address.email,
          customerPhone: address.phone,
          deliveryCity: address.city || address.region,
          deliveryAddress: address.streetAddress || address.digitalAddress || address.region,
          notes: address.notes,
          items: cart.map((item) => ({
            id: item.product.id,
            title: item.product.title,
            size: item.selectedSize,
            colorName: item.selectedColor.name,
            quantity: item.quantity,
            priceGHS: item.product.priceGHS,
          })),
          subtotalGHS,
          deliveryFeeGHS: shippingFeeGHS,
          totalGHS: grandTotalGHS,
        },
      }),
    }).catch((err) => console.warn('Email dispatch error:', err));

    // Open WhatsApp directly in new window/tab
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Fallback if popup blocked
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);
      playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#25D366', '#e6c387', '#ffffff'],
        });
      } catch {
        // Ignore in environments without canvas
      }
      clearCart();
    }, 1200);
  };

  if (orderComplete) {
    const firstName = address.fullName ? address.fullName.trim().split(' ')[0] : 'there';
    return (
      <div className="min-h-screen bg-[#08080a] text-zinc-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
        <div className="max-w-md w-full bg-[#0c0d12] border border-white/10 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl">
          <div className="relative w-12 h-14 mx-auto opacity-95">
            <Image
              src={BRAND_CONFIG.logoWhite}
              alt={BRAND_CONFIG.name}
              fill
              className="object-contain"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold uppercase tracking-tight text-white font-sans">
              Order Received
            </h1>
            <p className="text-sm text-zinc-400 font-sans">
              Thank you, {firstName}. Your pieces have been reserved.
            </p>
            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 font-mono text-xs">
                Order #{orderId}
              </span>
            </div>
          </div>

          {/* WhatsApp Direct Action */}
          {whatsappUrl && (
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-3">
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                If your WhatsApp chat didn&apos;t open automatically, tap below to message us directly to confirm delivery and payment.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-lg"
              >
                <WhatsAppIcon className="w-4 h-4 text-black" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>
          )}

          {/* Quiet Summary */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 space-y-2.5 text-left font-sans">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-zinc-500">Deliver to</span>
              <span className="text-zinc-200 text-right max-w-[200px] truncate">
                {address.streetAddress || address.city}, {isInternational ? address.country : selectedRegion}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-zinc-500">Payment</span>
              <span className="text-zinc-200">WhatsApp / MoMo</span>
            </div>
            <div className="flex justify-between pt-1 font-bold text-white">
              <span>Total</span>
              <span className="text-white font-mono">{formatPrice(grandTotalGHS)}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-white pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-white/5 pb-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-1 block font-sans">
              X-SIGN ATELIER
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-sans tracking-tight">
              CHECKOUT
            </h1>
          </div>
          <Link href="/shop" className="text-xs font-mono text-zinc-400 hover:text-white transition-colors">
            ← Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="py-24 text-center font-mono space-y-4">
            <Package className="w-12 h-12 text-zinc-600 mx-auto" />
            <p className="text-white text-lg font-bold">Your bag is currently empty.</p>
            <p className="text-xs text-zinc-400">Add pieces from the collection before proceeding to checkout.</p>
            <Link
              href="/shop"
              className="inline-block mt-4 px-6 py-3 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider"
            >
              Explore Runway Pieces
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Delivery & Payment Details */}
            <div className="lg:col-span-7 space-y-8">
              {/* Delivery Destination Selector */}
              <div className="p-6 rounded-2xl bg-[#0c0d12] border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                    Delivery Details
                  </h3>

                  <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsInternational(false)}
                      className={`px-3 py-1 rounded-full transition-all ${
                        !isInternational ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Ghana
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInternational(true)}
                      className={`px-3 py-1 rounded-full transition-all ${
                        isInternational ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Worldwide
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-400 text-[11px] uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 text-[11px] uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      placeholder="name@email.com"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 text-[11px] uppercase tracking-wider">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="e.g. 024 123 4567"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                    />
                  </div>

                  {!isInternational ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-zinc-400 text-[11px] uppercase tracking-wider">Region *</label>
                        <select
                          value={selectedRegion}
                          onChange={(e) => {
                            setSelectedRegion(e.target.value);
                            setAddress({ ...address, region: e.target.value });
                          }}
                          className="w-full p-3 rounded-xl bg-[#14151b] border border-white/10 text-white focus:outline-none"
                        >
                          {ghanaRegions.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-zinc-400 text-[11px] uppercase tracking-wider">
                          Ghana Post Digital Address
                        </label>
                        <input
                          type="text"
                          value={address.digitalAddress}
                          onChange={(e) => setAddress({ ...address, digitalAddress: e.target.value })}
                          placeholder="e.g. GA-183-9024"
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 uppercase font-mono"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <label className="text-zinc-400 text-[11px] uppercase tracking-wider">Country *</label>
                        <input
                          type="text"
                          required
                          value={address.country}
                          onChange={(e) => setAddress({ ...address, country: e.target.value })}
                          placeholder="United Kingdom, United States, Canada..."
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-zinc-400 text-[11px] uppercase tracking-wider">Postal / ZIP Code</label>
                        <input
                          type="text"
                          placeholder="SW1A 1AA, 10001..."
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 font-mono"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-400 text-[11px] uppercase tracking-wider">
                      Street Address & Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.streetAddress}
                      onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                      placeholder="e.g. Ring Road Central, near Shell station, Osu"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section - Clean Luxury Streetwear */}
              <div className="p-6 rounded-2xl bg-[#0c0d12] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                    Payment Method
                  </h3>
                  <span className="text-xs text-zinc-400">
                    MoMo & WhatsApp
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#25D366]/15 flex items-center justify-center shrink-0 text-[#25D366] mt-0.5">
                    <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-xs font-semibold text-white">
                      Confirm on WhatsApp
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      When you submit your order, your details will open directly in WhatsApp to finalize payment with MTN MoMo, Telecel Cash, or Bank Transfer.
                    </p>
                    <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px] text-zinc-500">
                      <span>MTN MoMo</span>
                      <span>•</span>
                      <span>Telecel Cash</span>
                      <span>•</span>
                      <span>Bank Transfer</span>
                      <span>•</span>
                      <span>Accra Same-Day Dispatch</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-[#0c0d12] border border-white/10 space-y-6">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  ORDER SUMMARY ({cart.reduce((t, i) => t + i.quantity, 0)} ITEMS)
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="flex gap-3 text-xs font-mono">
                      <div className="relative w-14 h-18 bg-zinc-900 rounded-lg overflow-hidden shrink-0">
                        <Image src={item.product.images[0]} alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{item.product.title}</p>
                        <p className="text-zinc-500 text-[11px]">
                          Size: {item.selectedSize} • {item.selectedColor.name} • Qty {item.quantity}
                        </p>
                        <p className="text-zinc-300 mt-1">
                          {formatPrice(item.product.priceGHS * item.quantity, item.product)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-white/10 pt-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-white">{formatPrice(subtotalGHS)}</span>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between text-base font-bold text-white">
                    <span>Total ({currency})</span>
                    <span className="text-white">{formatPrice(grandTotalGHS)}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-xl bg-white hover:bg-zinc-200 text-black disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Complete Order • {formatPrice(grandTotalGHS)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-zinc-500 text-center leading-relaxed font-sans">
                  Orders are dispatched from Accra with direct WhatsApp tracking.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
