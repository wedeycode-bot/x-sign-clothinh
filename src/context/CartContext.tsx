'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductColor, CurrencyCode } from '@/types/product';
import { CartItem } from '@/types/cart';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotalGHS: number;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (priceGHS: number, product?: Product) => string;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number; prefix: boolean }> = {
  GHS: { symbol: 'GH₵', rate: 1.0, prefix: true },
  USD: { symbol: '$', rate: 0.076, prefix: true },
  GBP: { symbol: '£', rate: 0.061, prefix: true },
  EUR: { symbol: '€', rate: 0.070, prefix: true },
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrencyState] = useState<CurrencyCode>('GHS');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('bonsam_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedCurr = localStorage.getItem('bonsam_currency') as CurrencyCode;
      if (savedCurr && CURRENCY_RATES[savedCurr]) {
        setCurrencyState(savedCurr);
      }
    } catch {
      // Ignore storage errors in SSR or private browsing
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bonsam_cart', JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('bonsam_currency', c);
    } catch {
      // Ignore
    }
  };

  const addToCart = (product: Product, size: string, color: ProductColor, quantity = 1) => {
    const cartItemId = `${product.id}-${size}-${color.hex}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { cartItemId, product, selectedSize: size, selectedColor: color, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotalGHS = cart.reduce(
    (total, item) => total + item.product.priceGHS * item.quantity,
    0
  );

  const formatPrice = (priceGHS: number, product?: Product) => {
    if (currency === 'GHS') {
      return `GH₵ ${priceGHS.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (product) {
      if (currency === 'USD') return `$${product.priceUSD.toFixed(2)}`;
      if (currency === 'GBP') return `£${product.priceGBP.toFixed(2)}`;
      if (currency === 'EUR') return `€${product.priceEUR.toFixed(2)}`;
    }
    const info = CURRENCY_RATES[currency];
    const converted = priceGHS * info.rate;
    return `${info.symbol}${converted.toFixed(2)}`;
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const openQuickView = (p: Product) => setQuickViewProduct(p);
  const closeQuickView = () => setQuickViewProduct(null);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotalGHS,
        currency,
        setCurrency,
        formatPrice,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isSearchOpen,
        openSearch,
        closeSearch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
