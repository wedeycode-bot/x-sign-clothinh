'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '@/data/products';
import { BRAND_CONFIG } from '@/config/brand';
import { ProductCard } from '@/components/shop/ProductCard';
import { ArrowRight } from 'lucide-react';

export const NewArrivals: React.FC = () => {
  const newArrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 8);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono mb-2">
            <div className="relative w-3.5 h-4">
              <Image src={BRAND_CONFIG.logoWhite} alt="" fill className="object-contain" />
            </div>
            <span>NEW ARRIVALS // ARCHIVE RELEASE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
            NEW ARRIVALS
          </h2>
        </div>

        <Link
          href="/shop?sort=newest"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          <span>EXPLORE ALL NEW RELEASES</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
