'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductsContext';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductCategory } from '@/types/product';
import { useTheme } from '@/context/ThemeContext';
import { BRAND_CONFIG } from '@/config/brand';
import { Filter, SlidersHorizontal, ArrowUpDown, Check } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as ProductCategory) || 'all';
  const { theme } = useTheme();
  const { products } = useProducts();

  const [category, setCategory] = useState<ProductCategory>(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const categories: { label: string; value: ProductCategory }[] = [
    { label: 'ALL PIECES', value: 'all' },
    { label: 'SHIRTS', value: 't-shirts' },
    { label: 'CAPS', value: 'accessories' },
  ];

  const sizes = ['all', 'ONE SIZE', 'S', 'M', 'L', 'XL', 'XXL'];

  const logoSrc = theme === 'light' ? BRAND_CONFIG.logoBlack : BRAND_CONFIG.logoWhite;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    if (selectedSize !== 'all') {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    if (onlyInStock) {
      result = result.filter((p) => !p.isSoldOut && p.stockCount > 0);
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.priceGHS - b.priceGHS);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.priceGHS - a.priceGHS);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [category, sortBy, selectedSize, onlyInStock]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#08080a] text-zinc-900 dark:text-white pt-24 pb-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-black/10 dark:border-white/5 pb-10 mb-10">
          <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-600 dark:text-zinc-300 uppercase tracking-widest mb-2">
            <div className="relative w-4 h-5">
              <Image src={logoSrc} alt="" fill className="object-contain" />
            </div>
            <span>OFFICIAL X-SIGN STORE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase text-zinc-950 dark:text-white font-display tracking-tight">
            THE SHOP
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl">
            Explore all signature graphic tees, ribbed knit beanies, and archival streetwear releases.
          </p>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar font-mono text-xs">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                category === c.value
                  ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-md'
                  : 'bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-black/5 dark:border-white/5'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Filters and Sorting Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-100 dark:bg-white/[0.02] border border-black/10 dark:border-white/5 mb-10 font-mono text-xs shadow-sm dark:shadow-none">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Size filter */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">SIZE:</span>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-white dark:bg-black/60 border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1 text-zinc-900 dark:text-white focus:outline-none"
              >
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All Sizes' : s}
                  </option>
                ))}
              </select>
            </div>

            {/* In stock toggle */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all ${
                onlyInStock
                  ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300 border-amber-500/40'
                  : 'bg-white dark:bg-black/60 text-zinc-600 dark:text-zinc-400 border-black/10 dark:border-white/10 hover:text-black dark:hover:text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>In-Stock Only</span>
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-zinc-500 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" />
              SORT:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-black/60 border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1 text-zinc-900 dark:text-white focus:outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center space-y-3 font-mono">
            <p className="text-zinc-950 dark:text-white text-lg">No pieces match your selected filter criteria.</p>
            <p className="text-zinc-500 text-xs">Try selecting a different category or resetting filters.</p>
            <button
              onClick={() => {
                setCategory('all');
                setSelectedSize('all');
                setOnlyInStock(false);
              }}
              className="mt-4 px-6 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 dark:bg-[#08080a] pt-24 text-center font-mono text-zinc-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
