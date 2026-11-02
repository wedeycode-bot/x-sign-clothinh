'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { COLLECTIONS } from '@/data/products';
import { BRAND_CONFIG } from '@/config/brand';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const FeaturedCollection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SEASON ARCHIVE</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2 font-sans">
            FEATURED CAPSULES
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-4 md:mt-0 max-w-md">
          Curated bodies of work developed with custom 3D parametric garment designs and heavyweight textiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {COLLECTIONS.map((col, idx) => (
          <div
            key={col.id}
            className="group relative rounded-3xl overflow-hidden border border-white/10 bg-[#0c0d12] flex flex-col justify-between min-h-[520px]"
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src={col.coverImage}
                alt={col.title}
                fill
                className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* Top Badges */}
            <div className="relative z-10 p-8 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-5 h-6">
                  <Image
                    src={BRAND_CONFIG.logoWhite}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono uppercase text-zinc-300">
                  {col.season} • {col.year}
                </span>
              </div>
              <span className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                <ArrowUpRight className="w-5 h-5" />
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 p-8 space-y-4">
              <div>
                <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest">
                  {col.tagline}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
                  {col.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 max-w-md">
                {col.description}
              </p>

              <div className="pt-2">
                <Link
                  href={col.slug === 'drop-01-first-edition' ? '/shop?category=t-shirts' : '/shop?category=accessories'}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                >
                  <span>Shop Capsule ({col.productIds.length} Pieces)</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
