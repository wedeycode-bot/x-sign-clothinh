'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SceneEnvironment } from '@/components/3d/SceneEnvironment';
import { useSound } from '@/context/SoundContext';
import { BRAND_CONFIG } from '@/config/brand';
import { Volume2, VolumeX, ArrowRight, Compass } from 'lucide-react';

interface CinematicIntroProps {
  onEnter: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onEnter }) => {
  const { isPlaying, toggleAudio, playClick } = useSound();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const entered = sessionStorage.getItem('brand_entered');
    if (entered) {
      setIsDismissed(true);
    }
  }, []);

  const handleEnter = () => {
    playClick();
    setIsDismissed(true);
    sessionStorage.setItem('brand_entered', 'true');
    onEnter();
  };

  if (isDismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 bg-[#050608] text-white select-none animate-in fade-in duration-700">
      {/* Background 3D Architectural Scene */}
      <SceneEnvironment className="absolute inset-0 z-0" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-5 h-6">
            <Image
              src={BRAND_CONFIG.logoWhite}
              alt={BRAND_CONFIG.name}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-400">
            DIGITAL FASHION EXHIBITION • {BRAND_CONFIG.subTitle}
          </span>
        </div>

        {/* Ambient Soundscape Toggle */}
        <button
          onClick={toggleAudio}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono tracking-wider transition-colors"
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-white" />
              <span>AMBIENT SOUND: ACTIVE</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
              <span>ENABLE ATMOSPHERE</span>
            </>
          )}
        </button>
      </div>

      {/* Center Cinematic Typography & Entrance */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 my-auto flex flex-col items-center">
        {/* Prominent Floating Brand Emblem */}
        <div className="relative w-20 h-24 sm:w-28 sm:h-32 mb-2 animate-float drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]">
          <Image
            src={BRAND_CONFIG.logoWhite}
            alt={BRAND_CONFIG.name}
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono tracking-widest text-zinc-300">
          <span>{BRAND_CONFIG.globalHubs}</span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-[0.2em] font-display leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 drop-shadow-2xl">
          {BRAND_CONFIG.name}
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl mx-auto font-sans font-light leading-relaxed">
          {BRAND_CONFIG.tagline}
        </p>

        {/* Campaign Preview Tag */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-zinc-300">
          <div className="relative w-6 h-4 rounded overflow-hidden">
            <Image
              src="/images/xsign-campaign.jpg"
              alt="Campaign"
              fill
              className="object-cover"
            />
          </div>
          <span>OFFICIAL CAMPAIGN LOOKBOOK LOADED</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button
            onClick={handleEnter}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-white/20 group"
          >
            <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            <span>Enter Exhibition</span>
          </button>

          <Link
            href="/shop"
            onClick={handleEnter}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-black/60 hover:bg-black/90 text-white font-mono uppercase tracking-wider text-xs border border-white/20 hover:border-white/50 transition-all flex items-center justify-center gap-2"
          >
            <span>Direct to Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-2">
        <div className="flex items-center gap-4">
          <span>CURRENCY: {BRAND_CONFIG.currencySymbol} ({BRAND_CONFIG.defaultCurrency}) & GLOBAL</span>
          <span>•</span>
          <span>EST. {BRAND_CONFIG.estYear}</span>
        </div>

        <button
          onClick={handleEnter}
          className="text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
        >
          SKIP TO STOREFRONT
        </button>
      </div>
    </div>
  );
};
