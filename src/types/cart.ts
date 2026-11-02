import { Product, ProductColor, CurrencyCode } from './product';

export interface CartItem {
  cartItemId: string; // unique combo of product id, size, and color
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  streetAddress: string;
  digitalAddress?: string; // Ghana Post GPS (e.g. GA-183-9024)
  notes?: string;
}

export type PaymentMethod = 'whatsapp';

export interface Order {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: CurrencyCode;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  createdAt: string;
  status: 'pending' | 'processing' | 'confirmed';
}
