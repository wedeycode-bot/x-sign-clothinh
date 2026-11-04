'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSound } from '@/context/SoundContext';
import { BRAND_CONFIG } from '@/config/brand';
import { Play, Pause, Maximize2, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);

  const sceneDurationMs = 4500; // 4.5s per scene

  // Auto-progress through scenes
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

  // Lock background scroll when Theater Mode is open
  useEffect(() => {
    if (isTheaterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isTheaterOpen]);

  // Escape key closes Theater Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTheaterOpen) {
        setIsTheaterOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTheaterOpen]);

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

  const handleOpenTheater = () => {
    playClick();
    setIsTheaterOpen(true);
  };

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-black/10 dark:border-white/5 transition-colors duration-200">
      {/* Video Canvas Frame: Optimized tall aspect-ratio on mobile so video & clothing are fully visible */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] min-h-[460px] sm:min-h-[500px] max-h-[720px] rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl group select-none">
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
              className={`object-cover object-top sm:object-center ${
                currentSceneIdx === idx && isPlaying
                  ? 'scale-105 transition-transform duration-[4500ms] ease-out'
                  : 'scale-100'
              }`}
            />
          </div>
        ))}

        {/* Subtle Vignette (lightened on mobile so the piece & model stay vivid and bright) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25 z-20 pointer-events-none" />

        {/* Top Video Overlay Bar - Sleek minimal fullscreen sign only */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-30">
          <button
            onClick={handleOpenTheater}
            className="p-2.5 sm:p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all shadow-xl active:scale-95 flex items-center justify-center"
            title="Fullscreen"
            aria-label="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Center Floating Play/Pause Hover Button */}
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <button
            onClick={handleTogglePlay}
            className="pointer-events-auto p-4 sm:p-5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:scale-110 hover:bg-white hover:text-black transition-all shadow-2xl opacity-80 sm:opacity-0 group-hover:opacity-100"
            aria-label={isPlaying ? 'Pause Film' : 'Play Film'}
          >
            {isPlaying ? <Pause className="w-6 h-6 sm:w-8 sm:h-8" /> : <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-0.5" />}
          </button>
        </div>

        {/* Bottom Lower-Third Editorial Card */}
        <div className="absolute bottom-5 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-30 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pointer-events-none">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
              <span className="text-white font-bold">{currentScene.timecode}</span>
              <span>•</span>
              <span>SCENE 0{currentScene.id} / 0{SCENES.length}</span>
            </div>
            <h3 className="text-lg sm:text-3xl font-black uppercase tracking-tight text-white font-display drop-shadow-md">
              {currentScene.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-sans line-clamp-1 sm:line-clamp-none">
              {currentScene.garment}
            </p>
          </div>

          <div className="pointer-events-auto flex items-center gap-2.5 pt-1 sm:pt-0">
            <Link
              href={`/product/${currentScene.productSlug}`}
              onClick={playClick}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-2xl flex items-center gap-1.5 whitespace-nowrap"
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

      {/* IMMERSIVE FULL-SCREEN THEATER MODE (Works 100% on iPhones, Android, & Desktop) */}
      {isTheaterOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none animate-in fade-in duration-200">
          {/* Theater Top Bar with Close button */}
          <div className="p-4 sm:p-6 z-20 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              <span className="text-white font-bold">{currentScene.timecode}</span>
              <span>•</span>
              <span>SCENE 0{currentScene.id} / 0{SCENES.length}</span>
            </div>

            <button
              onClick={() => {
                playClick();
                setIsTheaterOpen(false);
              }}
              className="p-2.5 sm:p-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all shadow-xl active:scale-95"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Full Screen Image Presentation with Ken Burns effect */}
          <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
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
                  priority
                  className={`object-contain ${
                    currentSceneIdx === idx && isPlaying
                      ? 'scale-105 transition-transform duration-[4500ms] ease-out'
                      : 'scale-100'
                  }`}
                />
              </div>
            ))}

            {/* Quick Next / Prev Touch Arrows */}
            <button
              onClick={() => handleNextScene((currentSceneIdx - 1 + SCENES.length) % SCENES.length)}
              className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white hover:text-black transition-all"
              aria-label="Previous Scene"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleNextScene((currentSceneIdx + 1) % SCENES.length)}
              className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white hover:text-black transition-all"
              aria-label="Next Scene"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Theater Bottom Bar */}
          <div className="p-4 sm:p-6 z-20 bg-gradient-to-t from-black via-black/80 to-transparent space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-2xl font-black uppercase text-white font-display">
                  {currentScene.title}
                </h3>
                <p className="text-xs text-zinc-300 font-sans mt-0.5">
                  {currentScene.garment} • {currentScene.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className="px-4 py-2 rounded-full bg-white/15 border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <Link
                  href={`/product/${currentScene.productSlug}`}
                  onClick={() => {
                    playClick();
                    setIsTheaterOpen(false);
                  }}
                  className="px-5 py-2 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-zinc-200 transition-colors shadow-xl"
                >
                  <span>Inspect Piece</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Time progress bar */}
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: `${((currentSceneIdx * 100) + progress) / SCENES.length}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
