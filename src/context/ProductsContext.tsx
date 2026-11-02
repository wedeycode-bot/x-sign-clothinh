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

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProductsData as Product[]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
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
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isSoldOut } : p))
      );

      try {
        const res = await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, updates: { isSoldOut } }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.product) {
            setProducts((prev) =>
              prev.map((p) => (p.id === id ? data.product : p))
            );
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
    [refreshProducts]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>): Promise<boolean> => {
      try {
        const res = await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, updates }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.product) {
            setProducts((prev) =>
              prev.map((p) => (p.id === id ? data.product : p))
            );
            return true;
          }
        }
        return false;
      } catch (err) {
        console.error('Failed to update product:', err);
        return false;
      }
    },
    []
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
            setProducts((prev) => [data.product, ...prev]);
            return true;
          }
        }
        return false;
      } catch (err) {
        console.error('Failed to add product:', err);
        return false;
      }
    },
    []
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
            setProducts((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
            return true;
          }
        }
        return false;
      } catch (err) {
        console.error('Failed to delete product:', err);
        return false;
      }
    },
    []
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
