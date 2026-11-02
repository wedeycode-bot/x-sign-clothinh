export type ProductCategory = 
  | 'all'
  | 't-shirts'
  | 'hoodies'
  | 'jeans'
  | 'pants'
  | 'shorts'
  | 'shirts'
  | 'accessories';

export type CurrencyCode = 'GHS' | 'USD' | 'GBP' | 'EUR';

export interface ProductColor {
  name: string;
  hex: string;
  modelHex?: string;
  images?: string[];
}

export type GarmentType = 'hoodie' | 'tshirt' | 'pants' | 'jeans' | 'vest' | 'accessory';

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ProductCategory;
  garmentType: GarmentType;
  priceGHS: number;
  priceUSD: number;
  priceGBP: number;
  priceEUR: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isSoldOut?: boolean;
  stockCount: number;
  dropName: string;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
  fabricDetails: {
    composition: string;
    weight: string;
    finish: string;
    hardware?: string;
    origin: string;
  };
  features: string[];
  careInstructions: string[];
  model3DConfig: {
    garmentType: GarmentType;
    defaultColor: string;
    roughness: number;
    metalness: number;
    fabricPattern: 'smooth' | 'heavy-terry' | 'twill' | 'denim' | 'ripstop';
    scale?: [number, number, number];
    rotationOffset?: [number, number, number];
  };
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  season: string;
  year: string;
  description: string;
  coverImage: string;
  editorialImages: string[];
  productIds: string[];
}
