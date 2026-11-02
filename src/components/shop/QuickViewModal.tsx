'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useSound } from '@/context/SoundContext';
import { useTheme } from '@/context/ThemeContext';
import { BRAND_CONFIG } from '@/config/brand';
import { ProductColor } from '@/types/product';
import { X, ArrowUpRight, Check, ShoppingBag, ShieldCheck } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, addToCart, formatPrice } = useCart();
  const { playClick, playSuccess } = useSound();
  const { theme } = useTheme();

  const [photoIndex, setPhotoIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(quickViewProduct.sizes[0]);
      setSelectedColor(quickViewProduct.colors[0]);
      setQuantity(1);
      setPhotoIndex(0);
      setIsAdded(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [quickViewProduct]);

  if (!quickViewProduct || !selectedColor) return null;

  const activeImages = (selectedColor && selectedColor.images && selectedColor.images.length > 0)
    ? selectedColor.images
    : quickViewProduct.images;

  const logoSrc = theme === 'light' ? BRAND_CONFIG.logoBlack : BRAND_CONFIG.logoWhite;

  const handleAddToCart = () => {
    playClick();
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    playSuccess();
    setTimeout(() => {
      setIsAdded(false);
      closeQuickView();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeQuickView} />

      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#0b0c10] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/10 dark:bg-black/60 text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-black/10 dark:border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Visual Stage Column */}
        <div className="h-[420px] md:h-full min-h-[380px] bg-zinc-100 dark:bg-black/60 relative flex flex-col justify-between p-4">
          {/* Top Label */}
          <div className="relative z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-black/70 backdrop-blur-md border border-black/10 dark:border-white/10 w-fit text-[11px] font-mono text-zinc-800 dark:text-zinc-300">
            <span>OFFICIAL PACKSHOT</span>
          </div>

          {/* Center Display Area */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full p-6 sm:p-8 flex items-center justify-center">
              <Image
                src={activeImages[photoIndex] || activeImages[0]}
                alt={quickViewProduct.title}
                fill
                className="object-contain p-6 sm:p-10"
              />
            </div>
          </div>

          {/* Bottom Thumbnails / View toggles for Photos */}
          {activeImages.length > 1 && (
            <div className="relative z-20 flex items-center gap-2 mt-auto self-center bg-white/90 dark:bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-black/10 dark:border-white/10 max-w-full overflow-x-auto no-scrollbar">
              {activeImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { playClick(); setPhotoIndex(idx); }}
                  className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                    photoIndex === idx
                      ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white bg-black/5 dark:bg-white/5'
                  }`}
                >
                  {quickViewProduct.category === 'accessories'
                    ? (idx === 0 ? 'Front View' : idx === 1 ? 'Angle Fold' : `Angle 0${idx + 1}`)
                    : (idx === 0 ? 'Street Fit' : idx === 1 ? 'Back Spine' : idx === 2 ? 'Front Piece' : `Angle 0${idx + 1}`)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Purchase Column */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="relative w-3.5 h-4">
                  <Image src={logoSrc} alt="" fill className="object-contain" />
                </div>
                {quickViewProduct.dropName ? (
                  <span className="text-[10px] font-mono tracking-widest text-zinc-600 dark:text-zinc-300 uppercase">
                    {quickViewProduct.dropName}
                  </span>
                ) : null}
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-white mt-1 font-sans">
                {quickViewProduct.title}
              </h3>
              <p className="text-xs text-zinc-500 mt-1 font-sans">
                {quickViewProduct.subtitle}
              </p>
            </div>

            <div className="text-2xl font-extrabold font-sans text-zinc-950 dark:text-white tracking-tight">
              {formatPrice(quickViewProduct.priceGHS, quickViewProduct)}
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
              {quickViewProduct.description}
            </p>

            {/* Color Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                <span>COLORWAY: {selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-2">
                {quickViewProduct.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      playClick();
                      setSelectedColor(c);
                      setPhotoIndex(0);
                    }}
                    className={`w-7 h-7 rounded-full border transition-all ${
                      selectedColor.name === c.name
                        ? 'border-black dark:border-white scale-110 shadow-lg'
                        : 'border-black/20 dark:border-white/20 hover:scale-105 opacity-70'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                <span>SELECT SIZE</span>
                <span className="text-[10px] text-zinc-500">Oversized Streetwear Fit</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {quickViewProduct.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      playClick();
                      setSelectedSize(sz);
                    }}
                    className={`py-2 text-xs font-mono rounded-lg border transition-all ${
                      selectedSize === sz
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold border-black dark:border-white'
                        : 'bg-zinc-100 dark:bg-white/5 text-zinc-800 dark:text-zinc-300 border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Highlight Badge */}
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-black/10 dark:border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-800 dark:text-zinc-300">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                <span>{quickViewProduct.fabricDetails.weight}</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">
                {quickViewProduct.fabricDetails.origin}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 ${
                isAdded
                  ? 'bg-emerald-500 text-white dark:text-black'
                  : 'bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-md'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • {formatPrice(quickViewProduct.priceGHS * quantity, quickViewProduct)}</span>
                </>
              )}
            </button>

            <Link
              href={`/product/${quickViewProduct.slug}`}
              onClick={closeQuickView}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <span>View Full Runway Specs & Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
