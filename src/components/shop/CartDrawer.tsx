'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { BRAND_CONFIG } from '@/config/brand';
import { getWhatsAppCartUrl, WhatsAppIcon } from '@/utils/whatsapp';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotalGHS,
    formatPrice,
    currency,
  } = useCart();
  const { theme } = useTheme();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const logoSrc = theme === 'light' ? BRAND_CONFIG.logoBlack : BRAND_CONFIG.logoWhite;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={closeCart} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#0a0b0e] border-l border-black/10 dark:border-white/10 h-full flex flex-col shadow-2xl z-10 transition-colors duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-950 dark:text-white">Shopping Bag</h3>
            <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-mono text-zinc-700 dark:text-zinc-300 font-bold">
              {cart.reduce((t, i) => t + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="relative w-16 h-20 mb-4 opacity-40">
                <Image
                  src={logoSrc}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-zinc-900 dark:text-zinc-300 font-medium mb-1">Your bag is currently empty</p>
              <p className="text-xs font-mono text-zinc-500 mb-6">
                Explore our limited edition drop before it sells out.
              </p>
              <button
                onClick={closeCart}
                className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="flex gap-4 p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-black/10 dark:border-white/5"
              >
                {/* Product Thumbnail */}
                <div className="relative w-20 h-24 bg-zinc-200 dark:bg-zinc-900 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-950 dark:text-white truncate">
                      {item.product.title}
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono mt-0.5">
                      {formatPrice(item.product.priceGHS, item.product)}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 mt-2">
                      <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                        Size: {item.selectedSize}
                      </span>
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/20 dark:border-white/20"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Modifier */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/10 dark:border-white/5">
                    <div className="flex items-center border border-black/10 dark:border-white/10 rounded-md overflow-hidden bg-white dark:bg-black/40">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-2 py-1 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono text-zinc-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-2 py-1 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-zinc-500 hover:text-red-500 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-black/10 dark:border-white/5 bg-zinc-50 dark:bg-[#08080a] space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
                <span>SUBTOTAL ({currency})</span>
                <span className="text-zinc-950 dark:text-white text-sm font-semibold">
                  {formatPrice(subtotalGHS)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>TAXES & DUTIES</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-bold uppercase tracking-wider text-xs transition-all shadow-xl shadow-black/10 dark:shadow-white/5"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={getWhatsAppCartUrl(cart, subtotalGHS)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs font-mono transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>Instant Pay / Order via WhatsApp</span>
            </a>

            <div className="text-center">
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Ghana Express Dispatch • DHL Worldwide • Secure Encryption
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
