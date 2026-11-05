'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/context/ProductsContext';
import { BRAND_CONFIG } from '@/config/brand';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductCategory } from '@/types/product';
import { ArrowRight } from 'lucide-react';

export const LatestDropGrid: React.FC = () => {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');

  // Dynamically show only categories that have products in the store
  const categories = useMemo(() => {
    const presentCategories = new Set(products.map((p) => p.category));
    const masterOrder: { label: string; value: ProductCategory }[] = [
      { label: 'ALL PIECES', value: 'all' },
      { label: 'SHIRTS', value: 't-shirts' },
      { label: 'CAPS', value: 'accessories' },
      { label: 'JOGGERS', value: 'joggers' },
      { label: 'SHORTS', value: 'shorts' },
      { label: 'BOXERS', value: 'boxers' },
      { label: 'VESTS', value: 'vests' },
      { label: 'SOCKS', value: 'socks' },
      { label: 'HOODIES', value: 'hoodies' },
      { label: 'PANTS', value: 'pants' },
    ];
    return masterOrder.filter((cat) => cat.value === 'all' || presentCategories.has(cat.value));
  }, [products]);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-black/10 dark:border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-sans block mb-1">
            {BRAND_CONFIG.name} // FIRST EDITION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-sans">
            LATEST DROP
          </h2>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest font-semibold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <span>VIEW FULL CATALOG ({products.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 pb-6 overflow-x-auto no-scrollbar font-sans text-xs">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`h-9 px-4 rounded text-xs font-semibold tracking-wider uppercase transition-all ${
                isSelected
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-black/10 dark:border-white/10'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-black/10 dark:border-white/10 font-mono text-xs text-zinc-500">
          <p className="text-zinc-900 dark:text-white font-semibold mb-1">Upcoming drop arriving soon</p>
          <p>New pieces in this category are being tailored at the atelier.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
