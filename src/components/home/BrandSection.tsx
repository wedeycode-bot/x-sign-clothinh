'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/config/brand';
import { Compass, Globe, ShieldCheck } from 'lucide-react';

export const BrandSection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-[#090a0f] border border-white/10 overflow-hidden p-8 sm:p-14 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-display leading-tight">
              A DIGITAL FASHION EXPERIENCE <br />
              DESIGNED FOR THE FUTURE.
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
              {BRAND_CONFIG.manifesto.paragraph1}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-white font-semibold uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Atelier Production</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every pattern-maker and tailor operates under living wage standards, health protection, and masterclass apprentice training.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono text-white font-semibold uppercase flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-white" />
                  <span>Local & International Reach</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Instant local checkout via Ghanaian Mobile Money and courier, with seamless international shipping to global destinations.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
              >
                <span>Read Studio Overview</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
            <Image
              src="/products/caps/IMG_4226.PNG"
              alt="X SIGN Atelier Piece"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Atelier Corner Emblem */}
            <div className="absolute top-4 right-4 w-14 h-16 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 p-2.5 flex items-center justify-center shadow-2xl">
              <div className="relative w-full h-full">
                <Image src={BRAND_CONFIG.logoWhite} alt="" fill className="object-contain" />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-xs font-mono text-zinc-300">
                <p className="text-white font-semibold uppercase">[ATELIER WORKSPACE]</p>
                <p className="text-[11px] text-zinc-400">{BRAND_CONFIG.flagshipAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
