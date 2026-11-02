'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/config/brand';
import { useTheme } from '@/context/ThemeContext';
import { ArrowUpRight, Camera, Sparkles, X, ShoppingBag } from 'lucide-react';

interface LookbookItem {
  id: string;
  image: string;
  title: string;
  productSlug?: string;
  productTitle?: string;
  orientation: 'portrait' | 'landscape';
}

const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'look-01',
    image: '/products/caps/xsign-white-beanie-street-look.jpg',
    title: 'Look 01 // X-SIGN Tribal Star Beanie & Rosary Chain',
    productSlug: 'xsign-ribbed-beanie-white-black',
    productTitle: 'X-SIGN Ribbed Beanie (Chalk White)',
    orientation: 'portrait',
  },
  {
    id: 'look-02',
    image: '/campaign/models/IMG_4330.jpg',
    title: 'Look 02 // Gothic Spine Chalk White Tee in Noir Studio',
    productSlug: 'xsign-gothic-spine-tee-white',
    productTitle: 'X-SIGN Gothic Spine Heavy Tee (White)',
    orientation: 'portrait',
  },
  {
    id: 'look-03',
    image: '/campaign/models/IMG_4368.jpg',
    title: 'Look 03 // Sovereign Gold Foil Edition Runway Fit',
    productSlug: 'xsign-sovereign-gold-tee',
    productTitle: 'X-SIGN Sovereign Gold Edition Tee',
    orientation: 'portrait',
  },
  {
    id: 'look-04',
    image: '/campaign/models/IMG_4292.jpg',
    title: 'Look 04 // Official Campaign Atelier Ensemble',
    productSlug: 'xsign-gothic-spine-tee-black',
    productTitle: 'X-SIGN Flagship Collection',
    orientation: 'landscape',
  },
  {
    id: 'look-05',
    image: '/campaign/models/IMG_4338.jpg',
    title: 'Look 05 // Onyx Black Gothic Spine Street Silhouette',
    productSlug: 'xsign-gothic-spine-tee-black',
    productTitle: 'X-SIGN Gothic Spine Heavy Tee (Black)',
    orientation: 'portrait',
  },
  {
    id: 'look-06',
    image: '/campaign/models/IMG_4362.jpg',
    title: 'Look 06 // Chalk White Ribbed Beanie with Obsidian Crest',
    productSlug: 'xsign-ribbed-beanie-white-black',
    productTitle: 'X-SIGN Ribbed Beanie (Chalk White)',
    orientation: 'portrait',
  },
  {
    id: 'look-07',
    image: '/campaign/models/IMG_4472.jpg',
    title: 'Look 07 // Celestial Gold Artwork on Heavyweight White Tee',
    productSlug: 'xsign-celestial-gold-tee-white',
    productTitle: 'X-SIGN Celestial Gold Edition Tee',
    orientation: 'portrait',
  },
  {
    id: 'look-08',
    image: '/campaign/models/IMG_4372.jpg',
    title: 'Look 08 // The Dual Stance — White & Black Gothic Back Art',
    productSlug: 'xsign-gothic-spine-tee-white',
    productTitle: 'Gothic Spine Collection',
    orientation: 'landscape',
  },
  {
    id: 'look-09',
    image: '/campaign/models/IMG_4379.jpg',
    title: 'Look 09 // Dark Noir Headwear & Ribbed Knit Drape',
    productSlug: 'xsign-ribbed-beanie-black',
    productTitle: 'X-SIGN Ribbed Beanie (Onyx Black)',
    orientation: 'portrait',
  },
  {
    id: 'look-10',
    image: '/campaign/models/IMG_4295.jpg',
    title: 'Look 10 // Runway Boxy Streetwear Silhouette',
    productSlug: 'xsign-gothic-spine-tee-black',
    productTitle: 'Oversized Boxy Drape',
    orientation: 'portrait',
  },
  {
    id: 'look-11',
    image: '/campaign/models/IMG_4394.jpg',
    title: 'Look 11 // Diamond Starlight Edition in High-Contrast Studio',
    productSlug: 'xsign-diamond-starlight-tee',
    productTitle: 'X-SIGN Diamond Starlight Tee',
    orientation: 'portrait',
  },
  {
    id: 'look-12',
    image: '/campaign/models/IMG_4387.jpg',
    title: 'Look 12 // Sovereign Gold Shimmer Beanie Studio Shot',
    productSlug: 'xsign-ribbed-beanie-gold',
    productTitle: 'X-SIGN Ribbed Beanie (Gold Shimmer)',
    orientation: 'portrait',
  },
  {
    id: 'look-13',
    image: '/campaign/models/IMG_4348.jpg',
    title: 'Look 13 // Architectural Studio Group Drape',
    productSlug: 'xsign-gothic-spine-tee-white',
    productTitle: 'Drop 01 Atelier Shoot',
    orientation: 'landscape',
  },
  {
    id: 'look-14',
    image: '/campaign/models/IMG_4397.jpg',
    title: 'Look 14 // Mocha Camel Beanie & Minimalist Street Fit',
    productSlug: 'xsign-ribbed-beanie-mocha',
    productTitle: 'X-SIGN Ribbed Beanie (Mocha Camel)',
    orientation: 'portrait',
  },
  {
    id: 'look-15',
    image: '/campaign/models/IMG_4323.jpg',
    title: 'Look 15 // Obsidian Heavyweight Vertebrae Silhouette',
    productSlug: 'xsign-gothic-spine-tee-black',
    productTitle: 'X-SIGN Gothic Spine Tee',
    orientation: 'portrait',
  },
  {
    id: 'look-16',
    image: '/campaign/models/IMG_4332.jpg',
    title: 'Look 16 // High Rib Collar & Drop Shoulder Tailoring',
    productSlug: 'xsign-gothic-spine-tee-black',
    productTitle: 'Architectural Drop Shoulder',
    orientation: 'portrait',
  },
];

export default function LookbookPage() {
  const [activeItem, setActiveItem] = useState<LookbookItem | null>(null);
  const { theme } = useTheme();

  const logoSrc = theme === 'light' ? BRAND_CONFIG.logoBlack : BRAND_CONFIG.logoWhite;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#08080a] text-zinc-900 dark:text-white pt-24 pb-28 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="border-b border-black/10 dark:border-white/5 pb-10">
          <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-600 dark:text-zinc-300 uppercase tracking-widest mb-2">
            <div className="relative w-4 h-5">
              <Image src={logoSrc} alt="" fill className="object-contain" />
            </div>
            <span>EDITORIAL CAMPAIGN // ARCHIVE 01</span>
          </div>
          <h1 className="text-4xl sm:text-7xl font-black uppercase text-zinc-950 dark:text-white font-display tracking-tight">
            RUNWAY LOOKBOOK
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            The official photographic campaign for {BRAND_CONFIG.name}. Shot on real models in Accra, capturing the architectural silhouettes, heavyweight 100% cotton drape, and iconic gothic vertebrae spinal graphics.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {LOOKBOOK_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className={`group relative rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-950 cursor-pointer shadow-lg shadow-black/5 ${
                item.orientation === 'landscape' ? 'md:col-span-2 aspect-[16/10]' : 'aspect-[3/4]'
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Top Tag */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 uppercase">
                <Camera className="w-3 h-3 text-white" />
                <span>{item.id.toUpperCase()}</span>
              </div>

              {/* Bottom Details Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold uppercase text-white font-sans tracking-wide drop-shadow-md">
                    {item.title}
                  </h3>
                  {item.productTitle && (
                    <p className="text-[11px] font-mono text-zinc-300">
                      Featuring: {item.productTitle}
                    </p>
                  )}
                </div>

                {item.productSlug && (
                  <Link
                    href={`/product/${item.productSlug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 px-4 py-2 rounded-full bg-white text-black font-mono font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-zinc-200 transition-colors shadow-xl"
                  >
                    <span>Shop Fit</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setActiveItem(null)}
        >
          <button
            onClick={() => setActiveItem(null)}
            className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[75vh] rounded-2xl overflow-hidden border border-white/15 bg-black">
              <Image
                src={activeItem.image}
                alt={activeItem.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between w-full gap-4 px-2">
              <div>
                <h4 className="text-sm font-bold uppercase text-white">{activeItem.title}</h4>
                {activeItem.productTitle && (
                  <p className="text-xs font-mono text-zinc-400">Featured Garment: {activeItem.productTitle}</p>
                )}
              </div>

              {activeItem.productSlug && (
                <Link
                  href={`/product/${activeItem.productSlug}`}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-200 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>View Product Details</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
