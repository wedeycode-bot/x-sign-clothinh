'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/config/brand';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useSound } from '@/context/SoundContext';

interface LookItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  slug: string;
}

const FEATURED_LOOKS: LookItem[] = [
  {
    id: '01',
    image: '/products/caps/xsign-white-beanie-street-look.jpg',
    title: 'Tribal Star Beanie',
    subtitle: 'Accra Street Style // White Knit & Rosary',
    slug: 'xsign-ribbed-beanie-white-black',
  },
  {
    id: '02',
    image: '/campaign/models/IMG_4330.jpg',
    title: 'Gothic Spine Chalk White',
    subtitle: '320 GSM Heavyweight Drop Fit',
    slug: 'xsign-gothic-spine-tee-white',
  },
  {
    id: '03',
    image: '/campaign/models/IMG_4368.jpg',
    title: 'Sovereign Gold Edition',
    subtitle: 'Metallic Foil Typography & Emblems',
    slug: 'xsign-sovereign-gold-tee',
  },
  {
    id: '04',
    image: '/campaign/models/IMG_4338.jpg',
    title: 'Onyx Black Vertebrae',
    subtitle: 'Monumental Archival Spine Graphic',
    slug: 'xsign-gothic-spine-tee-black',
  },
  {
    id: '05',
    image: '/campaign/models/IMG_4472.jpg',
    title: 'Celestial Gold White',
    subtitle: 'High-Density Shimmer Silkscreen',
    slug: 'xsign-celestial-gold-tee-white',
  },
];

export const EditorialLookbookStrip: React.FC = () => {
  const { playClick } = useSound();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-black/10 dark:border-white/5 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-display">
            STREET LOOKBOOK
          </h2>
        </div>

        <Link
          href="/lookbook"
          onClick={playClick}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <span>EXPLORE ALL 16 ARCHIVE LOOKS</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal Scrollable Lookbook Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {FEATURED_LOOKS.map((look) => (
          <Link
            key={look.id}
            href={`/product/${look.slug}`}
            onClick={playClick}
            className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-black/10 dark:border-white/10 aspect-[3/4] flex flex-col justify-end p-5 transition-all duration-500 hover:border-black/30 dark:hover:border-white/30 hover:scale-[1.02] shadow-lg shadow-black/5"
          >
            <Image
              src={look.image}
              alt={look.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

            {/* Corner look tag */}
            <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/15 font-mono text-[10px] text-zinc-300">
              LOOK {look.id}
            </div>

            <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>

            {/* Bottom Caption */}
            <div className="relative z-10 space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display line-clamp-1">
                {look.title}
              </h4>
              <p className="text-[10px] font-mono text-zinc-400 line-clamp-1">
                {look.subtitle}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono text-white underline underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>INSPECT PIECE</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
