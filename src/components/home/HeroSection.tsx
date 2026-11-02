'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSound } from '@/context/SoundContext';
import { useTheme } from '@/context/ThemeContext';
import { BRAND_CONFIG } from '@/config/brand';
import { ArrowRight, Camera } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { playClick } = useSound();
  const { theme } = useTheme();

  const watermarkLogo = theme === 'light' ? BRAND_CONFIG.logoBlack : BRAND_CONFIG.logoWhite;

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/10 dark:border-white/5 transition-colors duration-200">
      {/* Background Ambient Giant Watermark Emblem */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[650px] opacity-[0.03] dark:opacity-[0.025] pointer-events-none select-none">
        <Image
          src={watermarkLogo}
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-[0.9] font-display whitespace-nowrap">
              {BRAND_CONFIG.name}
            </h1>
            <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-zinc-600 dark:text-zinc-300 pt-1">
              {BRAND_CONFIG.tagline}
            </p>
          </div>

          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-light leading-relaxed max-w-md">
            <strong className="text-zinc-950 dark:text-white font-medium">X-SIGN FLEX TEE</strong> — Crafted with heart, worn with purpose. Engineered from heavy fabric of 100% cotton with Glitter Gold, Glitter Silver, Glow in Dark, Reflective & Fine Finished DTF.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/shop"
              onClick={playClick}
              className="py-4 px-8 rounded-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-2xl shadow-black/15 dark:shadow-white/10 group"
            >
              <span>SHOP COLLECTION</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/lookbook"
              onClick={playClick}
              className="py-4 px-7 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/15 text-zinc-900 dark:text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <span>STREET LOOKBOOK</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 border-t border-black/10 dark:border-white/5 grid grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <p className="text-zinc-950 dark:text-white font-bold text-base">100%</p>
              <p className="text-zinc-500 text-[10px] uppercase">Heavy Cotton</p>
            </div>
            <div>
              <p className="text-amber-600 dark:text-amber-400 font-bold text-base">GLITTER</p>
              <p className="text-zinc-500 text-[10px] uppercase">Gold & Silver DTF</p>
            </div>
            <div>
              <p className="text-zinc-950 dark:text-white font-bold text-base">7-GAUGE</p>
              <p className="text-zinc-500 text-[10px] uppercase">Ribbed Knits</p>
            </div>
          </div>
        </div>

        {/* Right Column: High-Res Campaign Editorial Hero Card */}
        <div className="lg:col-span-7 relative">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:h-[620px] rounded-3xl overflow-hidden border border-black/10 dark:border-white/20 bg-zinc-950 shadow-2xl group animate-in fade-in duration-500">
            <Image
              src="/images/xsign-campaign.jpg"
              alt="X-SIGN Official Campaign Shoot"
              fill
              priority
              className="object-cover object-center group-hover:scale-[1.015] transition-transform duration-700 ease-out"
            />

            {/* Vignette gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30 pointer-events-none" />

            {/* Bottom Editorial Caption */}
            <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-black font-mono font-black text-[10px] uppercase tracking-wider inline-block mb-1.5">
                  {BRAND_CONFIG.tagline}
                </span>
                <p className="text-lg sm:text-2xl font-black uppercase text-white font-display tracking-tight drop-shadow-md">
                  DON’T JUST LOOK DIFFERENT.
                </p>
                <p className="text-xs sm:text-sm text-zinc-300 font-sans">
                  Official campaign lookbook shot on the streets of Accra.
                </p>
              </div>

              <div className="pointer-events-auto flex items-center gap-2">
                <Link
                  href="/shop"
                  onClick={playClick}
                  className="px-4 py-2.5 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-2xl flex items-center gap-1.5"
                >
                  <span>SHOP THE LOOK</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
