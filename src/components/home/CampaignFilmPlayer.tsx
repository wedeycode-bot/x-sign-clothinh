'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSound } from '@/context/SoundContext';
import { BRAND_CONFIG } from '@/config/brand';
import { Play, Pause, Maximize2, ArrowRight } from 'lucide-react';

interface Scene {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  garment: string;
  productSlug: string;
  timecode: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    image: '/campaign/models/IMG_4292.jpg',
    title: 'OFFICIAL CAMPAIGN ENSEMBLE',
    subtitle: 'Accra Street Atelier // First Edition',
    garment: 'Gothic Spine Heavy Tees & Ribbed Beanies',
    productSlug: 'xsign-gothic-spine-tee-black',
    timecode: '00:03',
  },
  {
    id: 2,
    image: '/products/caps/xsign-white-beanie-street-look.jpg',
    title: 'TRIBAL STAR KNIT BEANIE',
    subtitle: 'Silver Starlight Graphic & Rosary Chain',
    garment: '7-Gauge Chunky Ribbed Beanie',
    productSlug: 'xsign-ribbed-beanie-white-black',
    timecode: '00:07',
  },
  {
    id: 3,
    image: '/campaign/models/IMG_4330.jpg',
    title: 'CHALK WHITE NOIR FIT',
    subtitle: '320 GSM Heavyweight Ring-Spun Cotton',
    garment: 'Gothic Spine Heavy Tee (Chalk White)',
    productSlug: 'xsign-gothic-spine-tee-white',
    timecode: '00:12',
  },
  {
    id: 4,
    image: '/campaign/models/IMG_4338.jpg',
    title: 'ONYX BLACK SPINAL VERTEBRAE',
    subtitle: 'Monumental Archival Cross Art',
    garment: 'Gothic Spine Heavy Tee (Onyx Black)',
    productSlug: 'xsign-gothic-spine-tee-black',
    timecode: '00:16',
  },
  {
    id: 5,
    image: '/campaign/models/IMG_4368.jpg',
    title: 'SOVEREIGN GOLD RUNWAY EDITION',
    subtitle: 'Metallic Gold Foil Typography & Symbols',
    garment: 'Sovereign Gold Edition Heavy Tee',
    productSlug: 'xsign-sovereign-gold-tee',
    timecode: '00:21',
  },
  {
    id: 6,
    image: '/campaign/models/IMG_4472.jpg',
    title: 'CELESTIAL GOLD ON CHALK WHITE',
    subtitle: 'High-Density Shimmer Silkscreen',
    garment: 'Celestial Gold Heavy Tee',
    productSlug: 'xsign-celestial-gold-tee-white',
    timecode: '00:26',
  },
];

export const CampaignFilmPlayer: React.FC = () => {
  const { playClick } = useSound();
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const sceneDurationMs = 4500; // 4.5s per scene
  const totalDurationSeconds = (SCENES.length * sceneDurationMs) / 1000;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          setCurrentSceneIdx((idx) => (idx + 1) % SCENES.length);
          return 0;
        }
        return next;
      });
    }, sceneDurationMs / 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentSceneIdx]);

  const currentScene = SCENES[currentSceneIdx];

  const handleTogglePlay = () => {
    playClick();
    setIsPlaying(!isPlaying);
  };

  const handleNextScene = (idx: number) => {
    playClick();
    setCurrentSceneIdx(idx);
    setProgress(0);
  };

  const handleFullscreen = () => {
    playClick();
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-black/10 dark:border-white/5 transition-colors duration-200">
      {/* Cinematic 16:9 Video Canvas Frame */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] max-h-[720px] rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl group select-none"
      >
        {/* Scene Image with Ken Burns Push-In */}
        {SCENES.map((scene, idx) => (
          <div
            key={scene.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSceneIdx === idx ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            <Image
              src={scene.image}
              alt={scene.title}
              fill
              priority={idx === 0}
              className={`object-cover object-center ${
                currentSceneIdx === idx && isPlaying
                  ? 'scale-105 transition-transform duration-[4500ms] ease-out'
                  : 'scale-100'
              }`}
            />
          </div>
        ))}

        {/* Film Grain & Cinematic Letterbox Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 z-20 pointer-events-none" />

        {/* Top Video Overlay Bar */}
        <div className="absolute top-5 left-5 right-5 z-30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 font-sans uppercase tracking-wider text-[11px]">
              X-SIGN CAMPAIGN
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFullscreen}
              className="p-2 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white hover:bg-white hover:text-black transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Floating Play/Pause Hover Button */}
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <button
            onClick={handleTogglePlay}
            className="pointer-events-auto p-4 sm:p-5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:scale-110 hover:bg-white hover:text-black transition-all shadow-2xl opacity-0 group-hover:opacity-100"
            aria-label={isPlaying ? 'Pause Film' : 'Play Film'}
          >
            {isPlaying ? <Pause className="w-6 h-6 sm:w-8 sm:h-8" /> : <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-0.5" />}
          </button>
        </div>

        {/* Bottom Lower-Third Editorial Card */}
        <div className="absolute bottom-6 left-6 right-6 z-30 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
              <span className="text-white font-bold">{currentScene.timecode}</span>
              <span>•</span>
              <span>SCENE 0{currentScene.id} / 0{SCENES.length}</span>
              <span>•</span>
              <span>{BRAND_CONFIG.name}</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white font-display drop-shadow-md">
              {currentScene.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-sans">
              {currentScene.garment} • {currentScene.subtitle}
            </p>
          </div>

          <div className="pointer-events-auto flex items-center gap-3">
            <Link
              href={`/product/${currentScene.productSlug}`}
              onClick={playClick}
              className="px-5 py-2.5 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-2xl flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>INSPECT IN SHOP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom Time Scrubber Progress Bar */}
        <div className="absolute bottom-0 inset-x-0 z-30 h-1.5 bg-white/10">
          <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSceneIdx * 100) + progress) / SCENES.length}%`,
            }}
          />
        </div>
      </div>

      {/* Scene Navigation Pill Bar */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar font-mono text-xs">
        {SCENES.map((scene, idx) => (
          <button
            key={scene.id}
            onClick={() => handleNextScene(idx)}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-2 ${
              currentSceneIdx === idx
                ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow'
                : 'bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5'
            }`}
          >
            <span>0{scene.id}</span>
            <span className="hidden sm:inline">{scene.title.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
