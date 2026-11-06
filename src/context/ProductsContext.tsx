'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/product';
import initialProductsData from '@/data/products.json';

interface ProductsContextType {
  products: Product[];
  isLoading: boolean;
  getProduct: (slugOrId: string) => Product | undefined;
  refreshProducts: () => Promise<void>;
  toggleSoldOut: (id: string, isSoldOut: boolean) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  addProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const CACHE_KEY = 'xsign_cached_products_v2';

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with localStorage if available to prevent flash of stale data on refresh, else initialProductsData
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (_) {}
    }
    return initialProductsData as Product[];
  });
  const [isLoading, setIsLoading] = useState(true);

  // Helper to update both state and localStorage
  const saveProductsLocally = (newProducts: Product[]) => {
    setProducts(newProducts);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(newProducts));
      } catch (_) {}
    }
  };

  const refreshProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      // Add cache-busting query param to defeat any edge/browser caching
      const res = await fetch(`/api/products?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          saveProductsLocally(data.products);
        }
      }
    } catch (err) {
      console.warn('Failed to refresh products from API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const getProduct = useCallback(
    (slugOrId: string) => {
      return products.find((p) => p.slug === slugOrId || p.id === slugOrId);
    },
    [products]
  );

  const toggleSoldOut = useCallback(
    async (id: string, isSoldOut: boolean): Promise<boolean> => {
      // Optimistic update
      const optimistic = products.map((p) => (p.id === id ? { ...p, isSoldOut } : p));
      saveProductsLocally(optimistic);

      try {
        const res = await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, updates: { isSoldOut } }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.product) {
            const updated = products.map((p) => (p.id === id ? data.product : p));
            saveProductsLocally(updated);
            return true;
          }
        }
        // Rollback on failure
        refreshProducts();
        return false;
      } catch (err) {
        console.error('Failed to toggle sold out:', err);
        refreshProducts();
        return false;
      }
    },
    [products, refreshProducts]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>): Promise<boolean> => {
      // Optimistic update immediately so UI never stutters or reverts
      const optimistic = products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      );
      saveProductsLocally(optimistic);

      try {
        const res = await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, updates }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.product) {
            const updated = products.map((p) => (p.id === id ? data.product : p));
            saveProductsLocally(updated);
            // Also refresh from server
            setTimeout(() => refreshProducts(), 600);
            return true;
          }
        }
        return false;
      } catch (err) {
        console.error('Failed to update product:', err);
        return false;
      }
    },
    [products, refreshProducts]
  );

  const addProduct = useCallback(
    async (newProduct: Product): Promise<boolean> => {
      try {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product: newProduct }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.product) {
            saveProductsLocally([data.product, ...products]);
            return true;
          }
        }
        return false;
      } catch (err) {
        console.error('Failed to add product:', err);
        return false;
      }
    },
    [products]
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            saveProductsLocally(products.filter((p) => p.id !== id && p.slug !== id));
            return true;
          }
        }
        return false;
      } catch (err) {
        console.error('Failed to delete product:', err);
        return false;
      }
    },
    [products]
  );

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
        getProduct,
        refreshProducts,
        toggleSoldOut,
        updateProduct,
        addProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
