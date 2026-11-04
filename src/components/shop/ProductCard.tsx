'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, ProductColor } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useSound } from '@/context/SoundContext';
import { Eye, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice, openQuickView, addToCart } = useCart();
  const { playClick, playSuccess } = useSound();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isSoldOut = Boolean(product.isSoldOut || (typeof product.stockCount === 'number' && product.stockCount <= 0));

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    playClick();
    addToCart(product, product.sizes[0], selectedColor, 1);
    setIsAdded(true);
    playSuccess();
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleOpen3D = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playClick();
    openQuickView(product);
  };

  const activeImages = (selectedColor && selectedColor.images && selectedColor.images.length > 0)
    ? selectedColor.images
    : product.images;

  const currentImage = isHovered && activeImages[1] ? activeImages[1] : activeImages[0];
  const isCutout = currentImage?.toLowerCase().endsWith('.png');

  return (
    <div
      className={`group relative flex flex-col bg-white dark:bg-[#0b0c10] border rounded-2xl overflow-hidden transition-all duration-300 ${
        isSoldOut
          ? 'border-black/10 dark:border-white/5 opacity-90'
          : 'border-black/10 dark:border-white/5 hover:border-black/30 dark:hover:border-white/20 shadow-sm dark:shadow-none'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-950/90">
        <Image
          src={currentImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={
            isCutout
              ? "object-contain p-5 sm:p-7 transition-transform duration-500 ease-out group-hover:scale-105"
              : "object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          }
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            {isSoldOut && (
              <span className="px-2.5 py-1 rounded-full bg-zinc-950/90 text-zinc-300 border border-zinc-700/80 font-mono font-bold text-[10px] tracking-wider uppercase backdrop-blur-md shadow-md">
                SOLD OUT
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {!isSoldOut && product.stockCount <= 10 && (
              <span className="px-2.5 py-1 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/40 font-mono text-[10px] text-red-300 tracking-wider">
                {product.stockCount} LEFT
              </span>
            )}
          </div>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 pointer-events-auto">
          {isSoldOut ? (
            <div className="flex-1 py-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-zinc-700/60 text-zinc-400 font-mono text-xs uppercase tracking-wider text-center shadow-xl">
              ARCHIVE // SOLD OUT
            </div>
          ) : (
            <>
              <button
                onClick={handleOpen3D}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-xs uppercase hover:bg-black hover:border-white/50 transition-all shadow-xl"
              >
                <Eye className="w-3.5 h-3.5 text-zinc-300" />
                <span>QUICK VIEW</span>
              </button>

              <button
                onClick={handleQuickAdd}
                disabled={isAdded}
                className="p-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xl"
                title="Quick add to bag"
              >
                {isAdded ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      </Link>

      {/* Info Card */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] text-zinc-500 font-sans font-medium truncate max-w-[190px]">
              {selectedColor?.name}
            </span>
            {/* Color & Design preview swatches */}
            <div className="flex items-center gap-1.5">
              {product.colors.map((c) => {
                const isSelected = selectedColor.name === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColor(c);
                    }}
                    onMouseEnter={() => setSelectedColor(c)}
                    className={`relative w-4 h-4 rounded-full border transition-all ${
                      isSelected
                        ? 'border-black dark:border-white scale-125 ring-1 ring-black/20 dark:ring-white/40 shadow-sm'
                        : 'border-black/20 dark:border-white/20 opacity-70 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                );
              })}
            </div>
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-zinc-950 dark:text-white text-sm sm:text-base leading-snug hover:text-amber-600 dark:hover:text-amber-200 transition-colors">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-zinc-500">
            <span>{product.colors.length} DESIGNS / COLORWAYS</span>
            <span>{product.sizes.length} SIZES</span>
          </div>
        </div>

        <div className="pt-3 border-t border-black/10 dark:border-white/5 flex items-center justify-between">
          <span className="text-sm sm:text-base font-mono font-semibold text-zinc-950 dark:text-white">
            {formatPrice(product.priceGHS, product)}
          </span>
          <span className="text-[11px] font-sans text-zinc-500 font-medium">
            View All Colorways →
          </span>
        </div>
      </div>
    </div>
  );
};
