'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/config/brand';
import { ArrowRight, Compass, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { useSound } from '@/context/SoundContext';

export const ManifestoBento: React.FC = () => {
  const { playClick } = useSound();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-black/10 dark:border-white/5 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-700 dark:text-zinc-300 mb-2">
            <Compass className="w-3.5 h-3.5 text-black dark:text-white" />
            <span>THE ATELIER PHILOSOPHY // {BRAND_CONFIG.name}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-display">
            TOGG IT YOUR WAY!!
          </h2>
        </div>

        <Link
          href="/about"
          onClick={playClick}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <span>READ FULL ATELIER MANIFESTO</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Large Feature Card: Manifesto with Background Shoot */}
        <div className="md:col-span-8 relative rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-950 p-8 sm:p-12 flex flex-col justify-end min-h-[460px] group shadow-lg">
          <Image
            src="/images/about-editorial-bg.jpg"
            alt="X-SIGN Atelier Shoot"
            fill
            className="object-cover opacity-50 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-white text-black font-mono font-bold text-[10px] uppercase tracking-wider inline-block">
              {BRAND_CONFIG.name} MANIFESTO
            </span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase text-white font-display leading-[1.05] tracking-tight">
              DON’T JUST LOOK DIFFERENT. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                MAKE YOUR PRESENCE UNDENIABLE.
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              Every fit is an opportunity to express yourself, break the rules, and leave a lasting impression. Built on confidence, driven by originality, and inspired by those who create their own lane.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                onClick={playClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-2xl"
              >
                <span>Read The Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: Archival Graphics & Spine Cross */}
        <div className="md:col-span-4 rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-transparent p-8 flex flex-col justify-between shadow-sm dark:shadow-none">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 flex items-center justify-center text-black dark:text-white">
              <Sparkles className="w-5 h-5 text-black dark:text-white" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block font-bold">
              ARCHIVAL ARTISTRY
            </span>
            <h4 className="text-xl font-bold uppercase text-zinc-950 dark:text-white font-display">
              Gothic Spine Vertebrae Artwork
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Monumental high-density screenprint and sovereign metallic foil graphics traversing the full spinal column.
            </p>
          </div>

          <div className="pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <span>SIGNATURE MOTIF</span>
            <span className="text-zinc-950 dark:text-white font-bold">X-SIGN ATELIER</span>
          </div>
        </div>

        {/* Card 3: Heavyweight Textiles & Fine Materials */}
        <div className="md:col-span-4 rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-transparent p-8 flex flex-col justify-between shadow-sm dark:shadow-none">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-white/10 border border-amber-500/20 dark:border-white/15 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-bold">
              ★ CRAFTED WITH HEART, WORN WITH PURPOSE
            </span>
            <h4 className="text-xl font-bold uppercase text-zinc-950 dark:text-white font-display">
              X-SIGN FLEX TEE MATERIALS
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Engineered with heavy fabric of 100% cotton, featuring Glitter Gold, Glitter Silver, Glow in Dark, Reflective elements, and Fine Finished DTF.
            </p>
          </div>

          <div className="pt-6 border-t border-black/10 dark:border-white/10 grid grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <p className="text-amber-600 dark:text-amber-400 font-bold text-base">GLITTER GOLD</p>
              <p className="text-zinc-500 text-[10px] uppercase">Fine Finished DTF</p>
            </div>
            <div>
              <p className="text-zinc-950 dark:text-white font-bold text-base">100% COTTON</p>
              <p className="text-zinc-500 text-[10px] uppercase">Heavy Fabric</p>
            </div>
          </div>
        </div>

        {/* Card 4: Accra Atelier Craftsmanship */}
        <div className="md:col-span-4 rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-transparent p-8 flex flex-col justify-between shadow-sm dark:shadow-none">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 flex items-center justify-center text-black dark:text-white">
              <ShieldCheck className="w-5 h-5 text-black dark:text-white" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block font-bold">
              ETHICAL ATELIER
            </span>
            <h4 className="text-xl font-bold uppercase text-zinc-950 dark:text-white font-display">
              Master Pattern-Makers
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Crafted in Accra under living wage standards, meticulous hand-finishing, high-density 3D embroidery, and archival screenprinting.
            </p>
          </div>

          <div className="pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <span>ORIGIN</span>
            <span className="text-zinc-950 dark:text-white font-bold">ACCRA, GHANA</span>
          </div>
        </div>

        {/* Card 5: Local & Global Dispatch */}
        <div className="md:col-span-4 rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-transparent p-8 flex flex-col justify-between shadow-sm dark:shadow-none">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 flex items-center justify-center text-black dark:text-white">
              <Globe className="w-5 h-5 text-black dark:text-white" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block font-bold">
              GLOBAL FULFILLMENT
            </span>
            <h4 className="text-xl font-bold uppercase text-zinc-950 dark:text-white font-display">
              MoMo & Worldwide Delivery
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Instant mobile money and courier throughout Ghana, coupled with tracked express air shipping across the globe.
            </p>
          </div>

          <div className="pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <span>DISPATCH</span>
            <span className="text-zinc-950 dark:text-white font-bold">WORLDWIDE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
