'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/config/brand';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { ArrowUpRight } from 'lucide-react';

export const CampaignStory: React.FC = () => {
  const { settings } = useSiteSettings();
  const manifesto = settings.manifesto || BRAND_CONFIG.manifesto;

  return (
    <section className="relative py-24 overflow-hidden bg-white dark:bg-black border-b border-black/10 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Full-Width Editorial Campaign Photograph */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-black/10 dark:border-white/15 bg-zinc-950 shadow-2xl group">
          <Image
            src="/images/xsign-campaign.jpg"
            alt="X-SIGN Official Campaign"
            fill
            priority
            className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

          {/* Bottom Overlay Story & CTA */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pointer-events-none">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded bg-white text-black font-sans font-bold text-[10px] uppercase tracking-widest inline-block">
                {manifesto.subheading || BRAND_CONFIG.tagline}
              </span>
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-white font-sans tracking-tight leading-tight">
                {manifesto.heading}
              </h3>
            </div>

            <div className="pointer-events-auto shrink-0 flex items-center gap-3">
              <Link
                href="/lookbook"
                className="inline-flex items-center gap-2 px-5 py-3 rounded border border-white/20 bg-black/70 backdrop-blur-md text-white font-sans font-semibold text-xs uppercase tracking-wider hover:bg-black transition-colors"
              >
                <span>Lookbook</span>
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-white text-black font-sans font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-xl"
              >
                <span>Shop Drop</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Supporting Editorial Story Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-zinc-950 dark:text-white font-sans tracking-tight leading-tight">
              Built on confidence. <br />
              Driven by originality.
            </h2>
          </div>

          <div className="lg:col-span-6 space-y-4 text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            <p>
              {manifesto.paragraph1}
            </p>
            <p>
              {manifesto.paragraph2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
