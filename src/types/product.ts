export type ProductCategory = 
  | 'all'
  | 't-shirts'
  | 'hoodies'
  | 'jeans'
  | 'pants'
  | 'shorts'
  | 'shirts'
  | 'accessories'
  | 'joggers'
  | 'boxers'
  | 'vests'
  | 'socks';

export interface CategoryOption {
  label: string;
  value: ProductCategory;
}

export const PRODUCT_CATEGORIES: CategoryOption[] = [
  { label: 'ALL PIECES', value: 'all' },
  { label: 'SHIRTS', value: 't-shirts' },
  { label: 'JOGGERS', value: 'joggers' },
  { label: 'SHORTS', value: 'shorts' },
  { label: 'BOXERS', value: 'boxers' },
  { label: 'VEST (SINGLETS)', value: 'vests' },
  { label: 'SOCKS', value: 'socks' },
  { label: 'CAPS & ACCESSORIES', value: 'accessories' },
  { label: 'HOODIES', value: 'hoodies' },
  { label: 'PANTS', value: 'pants' },
  { label: 'JEANS', value: 'jeans' },
];

export const ADMIN_CATEGORY_OPTIONS = [
  { label: 'Shirts', value: 't-shirts' },
  { label: 'Joggers', value: 'joggers' },
  { label: 'Shorts', value: 'shorts' },
  { label: 'Boxers', value: 'boxers' },
  { label: 'Vest (Singlets)', value: 'vests' },
  { label: 'Socks', value: 'socks' },
  { label: 'Caps & Accessories', value: 'accessories' },
  { label: 'Hoodies', value: 'hoodies' },
  { label: 'Pants', value: 'pants' },
  { label: 'Jeans', value: 'jeans' },
] as const;

export const formatCategoryName = (cat: string): string => {
  switch (cat) {
    case 't-shirts':
    case 'shirts':
      return 'Shirts';
    case 'joggers':
      return 'Joggers';
    case 'shorts':
      return 'Shorts';
    case 'boxers':
      return 'Boxers';
    case 'vests':
    case 'vest':
      return 'Vest (Singlet)';
    case 'socks':
      return 'Socks';
    case 'accessories':
      return 'Caps & Accessories';
    case 'hoodies':
      return 'Hoodies';
    case 'pants':
      return 'Pants';
    case 'jeans':
      return 'Jeans';
    default:
      return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Piece';
  }
};

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
