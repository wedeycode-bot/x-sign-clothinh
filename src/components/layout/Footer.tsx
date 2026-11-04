'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { BRAND_CONFIG } from '@/config/brand';
import { Check, ShieldCheck, Truck, RefreshCw, Send } from 'lucide-react';
import { SocialLinks } from '@/components/common/SocialLinks';

export const Footer: React.FC = () => {
  const { currency } = useCart();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 4000);
  };

  const logoSrc = theme === 'light' ? BRAND_CONFIG.logoBlack : BRAND_CONFIG.logoWhite;

  return (
    <footer className="bg-zinc-100 dark:bg-[#050608] border-t border-black/10 dark:border-white/5 text-zinc-600 dark:text-zinc-400 font-sans pt-16 pb-12 transition-colors duration-200">
      {/* Top Value Propositions Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-black/10 dark:border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-black dark:text-white shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-zinc-900 dark:text-white text-sm font-semibold uppercase tracking-wider">
                Ghana & Worldwide Dispatch
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-1 leading-relaxed">
                Same-day dispatch in Accra. 24–48hr delivery to Kumasi, Takoradi & nationwide. DHL Express worldwide.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-black dark:text-white shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-zinc-900 dark:text-white text-sm font-semibold uppercase tracking-wider">
                Heavyweight Atelier Standards
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-1 leading-relaxed">
                Custom 100% heavy cotton, glitter gold, glitter silver, glow in dark, reflective & fine finished DTF, and chunky 7-gauge ribbed knits.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-black dark:text-white shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-zinc-900 dark:text-white text-sm font-semibold uppercase tracking-wider">
                Direct WhatsApp Checkout & Payment
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-1 leading-relaxed">
                Instant order manifest transfer and real-time confirmation via WhatsApp with MoMo, Bank Transfer, and international dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Lore Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-10 shrink-0">
              <Image
                src={logoSrc}
                alt={BRAND_CONFIG.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-[0.25em] text-zinc-950 dark:text-white uppercase font-sans leading-none">
                {BRAND_CONFIG.name}
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase mt-0.5">
                {BRAND_CONFIG.subTitle}
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
            {BRAND_CONFIG.manifesto.paragraph1}
          </p>

          <div className="pt-2">
            <p className="text-[11px] font-mono text-zinc-500">
              ATELIER: {BRAND_CONFIG.flagshipAddress}
            </p>
            <p className="text-[11px] font-mono text-zinc-500">
              SUPPORT: {BRAND_CONFIG.contactPhone} • {BRAND_CONFIG.contactEmail}
            </p>
          </div>

          <div className="pt-2">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-2">
              CONNECT WITH ATELIER
            </span>
            <SocialLinks
              className="flex items-center gap-4"
              iconClassName="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all hover:scale-110 active:scale-95"
            />
          </div>
        </div>

        {/* Column 1: Shop */}
        <div className="space-y-3 font-mono text-xs">
          <h5 className="text-zinc-900 dark:text-white font-semibold uppercase tracking-wider text-xs">SHOP</h5>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
            <li><Link href="/shop" className="hover:text-black dark:hover:text-white transition-colors">All Pieces</Link></li>
            <li><Link href="/shop?category=t-shirts" className="hover:text-black dark:hover:text-white transition-colors">Shirts</Link></li>
            <li><Link href="/shop?category=accessories" className="hover:text-black dark:hover:text-white transition-colors">Caps</Link></li>
            <li><Link href="/lookbook" className="hover:text-black dark:hover:text-white transition-colors">Street Lookbook</Link></li>
            <li><Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">Atelier & Manifesto</Link></li>
          </ul>
        </div>

        {/* Column 2: Client Care */}
        <div className="space-y-3 font-mono text-xs">
          <h5 className="text-zinc-900 dark:text-white font-semibold uppercase tracking-wider text-xs">CLIENT SERVICES</h5>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
            <li><Link href="/support#delivery" className="hover:text-black dark:hover:text-white transition-colors">Ghana Delivery Rates</Link></li>
            <li><Link href="/support#international" className="hover:text-black dark:hover:text-white transition-colors">International Shipping</Link></li>
            <li><Link href="/support#sizing" className="hover:text-black dark:hover:text-white transition-colors">Streetwear Sizing Matrix</Link></li>
            <li><Link href="/support#returns" className="hover:text-black dark:hover:text-white transition-colors">14-Day Exchanges</Link></li>
            <li><Link href="/support#faq" className="hover:text-black dark:hover:text-white transition-colors">Frequently Asked Questions</Link></li>
          </ul>
        </div>

        {/* Column 3: Newsletter */}
        <div className="space-y-3 font-mono text-xs">
          <h5 className="text-zinc-900 dark:text-white font-semibold uppercase tracking-wider text-xs">THE ARCHIVE NEWSLETTER</h5>
          <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
            Gain priority entry to unreleased capsule drops, runway invitations, and archive restocks.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2 pt-1 font-sans">
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full py-2.5 pl-3 pr-10 rounded-lg bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-black/40 dark:focus:border-white/40 shadow-sm dark:shadow-none"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-2.5 rounded-md bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {isSubscribed && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" />
                <span>You are verified on the drop whitelist.</span>
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-black/10 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-mono text-zinc-500 dark:text-zinc-600">
        <div>
          © {new Date().getFullYear()} {BRAND_CONFIG.name}. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-3">
          <SocialLinks
            className="flex items-center gap-4"
            iconClassName="text-zinc-500 hover:text-black dark:hover:text-white transition-all hover:scale-110 active:scale-95"
          />
        </div>
        <div className="flex items-center gap-6">
          <span>CURRENCY: {currency}</span>
          <Link href="/support#privacy" className="hover:text-black dark:hover:text-zinc-400 transition-colors">
            PRIVACY
          </Link>
          <Link href="/support#terms" className="hover:text-black dark:hover:text-zinc-400 transition-colors">
            TERMS OF SERVICE
          </Link>
        </div>
      </div>
    </footer>
  );
};
