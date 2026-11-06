'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/context/ProductsContext';
import { useCart } from '@/context/CartContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Product, ProductCategory, GarmentType, ADMIN_CATEGORY_OPTIONS, formatCategoryName } from '@/types/product';
import { SiteSettings } from '@/types/siteSettings';
import { BRAND_CONFIG } from '@/config/brand';
import {
  ShieldCheck,
  KeyRound,
  Unlock,
  RefreshCw,
  AlertCircle,
  Eye,
  Plus,
  LogOut,
  Search,
  Package,
  Trash2,
  ExternalLink,
  Check,
  Edit,
  X,
  Minus,
  Mail,
  Send,
  ShoppingBag,
  Phone,
  MapPin,
  Clock,
  Camera,
  Upload,
  Palette,
  ArrowLeft,
  ArrowRight,
  Star,
  Link as LinkIcon,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  Tag,
} from 'lucide-react';

/* Inline Stock Modifier Component */
function StockInput({
  product,
  onUpdateStock,
}: {
  product: Product;
  onUpdateStock: (product: Product, newStock: number) => Promise<void>;
}) {
  const currentStock = typeof product.stockCount === 'number' ? product.stockCount : 0;
  const [stockVal, setStockVal] = useState<string>(String(currentStock));
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setStockVal(String(product.stockCount ?? 0));
  }, [product.stockCount]);

  const commitStock = async (num: number) => {
    if (isNaN(num) || num < 0) return;
    setIsUpdating(true);
    await onUpdateStock(product, num);
    setIsUpdating(false);
  };

  return (
    <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl px-2.5 py-1.5">
      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold mr-0.5">
        Stock Left:
      </span>
      <button
        type="button"
        disabled={isUpdating || currentStock <= 0}
        onClick={() => {
          const next = Math.max(0, currentStock - 1);
          setStockVal(String(next));
          commitStock(next);
        }}
        className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-bold text-xs transition-colors shadow-sm disabled:opacity-40"
        title="Decrease stock by 1"
      >
        <Minus className="w-3 h-3" />
      </button>

      <input
        type="number"
        min={0}
        value={stockVal}
        onChange={(e) => setStockVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const parsed = parseInt(stockVal, 10);
            if (!isNaN(parsed)) commitStock(parsed);
          }
        }}
        onBlur={() => {
          const parsed = parseInt(stockVal, 10);
          if (!isNaN(parsed) && parsed !== currentStock) {
            commitStock(parsed);
          } else {
            setStockVal(String(currentStock));
          }
        }}
        className="w-12 h-6 text-center font-mono font-bold text-xs bg-transparent text-zinc-950 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-zinc-800 rounded border border-transparent focus:border-black/20 dark:focus:border-white/20"
        title="Type number and press Enter or click away"
      />

      <button
        type="button"
        disabled={isUpdating}
        onClick={() => {
          const next = currentStock + 1;
          setStockVal(String(next));
          commitStock(next);
        }}
        className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-bold text-xs transition-colors shadow-sm disabled:opacity-40"
        title="Increase stock by 1"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}

/* Inline Price Modifier Component */
function PriceInput({
  product,
  onUpdatePrice,
}: {
  product: Product;
  onUpdatePrice: (product: Product, newPrice: number) => Promise<void>;
}) {
  const [priceVal, setPriceVal] = useState<string>(String(product.priceGHS));
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setPriceVal(String(product.priceGHS));
  }, [product.priceGHS]);

  const commitPrice = async (num: number) => {
    if (isNaN(num) || num <= 0) return;
    setIsUpdating(true);
    await onUpdatePrice(product, num);
    setIsUpdating(false);
  };

  return (
    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl px-2.5 py-1.5">
      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
        GH₵
      </span>
      <input
        type="number"
        min={1}
        value={priceVal}
        onChange={(e) => setPriceVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const parsed = parseFloat(priceVal);
            if (!isNaN(parsed)) commitPrice(parsed);
          }
        }}
        onBlur={() => {
          const parsed = parseFloat(priceVal);
          if (!isNaN(parsed) && parsed !== product.priceGHS) {
            commitPrice(parsed);
          } else {
            setPriceVal(String(product.priceGHS));
          }
        }}
        className="w-16 h-6 text-center font-mono font-bold text-xs bg-transparent text-zinc-950 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-zinc-800 rounded border border-transparent focus:border-black/20 dark:focus:border-white/20"
        title="Type new price and press Enter or click away"
      />
    </div>
  );
}

export default function AdminPage() {
  const { products, isLoading, refreshProducts, toggleSoldOut, updateProduct, addProduct, deleteProduct } =
    useProducts();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_stock' | 'sold_out'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals & Forms
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newMockupUrl, setNewMockupUrl] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newColorMockup, setNewColorMockup] = useState('');

  const [isUploadingMockup, setIsUploadingMockup] = useState(false);
  const [isUploadingLook, setIsUploadingLook] = useState(false);
  const [isUploadingNewProductImage, setIsUploadingNewProductImage] = useState(false);

    // Upload single or multiple images directly from camera roll
  const uploadImageFiles = async (files: FileList | File[], folder: 'lookbook' | 'products' = 'products'): Promise<string[]> => {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.urls) && data.urls.length > 0) {
        return data.urls;
      } else if (res.ok && data.success && data.url) {
        return [data.url];
      } else {
        setNotification({ type: 'error', message: data.message || 'Camera roll upload failed.' });
        return [];
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setNotification({ type: 'error', message: 'Network error uploading photos.' });
      return [];
    }
  };

  const handleLookFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingLook(true);
    const urls = await uploadImageFiles(files, 'lookbook');
    setIsUploadingLook(false);
    if (urls.length > 0) {
      setNewLook((prev) => ({ ...prev, image: urls[0] }));
      setNotification({ type: 'success', message: 'Photo attached from camera roll!' });
    }
    e.target.value = '';
  };

  const handleMockupFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingMockup(true);
    const urls = await uploadImageFiles(files, 'products');
    setIsUploadingMockup(false);
    if (urls.length > 0) {
      setEditingProduct((prev) => prev ? ({ ...prev, images: [...(prev.images || []), ...urls] }) : null);
      setNotification({ type: 'success', message: `${urls.length} photo(s) added from camera roll!` });
    }
    e.target.value = '';
  };

  const handleNewProductFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingNewProductImage(true);
    const urls = await uploadImageFiles(files, 'products');
    setIsUploadingNewProductImage(false);
    if (urls.length > 0) {
      setNewProductForm((prev) => {
        const current = prev.images.filter(Boolean);
        const updated = [...current, ...urls];
        return {
          ...prev,
          images: updated,
          colors: prev.colors.map((c, i) => i === 0 ? { ...c, images: [updated[0]] } : c),
        };
      });
      setNotification({ type: 'success', message: `${urls.length} photo(s) added from camera roll!` });
    }
    e.target.value = '';
  };



  const shirtMockupPresets = [
    { label: 'White / Red Cross', path: '/products/shirts/IMG_4266.PNG', hex: '#FFFFFF' },
    { label: 'Black / Red Cross', path: '/products/shirts/IMG_4251.PNG', hex: '#111111' },
    { label: 'Black / Green Cross', path: '/products/shirts/IMG_4260.PNG', hex: '#1A3320' },
    { label: 'Black / White Cross', path: '/products/shirts/IMG_4261.PNG', hex: '#1C1C1E' },
    { label: 'Black / Gold Cross', path: '/products/shirts/IMG_4263.PNG', hex: '#2A2415' },
    { label: 'White / Black Cross', path: '/products/shirts/IMG_4250.PNG', hex: '#F5F5F5' },
  ];

  const capMockupPresets = [
    { label: 'Black Distressed Trucker', path: '/products/caps/IMG_3375.PNG', hex: '#18181B' },
    { label: 'White Knitted Beanie', path: '/products/caps/IMG_4195.PNG', hex: '#F4F4F5' },
    { label: 'Black Knitted Beanie', path: '/products/caps/IMG_4202.PNG', hex: '#18181B' },
    { label: 'Army Olive Wash Cap', path: '/products/caps/IMG_4216.PNG', hex: '#3E4233' },
    { label: 'Crimson Embroidered Cap', path: '/products/caps/IMG_4220.PNG', hex: '#7F1D1D' },
    { label: 'Earth Washed Cap', path: '/products/caps/IMG_4228.PNG', hex: '#453229' },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Full Control: Image URLs & Preset Pickers
  const [editingImageUrl, setEditingImageUrl] = useState('');
  const [newProductImageUrl, setNewProductImageUrl] = useState('');
  const [newLookImageUrl, setNewLookImageUrl] = useState('');
  const [showPresetsEdit, setShowPresetsEdit] = useState(false);
  const [showPresetsNew, setShowPresetsNew] = useState(false);

  // Full Control: Sizes, Features & Care specs
  const [customSizeEdit, setCustomSizeEdit] = useState('');
  const [customSizeNew, setCustomSizeNew] = useState('');
  const [newFeatureEdit, setNewFeatureEdit] = useState('');
  const [newCareEdit, setNewCareEdit] = useState('');
  const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'ONE SIZE'];

  // Resend Email Notification Status
  const [emailConfig, setEmailConfig] = useState<{ configured: boolean; adminEmail: string } | null>(null);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  useEffect(() => {
    fetch('/api/notify/email')
      .then((r) => r.json())
      .then((data) => setEmailConfig(data))
      .catch(() => {});
  }, []);

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    try {
      const res = await fetch('/api/notify/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({ type: 'success', message: data.message });
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to send test email.' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Could not contact email server.' });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // Primary Section Tabs: Inventory, Customer Orders, Lookbook, Site Content
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'lookbook' | 'content'>('inventory');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Site Content & Homepage CMS State
  const { settings: liveSettings, updateSettings: updateSiteSettings } = useSiteSettings();
  const [contentForm, setContentForm] = useState<SiteSettings>(liveSettings);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [newTickerText, setNewTickerText] = useState('');

  useEffect(() => {
    setContentForm(liveSettings);
  }, [liveSettings]);

  const handleSaveSiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContent(true);
    const ok = await updateSiteSettings(contentForm);
    setIsSavingContent(false);
    if (ok) {
      setNotification({ type: 'success', message: 'Homepage & site content updated live!' });
    } else {
      setNotification({ type: 'error', message: 'Failed to update site content.' });
    }
  };

  // Lookbook State
  const [lookbookItems, setLookbookItems] = useState<any[]>([]);
  const [isLoadingLookbook, setIsLoadingLookbook] = useState(false);
  const [isAddLookModalOpen, setIsAddLookModalOpen] = useState(false);
  const [newLook, setNewLook] = useState({
    title: '',
    image: '',
    productSlug: 'xsign-flex-tee',
    productTitle: 'X-SIGN Flex Tee',
    orientation: 'portrait' as 'portrait' | 'landscape',
  });

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchLookbook = async () => {
    setIsLoadingLookbook(true);
    try {
      const res = await fetch('/api/lookbook');
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setLookbookItems(data.items);
      }
    } catch (err) {
      console.error('Failed to fetch lookbook:', err);
    } finally {
      setIsLoadingLookbook(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchLookbook();
  }, []);

  const handleAddLook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLook.title.trim() || !newLook.image.trim()) {
      alert('Please provide a title and an image URL or path.');
      return;
    }

    try {
      const res = await fetch('/api/lookbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLook),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          message: `Model photo "${newLook.title}" published to Lookbook!`,
        });
        setIsAddLookModalOpen(false);
        setNewLook({
          title: '',
          image: '',
          productSlug: 'xsign-flex-tee',
          productTitle: 'X-SIGN Flex Tee',
          orientation: 'portrait',
        });
        fetchLookbook();
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to add model photo',
        });
      }
    } catch (err) {
      console.error('Error adding look:', err);
      setNotification({
        type: 'error',
        message: 'Network error adding lookbook item',
      });
    }
  };

  const handleDeleteLook = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the lookbook?`)) return;

    try {
      const res = await fetch(`/api/lookbook?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          message: `Model photo removed from lookbook.`,
        });
        fetchLookbook();
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Failed to delete lookbook item',
        });
      }
    } catch (err) {
      console.error('Error deleting look:', err);
      setNotification({
        type: 'error',
        message: 'Network error deleting lookbook item',
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string, sendEmail: boolean = true) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status, sendEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({ type: 'success', message: data.message });
        fetchOrders();
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to update order status' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Could not contact server.' });
    }
  };

  const getGarmentType = (category: ProductCategory): GarmentType => {
    switch (category) {
      case 'accessories':
      case 'socks':
        return 'accessory';
      case 'vests':
        return 'vest';
      case 'hoodies':
        return 'hoodie';
      case 'pants':
      case 'jeans':
      case 'joggers':
      case 'shorts':
      case 'boxers':
        return 'pants';
      default:
        return 'tshirt';
    }
  };

  // Form state for creating a new product
  const initialNewProductForm = {
    title: '',
    subtitle: '',
    category: 't-shirts' as ProductCategory,
    garmentType: 'tshirt' as GarmentType,
    priceGHS: 299,
    stockCount: 50,
    dropName: 'X-SIGN DROP 02',
    isNew: true,
    isFeatured: true,
    isSoldOut: false,
    images: [] as string[],
    colors: [
      { name: 'Onyx Black', hex: '#111113', modelHex: '#18181b', images: ['/products/shirts/IMG_4266.PNG'] },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Atelier crafted in Accra with premium heavy fabric and high-definition architectural detailing.',
    composition: '100% Combed Heavy Cotton',
    weight: '320 GSM',
    finish: 'Metallic Shimmer & Precision DTF',
    origin: 'Atelier Crafted in Accra',
  };

  const [newProductForm, setNewProductForm] = useState(initialNewProductForm);

  // Check auth session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('xsign_admin_session');
    if (savedToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Notification auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('xsign_admin_session', data.token || 'authenticated');
        setIsAuthenticated(true);
        setPasscode('');
        setNotification({ type: 'success', message: 'Welcome, Director. Access granted to inventory controls.' });
      } else {
        setAuthError(data.message || 'Invalid manager access code');
      }
    } catch {
      setAuthError('Connection error during authentication. Try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('xsign_admin_session');
    setIsAuthenticated(false);
  };

  // Stock update handler
  const handleStockUpdate = async (product: Product, newStock: number) => {
    const stock = Math.max(0, Math.floor(newStock));
    // If stock is set to 0, automatically mark sold out. If increased above 0 and was sold out, restore in stock.
    const isSoldOut = stock === 0 ? true : (product.isSoldOut && stock > 0 ? false : product.isSoldOut);

    const ok = await updateProduct(product.id, {
      stockCount: stock,
      isSoldOut,
    });

    if (ok) {
      setNotification({
        type: 'success',
        message: `Stock for "${product.title}" updated to ${stock} unit${stock === 1 ? '' : 's'}${stock === 0 ? ' (Marked SOLD OUT)' : ''}.`,
      });
    } else {
      setNotification({ type: 'error', message: 'Failed to update stock.' });
    }
  };

  // Price update handler
  const handlePriceUpdate = async (product: Product, newPriceGHS: number) => {
    if (isNaN(newPriceGHS) || newPriceGHS <= 0) return;
    const ok = await updateProduct(product.id, {
      priceGHS: newPriceGHS,
      priceUSD: Math.round(newPriceGHS * 0.076),
      priceGBP: Math.round(newPriceGHS * 0.061),
      priceEUR: Math.round(newPriceGHS * 0.070),
    });
    if (ok) {
      setNotification({ type: 'success', message: `Price updated for "${product.title}" to GH₵ ${newPriceGHS}.` });
    } else {
      setNotification({ type: 'error', message: 'Failed to update price.' });
    }
  };

  // Quick Sold Out Toggle
  const handleToggleSoldOut = async (product: Product) => {
    const nextStatus = !product.isSoldOut;
    // If setting to in-stock and stock was 0, default to 20 units
    const updates: Partial<Product> = { isSoldOut: nextStatus };
    if (!nextStatus && (product.stockCount === 0 || !product.stockCount)) {
      updates.stockCount = 20;
    }

    const ok = await updateProduct(product.id, updates);
    if (ok) {
      setNotification({
        type: 'success',
        message: `"${product.title}" marked as ${nextStatus ? 'SOLD OUT' : 'IN STOCK'}. Storefront updated.`,
      });
    } else {
      setNotification({ type: 'error', message: 'Failed to update stock status. Please try again.' });
    }
  };

  // Delete product
  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently remove "${product.title}" from the storefront?`
    );
    if (!confirmed) return;

    const ok = await deleteProduct(product.id);
    if (ok) {
      setNotification({ type: 'success', message: `Product "${product.title}" removed.` });
    } else {
      setNotification({ type: 'error', message: 'Could not delete product.' });
    }
  };

  // Save changes from Edit Modal
  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSubmitting(true);
    const stock = Number(editingProduct.stockCount) || 0;
    const price = Number(editingProduct.priceGHS) || 149;
    const isSoldOut = stock === 0 ? true : Boolean(editingProduct.isSoldOut);

    const ok = await updateProduct(editingProduct.id, {
      ...editingProduct,
      stockCount: stock,
      priceGHS: price,
      priceUSD: editingProduct.priceUSD || Math.round(price * 0.076),
      priceGBP: editingProduct.priceGBP || Math.round(price * 0.061),
      priceEUR: editingProduct.priceEUR || Math.round(price * 0.070),
      isSoldOut,
      images: Array.isArray(editingProduct.images) && editingProduct.images.length > 0 ? editingProduct.images : ['/products/shirts/IMG_4266.PNG'],
      sizes: Array.isArray(editingProduct.sizes) && editingProduct.sizes.length > 0 ? editingProduct.sizes : ['S', 'M', 'L', 'XL'],
      colors: Array.isArray(editingProduct.colors) && editingProduct.colors.length > 0 ? editingProduct.colors : [
        { name: 'Onyx Black', hex: '#111113', modelHex: '#18181b', images: editingProduct.images || ['/products/shirts/IMG_4266.PNG'] },
      ],
      fabricDetails: editingProduct.fabricDetails || {
        composition: '100% Combed Heavy Cotton',
        weight: '320 GSM',
        finish: 'Precision Screenprint & DTF',
        origin: 'Atelier Crafted in Accra',
      },
      features: Array.isArray(editingProduct.features) ? editingProduct.features : [],
      careInstructions: Array.isArray(editingProduct.careInstructions) ? editingProduct.careInstructions : [],
      isFeatured: Boolean(editingProduct.isFeatured),
      isNew: Boolean(editingProduct.isNew),
    });

    setIsSubmitting(false);

    if (ok) {
      setNotification({ type: 'success', message: `Changes saved for "${editingProduct.title}".` });
      setEditingProduct(null);
    } else {
      setNotification({ type: 'error', message: 'Failed to save changes.' });
    }
  };

  // Add Product Form Submission
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title.trim()) {
      alert('Please enter a product title.');
      return;
    }

    setIsSubmitting(true);

    const priceGHS = Number(newProductForm.priceGHS) || 299;
    const slug = newProductForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct: Product = {
      id: slug,
      slug,
      title: newProductForm.title.trim(),
      subtitle: newProductForm.subtitle.trim() || 'Official Atelier Release',
      category: newProductForm.category,
      garmentType: newProductForm.garmentType,
      priceGHS,
      priceUSD: Math.round(priceGHS * 0.076),
      priceGBP: Math.round(priceGHS * 0.061),
      priceEUR: Math.round(priceGHS * 0.070),
      isNew: newProductForm.isNew,
      isFeatured: newProductForm.isFeatured,
      isSoldOut: newProductForm.isSoldOut,
      stockCount: Number(newProductForm.stockCount) || 50,
      dropName: newProductForm.dropName.trim(),
      images: newProductForm.images.filter(Boolean),
      colors: newProductForm.colors,
      sizes: newProductForm.sizes,
      description: newProductForm.description,
      fabricDetails: {
        composition: newProductForm.composition,
        weight: newProductForm.weight,
        finish: newProductForm.finish,
        origin: newProductForm.origin,
      },
      features: [
        `${newProductForm.title}: Crafted with heart, worn with purpose.`,
        `Atelier construction featuring ${newProductForm.finish}`,
        `Constructed from ${newProductForm.composition}`,
      ],
      careInstructions: ['Machine wash cold inside out', 'Hang dry in shade to preserve artwork vibrancy'],
      model3DConfig: {
        garmentType: newProductForm.garmentType,
        defaultColor: newProductForm.colors[0]?.hex || '#1a1a1a',
        roughness: 0.9,
        metalness: 0.05,
        fabricPattern: newProductForm.garmentType === 'accessory' ? 'heavy-terry' : 'smooth',
        scale: [1, 1, 1],
      },
    };

    const ok = await addProduct(newProduct);
    setIsSubmitting(false);

    if (ok) {
      setNotification({ type: 'success', message: `Piece "${newProduct.title}" successfully added to storefront!` });
      setIsAddModalOpen(false);
      setNewProductForm(initialNewProductForm);
    } else {
      setNotification({ type: 'error', message: 'Failed to create product. Check fields and retry.' });
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

      const isSoldOut = Boolean(p.isSoldOut || (typeof p.stockCount === 'number' && p.stockCount <= 0));
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'sold_out' && isSoldOut) ||
        (statusFilter === 'in_stock' && !isSoldOut);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  // Inventory stats
  const totalItems = products.length;
  const soldOutItems = products.filter((p) => p.isSoldOut || (typeof p.stockCount === 'number' && p.stockCount <= 0)).length;
  const inStockItems = totalItems - soldOutItems;

  // 1. Loading screen
  if (isAuthenticated === null) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  // 2. Passcode Gate Screen (Clean, strictly private, zero hints)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16">
        <div className="w-full max-w-md p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-2xl relative overflow-hidden">
          <div className="text-center space-y-3 mb-8">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                {BRAND_CONFIG.name} ATELIER
              </span>
              <h1 className="text-2xl font-bold font-sans uppercase tracking-tight text-zinc-950 dark:text-white">
                Manager Portal
              </h1>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Restricted management console for authorized brand personnel.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-2">
                Manager Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter access code"
                  autoFocus
                  required
                  className="w-full h-12 px-4 pl-11 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
                />
                <KeyRound className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full h-12 rounded-xl bg-black text-white dark:bg-white dark:text-black font-sans font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Manager Console</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/5 text-center">
            <Link
              href="/"
              className="text-xs font-sans text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
            >
              ← Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Manager Dashboard
  return (
    <div className="min-h-screen pb-24 pt-28 sm:pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border animate-in fade-in slide-in-from-bottom-3 duration-300 ${
            notification.type === 'success'
              ? 'bg-zinc-950/90 text-white border-emerald-500/30'
              : 'bg-red-950/90 text-white border-red-500/30'
          }`}
        >
          {notification.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span className="text-xs font-sans">{notification.message}</span>
        </div>
      )}

      {/* Top Bar / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-black/10 dark:border-white/10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-zinc-950 dark:text-white">
            Inventory & Drop Manager
          </h1>
          <p className="text-xs text-zinc-500 font-sans mt-1">
            Manage product availability, stock levels, and storefront pricing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <Link
            href="/shop"
            target="_blank"
            className="flex-1 sm:flex-initial h-10 px-3.5 sm:px-4 rounded-xl border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 bg-black/[0.02] dark:bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white flex items-center justify-center gap-2 transition-all whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Storefront Preview</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </Link>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-initial h-10 px-3.5 sm:px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={handleLogout}
            title="Lock terminal and logout"
            className="h-10 w-10 shrink-0 rounded-xl border border-black/10 dark:border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors flex items-center justify-center"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm">
          <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
            Total Pieces
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-950 dark:text-white font-mono">
              {totalItems}
            </span>
            <span className="text-xs text-zinc-500 font-sans">in catalog</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm">
          <span className="text-[11px] font-mono tracking-widest text-emerald-600 dark:text-emerald-400 uppercase block mb-1">
            In Stock
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {inStockItems}
            </span>
            <span className="text-xs text-zinc-500 font-sans">active pieces</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm">
          <span className="text-[11px] font-mono tracking-widest text-amber-600 dark:text-amber-400 uppercase block mb-1">
            Sold Out
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              {soldOutItems}
            </span>
            <span className="text-xs text-zinc-500 font-sans">archived</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm">
          <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
            WhatsApp Channel
          </span>
          <div className="text-sm font-semibold text-zinc-950 dark:text-white font-mono truncate">
            {BRAND_CONFIG.whatsappNumber}
          </div>
          <span className="text-[10px] text-zinc-500">Live ordering line</span>
        </div>
      </div>

      {/* Resend Email Notification Status Card */}
      <div className="mb-8 p-5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            emailConfig?.configured
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
          }`}>
            <Mail className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-tight">
                Resend Email Notifications
              </h3>
              {emailConfig?.configured ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono text-[9px] uppercase font-bold tracking-wider border border-emerald-500/20">
                  Connected
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-mono text-[9px] uppercase font-bold tracking-wider border border-amber-500/20">
                  API Key Needed
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 font-sans mt-0.5">
              {emailConfig?.configured
                ? `Customer receipts & new order alerts active. Alert inbox: ${emailConfig.adminEmail}`
                : 'Add RESEND_API_KEY to your .env.local file to activate automated customer receipts & owner alerts.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSendTestEmail}
          disabled={isSendingTestEmail}
          className="h-10 px-4 rounded-xl border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white flex items-center justify-center gap-2 transition-colors shrink-0 disabled:opacity-50"
        >
          {isSendingTestEmail ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send Test Email</span>
            </>
          )}
        </button>
      </div>

      {/* Primary Section Switcher: Catalog vs Customer Orders vs Lookbook Models */}
      <div className="flex items-center gap-2 sm:gap-3 border-b border-black/10 dark:border-white/10 pb-4 mb-8 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`shrink-0 h-11 px-4 sm:px-5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catalog ({totalItems})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('orders');
            fetchOrders();
          }}
          className={`shrink-0 h-11 px-4 sm:px-5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
          {orders.filter((o) => o.status === 'received').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('lookbook');
            fetchLookbook();
          }}
          className={`shrink-0 h-11 px-4 sm:px-5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'lookbook'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Lookbook Models ({lookbookItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`shrink-0 h-11 px-4 sm:px-5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'content'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Site Content & Homepage</span>
        </button>
      </div>

      {activeTab === 'orders' ? (
        /* ORDERS LOG VIEW */
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight text-zinc-950 dark:text-white">
                Customer Orders & Notifications
              </h2>
              <p className="text-xs text-zinc-500">
                Updating an order status automatically triggers a notification email to the customer.
              </p>
            </div>
            <button
              onClick={() => fetchOrders()}
              disabled={isLoadingOrders}
              className="h-9 px-3.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10">
              <ShoppingBag className="w-10 h-10 mx-auto text-zinc-400 mb-3" />
              <p className="text-sm font-semibold text-zinc-950 dark:text-white">No customer orders recorded yet</p>
              <p className="text-xs text-zinc-500 mt-1">
                When visitors check out on the storefront, their order manifests and email records will appear here.
              </p>
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold font-mono text-zinc-950 dark:text-white">
                      #{o.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                        o.status === 'received'
                          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          : o.status === 'confirmed'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : o.status === 'dispatched'
                          ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(o.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-zinc-500 text-[11px] font-mono uppercase block mb-0.5">Customer</span>
                    <strong className="text-zinc-950 dark:text-white text-sm block">{o.customerName}</strong>
                    {o.customerEmail && <span className="text-zinc-500 text-xs block">{o.customerEmail}</span>}
                  </div>

                  <div>
                    <span className="text-zinc-500 text-[11px] font-mono uppercase block mb-0.5">Phone / WhatsApp</span>
                    <strong className="text-zinc-950 dark:text-white text-sm block">{o.customerPhone}</strong>
                    <a
                      href={`https://wa.me/${o.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${o.customerName}, this is X-SIGN Atelier regarding your order #${o.orderNumber}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#25D366] text-xs font-semibold mt-0.5 hover:underline"
                    >
                      <span>Chat on WhatsApp →</span>
                    </a>
                  </div>

                  <div>
                    <span className="text-zinc-500 text-[11px] font-mono uppercase block mb-0.5">Delivery Location</span>
                    <strong className="text-zinc-950 dark:text-white text-xs block">{o.deliveryCity}</strong>
                    <span className="text-zinc-500 text-xs block">{o.deliveryAddress}</span>
                  </div>
                </div>

                {/* Ordered Items Table */}
                <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-xl p-3.5 border border-black/5 dark:border-white/5 space-y-2">
                  <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
                    Ordered Pieces
                  </div>
                  <div className="divide-y divide-black/5 dark:divide-white/5">
                    {o.items?.map((item: any, idx: number) => (
                      <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-zinc-950 dark:text-white">{item.title}</strong>
                          <span className="text-zinc-500 ml-2 font-mono">
                            ({item.colorName} • {item.size})
                          </span>
                        </div>
                        <div className="font-mono">
                          <span className="text-zinc-500 mr-3">x{item.quantity}</span>
                          <span className="font-bold text-zinc-950 dark:text-white">
                            GH₵ {item.priceGHS * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between font-mono text-xs font-bold">
                    <span>Total Amount:</span>
                    <span className="text-emerald-500 text-sm">GH₵ {o.totalGHS}</span>
                  </div>
                </div>

                {/* Update Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 dark:border-white/5">
                  <div className="text-xs text-zinc-500 font-sans">
                    Email updates are automatically dispatched to {o.customerEmail || 'the customer'} on status change.
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {o.status === 'received' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(o.id, 'confirmed')}
                        className="h-9 px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Confirm Order
                      </button>
                    )}

                    {o.status !== 'dispatched' && o.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(o.id, 'dispatched')}
                        className="h-9 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                      >
                        Dispatch & Notify Customer
                      </button>
                    )}

                    {o.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(o.id, 'completed')}
                        className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'lookbook' ? (
        /* LOOKBOOK MANAGEMENT VIEW */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/10 dark:border-white/10">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight text-zinc-950 dark:text-white">
                Runway & Model Lookbook
              </h2>
              <p className="text-xs text-zinc-500">
                Manage model photographs showcased on your public Lookbook page and storefront editorial strip.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/lookbook"
                target="_blank"
                className="h-10 px-4 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
              >
                <span>View Live Lookbook</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setIsAddLookModalOpen(true)}
                className="h-10 px-5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                <span>Add Model Photo</span>
              </button>
            </div>
          </div>

          {isLoadingLookbook ? (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs">
              Loading lookbook photos...
            </div>
          ) : lookbookItems.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-black/15 dark:border-white/15 space-y-3">
              <Camera className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="text-sm font-semibold text-zinc-950 dark:text-white">No model photos in lookbook yet</p>
              <p className="text-xs text-zinc-500">Click &ldquo;Add Model Photo&rdquo; to upload or select campaign model shots.</p>
              <button
                onClick={() => setIsAddLookModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold uppercase"
              >
                Add First Photo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lookbookItems.map((look) => (
                <div
                  key={look.id}
                  className="group relative rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0d12] flex flex-col shadow-sm"
                >
                  <div className={`relative w-full ${look.orientation === 'landscape' ? 'aspect-[16/10]' : 'aspect-[3/4]'} bg-zinc-900 overflow-hidden`}>
                    <Image
                      src={look.image}
                      alt={look.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white uppercase">
                      {look.orientation}
                    </div>
                    <button
                      onClick={() => handleDeleteLook(look.id, look.title)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors shadow-lg"
                      title="Remove from lookbook"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                    <div>
                      <p className="text-xs font-bold text-zinc-950 dark:text-white line-clamp-2">
                        {look.title}
                      </p>
                      {look.productTitle && (
                        <p className="text-[11px] text-zinc-500 pt-0.5 truncate">
                          Piece: {look.productTitle}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-zinc-400">ID: {look.id}</span>
                      {look.productSlug && (
                        <Link
                          href={`/product/${look.productSlug}`}
                          target="_blank"
                          className="text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white flex items-center gap-1 font-medium"
                        >
                          <span>Shop Piece</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'content' ? (
        /* SITE CONTENT & HOMEPAGE CMS VIEW */
        <form onSubmit={handleSaveSiteContent} className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Homepage & Brand Content CMS</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Take full control of your homepage runway headlines, running announcements, campaign film, and atelier manifesto.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSavingContent}
              className="h-11 px-6 rounded-xl bg-black text-white dark:bg-white dark:text-black font-sans font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg shrink-0"
            >
              {isSavingContent ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Live...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save & Publish Changes</span>
                </>
              )}
            </button>
          </div>

          {/* 1. HERO RUNWAY BANNER */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-500" />
                <span>01. Main Runway Hero Section</span>
              </h3>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">First screen on homepage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                  Brand Headline
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.hero?.title || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      hero: { ...(contentForm.hero || {}), title: e.target.value } as any,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                  Tagline / Subheading
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.hero?.tagline || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      hero: { ...(contentForm.hero || {}), tagline: e.target.value } as any,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                Hero Description / Atelier Hook
              </label>
              <textarea
                rows={3}
                value={contentForm.hero?.description || ''}
                onChange={(e) =>
                  setContentForm({
                    ...contentForm,
                    hero: { ...(contentForm.hero || {}), description: e.target.value } as any,
                  })
                }
                className="w-full p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-sans text-zinc-950 dark:text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                  Primary Button Text & Destination
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={contentForm.hero?.primaryCtaText || 'SHOP COLLECTION'}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        hero: { ...(contentForm.hero || {}), primaryCtaText: e.target.value } as any,
                      })
                    }
                    className="flex-1 h-10 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-sans text-zinc-950 dark:text-white"
                  />
                  <input
                    type="text"
                    value={contentForm.hero?.primaryCtaLink || '/shop'}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        hero: { ...(contentForm.hero || {}), primaryCtaLink: e.target.value } as any,
                      })
                    }
                    className="w-28 h-10 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                  Secondary Button Text & Destination
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={contentForm.hero?.secondaryCtaText || 'VIEW LOOKBOOK'}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        hero: { ...(contentForm.hero || {}), secondaryCtaText: e.target.value } as any,
                      })
                    }
                    className="flex-1 h-10 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-sans text-zinc-950 dark:text-white"
                  />
                  <input
                    type="text"
                    value={contentForm.hero?.secondaryCtaLink || '/lookbook'}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        hero: { ...(contentForm.hero || {}), secondaryCtaLink: e.target.value } as any,
                      })
                    }
                    className="w-28 h-10 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. MARQUEE RUNNING TICKER ANNOUNCEMENTS */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-500" />
                <span>02. Marquee Running Ticker Banner</span>
              </h3>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                {(contentForm.marquee?.items || []).length} phrases in rotation
              </span>
            </div>

            <p className="text-xs text-zinc-500 font-sans">
              These phrases scroll continuously across the homepage marquee ticker. Add announcements, drop dates, delivery promises, or atelier slogans.
            </p>

            <div className="space-y-2">
              {(contentForm.marquee?.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-center font-mono text-xs text-zinc-400 font-bold">{idx + 1}</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...(contentForm.marquee?.items || [])];
                      updated[idx] = e.target.value;
                      setContentForm({
                        ...contentForm,
                        marquee: { items: updated },
                      });
                    }}
                    className="flex-1 h-10 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-sans text-zinc-950 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (contentForm.marquee?.items || []).filter((_, i) => i !== idx);
                      setContentForm({
                        ...contentForm,
                        marquee: { items: updated },
                      });
                    }}
                    className="w-10 h-10 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white flex items-center justify-center transition-colors shrink-0"
                    title="Remove phrase"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="New ticker phrase (e.g. FLASH SALE • FREE ACCRA DISPATCH)"
                value={newTickerText}
                onChange={(e) => setNewTickerText(e.target.value)}
                className="flex-1 h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-sans text-zinc-950 dark:text-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newTickerText.trim()) return;
                  setContentForm({
                    ...contentForm,
                    marquee: {
                      items: [...(contentForm.marquee?.items || []), newTickerText.trim()],
                    },
                  });
                  setNewTickerText('');
                }}
                className="h-11 px-5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase shrink-0"
              >
                + Add Phrase
              </button>
            </div>
          </div>

          {/* 3. OFFICIAL CAMPAIGN FILM */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-500" />
                <span>03. Official Campaign Film Settings</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                  Film Title
                </label>
                <input
                  type="text"
                  value={contentForm.campaignFilm?.title || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      campaignFilm: { ...(contentForm.campaignFilm || { subtitle: '' }), title: e.target.value },
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                  Film Subtitle
                </label>
                <input
                  type="text"
                  value={contentForm.campaignFilm?.subtitle || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      campaignFilm: { ...(contentForm.campaignFilm || { title: '' }), subtitle: e.target.value },
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                Optional Direct Video Link (YouTube / MP4 / Cloud Video)
              </label>
              <input
                type="url"
                placeholder="e.g. https://www.youtube.com/watch?v=... or leave blank for animated model scenes"
                value={contentForm.campaignFilm?.videoUrl || ''}
                onChange={(e) =>
                  setContentForm({
                    ...contentForm,
                    campaignFilm: { ...(contentForm.campaignFilm || { title: '', subtitle: '' }), videoUrl: e.target.value },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
              />
              <span className="text-[10px] text-zinc-500 font-mono block">
                If left blank, the homepage displays the high-res atelier campaign slideshow with theater mode.
              </span>
            </div>
          </div>

          {/* 4. ATELIER MANIFESTO */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>04. Atelier Manifesto & Brand Story</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                  Manifesto Headline
                </label>
                <input
                  type="text"
                  value={contentForm.manifesto?.heading || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      manifesto: { ...(contentForm.manifesto || {}), heading: e.target.value } as any,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                  Subheading Badge
                </label>
                <input
                  type="text"
                  value={contentForm.manifesto?.subheading || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      manifesto: { ...(contentForm.manifesto || {}), subheading: e.target.value } as any,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                Primary Brand Paragraph
              </label>
              <textarea
                rows={3}
                value={contentForm.manifesto?.paragraph1 || ''}
                onChange={(e) =>
                  setContentForm({
                    ...contentForm,
                    manifesto: { ...(contentForm.manifesto || {}), paragraph1: e.target.value } as any,
                  })
                }
                className="w-full p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-sans text-zinc-950 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                Secondary Technical Paragraph
              </label>
              <textarea
                rows={2}
                value={contentForm.manifesto?.paragraph2 || ''}
                onChange={(e) =>
                  setContentForm({
                    ...contentForm,
                    manifesto: { ...(contentForm.manifesto || {}), paragraph2: e.target.value } as any,
                  })
                }
                className="w-full p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-sans text-zinc-950 dark:text-white"
              />
            </div>
          </div>

          {/* 5. CONTACT & SOCIALS */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>05. Client Care Channels & Social Accounts</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                  WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  value={contentForm.contact?.whatsappNumber || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      contact: { ...(contentForm.contact || {}), whatsappNumber: e.target.value } as any,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                  Client Care Email
                </label>
                <input
                  type="email"
                  value={contentForm.contact?.email || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      contact: { ...(contentForm.contact || {}), email: e.target.value } as any,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                  Flagship Address
                </label>
                <input
                  type="text"
                  value={contentForm.contact?.flagshipAddress || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      contact: { ...(contentForm.contact || {}), flagshipAddress: e.target.value } as any,
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-sans text-zinc-950 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-zinc-500">Instagram</label>
                <input
                  type="text"
                  value={contentForm.contact?.instagram || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      contact: { ...(contentForm.contact || {}), instagram: e.target.value } as any,
                    })
                  }
                  className="w-full h-9 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-zinc-500">TikTok</label>
                <input
                  type="text"
                  value={contentForm.contact?.tiktok || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      contact: { ...(contentForm.contact || {}), tiktok: e.target.value } as any,
                    })
                  }
                  className="w-full h-9 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-zinc-500">Twitter / X</label>
                <input
                  type="text"
                  value={contentForm.contact?.twitter || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      contact: { ...(contentForm.contact || {}), twitter: e.target.value } as any,
                    })
                  }
                  className="w-full h-9 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-zinc-500">YouTube</label>
                <input
                  type="text"
                  value={contentForm.contact?.youtube || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      contact: { ...(contentForm.contact || {}), youtube: e.target.value } as any,
                    })
                  }
                  className="w-full h-9 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-zinc-500">Twitch</label>
                <input
                  type="text"
                  value={contentForm.contact?.twitch || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      contact: { ...(contentForm.contact || {}), twitch: e.target.value } as any,
                    })
                  }
                  className="w-full h-9 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
            <button
              type="submit"
              disabled={isSavingContent}
              className="h-12 px-8 rounded-xl bg-black text-white dark:bg-white dark:text-black font-sans font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl"
            >
              {isSavingContent ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Live to Storefront...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save & Publish All Homepage Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* INVENTORY VIEW */
        <>
          {/* Control Bar: Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`h-9 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              statusFilter === 'all'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            All Pieces ({totalItems})
          </button>
          <button
            onClick={() => setStatusFilter('in_stock')}
            className={`h-9 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              statusFilter === 'in_stock'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500'
            }`}
          >
            In Stock ({inStockItems})
          </button>
          <button
            onClick={() => setStatusFilter('sold_out')}
            className={`h-9 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              statusFilter === 'sold_out'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-amber-500'
            }`}
          >
            Sold Out ({soldOutItems})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64 min-w-[180px]">
            <input
              type="text"
              placeholder="Filter by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 px-3 pl-9 rounded-xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
          >
            <option value="all">All Categories</option>
            {ADMIN_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => refreshProducts()}
            disabled={isLoading}
            title="Refresh product list"
            className="h-9 w-9 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Products Inventory Grid / List */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10">
            <Package className="w-10 h-10 mx-auto text-zinc-400 mb-3" />
            <p className="text-sm font-semibold text-zinc-950 dark:text-white">No products found</p>
            <p className="text-xs text-zinc-500 mt-1">Try modifying your filter or add a new piece to the atelier.</p>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isSoldOut = Boolean(p.isSoldOut || (typeof p.stockCount === 'number' && p.stockCount <= 0));
            const coverImg = p.images?.[0] || '/products/shirts/IMG_4266.PNG';

            return (
              <div
                key={p.id}
                className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c0d12] border transition-all duration-200 flex flex-col xl:flex-row xl:items-center justify-between gap-5 ${
                  isSoldOut
                    ? 'border-amber-500/20 bg-amber-500/[0.01]'
                    : 'border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/20'
                }`}
              >
                {/* Product Info with Thumbnail */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0 border border-black/10 dark:border-white/10">
                    <Image
                      src={coverImg}
                      alt={p.title}
                      fill
                      className="object-contain p-1.5"
                    />
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="font-mono text-[9px] font-bold text-amber-300 uppercase tracking-wider text-center px-1">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] tracking-wider uppercase font-medium">
                        {formatCategoryName(p.category)}
                      </span>
                      {p.dropName && (
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest truncate">
                          {p.dropName}
                        </span>
                      )}
                      {isSoldOut ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-mono text-[10px] font-bold uppercase tracking-wider">
                          SOLD OUT
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase tracking-wider">
                          IN STOCK
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-zinc-950 dark:text-white text-base sm:text-lg leading-tight truncate">
                      {p.title}
                    </h3>

                    <p className="text-xs text-zinc-500 font-sans line-clamp-1">
                      {p.subtitle || p.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono">
                      <span className="text-zinc-500">{p.sizes.join(', ')}</span>
                      <span className="text-zinc-400">•</span>
                      <span className="text-zinc-500">{p.colors.length} Colorway{p.colors.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Manager Modifiers & Quick Actions */}
                <div className="flex flex-wrap items-center justify-start xl:justify-end gap-3 pt-4 xl:pt-0 border-t xl:border-t-0 border-black/10 dark:border-white/5">
                  {/* 1. STOCK LEFT MODIFIER (Direct Stepper & Input) */}
                  <StockInput product={p} onUpdateStock={handleStockUpdate} />

                  {/* 2. PRICE MODIFIER (Direct Input) */}
                  <PriceInput product={p} onUpdatePrice={handlePriceUpdate} />

                  {/* 3. SOLD OUT TOGGLE BUTTON */}
                  <button
                    onClick={() => handleToggleSoldOut(p)}
                    className={`h-10 px-3.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm ${
                      isSoldOut
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-zinc-900 hover:bg-black text-amber-400 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-amber-500/30'
                    }`}
                  >
                    {isSoldOut ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Stock</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Sold Out</span>
                      </>
                    )}
                  </button>

                  {/* 4. EDIT PIECE MODAL TRIGGER */}
                  <button
                    onClick={() => setEditingProduct({ ...p })}
                    className="h-10 px-3 rounded-xl border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white flex items-center gap-1.5 transition-colors"
                    title="Edit complete product details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* 5. VIEW LIVE PRODUCT PAGE */}
                  <Link
                    href={`/product/${p.slug}`}
                    target="_blank"
                    className="h-10 px-3 rounded-xl border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 text-zinc-500 hover:text-black dark:hover:text-white flex items-center justify-center transition-colors"
                    title="View live product page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {/* 6. DELETE PIECE */}
                  <button
                    onClick={() => handleDeleteProduct(p)}
                    className="h-10 px-3 rounded-xl border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-500 transition-colors flex items-center justify-center"
                    title="Remove piece from catalog"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
        </>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0c0d12] border border-black/15 dark:border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 relative overflow-hidden">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-black/10 dark:border-white/10">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                  EDIT ATELIER PIECE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-zinc-950 dark:text-white">
                  {editingProduct.title}
                </h2>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400">
                    Drop Name
                  </label>
                  <input
                    type="text"
                    value={editingProduct.dropName || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, dropName: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>

              {/* Price, Stock Count, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400">
                    Price (GH₵) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProduct.priceGHS}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceGHS: Number(e.target.value) })}
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400 font-bold text-amber-500">
                    Stock Left (Units) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingProduct.stockCount ?? 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-amber-500/30 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  >
                    {ADMIN_CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock Status Switch */}
              <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
                    Availability Status
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Directly indicates whether the piece is actively purchasable or archived as Sold Out.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProduct({ ...editingProduct, isSoldOut: !editingProduct.isSoldOut })}
                  className={`h-9 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                    editingProduct.isSoldOut
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-emerald-600 text-white shadow-sm'
                  }`}
                >
                  {editingProduct.isSoldOut ? 'SOLD OUT' : 'IN STOCK'}
                </button>
              </div>

              {/* Product Mockup Pictures (Packshots & Cutouts) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-500" />
                      <span>Product Mockup Pictures ({(editingProduct.images || []).length})</span>
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Tap the red trash icon on any photo to remove it immediately. Reorder with arrows or set your cover photo.
                    </p>
                  </div>
                  {(editingProduct.images || []).length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to remove all pictures from this piece?')) {
                          setEditingProduct({ ...editingProduct, images: [] });
                        }
                      }}
                      className="text-[11px] font-mono text-rose-500 hover:text-rose-600 underline font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Gallery of current mockups */}
                {(editingProduct.images || []).length === 0 ? (
                  <div className="p-6 text-center rounded-xl border border-dashed border-black/15 dark:border-white/15 text-xs text-zinc-500 font-mono">
                    No pictures attached yet. Add photos from your camera roll or paste an image URL below.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {(editingProduct.images || []).map((img, idx) => {
                      const isCover = idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`relative aspect-[4/5] rounded-xl overflow-hidden border p-1 bg-white dark:bg-black/60 shadow-sm transition-all ${
                            isCover ? 'border-emerald-500 ring-2 ring-emerald-500/40' : 'border-black/10 dark:border-white/10'
                          }`}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={img}
                              alt=""
                              fill
                              className={img.toLowerCase().endsWith('.png') ? 'object-contain p-1' : 'object-cover'}
                            />
                          </div>

                          {/* Cover Badge / Set Cover Button */}
                          <div className="absolute top-1.5 left-1.5 z-10">
                            {isCover ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-black text-[9px] font-mono font-bold uppercase shadow">
                                ★ Cover
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const newImages = [img, ...editingProduct.images.filter((_, i) => i !== idx)];
                                  setEditingProduct({ ...editingProduct, images: newImages });
                                }}
                                className="px-1.5 py-0.5 rounded-md bg-black/85 hover:bg-emerald-500 text-white hover:text-black text-[9px] font-mono font-bold uppercase shadow transition-colors"
                              >
                                Set Cover
                              </button>
                            )}
                          </div>

                          {/* Always-visible RED TRASH BUTTON on top-right */}
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = editingProduct.images.filter((_, i) => i !== idx);
                              setEditingProduct({ ...editingProduct, images: newImages });
                            }}
                            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-90 text-white flex items-center justify-center shadow-lg transition-all z-10"
                            title="Delete this picture"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Bottom Reorder Arrows */}
                          <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between z-10">
                            {idx > 0 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const newImgs = [...editingProduct.images];
                                  const temp = newImgs[idx - 1];
                                  newImgs[idx - 1] = newImgs[idx];
                                  newImgs[idx] = temp;
                                  setEditingProduct({ ...editingProduct, images: newImgs });
                                }}
                                className="w-6 h-6 rounded-md bg-black/85 hover:bg-black text-white flex items-center justify-center shadow transition-colors active:scale-95"
                                title="Move left"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            ) : <span />}

                            {idx < editingProduct.images.length - 1 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const newImgs = [...editingProduct.images];
                                  const temp = newImgs[idx + 1];
                                  newImgs[idx + 1] = newImgs[idx];
                                  newImgs[idx] = temp;
                                  setEditingProduct({ ...editingProduct, images: newImgs });
                                }}
                                className="w-6 h-6 rounded-md bg-black/85 hover:bg-black text-white flex items-center justify-center shadow transition-colors active:scale-95 ml-auto"
                                title="Move right"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            ) : <span />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upload from camera roll */}
                <div className="pt-1">
                  <label className="cursor-pointer w-full h-14 rounded-2xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 flex items-center justify-center gap-3 transition-all">
                    {isUploadingMockup ? (
                      <RefreshCw className="w-5 h-5 text-emerald-500 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 text-emerald-500" />
                    )}
                    <div className="text-left">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white block">
                        {isUploadingMockup ? 'Uploading from Camera Roll...' : '+ Add Photo(s) from Camera Roll / Files'}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono block">
                        Select packshots or cutouts directly from your phone or device
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleMockupFileUpload}
                      disabled={isUploadingMockup}
                    />
                  </label>
                </div>

                {/* Add Image by Direct URL */}
                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-black/40 border border-black/10 dark:border-white/10 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                    Or Paste Direct Image URL (Cloud / Supabase / Web)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://.../photo.png or /products/shirts/..."
                      value={editingImageUrl}
                      onChange={(e) => setEditingImageUrl(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingImageUrl.trim()) return;
                        setEditingProduct({
                          ...editingProduct,
                          images: [...(editingProduct.images || []), editingImageUrl.trim()],
                        });
                        setEditingImageUrl('');
                        setNotification({ type: 'success', message: 'Picture URL attached to piece!' });
                      }}
                      className="h-9 px-3.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase shrink-0 shadow-sm"
                    >
                      + Attach URL
                    </button>
                  </div>
                </div>

                {/* Preset Atelier Mockups Accordion */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPresetsEdit(!showPresetsEdit)}
                    className="w-full py-2 px-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/30 flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-1.5 font-bold uppercase text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Browse Preset Atelier Mockups (Tees & Caps)
                    </span>
                    {showPresetsEdit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showPresetsEdit && (
                    <div className="mt-2.5 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block mb-2">Signature Shirts:</span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {shirtMockupPresets.map((p, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                if (!(editingProduct.images || []).includes(p.path)) {
                                  setEditingProduct({
                                    ...editingProduct,
                                    images: [...(editingProduct.images || []), p.path],
                                  });
                                  setNotification({ type: 'success', message: `Added ${p.label} mockup!` });
                                }
                              }}
                              className="group relative aspect-square rounded-lg border border-black/10 dark:border-white/10 p-1 bg-zinc-50 dark:bg-black/60 hover:border-emerald-500 transition-all flex flex-col items-center justify-center"
                              title={`Add ${p.label}`}
                            >
                              <div className="relative w-full h-full">
                                <Image src={p.path} alt={p.label} fill className="object-contain p-0.5" />
                              </div>
                              <span className="text-[8px] font-mono text-zinc-500 truncate w-full text-center mt-0.5">{p.label.split('/')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block mb-2">Headwear & Caps:</span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {capMockupPresets.map((p, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                if (!(editingProduct.images || []).includes(p.path)) {
                                  setEditingProduct({
                                    ...editingProduct,
                                    images: [...(editingProduct.images || []), p.path],
                                  });
                                  setNotification({ type: 'success', message: `Added ${p.label} mockup!` });
                                }
                              }}
                              className="group relative aspect-square rounded-lg border border-black/10 dark:border-white/10 p-1 bg-zinc-50 dark:bg-black/60 hover:border-emerald-500 transition-all flex flex-col items-center justify-center"
                              title={`Add ${p.label}`}
                            >
                              <div className="relative w-full h-full">
                                <Image src={p.path} alt={p.label} fill className="object-contain p-0.5" />
                              </div>
                              <span className="text-[8px] font-mono text-zinc-500 truncate w-full text-center mt-0.5">{p.label.split(' ')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Designs & Colours Display Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-500" />
                    <span>Designs & Colourways ({(editingProduct.colors || []).length})</span>
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Displays swatches on the Shop page. When shoppers tap or hover a swatch, the product card instantly displays that design\'s mockup picture.
                  </p>
                </div>

                {/* List of current designs */}
                <div className="space-y-2">
                  {(editingProduct.colors || []).map((col, idx) => {
                    const colMockup = col.images?.[0] || editingProduct.images[0];
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="w-6 h-6 rounded-full border border-black/20 dark:border-white/20 shrink-0 shadow-sm"
                            style={{ backgroundColor: col.hex }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-zinc-950 dark:text-white truncate">
                              {col.name}
                            </p>
                            <p className="text-[10px] font-mono text-zinc-500 uppercase">
                              Hex: {col.hex} {colMockup ? `• Mockup: ${colMockup.split('/').pop()}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {colMockup && (
                            <div className="relative w-8 h-10 rounded border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-black/60">
                              <Image src={colMockup} alt="" fill className="object-contain p-0.5" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if ((editingProduct.colors?.length || 0) <= 1) {
                                alert('A product must have at least one design or colourway.');
                                return;
                              }
                              const updated = editingProduct.colors.filter((_, i) => i !== idx);
                              setEditingProduct({ ...editingProduct, colors: updated });
                            }}
                            className="w-8 h-8 rounded-lg border border-black/10 dark:border-white/10 hover:border-rose-500 hover:bg-rose-500/10 flex items-center justify-center text-zinc-500 hover:text-rose-500 transition-colors"
                            title="Remove design"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add new design subform */}
                <div className="p-3.5 rounded-xl border border-dashed border-black/20 dark:border-white/20 bg-white/50 dark:bg-black/20 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block">
                    + Add Available Design / Colour
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="space-y-1 sm:col-span-1">
                      <label className="text-[10px] uppercase font-mono text-zinc-500">Design Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Acid Wash Green"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        className="w-full h-9 px-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs text-zinc-950 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-zinc-500">Color Swatch</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={newColorHex}
                          onChange={(e) => setNewColorHex(e.target.value)}
                          className="w-9 h-9 p-0.5 rounded-lg border border-black/10 dark:border-white/10 bg-transparent cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={newColorHex}
                          onChange={(e) => setNewColorHex(e.target.value)}
                          className="flex-1 h-9 px-2 rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white uppercase"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-zinc-500">Assigned Mockup</label>
                      <select
                        value={newColorMockup}
                        onChange={(e) => setNewColorMockup(e.target.value)}
                        className="w-full h-9 px-2 rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs text-zinc-950 dark:text-white"
                      >
                        <option value="">Default Product Cover</option>
                        {(editingProduct.images || []).map((img, i) => (
                          <option key={i} value={img}>
                            Mockup {i + 1}: {img.split('/').pop()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newColorName.trim()) {
                          alert('Please enter a name for the design / colourway.');
                          return;
                        }
                        const assignedImg = newColorMockup || editingProduct.images[0] || '';
                        const newCol = {
                          name: newColorName.trim(),
                          hex: newColorHex,
                          images: assignedImg ? [assignedImg] : [],
                        };
                        const updated = [...(editingProduct.colors || []), newCol];
                        setEditingProduct({ ...editingProduct, colors: updated });
                        setNewColorName('');
                        setNewColorMockup('');
                      }}
                      className="h-9 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Design Swatch</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Available Sizes Matrix */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-500" />
                    <span>Available Sizing Matrix ({(editingProduct.sizes || []).length} active)</span>
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Tap chip to enable / disable</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {STANDARD_SIZES.map((s) => {
                    const isSelected = (editingProduct.sizes || []).includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          const current = editingProduct.sizes || [];
                          const updated = isSelected
                            ? current.filter((x) => x !== s)
                            : [...current, s];
                          setEditingProduct({
                            ...editingProduct,
                            sizes: updated.length > 0 ? updated : [s],
                          });
                        }}
                        className={`h-9 px-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm ${
                          isSelected
                            ? 'bg-black text-white dark:bg-white dark:text-black ring-2 ring-emerald-500/30'
                            : 'bg-white dark:bg-zinc-800 text-zinc-500 border border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white'
                        }`}
                      >
                        {s} {isSelected ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Size */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Custom size (e.g. 28, 30, 32, Oversized OS)"
                    value={customSizeEdit}
                    onChange={(e) => setCustomSizeEdit(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customSizeEdit.trim()) return;
                      const size = customSizeEdit.trim().toUpperCase();
                      if (!(editingProduct.sizes || []).includes(size)) {
                        setEditingProduct({
                          ...editingProduct,
                          sizes: [...(editingProduct.sizes || []), size],
                        });
                      }
                      setCustomSizeEdit('');
                    }}
                    className="h-9 px-3.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase shrink-0"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              {/* Product Badges & Runway Spotlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white block">
                      Featured Runway Piece
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Spotlighted prominently on storefront</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProduct({ ...editingProduct, isFeatured: !editingProduct.isFeatured })}
                    className={`h-8 px-3 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                      editingProduct.isFeatured
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {editingProduct.isFeatured ? '★ Featured' : 'Normal'}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white block">
                      New Release Badge
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Highlights item with &ldquo;NEW&rdquo; tag</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProduct({ ...editingProduct, isNew: !editingProduct.isNew })}
                    className={`h-8 px-3 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                      editingProduct.isNew
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {editingProduct.isNew ? 'New' : 'Standard'}
                  </button>
                </div>
              </div>

              {/* Fabric & Technical Atelier Details */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span>Fabric & Atelier Technical Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-zinc-500">Composition</label>
                    <input
                      type="text"
                      value={editingProduct.fabricDetails?.composition || '100% Combed Heavy Cotton'}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          fabricDetails: {
                            ...(editingProduct.fabricDetails || { weight: '320 GSM', finish: 'Precision Screenprint', origin: 'Accra' }),
                            composition: e.target.value,
                          },
                        })
                      }
                      className="w-full h-9 px-3 rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs text-zinc-950 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-zinc-500">Fabric Weight (GSM)</label>
                    <input
                      type="text"
                      value={editingProduct.fabricDetails?.weight || '320 GSM'}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          fabricDetails: {
                            ...(editingProduct.fabricDetails || { composition: '100% Cotton', finish: 'Precision Screenprint', origin: 'Accra' }),
                            weight: e.target.value,
                          },
                        })
                      }
                      className="w-full h-9 px-3 rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs text-zinc-950 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-zinc-500">Finish & Printing Technique</label>
                    <input
                      type="text"
                      value={editingProduct.fabricDetails?.finish || 'Precision Screenprint & DTF'}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          fabricDetails: {
                            ...(editingProduct.fabricDetails || { composition: '100% Cotton', weight: '320 GSM', origin: 'Accra' }),
                            finish: e.target.value,
                          },
                        })
                      }
                      className="w-full h-9 px-3 rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs text-zinc-950 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-zinc-500">Atelier Origin</label>
                    <input
                      type="text"
                      value={editingProduct.fabricDetails?.origin || 'Atelier Crafted in Accra'}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          fabricDetails: {
                            ...(editingProduct.fabricDetails || { composition: '100% Cotton', weight: '320 GSM', finish: 'Screenprint' }),
                            origin: e.target.value,
                          },
                        })
                      }
                      className="w-full h-9 px-3 rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs text-zinc-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Product Features Bullet Points */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>Product Highlights & Features ({(editingProduct.features || []).length})</span>
                  </h4>
                </div>

                <div className="space-y-2">
                  {(editingProduct.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const updated = [...(editingProduct.features || [])];
                          updated[idx] = e.target.value;
                          setEditingProduct({ ...editingProduct, features: updated });
                        }}
                        className="flex-1 h-9 px-3 rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs text-zinc-950 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingProduct.features || []).filter((_, i) => i !== idx);
                          setEditingProduct({ ...editingProduct, features: updated });
                        }}
                        className="w-9 h-9 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white flex items-center justify-center transition-colors"
                        title="Remove highlight"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add bullet point (e.g. Signature raw-edge stitching)"
                    value={newFeatureEdit}
                    onChange={(e) => setNewFeatureEdit(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs text-zinc-950 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newFeatureEdit.trim()) return;
                      setEditingProduct({
                        ...editingProduct,
                        features: [...(editingProduct.features || []), newFeatureEdit.trim()],
                      });
                      setNewFeatureEdit('');
                    }}
                    className="h-9 px-3.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase shrink-0"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editingProduct.subtitle || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="h-11 px-5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 rounded-xl bg-black text-white dark:bg-white dark:text-black font-sans font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0c0d12] border border-black/15 dark:border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 relative overflow-hidden">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-black/10 dark:border-white/10">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                  ATELIER CATALOG ADDITION
                </span>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-zinc-950 dark:text-white">
                  Add New Product
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. X-SIGN ARCHITECTURAL HOODIE"
                    value={newProductForm.title}
                    onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400">
                    Drop Collection Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. X-SIGN DROP 02"
                    value={newProductForm.dropName}
                    onChange={(e) => setNewProductForm({ ...newProductForm, dropName: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400">
                    Category
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      const gType = getGarmentType(cat);
                      let defaultSizes = ['S', 'M', 'L', 'XL'];
                      if (cat === 'accessories' || cat === 'socks') {
                        defaultSizes = ['ONE SIZE'];
                      } else if (cat === 't-shirts' || cat === 'hoodies' || cat === 'joggers') {
                        defaultSizes = ['S', 'M', 'L', 'XL', 'XXL'];
                      }
                      setNewProductForm({
                        ...newProductForm,
                        category: cat,
                        garmentType: gType,
                        sizes: defaultSizes,
                      });
                    }}
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  >
                    {ADMIN_CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400">
                    Price (GH₵) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProductForm.priceGHS}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, priceGHS: Number(e.target.value) })
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400 font-bold text-amber-500">
                    Initial Stock Left *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newProductForm.stockCount}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, stockCount: Number(e.target.value) })
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-amber-500/30 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400">
                  Subtitle / Highlight Specs
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100% Combed Heavy Cotton • Metallic Foil Detailing"
                  value={newProductForm.subtitle}
                  onChange={(e) => setNewProductForm({ ...newProductForm, subtitle: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              {/* Product Photos Gallery */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400 font-bold flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-500" />
                      <span>Product Photos ({(newProductForm.images || []).length})</span>
                    </label>
                    <span className="text-[11px] font-mono text-zinc-500">
                      Tap the red trash icon on any photo to remove it. Reorder with arrows or set cover.
                    </span>
                  </div>
                  {(newProductForm.images || []).length > 0 && (
                    <button
                      type="button"
                      onClick={() => setNewProductForm({ ...newProductForm, images: [] })}
                      className="text-[11px] font-mono text-rose-500 hover:text-rose-600 underline font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {newProductForm.images.length === 0 ? (
                  <div className="p-6 text-center rounded-xl border border-dashed border-black/15 dark:border-white/15 text-xs text-zinc-500 font-mono">
                    No pictures attached yet. Add photos from your camera roll or paste an image URL below.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {newProductForm.images.map((img, idx) => {
                      const isCover = idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`relative aspect-[4/5] rounded-xl overflow-hidden border p-1 bg-white dark:bg-black/60 shadow-sm transition-all ${
                            isCover ? 'border-emerald-500 ring-2 ring-emerald-500/40' : 'border-black/10 dark:border-white/10'
                          }`}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={img}
                              alt=""
                              fill
                              className={img.toLowerCase().endsWith('.png') ? 'object-contain p-1' : 'object-cover'}
                            />
                          </div>

                          {/* Cover Badge / Set Cover */}
                          <div className="absolute top-1.5 left-1.5 z-10">
                            {isCover ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-black text-[9px] font-mono font-bold uppercase shadow">
                                ★ Cover
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const newImgs = [img, ...newProductForm.images.filter((_, i) => i !== idx)];
                                  setNewProductForm({ ...newProductForm, images: newImgs });
                                }}
                                className="px-1.5 py-0.5 rounded-md bg-black/85 hover:bg-emerald-500 text-white hover:text-black text-[9px] font-mono font-bold uppercase shadow transition-colors"
                              >
                                Set Cover
                              </button>
                            )}
                          </div>

                          {/* Always-visible RED TRASH BUTTON on top-right */}
                          <button
                            type="button"
                            onClick={() => {
                              const newImgs = newProductForm.images.filter((_, i) => i !== idx);
                              setNewProductForm({ ...newProductForm, images: newImgs });
                            }}
                            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-90 text-white flex items-center justify-center shadow-lg transition-all z-10"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Bottom Reorder Arrows */}
                          <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between z-10">
                            {idx > 0 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const newImgs = [...newProductForm.images];
                                  const temp = newImgs[idx - 1];
                                  newImgs[idx - 1] = newImgs[idx];
                                  newImgs[idx] = temp;
                                  setNewProductForm({ ...newProductForm, images: newImgs });
                                }}
                                className="w-6 h-6 rounded-md bg-black/85 hover:bg-black text-white flex items-center justify-center shadow transition-colors active:scale-95"
                                title="Move left"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            ) : <span />}

                            {idx < newProductForm.images.length - 1 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const newImgs = [...newProductForm.images];
                                  const temp = newImgs[idx + 1];
                                  newImgs[idx + 1] = newImgs[idx];
                                  newImgs[idx] = temp;
                                  setNewProductForm({ ...newProductForm, images: newImgs });
                                }}
                                className="w-6 h-6 rounded-md bg-black/85 hover:bg-black text-white flex items-center justify-center shadow transition-colors active:scale-95 ml-auto"
                                title="Move right"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            ) : <span />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upload straight from camera roll */}
                <div className="pt-1">
                  <label className="cursor-pointer w-full h-14 rounded-2xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 flex items-center justify-center gap-3 transition-all">
                    {isUploadingNewProductImage ? (
                      <RefreshCw className="w-5 h-5 text-emerald-500 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 text-emerald-500" />
                    )}
                    <div className="text-left">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white block">
                        {isUploadingNewProductImage ? 'Uploading Photos...' : '+ Add Photo(s) from Camera Roll / Files'}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono block">
                        Select packshots or cutouts directly from your device
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleNewProductFileUpload}
                      disabled={isUploadingNewProductImage}
                    />
                  </label>
                </div>

                {/* Add Image by Direct URL */}
                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-black/40 border border-black/10 dark:border-white/10 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                    Or Paste Direct Image URL (Cloud / Supabase / Web)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://.../photo.png or /products/shirts/..."
                      value={newProductImageUrl}
                      onChange={(e) => setNewProductImageUrl(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newProductImageUrl.trim()) return;
                        setNewProductForm({
                          ...newProductForm,
                          images: [...newProductForm.images, newProductImageUrl.trim()],
                        });
                        setNewProductImageUrl('');
                        setNotification({ type: 'success', message: 'Picture URL attached!' });
                      }}
                      className="h-9 px-3.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase shrink-0 shadow-sm"
                    >
                      + Attach URL
                    </button>
                  </div>
                </div>

                {/* Preset Atelier Mockups Accordion */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPresetsNew(!showPresetsNew)}
                    className="w-full py-2 px-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/30 flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-1.5 font-bold uppercase text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Browse Preset Atelier Mockups (Tees & Caps)
                    </span>
                    {showPresetsNew ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showPresetsNew && (
                    <div className="mt-2.5 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block mb-2">Signature Shirts:</span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {shirtMockupPresets.map((p, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                if (!newProductForm.images.includes(p.path)) {
                                  setNewProductForm({
                                    ...newProductForm,
                                    images: [...newProductForm.images, p.path],
                                  });
                                  setNotification({ type: 'success', message: `Added ${p.label} mockup!` });
                                }
                              }}
                              className="group relative aspect-square rounded-lg border border-black/10 dark:border-white/10 p-1 bg-zinc-50 dark:bg-black/60 hover:border-emerald-500 transition-all flex flex-col items-center justify-center"
                              title={`Add ${p.label}`}
                            >
                              <div className="relative w-full h-full">
                                <Image src={p.path} alt={p.label} fill className="object-contain p-0.5" />
                              </div>
                              <span className="text-[8px] font-mono text-zinc-500 truncate w-full text-center mt-0.5">{p.label.split('/')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block mb-2">Headwear & Caps:</span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {capMockupPresets.map((p, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                if (!newProductForm.images.includes(p.path)) {
                                  setNewProductForm({
                                    ...newProductForm,
                                    images: [...newProductForm.images, p.path],
                                  });
                                  setNotification({ type: 'success', message: `Added ${p.label} mockup!` });
                                }
                              }}
                              className="group relative aspect-square rounded-lg border border-black/10 dark:border-white/10 p-1 bg-zinc-50 dark:bg-black/60 hover:border-emerald-500 transition-all flex flex-col items-center justify-center"
                              title={`Add ${p.label}`}
                            >
                              <div className="relative w-full h-full">
                                <Image src={p.path} alt={p.label} fill className="object-contain p-0.5" />
                              </div>
                              <span className="text-[8px] font-mono text-zinc-500 truncate w-full text-center mt-0.5">{p.label.split(' ')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Available Sizes Matrix for New Product */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-500" />
                    <span>Available Sizing Matrix ({(newProductForm.sizes || []).length} selected)</span>
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Tap chip to toggle</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {STANDARD_SIZES.map((s) => {
                    const isSelected = (newProductForm.sizes || []).includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          const current = newProductForm.sizes || [];
                          const updated = isSelected
                            ? current.filter((x) => x !== s)
                            : [...current, s];
                          setNewProductForm({
                            ...newProductForm,
                            sizes: updated.length > 0 ? updated : [s],
                          });
                        }}
                        className={`h-9 px-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm ${
                          isSelected
                            ? 'bg-black text-white dark:bg-white dark:text-black ring-2 ring-emerald-500/30'
                            : 'bg-white dark:bg-zinc-800 text-zinc-500 border border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white'
                        }`}
                      >
                        {s} {isSelected ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Size */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Custom size (e.g. 28, 30, 32, Oversized OS)"
                    value={customSizeNew}
                    onChange={(e) => setCustomSizeNew(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customSizeNew.trim()) return;
                      const size = customSizeNew.trim().toUpperCase();
                      if (!(newProductForm.sizes || []).includes(size)) {
                        setNewProductForm({
                          ...newProductForm,
                          sizes: [...(newProductForm.sizes || []), size],
                        });
                      }
                      setCustomSizeNew('');
                    }}
                    className="h-9 px-3.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase shrink-0"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
                    Initial Stock Availability
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Toggle if this piece should launch as already Sold Out (Archival preview).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewProductForm({ ...newProductForm, isSoldOut: !newProductForm.isSoldOut })}
                  className={`h-9 px-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                    newProductForm.isSoldOut
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-emerald-600 text-white shadow-sm'
                  }`}
                >
                  {newProductForm.isSoldOut ? 'SOLD OUT' : 'IN STOCK'}
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-mono text-zinc-600 dark:text-zinc-400">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-sans text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-11 px-5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 rounded-xl bg-black text-white dark:bg-white dark:text-black font-sans font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Publishing to Storefront...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Publish Piece to Catalog</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD LOOKBOOK MODEL PHOTO MODAL */}
      {isAddLookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0c0d12] border border-black/15 dark:border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 relative overflow-hidden">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-black/10 dark:border-white/10">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                  X-SIGN ATELIER // LOOKBOOK CMS
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-zinc-950 dark:text-white">
                  Add Model Photo to Lookbook
                </h3>
              </div>
              <button
                onClick={() => setIsAddLookModalOpen(false)}
                className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLook} className="space-y-6">
              {/* Look Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Look Title / Caption *
                </label>
                <input
                  type="text"
                  required
                  value={newLook.title}
                  onChange={(e) => setNewLook({ ...newLook, title: e.target.value })}
                  placeholder="e.g. Look 17 // Model in Sovereign Gold Street Fit"
                  className="w-full h-11 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              {/* Photo Upload Straight from Camera Roll */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block">
                  Model Photo (From Camera Roll) *
                </label>

                {!newLook.image ? (
                  <label className="cursor-pointer flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 text-center transition-all">
                    {isUploadingLook ? (
                      <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mb-2" />
                    ) : (
                      <Camera className="w-10 h-10 text-emerald-500 mb-2" />
                    )}
                    <span className="text-sm font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
                      {isUploadingLook ? 'Uploading from Camera Roll...' : 'Choose Photo from Camera Roll'}
                    </span>
                    <span className="text-xs text-zinc-500 mt-1 font-mono">
                      Tap to select directly from your phone gallery or device
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLookFileUpload}
                      disabled={isUploadingLook}
                    />
                  </label>
                ) : (
                  <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10 shadow-sm">
                        <Image src={newLook.image} alt="Preview" fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                          <Check className="w-3.5 h-3.5" /> Photo Attached from Camera Roll
                        </span>
                        <p className="text-xs text-zinc-500 font-mono truncate">{newLook.image.split('/').pop()}</p>
                      </div>
                    </div>
                    <label className="cursor-pointer shrink-0 h-9 px-3.5 rounded-xl border border-black/15 dark:border-white/15 hover:border-black dark:hover:border-white text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 transition-all flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLookFileUpload}
                        disabled={isUploadingLook}
                      />
                    </label>
                  </div>
                )}

                {/* Or Paste Direct Image URL */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="Or paste model photo URL (https://...)"
                    value={newLookImageUrl}
                    onChange={(e) => setNewLookImageUrl(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-mono text-zinc-950 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newLookImageUrl.trim()) return;
                      setNewLook((prev) => ({ ...prev, image: newLookImageUrl.trim() }));
                      setNewLookImageUrl('');
                      setNotification({ type: 'success', message: 'Photo URL attached to look!' });
                    }}
                    className="h-9 px-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase shrink-0"
                  >
                    Set URL
                  </button>
                </div>
              </div>

              {/* Tagged Product to Shop & Orientation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Piece Worn by Model
                  </label>
                  <select
                    value={newLook.productSlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      const prod = products.find((p) => p.slug === slug);
                      setNewLook({
                        ...newLook,
                        productSlug: slug,
                        productTitle: prod ? prod.title : 'Featured Piece',
                      });
                    }}
                    className="w-full h-11 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs text-zinc-950 dark:text-white focus:outline-none"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Orientation
                  </label>
                  <select
                    value={newLook.orientation}
                    onChange={(e) => setNewLook({ ...newLook, orientation: e.target.value as any })}
                    className="w-full h-11 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs text-zinc-950 dark:text-white focus:outline-none"
                  >
                    <option value="portrait">Portrait (3:4 - Single Column)</option>
                    <option value="landscape">Landscape (16:10 - Wide Span)</option>
                  </select>
                </div>
              </div>

              {/* Image Preview */}
              {newLook.image && (
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 flex items-center gap-4">
                  <div className={`relative ${newLook.orientation === 'landscape' ? 'w-24 h-15' : 'w-16 h-20'} rounded-lg overflow-hidden bg-black shrink-0`}>
                    <Image src={newLook.image} alt="Preview" fill className="object-cover" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-zinc-950 dark:text-white">Image Preview Active</p>
                    <p className="text-zinc-500 font-mono text-[11px] truncate max-w-xs">{newLook.image}</p>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddLookModalOpen(false)}
                  className="h-11 px-5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-black text-white dark:bg-white dark:text-black font-sans font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish to Lookbook</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
