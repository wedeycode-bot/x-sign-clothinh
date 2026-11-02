import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/types/product';
import initialProductsData from '@/data/products.json';

const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'products.json');

// In-memory cache fallback in case file system has transient read/write locks
let inMemoryProducts: Product[] = [...(initialProductsData as Product[])];

export async function getStoredProducts(): Promise<Product[]> {
  try {
    const fileContent = await fs.readFile(PRODUCTS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(fileContent) as Product[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      inMemoryProducts = parsed;
      return parsed;
    }
  } catch (error) {
    console.warn('[productStore] Error reading products.json, using in-memory store:', error);
  }
  return inMemoryProducts;
}

export async function saveStoredProducts(products: Product[]): Promise<void> {
  inMemoryProducts = products;
  try {
    await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('[productStore] Error saving products.json to disk:', error);
    throw error;
  }
}

export async function updateStoredProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const products = await getStoredProducts();
  const index = products.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) return null;

  const updatedProduct = {
    ...products[index],
    ...updates,
  };

  products[index] = updatedProduct;
  await saveStoredProducts(products);
  return updatedProduct;
}

export async function addStoredProduct(newProduct: Product): Promise<Product> {
  const products = await getStoredProducts();
  
  // Ensure unique ID & slug
  let slug = newProduct.slug || newProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let id = newProduct.id || slug;
  
  // Check for conflicts
  let count = 1;
  const originalSlug = slug;
  while (products.some((p) => p.slug === slug || p.id === id)) {
    slug = `${originalSlug}-${count}`;
    id = slug;
    count++;
  }

  const completeProduct: Product = {
    ...newProduct,
    id,
    slug,
    stockCount: typeof newProduct.stockCount === 'number' ? newProduct.stockCount : 50,
    isSoldOut: Boolean(newProduct.isSoldOut),
  };

  // Add at the beginning of the list for instant visibility
  products.unshift(completeProduct);
  await saveStoredProducts(products);
  return completeProduct;
}

export async function deleteStoredProduct(id: string): Promise<boolean> {
  const products = await getStoredProducts();
  const filtered = products.filter((p) => p.id !== id && p.slug !== id);
  if (filtered.length === products.length) return false;

  await saveStoredProducts(filtered);
  return true;
}
