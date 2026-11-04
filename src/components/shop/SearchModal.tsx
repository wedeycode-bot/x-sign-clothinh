'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types/product';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, formatPrice, openQuickView } = useCart();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen]);

  // Handle ESC key and Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  if (!isSearchOpen) return null;

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.dropName.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click backdrop anywhere to dismiss */}
      <div className="absolute inset-0 cursor-pointer" onClick={closeSearch} />

      <div
        className="relative z-10 w-full max-w-3xl bg-white dark:bg-[#0e0f14] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Input */}
        <div className="p-4 sm:p-6 border-b border-black/10 dark:border-white/5 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-500 dark:text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search collection, tees, beanies, caps..."
            className="w-full bg-transparent text-base sm:text-lg text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              title="Clear text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeSearch}
            aria-label="Close search"
            className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Categories Bar */}
        <div className="px-6 py-3 border-b border-black/10 dark:border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-mono">
          <span className="text-zinc-500 pr-2 shrink-0">FILTER:</span>
          {['all', 't-shirts', 'accessories'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                  : 'bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {cat === 't-shirts' ? 'Graphic Tees' : cat === 'accessories' ? 'Beanies & Caps' : 'All'}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-sm">
              No pieces match &ldquo;{query}&rdquo;. Explore our latest drops.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex items-center justify-between p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.02] hover:bg-zinc-200/70 dark:hover:bg-white/[0.06] border border-black/10 dark:border-white/5 transition-all"
              >
                <Link
                  href={`/product/${product.slug}`}
                  onClick={closeSearch}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <div className="relative w-16 h-20 bg-zinc-200 dark:bg-zinc-900 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-mono text-amber-600 dark:text-amber-400 uppercase tracking-widest font-bold">
                      {product.dropName}
                    </p>
                    <h4 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-200 transition-colors">
                      {product.title}
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                      {formatPrice(product.priceGHS, product)}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-2 pl-3 shrink-0">
                  <button
                    onClick={() => {
                      closeSearch();
                      openQuickView(product);
                    }}
                    className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    QUICK VIEW
                  </button>
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closeSearch}
                    className="p-2 rounded-lg bg-black/5 dark:bg-white/5 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black text-zinc-600 dark:text-zinc-400 transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
