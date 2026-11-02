'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/config/brand';
import { useTheme } from '@/context/ThemeContext';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const { theme } = useTheme();
  const logoSrc = theme === 'light' ? BRAND_CONFIG.logoBlack : BRAND_CONFIG.logoWhite;

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-[#08080a] text-zinc-900 dark:text-white pt-24 pb-24 overflow-hidden transition-colors duration-200">
      {/* Cinematic Full-Page Background Wallpaper */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/images/about-editorial-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-10 dark:opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/90 via-zinc-50/85 to-zinc-50 dark:from-[#08080a]/90 dark:via-[#08080a]/85 dark:to-[#08080a]" />
        <div className="absolute inset-0 backdrop-blur-[3px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Full-Bleed Authentic Editorial Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-black/10 dark:border-white/15 min-h-[520px] sm:min-h-[660px] flex flex-col justify-between p-8 sm:p-14 shadow-2xl group bg-zinc-950">
          <Image
            src="/images/about-editorial-bg.jpg"
            alt="X SIGN Official Streetwear Campaign Shoot"
            fill
            priority
            className="object-cover object-top sm:object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent hidden lg:block" />

          {/* Top Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="relative w-7 h-9 sm:w-8 sm:h-10">
              <Image src="/images/brand-logo-white.png" alt={BRAND_CONFIG.name} fill className="object-contain drop-shadow" />
            </div>

            <span className="px-3 py-1 rounded-full bg-white text-black font-sans font-bold text-[10px] uppercase tracking-widest hidden sm:inline-block">
              {BRAND_CONFIG.tagline}
            </span>
          </div>

          {/* Bottom Headline & Manifesto */}
          <div className="relative z-10 space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase text-white font-display tracking-tight leading-[0.92] drop-shadow-lg">
              DON’T JUST LOOK DIFFERENT. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                MAKE YOUR PRESENCE UNDENIABLE.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-2xl drop-shadow">
              {BRAND_CONFIG.manifesto.paragraph1}
            </p>
          </div>
        </div>

        {/* Narrative Section 1: Design Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black uppercase font-sans text-zinc-950 dark:text-white tracking-tight">
              {BRAND_CONFIG.manifesto.heading}
            </h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 font-light leading-relaxed">
              Every fit is an opportunity to express yourself, break the rules, and leave a lasting impression. We don’t dress to blend in — we dress to stand apart.
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
              Built on confidence, driven by originality, and inspired by those who create their own lane. {BRAND_CONFIG.name} represents a lifestyle beyond ordinary fashion.
            </p>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-950 shadow-xl">
            <Image
              src="/campaign/models/IMG_4372.jpg"
              alt="X SIGN Dual Stance Runway Campaign"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Narrative Section 2: Fabrication & Standards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 relative aspect-[4/3] rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-950 shadow-xl">
            <Image
              src="/products/shirts/IMG_4251.PNG"
              alt="X SIGN Gothic Spine Artwork"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black uppercase font-sans text-zinc-950 dark:text-white tracking-tight">
              HEAVYWEIGHT STREETWEAR ARCHITECTURE
            </h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 font-light leading-relaxed">
              {BRAND_CONFIG.manifesto.paragraph2}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
              Crafted with thick 1.25" seamless bound ribbed crewnecks, monumental gothic vertebrae silkscreening, and drop-shoulder boxy cuts engineered to hold structural shape.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-black/10 dark:border-white/10 font-mono text-xs">
              <div className="p-4 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-black/10 dark:border-white/5 shadow-sm dark:shadow-none">
                <span className="text-zinc-950 dark:text-white font-bold text-base block">100% COTTON</span>
                <span className="text-zinc-500 text-[10px]">Heavyweight Fabric</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-black/10 dark:border-white/5 shadow-sm dark:shadow-none">
                <span className="text-zinc-950 dark:text-white font-bold text-base block">7-GAUGE</span>
                <span className="text-zinc-500 text-[10px]">Chunky Rib Knit</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-black/10 dark:border-white/5 shadow-sm dark:shadow-none">
                <span className="text-zinc-950 dark:text-white font-bold text-base block">GLITTER GOLD</span>
                <span className="text-zinc-500 text-[10px]">DTF & Reflective</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-zinc-100 dark:bg-gradient-to-r dark:from-zinc-900 dark:via-black dark:to-[#0d0e12] border border-black/10 dark:border-white/15 p-8 sm:p-14 text-center space-y-6 shadow-xl dark:shadow-2xl">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            [EXPLORE THE COLLECTION]
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-zinc-950 dark:text-white font-sans tracking-tight">
            TOGG IT YOUR WAY
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-mono max-w-lg mx-auto">
            Browse the flagship gothic spine tees, chunky ribbed beanies, and editorial runway lookbook.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-xl"
            >
              <span>Shop The Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/lookbook"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-zinc-900 dark:text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <span>View Runway Lookbook</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
