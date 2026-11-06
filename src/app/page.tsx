'use client';

import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { LatestDropGrid } from '@/components/home/LatestDropGrid';
import { CampaignFilmPlayer } from '@/components/home/CampaignFilmPlayer';
import { EditorialLookbookStrip } from '@/components/home/EditorialLookbookStrip';
import { CampaignStory } from '@/components/home/CampaignStory';
import { BRAND_CONFIG } from '@/config/brand';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function HomePage() {
  const { settings } = useSiteSettings();
  const marqueeItems = settings.marquee?.items && settings.marquee.items.length > 0
    ? settings.marquee.items
    : [
        `${BRAND_CONFIG.name} // ${BRAND_CONFIG.subTitle}`,
        BRAND_CONFIG.tagline,
        'ACCRA • GLOBAL DISPATCH',
        'DROP 01 FIRST EDITION',
        'HEAVYWEIGHT 100% COTTON',
      ];

  // Repeat for continuous marquee loop
  const loopItems = [...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="bg-zinc-50 dark:bg-[#08080a] text-zinc-900 dark:text-white overflow-hidden transition-colors duration-200">
      {/* 01. MAIN RUNWAY HERO */}
      <HeroSection />

      {/* 02. MINIMALIST STREETWEAR MARQUEE */}
      <div className="py-3.5 border-y border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-[#0c0d12] overflow-hidden select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-sans text-xs uppercase tracking-[0.25em] text-zinc-600 dark:text-zinc-400 font-semibold">
          {loopItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className={idx % 2 === 0 ? 'text-zinc-950 dark:text-white font-bold' : ''}>
                {item}
              </span>
              <span className="text-zinc-400 dark:text-zinc-600">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 03. LATEST DROP COLLECTION GRID (Real shop products: Tees & Headwear) */}
      <LatestDropGrid />

      {/* 04. OFFICIAL CAMPAIGN FILM */}
      <CampaignFilmPlayer />

      {/* 05. EDITORIAL STREET LOOKBOOK STRIP */}
      <EditorialLookbookStrip />

      {/* 06. ATELIER EDITORIAL MANIFESTO */}
      <CampaignStory />
    </div>
  );
}
