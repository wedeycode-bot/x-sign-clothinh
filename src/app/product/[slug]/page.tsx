'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUCTS, findProductBySlug } from '@/data/products';
import { useProducts } from '@/context/ProductsContext';
import { SizeGuideModal } from '@/components/shop/SizeGuideModal';
import { ProductCard } from '@/components/shop/ProductCard';
import { useCart } from '@/context/CartContext';
import { useSound } from '@/context/SoundContext';
import { BRAND_CONFIG } from '@/config/brand';
import { ProductColor } from '@/types/product';
import { WhatsAppIcon } from '@/utils/whatsapp';
import {
  Check,
  Ruler,
  Truck,
  Minus,
  Plus,
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { getProduct, products } = useProducts();
  const lookup = findProductBySlug(params.slug);

  // If not found in legacy mapper, check dynamic products from context
  const dynamicProduct = getProduct(params.slug);

  if (!lookup && !dynamicProduct) {
    notFound();
  }

  const baseProduct = dynamicProduct || lookup!.product;
  const initialColorName = lookup?.initialColorName;

  // Track live state of the product (for real-time stock/sold out updates)
  const product = dynamicProduct || baseProduct;
  const isSoldOut = Boolean(product.isSoldOut || (typeof product.stockCount === 'number' && product.stockCount <= 0));

  const { addToCart, formatPrice } = useCart();
  const { playClick, playSuccess } = useSound();

  const initialColor = initialColorName
    ? product.colors.find((c) => c.name === initialColorName) || product.colors[0]
    : product.colors[0];

  const [selectedColor, setSelectedColor] = useState<ProductColor>(initialColor);

  React.useEffect(() => {
    if (product.colors && product.colors.length > 0) {
      setSelectedColor((prev) => {
        const match = product.colors.find((c) => c.name === prev?.name);
        return match || product.colors[0];
      });
    }
  }, [product]);

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Reflect admin photo changes (cover photo and gallery) directly
  const activeImages = (product.images && product.images.length > 0)
    ? product.images
    : (selectedColor && selectedColor.images && selectedColor.images.length > 0 ? selectedColor.images : ['/campaign/models/IMG_4338.jpg']);

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    playClick();
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    playSuccess();
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Direct WhatsApp Quick Order Link
  const whatsAppDirectText = encodeURIComponent(
    `👋 Hello ${BRAND_CONFIG.name}!\nI would like to order:\n\n• *Product:* ${product.title}\n• *Colorway:* ${selectedColor.name}\n• *Size:* ${selectedSize}\n• *Quantity:* ${quantity}\n• *Total Price:* GH₵ ${(product.priceGHS * quantity).toLocaleString()}\n\nPlease let me know how to finalize payment and delivery!`
  );
  const whatsAppDirectUrl = `https://wa.me/${BRAND_CONFIG.whatsappPhoneClean || '233530813362'}?text=${whatsAppDirectText}`;

  const isOneSize = product.sizes.length === 1 && (product.sizes[0] === 'ONE SIZE' || product.sizes[0] === 'OS');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#08080a] text-zinc-900 dark:text-zinc-100 pt-24 pb-28 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 mb-8 uppercase tracking-widest font-sans">
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
          <span className="text-zinc-400 dark:text-zinc-700">/</span>
          <Link href="/shop" className="hover:text-black dark:hover:text-white transition-colors">Collection</Link>
          <span className="text-zinc-400 dark:text-zinc-700">/</span>
          <span className="text-zinc-900 dark:text-zinc-300 font-medium">{product.title}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Visual Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Display Viewport */}
            <div className="relative aspect-[4/5] max-h-[580px] rounded-lg overflow-hidden bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 flex items-center justify-center">
              <Image
                src={activeImages[activeImageIdx] || activeImages[0]}
                alt={product.title}
                fill
                priority
                className={
                  (activeImages[activeImageIdx] || activeImages[0])?.toLowerCase().endsWith('.png')
                    ? "object-contain p-8 sm:p-12 transition-transform duration-300"
                    : "object-cover object-top"
                }
              />

              {product.dropName ? (
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[10px] font-sans font-medium text-zinc-300 uppercase tracking-widest">
                  {product.dropName}
                </div>
              ) : null}
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
              {activeImages.map((img, idx) => {
                const isThumbCutout = img.toLowerCase().endsWith('.png');
                const isSelected = activeImageIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative aspect-[4/5] rounded overflow-hidden border transition-all bg-white dark:bg-[#0c0d12] ${
                      isSelected
                        ? 'border-black dark:border-white opacity-100'
                        : 'border-black/10 dark:border-white/10 opacity-50 hover:opacity-90'
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className={isThumbCutout ? "object-contain p-1.5" : "object-cover object-top"}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Editorial Details & Purchase Flow */}
          <div className="lg:col-span-5 space-y-8">
            {/* Header: Title, Price & Subtitle */}
            <div className="space-y-3 pb-6 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-zinc-500 font-sans">
                <span>{BRAND_CONFIG.name}</span>
                {isSoldOut ? (
                  <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono text-[10px] font-bold tracking-wider uppercase">
                    ARCHIVE // SOLD OUT
                  </span>
                ) : product.stockCount <= 10 && (
                  <span className="text-red-500 font-medium">
                    Low Stock: {product.stockCount} Available
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase text-zinc-950 dark:text-white font-sans tracking-tight">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white font-sans tracking-tight">
                  {formatPrice(product.priceGHS, product)}
                </span>
                <span className="text-xs text-zinc-500 font-sans">
                  Tax included
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                {product.subtitle}
              </p>
            </div>

            {/* Editorial Narrative */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-sans">
                Description
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Colorway Swatch Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-zinc-500 uppercase tracking-widest text-[11px]">Color</span>
                <span className="font-medium text-zinc-950 dark:text-white truncate max-w-[260px]">
                  {selectedColor.name}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {product.colors.map((c) => {
                  const isSelected = selectedColor.name === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => {
                        playClick();
                        setSelectedColor(c);
                        setActiveImageIdx(0);
                      }}
                      className={`relative w-7 h-7 rounded-full p-[2px] transition-all duration-150 ${
                        isSelected
                          ? 'border-2 border-zinc-950 dark:border-white scale-110'
                          : 'border border-transparent hover:border-black/30 dark:hover:border-white/30'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="block w-full h-full rounded-full border border-black/10 dark:border-white/10"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 uppercase tracking-widest text-[11px] font-sans">
                  Size
                </span>
                {!isOneSize && (
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs font-sans text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5 underline underline-offset-4"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                )}
              </div>

              {isOneSize ? (
                <div className="inline-flex items-center px-3.5 py-2 rounded border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.03] text-xs font-sans tracking-wide text-zinc-700 dark:text-zinc-300">
                  Universal Fit (One Size)
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => {
                          playClick();
                          setSelectedSize(sz);
                        }}
                        className={`h-11 min-w-[48px] px-4 rounded text-xs font-sans font-semibold tracking-wider uppercase border transition-all ${
                          isSelected
                            ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sm'
                            : 'bg-transparent text-zinc-700 dark:text-zinc-300 border-black/15 dark:border-white/15 hover:border-black/40 dark:hover:border-white/40'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quantity Modifier & Purchasing Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Minimalist Quantity Stepper */}
                <div className="h-12 w-28 flex items-center justify-between border border-black/15 dark:border-white/15 rounded bg-transparent px-2.5 shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-sans font-semibold text-zinc-950 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Add to Bag or Sold Out Indicator */}
                {isSoldOut ? (
                  <button
                    disabled
                    className="flex-1 h-12 rounded font-sans font-bold text-xs uppercase tracking-widest bg-zinc-800 text-zinc-400 border border-zinc-700/60 cursor-not-allowed flex items-center justify-center gap-2 shadow-inner"
                  >
                    <span>SOLD OUT</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`flex-1 h-12 rounded font-sans font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <span>Add to Bag • {formatPrice(product.priceGHS * quantity, product)}</span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Atelier Technical Specs Table */}
            <div className="border-t border-black/10 dark:border-white/10 pt-6 space-y-3 font-sans text-xs">
              <h4 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
                Garment Specifications
              </h4>

              <div className="divide-y divide-black/5 dark:divide-white/5 text-xs">
                <div className="flex justify-between py-2.5">
                  <span className="text-zinc-500 font-sans uppercase text-[11px]">Material</span>
                  <span className="text-zinc-950 dark:text-white font-medium">{product.fabricDetails.composition}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-zinc-500 font-sans uppercase text-[11px]">Fabric Weight</span>
                  <span className="text-zinc-950 dark:text-white font-medium">{product.fabricDetails.weight}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-zinc-500 font-sans uppercase text-[11px]">Print & Finish</span>
                  <span className="text-zinc-950 dark:text-white font-medium">{product.fabricDetails.finish}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-zinc-500 font-sans uppercase text-[11px]">Tailoring</span>
                  <span className="text-zinc-950 dark:text-white font-medium">{product.fabricDetails.origin}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Delivery Guarantee */}
            <div className="p-4 rounded border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-start gap-3 text-xs font-sans">
              <Truck className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed text-zinc-600 dark:text-zinc-400">
                <p className="font-semibold text-zinc-950 dark:text-white">Ghana Courier & Worldwide Shipping</p>
                <p className="text-[11px]">Same-day dispatch across Greater Accra. 24–48h nationwide delivery via courier. Express international delivery via DHL.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Compatible Pieces Section */}
        <div className="mt-28 pt-16 border-t border-black/10 dark:border-white/10">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-zinc-500 block mb-1 font-sans">
              Related
            </span>
            <h3 className="text-xl sm:text-2xl font-bold uppercase text-zinc-950 dark:text-white font-sans tracking-tight">
              Compatible Pieces
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Sizing Chart Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />
    </div>
  );
}
