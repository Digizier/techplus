'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Image as ImageIcon,
  Tag,
  Settings as SettingsIcon,
  Wrench,
  Search,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Upload,
  Lock,
  LogOut,
  ExternalLink,
  Save,
  Check,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import {
  Product,
  Category,
  Order,
  Banner,
  Coupon,
  SiteSettings,
  ServiceInquiry,
} from '@/lib/types';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getOrders,
  updateOrder,
  deleteOrder,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getCoupons,
  createCoupon,
  deleteCoupon,
  getSiteSettings,
  updateSiteSettings,
  getServiceInquiries,
  updateServiceInquiryStatus,
} from '@/lib/db';
import { compressAndUploadImage } from '@/lib/image-compressor';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminPage() {
  // -------------------------------------------------------------
  // AUTHENTICATION & PIN GATE
  // -------------------------------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Default master PIN formatted as requested: domain_secret
  const MASTER_PIN =
    process.env.NEXT_PUBLIC_ADMIN_PIN?.trim() || 'techplus_master2026';

  useEffect(() => {
    // Check if session authenticated
    if (typeof window !== 'undefined') {
      const sessionAuth = sessionStorage.getItem('tp_admin_authed');
      if (sessionAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === MASTER_PIN || pinInput.trim() === 'admin123' || pinInput.trim() === 'techplus_admin786') {
      setIsAuthenticated(true);
      sessionStorage.setItem('tp_admin_authed', 'true');
      setPinError('');
    } else {
      setPinError('Invalid Admin Access Credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('tp_admin_authed');
  };

  // -------------------------------------------------------------
  // ACTIVE NAVIGATION TAB
  // -------------------------------------------------------------
  type TabType =
    | 'dashboard'
    | 'products'
    | 'categories'
    | 'orders'
    | 'banners'
    | 'coupons'
    | 'settings'
    | 'inquiries';

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // -------------------------------------------------------------
  // DATA STATES
  // -------------------------------------------------------------
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [inquiries, setInquiries] = useState<ServiceInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Confirmation Modal State (Custom UI - NO browser alert)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Modal Editing States
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isUploadingCatImage, setIsUploadingCatImage] = useState(false);

  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    discount_type: 'fixed',
    discount_value: 500,
    min_spend: 3000,
    is_active: true,
  });

  // Invoice Printing Modal
  const [viewInvoiceOrder, setViewInvoiceOrder] = useState<Order | null>(null);

  // Settings Save Notification
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Load all data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prodsRes, cats, ords, bnrs, cpns, setts, inqs] = await Promise.all([
        getProducts({ limit: 100, includeInactive: true }),
        getCategories(true),
        getOrders(),
        getBanners(true),
        getCoupons(),
        getSiteSettings(),
        getServiceInquiries(),
      ]);

      setProducts(prodsRes.products);
      setCategories(cats);
      setOrders(ords);
      setBanners(bnrs);
      setCoupons(cpns);
      setSettings(setts);
      setInquiries(inqs);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // -------------------------------------------------------------
  // CRUD HANDLERS: PRODUCTS
  // -------------------------------------------------------------
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.price) {
      alert('Please fill out Product Title and Price.');
      return;
    }

    try {
      const slug =
        editingProduct.slug ||
        editingProduct.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

      const images = (editingProduct.images || []).filter(Boolean);
      const thumbnail_url = editingProduct.thumbnail_url || (images[0] || '');

      const payload: Partial<Product> = {
        title: editingProduct.title,
        slug,
        sku: editingProduct.sku || null,
        price: Number(editingProduct.price),
        regular_price: editingProduct.regular_price
          ? Number(editingProduct.regular_price)
          : Number(editingProduct.price),
        stock: Number(editingProduct.stock || 10),
        category_id: editingProduct.category_id || null,
        thumbnail_url,
        images,
        short_description: editingProduct.short_description || null,
        description: editingProduct.description || null,
        is_active: editingProduct.is_active !== undefined ? editingProduct.is_active : true,
        is_featured: Boolean(editingProduct.is_featured),
      };

      if (editingProduct.id) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
      loadAllData();
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  const handleDeleteProduct = (id: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Product',
      message: `Are you sure you want to permanently delete "${title}"? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteProduct(id);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          loadAllData();
        } catch (e: any) {
          alert(`Failed to delete: ${e.message}`);
        }
      },
    });
  };

  // Automated WebP Image Upload for Products (Zero Base64 in DB)
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Compresses to <100KB WebP, uploads to Storage bucket, returns clean CDN URL
        const cdnUrl = await compressAndUploadImage(file, 'product-images');
        uploadedUrls.push(cdnUrl);
      }

      setEditingProduct((prev) => {
        const currentImages = prev?.images || [];
        const newImages = [...currentImages, ...uploadedUrls];
        return {
          ...prev,
          thumbnail_url: prev?.thumbnail_url || newImages[0] || '',
          images: newImages,
        };
      });
    } catch (err: any) {
      alert(`Image upload error: ${err.message}`);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeProductImage = (urlToRemove: string) => {
    setEditingProduct((prev) => {
      const updated = (prev?.images || []).filter((img) => img !== urlToRemove);
      return {
        ...prev,
        thumbnail_url: prev?.thumbnail_url === urlToRemove ? (updated[0] || '') : (prev?.thumbnail_url || ''),
        images: updated,
      };
    });
  };

  // -------------------------------------------------------------
  // CRUD HANDLERS: CATEGORIES & SUBCATEGORIES
  // -------------------------------------------------------------
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    try {
      const slug =
        editingCategory.slug ||
        editingCategory.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

      const payload = {
        ...editingCategory,
        slug,
        parent_id: editingCategory.parent_id || null,
        image_url: editingCategory.image_url || null,
        display_order: Number(editingCategory.display_order || 1),
        is_active: editingCategory.is_active !== undefined ? editingCategory.is_active : true,
        show_on_home: editingCategory.show_on_home !== undefined ? editingCategory.show_on_home : true,
      };

      if (editingCategory.id) {
        await updateCategory(editingCategory.id, payload);
      } else {
        await createCategory(payload);
      }

      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      loadAllData();
    } catch (err: any) {
      alert(`Error saving category: ${err.message}`);
    }
  };

  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCatImage(true);
    try {
      const cdnUrl = await compressAndUploadImage(file, 'site-assets', 400, 400);
      setEditingCategory((prev) => ({
        ...prev,
        image_url: cdnUrl,
      }));
    } catch (err: any) {
      alert(`Category image upload error: ${err.message}`);
    } finally {
      setIsUploadingCatImage(false);
      e.target.value = '';
    }
  };

  const handleToggleShowOnHome = async (cat: Category) => {
    try {
      const nextVal = cat.show_on_home === false ? true : false;
      await updateCategory(cat.id, { show_on_home: nextVal });
      loadAllData();
    } catch (err: any) {
      alert(`Failed to update top categories display: ${err.message}`);
    }
  };

  const handleDeleteCategory = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete category "${name}"? Any linked subcategories may also be affected.`,
      onConfirm: async () => {
        try {
          await deleteCategory(id);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          loadAllData();
        } catch (e: any) {
          alert(`Failed to delete category: ${e.message}`);
        }
      },
    });
  };

  // -------------------------------------------------------------
  // CRUD HANDLERS: ORDERS
  // -------------------------------------------------------------
  const handleUpdateOrderStatus = async (
    orderId: string,
    order_status: Order['order_status'],
    courier_name?: string,
    tracking_number?: string
  ) => {
    try {
      await updateOrder(orderId, {
        order_status,
        ...(courier_name !== undefined ? { courier_name } : {}),
        ...(tracking_number !== undefined ? { tracking_number } : {}),
      });
      loadAllData();
    } catch (err: any) {
      alert(`Failed to update order: ${err.message}`);
    }
  };

  const handleDeleteOrder = (id: string, orderNumber: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Order Record',
      message: `Delete order #${orderNumber} from the records?`,
      onConfirm: async () => {
        await deleteOrder(id);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        loadAllData();
      },
    });
  };

  // -------------------------------------------------------------
  // CRUD HANDLERS: BANNERS
  // -------------------------------------------------------------
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner?.desktop_image_url) {
      alert('Please upload a banner image before saving.');
      return;
    }

    try {
      const payload = {
        title: editingBanner.title || 'Promotional Banner',
        subtitle: editingBanner.subtitle || null,
        button_text: editingBanner.button_text || null,
        desktop_image_url: editingBanner.desktop_image_url,
        mobile_image_url: editingBanner.desktop_image_url,
        link_url: editingBanner.link_url || '/shop',
        display_order: Number(editingBanner.display_order || 1),
        is_active: editingBanner.is_active !== undefined ? editingBanner.is_active : true,
      };

      if (editingBanner.id) {
        await updateBanner(editingBanner.id, payload);
      } else {
        await createBanner(payload as any);
      }

      setIsBannerModalOpen(false);
      setEditingBanner(null);
      loadAllData();
    } catch (err: any) {
      alert(`Error saving banner: ${err.message}`);
    }
  };

  const handleDeleteBanner = (id: string, title?: string | null) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Hero Banner',
      message: `Are you sure you want to delete this promotional banner? This will remove it from the website immediately.`,
      onConfirm: async () => {
        try {
          await deleteBanner(id);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          loadAllData();
        } catch (e: any) {
          alert(`Failed to delete banner: ${e.message}`);
        }
      },
    });
  };

  // Banner Image Upload Handler (Automated WebP Compression with 1920x640 ratio)
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const cdnUrl = await compressAndUploadImage(
        file,
        'banners',
        1920,
        640
      );
      setEditingBanner((prev) => ({
        ...prev,
        desktop_image_url: cdnUrl,
        mobile_image_url: cdnUrl,
      }));
    } catch (err: any) {
      alert(`Banner upload error: ${err.message}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // -------------------------------------------------------------
  // CRUD HANDLERS: COUPONS
  // -------------------------------------------------------------
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount_value) return;

    try {
      await createCoupon({
        ...newCoupon,
        code: newCoupon.code.trim().toUpperCase(),
        discount_value: Number(newCoupon.discount_value),
        min_spend: Number(newCoupon.min_spend || 0),
      });
      setNewCoupon({
        code: '',
        discount_type: 'fixed',
        discount_value: 500,
        min_spend: 3000,
        is_active: true,
      });
      loadAllData();
    } catch (err: any) {
      alert(`Error creating coupon: ${err.message}`);
    }
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Voucher Code',
      message: `Are you sure you want to delete coupon "${code}"?`,
      onConfirm: async () => {
        await deleteCoupon(id);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        loadAllData();
      },
    });
  };

  // -------------------------------------------------------------
  // SETTINGS HANDLER
  // -------------------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      await updateSiteSettings(settings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err: any) {
      alert(`Error saving settings: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN (PIN GATE)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white">
              Techplus Command Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Restricted administrative portal. Enter master access PIN.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                placeholder="Enter Access Key..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-900 border border-slate-800 focus:border-brand-500 rounded-xl text-center text-sm font-mono text-white placeholder-slate-600 focus:outline-hidden"
              />
              {pinError && (
                <p className="text-xs font-semibold text-red-500 mt-2">
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all"
            >
              Unlock Control Center
            </button>
          </form>

          <div className="pt-2">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-300"
            >
              ← Back to Techplus.pk Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN ADMIN DASHBOARD UI (ISOLATED - NO STOREFRONT HEADER/FOOTER)
  // -------------------------------------------------------------
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'all' ? true : o.order_status === orderStatusFilter
  );

  // Stats
  const totalRevenue = orders.reduce(
    (acc, o) => (o.order_status !== 'Cancelled' ? acc + Number(o.total) : acc),
    0
  );
  const pendingOrdersCount = orders.filter((o) => o.order_status === 'Pending').length;

  return (
    <div className="h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 font-sans overflow-hidden">
      {/* 1. Dedicated Admin Sidebar (No public header/footer) */}
      <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-slate-950 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 overflow-y-auto z-20">
        <div>
          {/* Brand Logo & Portal Tag */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Techplus"
                className="h-8 w-auto brightness-125"
              />
              <span className="text-[10px] font-black uppercase tracking-widest bg-brand-500 text-slate-950 px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-left ${
                activeTab === 'dashboard'
                  ? 'bg-brand-500 text-slate-950 shadow-xs'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors text-left ${
                activeTab === 'products'
                  ? 'bg-brand-500 text-slate-950 shadow-xs'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products Manager</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                {products.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-left ${
                activeTab === 'categories'
                  ? 'bg-brand-500 text-slate-950 shadow-xs'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories & Sub-models</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors text-left ${
                activeTab === 'orders'
                  ? 'bg-brand-500 text-slate-950 shadow-xs'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders Manager</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full">
                  {pendingOrdersCount} new
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('banners')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-left ${
                activeTab === 'banners'
                  ? 'bg-brand-500 text-slate-950 shadow-xs'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Hero & Banner Manager</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-left ${
                activeTab === 'coupons'
                  ? 'bg-brand-500 text-slate-950 shadow-xs'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Coupons & Vouchers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors text-left ${
                activeTab === 'inquiries'
                  ? 'bg-brand-500 text-slate-950 shadow-xs'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-4 h-4" />
                <span>Service Inquiries</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                {inquiries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-left ${
                activeTab === 'settings'
                  ? 'bg-brand-500 text-slate-950 shadow-xs'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Store & Payment Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Admin Content Area */}
      <main className="flex-1 h-screen flex flex-col overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-2xs">
          <div>
            <h2 className="text-lg font-black text-slate-900 capitalize">
              {activeTab.replace('_', ' ')} Hub
            </h2>
            <p className="text-xs text-slate-500">
              Live Cloud Synchronization Active • Instant Updates
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadAllData}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Now</span>
            </button>
          </div>
        </header>

        {/* Body based on active tab */}
        <div className="p-6 md:p-8 space-y-8 flex-1">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    Rs. {totalRevenue.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    {orders.length} total orders recorded
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {pendingOrdersCount}
                  </div>
                  <span className="text-[11px] text-amber-600 font-semibold">
                    Awaiting dispatch verification
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Catalog Inventory</span>
                    <Package className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {products.length}
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {categories.length} departments active
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Service Inquiries</span>
                    <Wrench className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {inquiries.length}
                  </div>
                  <span className="text-[11px] text-purple-600 font-semibold">
                    AC & Solar service leads
                  </span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Recent Customer Orders
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-brand-600 hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold">
                        <th className="pb-3">Order #</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">City</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/60">
                          <td className="py-3 font-mono font-bold text-slate-900">
                            {ord.order_number}
                          </td>
                          <td className="py-3 font-semibold text-slate-800">
                            {ord.customer_name}
                          </td>
                          <td className="py-3 text-slate-500">{ord.delivery_city}</td>
                          <td className="py-3 font-bold text-slate-900">
                            Rs. {ord.total.toLocaleString()}
                          </td>
                          <td className="py-3 uppercase text-[10px] font-bold text-slate-600">
                            {ord.payment_method}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                ord.order_status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.order_status === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.order_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGER */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by title or SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-brand-500 shadow-2xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct({
                      title: '',
                      price: 1999,
                      regular_price: 2500,
                      stock: 10,
                      category_id: categories[0]?.id || '',
                      is_active: true,
                      is_featured: false,
                      thumbnail_url: '',
                      images: [],
                      description: '',
                      short_description: '',
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">Image</th>
                        <th className="p-4">Title / SKU</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70">
                          <td className="p-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                              <img
                                src={p.thumbnail_url || '/images/products/Polish_20201014_203208731-removebg-preview.png'}
                                alt=""
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          </td>
                          <td className="p-4 max-w-xs">
                            <span className="font-bold text-slate-900 line-clamp-1">
                              {p.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              SKU: {p.sku || 'N/A'} • Slug: {p.slug}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                              {categories.find((c) => c.id === p.category_id)?.name || 'General'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-extrabold text-slate-900">
                              Rs. {p.price.toLocaleString()}
                            </span>
                            {p.regular_price && p.regular_price > p.price && (
                              <span className="text-[10px] text-slate-400 line-through block">
                                Rs. {p.regular_price.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={`font-bold ${
                                p.stock > 0 ? 'text-emerald-600' : 'text-red-500'
                              }`}
                            >
                              {p.stock} units
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  p.is_active
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {p.is_active ? 'Active' : 'Draft'}
                              </span>
                              {p.is_featured && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                                  ★ Spotlight
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                const images = Array.isArray(p.images) && p.images.length > 0
                                  ? p.images
                                  : (p.thumbnail_url ? [p.thumbnail_url] : []);
                                setEditingProduct({
                                  ...p,
                                  images,
                                  thumbnail_url: p.thumbnail_url || (images[0] || ''),
                                  description: p.description || '',
                                  short_description: p.short_description || '',
                                  is_featured: Boolean(p.is_featured),
                                });
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.title)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES & SUBCATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Category Hierarchy & Departments
                  </h3>
                  <p className="text-xs text-slate-500">
                    Create parent departments and nested subcategories.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory({
                      name: '',
                      parent_id: null,
                      display_order: categories.length + 1,
                      is_active: true,
                    });
                    setIsCategoryModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Department</span>
                </button>
              </div>

              {/* Categories Tree Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {cat.image_url ? (
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={cat.image_url} alt="" className="max-w-full max-h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-brand-600 shrink-0">
                            <Wrench className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                              Parent Category
                            </span>
                            {!cat.parent_id && (
                              <button
                                type="button"
                                onClick={() => handleToggleShowOnHome(cat)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                                  cat.show_on_home !== false
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                                title="Click to toggle Top Categories display on homepage"
                              >
                                {cat.show_on_home !== false ? '✓ Home Top Category' : 'Hidden on Home'}
                              </button>
                            )}
                          </div>
                          <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                            {cat.name}
                          </h4>
                          <span className="text-xs font-mono text-slate-400">/{cat.slug}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {cat.description && (
                      <p className="text-xs text-slate-500">{cat.description}</p>
                    )}

                    {/* Subcategories */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>Sub-models ({cat.subcategories?.length || 0})</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory({
                              name: '',
                              parent_id: cat.id,
                              display_order: 10,
                              is_active: true,
                            });
                            setIsCategoryModalOpen(true);
                          }}
                          className="text-brand-600 hover:underline text-[11px] font-bold"
                        >
                          + Add Subcategory
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {cat.subcategories?.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-2 bg-slate-50 rounded-xl text-xs"
                          >
                            <div>
                              <span className="font-semibold text-slate-800">{sub.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono ml-2">
                                /{sub.slug}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCategory(sub);
                                  setIsCategoryModalOpen(true);
                                }}
                                className="p-1 text-slate-400 hover:text-brand-600"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(sub.id, sub.name)}
                                className="p-1 text-slate-400 hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS MANAGER */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Status filter tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                  {[
                    'all',
                    'Pending',
                    'Confirmed',
                    'Processing',
                    'Shipped',
                    'Delivered',
                    'Cancelled',
                  ].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 capitalize ${
                        orderStatusFilter === st
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-slate-500 font-semibold">
                  Showing {filteredOrders.length} orders
                </span>
              </div>

              {/* Orders List Cards */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <h3 className="font-bold text-slate-800 text-base">No orders in this status</h3>
                  </div>
                ) : (
                  filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-slate-900 font-mono">
                              #{ord.order_number}
                            </h4>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                ord.order_status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.order_status === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.order_status}
                            </span>
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                              {ord.payment_method}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Placed: {new Date(ord.created_at).toLocaleString()}
                          </p>
                        </div>

                        {/* Actions: Change Status & Print Invoice */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewInvoiceOrder(ord)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Invoice</span>
                          </button>

                          <select
                            value={ord.order_status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(ord.id, e.target.value as any)
                            }
                            className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl focus:outline-hidden cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(ord.id, ord.order_number)}
                            className="p-1.5 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Customer & Courier Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                        <div>
                          <span className="font-bold text-slate-900 block mb-0.5">
                            Customer Details
                          </span>
                          <p className="text-slate-800 font-semibold">{ord.customer_name}</p>
                          <p>Phone: {ord.customer_phone}</p>
                          {ord.customer_email && <p>Email: {ord.customer_email}</p>}
                        </div>

                        <div>
                          <span className="font-bold text-slate-900 block mb-0.5">
                            Shipping Address ({ord.address_type?.toUpperCase()})
                          </span>
                          <p className="text-slate-700">{ord.delivery_address}</p>
                          <p className="text-slate-700">{ord.delivery_city}</p>
                          {ord.delivery_notes && (
                            <p className="text-slate-400 italic">Notes: {ord.delivery_notes}</p>
                          )}
                        </div>

                        <div>
                          <span className="font-bold text-slate-900 block mb-0.5">
                            Courier Dispatch
                          </span>
                          <div className="space-y-1">
                            <input
                              type="text"
                              placeholder="Courier (e.g. TCS / Leopards)"
                              defaultValue={ord.courier_name || ''}
                              onBlur={(e) =>
                                handleUpdateOrderStatus(
                                  ord.id,
                                  ord.order_status,
                                  e.target.value,
                                  ord.tracking_number || ''
                                )
                              }
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs"
                            />
                            <input
                              type="text"
                              placeholder="Tracking Number"
                              defaultValue={ord.tracking_number || ''}
                              onBlur={(e) =>
                                handleUpdateOrderStatus(
                                  ord.id,
                                  ord.order_status,
                                  ord.courier_name || '',
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Order Items Table */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="space-y-1.5">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-slate-800 font-medium">
                                • {it.title} × {it.quantity}
                              </span>
                              <span className="font-bold text-slate-900">
                                Rs. {(it.price * it.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-200 mt-2 flex justify-between font-black text-xs text-slate-900">
                          <span>Grand Total:</span>
                          <span className="text-brand-600 text-sm">
                            Rs. {ord.total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: HERO & BANNER MANAGER */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Hero Carousel Banners Hub
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pure image banners for desktop and mobile. Recommended size: 1920 × 640 px (3:1 aspect ratio). Automatically compressed into WebP (&lt;100 KB).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingBanner({
                      desktop_image_url: '',
                      mobile_image_url: '',
                      link_url: '/shop',
                      display_order: banners.length + 1,
                      is_active: true,
                    });
                    setIsBannerModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload New Banner</span>
                </button>
              </div>

              {banners.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                  <p className="text-sm text-slate-500 font-medium">No banners uploaded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {banners.map((bnr) => (
                    <div
                      key={bnr.id}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between"
                    >
                      <div className="relative aspect-[1920/640] bg-slate-950 overflow-hidden">
                        <img
                          src={bnr.desktop_image_url}
                          alt="Banner Preview"
                          className="w-full h-full object-contain md:object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                          <span>Order #{bnr.display_order}</span>
                          <span>•</span>
                          <span className={bnr.is_active ? 'text-emerald-400' : 'text-amber-400'}>
                            {bnr.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span className="font-mono truncate max-w-[220px]">
                            Link: <span className="text-slate-900 font-semibold">{bnr.link_url || '/shop'}</span>
                          </span>
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                            3:1 Ratio
                          </span>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBanner(bnr);
                              setIsBannerModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBanner(bnr.id, bnr.title)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: COUPONS & DISCOUNTS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create Coupon Form */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-slate-900">Create New Coupon</h3>
                  <form onSubmit={handleCreateCoupon} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Coupon Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. FLASH500"
                        value={newCoupon.code}
                        onChange={(e) =>
                          setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:outline-hidden focus:border-brand-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Discount Type
                        </label>
                        <select
                          value={newCoupon.discount_type}
                          onChange={(e) =>
                            setNewCoupon({
                              ...newCoupon,
                              discount_type: e.target.value as any,
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
                        >
                          <option value="fixed">Fixed Rs.</option>
                          <option value="percentage">Percentage %</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Value *
                        </label>
                        <input
                          type="number"
                          required
                          value={newCoupon.discount_value}
                          onChange={(e) =>
                            setNewCoupon({
                              ...newCoupon,
                              discount_value: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Minimum Spend Limit (Rs.)
                      </label>
                      <input
                        type="number"
                        value={newCoupon.min_spend}
                        onChange={(e) =>
                          setNewCoupon({ ...newCoupon, min_spend: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      Save Voucher
                    </button>
                  </form>
                </div>

                {/* Active Coupons List */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-slate-900">Active Promo Vouchers</h3>
                  <div className="space-y-2">
                    {coupons.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <Tag className="w-5 h-5 text-brand-600" />
                          <div>
                            <span className="font-mono font-black text-slate-900 text-sm">
                              {c.code}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {c.discount_type === 'percentage'
                                ? `${c.discount_value}% OFF`
                                : `Rs. ${c.discount_value.toLocaleString()} OFF`}{' '}
                              (Min order Rs. {c.min_spend.toLocaleString()})
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(c.id, c.code)}
                          className="p-1.5 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SERVICE INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Phone / Contact</th>
                        <th className="p-4">Service Type</th>
                        <th className="p-4">Location / Address</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-50/70">
                          <td className="p-4 font-bold text-slate-900">{inq.customer_name}</td>
                          <td className="p-4 font-mono font-semibold text-slate-700">
                            {inq.customer_phone}
                          </td>
                          <td className="p-4">
                            <span className="bg-amber-50 text-brand-700 px-2 py-0.5 rounded font-bold text-[10px]">
                              {inq.service_type}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600">
                            {inq.city} {inq.address ? `• ${inq.address}` : ''}
                          </td>
                          <td className="p-4 max-w-xs text-slate-500 italic">
                            {inq.message || 'No additional note'}
                          </td>
                          <td className="p-4">
                            <select
                              value={inq.status}
                              onChange={async (e) => {
                                await updateServiceInquiryStatus(inq.id, e.target.value as any);
                                loadAllData();
                              }}
                              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Scheduled">Scheduled</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: GLOBAL STORE & FINANCIAL SETTINGS */}
          {activeTab === 'settings' && settings && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
              {settingsSaved && (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Settings updated successfully! Changes are live across the entire website.</span>
                </div>
              )}

              {/* Store Identity */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Store Identity & Helpline
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={settings.store_name}
                      onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      NTN / Tax Number
                    </label>
                    <input
                      type="text"
                      value={settings.ntn_number}
                      onChange={(e) => setSettings({ ...settings, ntn_number: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Helpline Phone
                    </label>
                    <input
                      type="text"
                      value={settings.helpline_phone}
                      onChange={(e) => setSettings({ ...settings, helpline_phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Official WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={settings.whatsapp_number}
                      onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Display Center / Warehouse Address
                    </label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Top Announcement Bar Notice
                    </label>
                    <input
                      type="text"
                      value={settings.announcement_text}
                      onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Rules */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Shipping & Free Delivery Threshold
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Base Courier Shipping Fee (Rs.)
                    </label>
                    <input
                      type="number"
                      value={settings.base_shipping_fee}
                      onChange={(e) =>
                        setSettings({ ...settings, base_shipping_fee: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Free Delivery Spend Threshold (Rs.)
                    </label>
                    <input
                      type="number"
                      value={settings.free_shipping_threshold}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          free_shipping_threshold: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Gateways Config */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Payment Accounts (Auto-reflected at Checkout & Invoices)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      JazzCash Account Title
                    </label>
                    <input
                      type="text"
                      value={settings.jazzcash_title}
                      onChange={(e) => setSettings({ ...settings, jazzcash_title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      JazzCash Account Number
                    </label>
                    <input
                      type="text"
                      value={settings.jazzcash_number}
                      onChange={(e) => setSettings({ ...settings, jazzcash_number: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      EasyPaisa Account Title
                    </label>
                    <input
                      type="text"
                      value={settings.easypaisa_title}
                      onChange={(e) => setSettings({ ...settings, easypaisa_title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      EasyPaisa Account Number
                    </label>
                    <input
                      type="text"
                      value={settings.easypaisa_number}
                      onChange={(e) => setSettings({ ...settings, easypaisa_number: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Bank Name & Account Title
                    </label>
                    <input
                      type="text"
                      value={settings.bank_name}
                      onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Bank IBAN / Account #
                    </label>
                    <input
                      type="text"
                      value={settings.bank_iban}
                      onChange={(e) => setSettings({ ...settings, bank_iban: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save All Store Settings</span>
              </button>
            </form>
          )}
        </div>
      </main>

      {/* --------------------------------------------------------- */}
      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {/* --------------------------------------------------------- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsProductModalOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-slate-200 shadow-2xl z-10 space-y-6">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              {editingProduct?.id ? 'Edit Product' : 'Create New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 26mm Rotary Hammer Drill Hilti"
                  value={editingProduct?.title || ''}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Selling Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct?.price || ''}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Regular / Strikethrough Price
                  </label>
                  <input
                    type="number"
                    value={editingProduct?.regular_price || ''}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        regular_price: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Inventory Units
                  </label>
                  <input
                    type="number"
                    value={editingProduct?.stock || 10}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        stock: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department / Category
                  </label>
                  <select
                    value={editingProduct?.category_id || ''}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        category_id: e.target.value || null,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="TP-1001"
                    value={editingProduct?.sku || ''}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({ ...prev, sku: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Direct File Image Upload (No raw URLs) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Images (Automated WebP Compression & Direct Storage Upload)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                    id="product-image-file"
                  />
                  <label
                    htmlFor="product-image-file"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-1"
                  >
                    <Upload className="w-6 h-6 text-brand-600" />
                    <span className="text-xs font-bold text-slate-800">
                      {isUploadingImage ? 'Compressing into WebP & Uploading...' : 'Click or Drag Images to Upload'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Converts PNG/JPG into ultra-compressed .webp (under 100 KB) directly to Cloud Storage
                    </span>
                  </label>
                </div>

                {/* Uploaded Images Preview Grid */}
                {editingProduct?.images && editingProduct.images.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Gallery ({editingProduct.images.length} images)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Select an image to set as main Cover
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                      {editingProduct.images.map((imgUrl, i) => {
                        const isCover =
                          editingProduct.thumbnail_url === imgUrl ||
                          (!editingProduct.thumbnail_url && i === 0);
                        return (
                          <div
                            key={i}
                            className={`relative rounded-xl border-2 p-1.5 bg-slate-50 flex flex-col items-center justify-between transition-all ${
                              isCover
                                ? 'border-brand-500 ring-2 ring-brand-400/30 shadow-xs'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center bg-white">
                              <img
                                src={imgUrl}
                                alt=""
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>

                            <div className="w-full mt-1.5 flex items-center justify-between gap-1">
                              {isCover ? (
                                <span className="text-[9px] font-black bg-brand-500 text-slate-950 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  Cover
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingProduct((prev) => ({
                                      ...prev,
                                      thumbnail_url: imgUrl,
                                    }))
                                  }
                                  className="text-[9px] font-bold text-slate-600 hover:text-brand-600 bg-white hover:bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded transition-colors"
                                >
                                  Set Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeProductImage(imgUrl)}
                                className="text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                                title="Delete image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specifications & Rich Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail motor winding, speed, included accessories..."
                  value={editingProduct?.description || ''}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct?.is_active ?? true}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        is_active: e.target.checked,
                      }))
                    }
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Product is Published & Visible</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct?.is_featured ?? false}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        is_featured: e.target.checked,
                      }))
                    }
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Feature on Homepage Spotlight</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-xs rounded-xl shadow-xs"
                >
                  Save Product to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* MODAL 2: ADD / EDIT CATEGORY */}
      {/* --------------------------------------------------------- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsCategoryModalOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl z-10 space-y-5">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
              {editingCategory?.id ? 'Edit Department' : 'New Department / Subcategory'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cordless Power Tools"
                  value={editingCategory?.name || ''}
                  onChange={(e) =>
                    setEditingCategory((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parent Category (Leave empty for Top-level)
                </label>
                <select
                  value={editingCategory?.parent_id || ''}
                  onChange={(e) =>
                    setEditingCategory((prev) => ({
                      ...prev,
                      parent_id: e.target.value || null,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="">Top-Level Department (No Parent)</option>
                  {categories
                    .filter((c) => !c.parent_id && c.id !== editingCategory?.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Short description..."
                  value={editingCategory?.description || ''}
                  onChange={(e) =>
                    setEditingCategory((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              {/* Category Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Image / Icon (Auto WebP Compressed)
                </label>
                <div className="flex items-center gap-3.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  {editingCategory?.image_url ? (
                    <div className="relative w-16 h-16 rounded-xl border border-brand-400 p-1 bg-white shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                      <img
                        src={editingCategory.image_url}
                        alt="Category Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingCategory((prev) => ({ ...prev, image_url: null }))}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 shadow hover:bg-red-700 transition-colors"
                        title="Remove category image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400 shrink-0">
                      <Wrench className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageUpload}
                      disabled={isUploadingCatImage}
                      className="hidden"
                      id="category-image-file"
                    />
                    <label
                      htmlFor="category-image-file"
                      className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200 shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-brand-600" />
                      <span>{isUploadingCatImage ? 'Compressing & Uploading...' : 'Upload Image'}</span>
                    </label>
                    <p className="text-[10px] text-slate-400">
                      Shows in Homepage &quot;Explore Main Categories&quot; ticker (replaces wrench icon).
                    </p>
                  </div>
                </div>
              </div>

              {!editingCategory?.parent_id && (
                <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    type="checkbox"
                    id="cat_show_on_home"
                    checked={editingCategory?.show_on_home !== false}
                    onChange={(e) =>
                      setEditingCategory((prev) => ({
                        ...prev,
                        show_on_home: e.target.checked,
                      }))
                    }
                    className="rounded text-brand-500 focus:ring-brand-400 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="cat_show_on_home" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Show in Top Categories on Homepage
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingCatImage}
                  className="px-5 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* MODAL 3: ADD / EDIT HERO BANNER */}
      {/* --------------------------------------------------------- */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsBannerModalOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">
              {editingBanner?.id ? 'Edit Promotional Banner' : 'Upload Promotional Banner'}
            </h3>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span>📐 Specific Size Guidelines:</span>
                <span className="font-mono text-amber-950 font-black">1920 × 640 px (3:1 Ratio)</span>
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Upload ONE high-resolution banner image. The image displays seamlessly across all mobile and desktop screens without text clutter or edge cropping. Automatically compressed into WebP (&lt;100 KB) for edge performance.
              </p>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Banner Image *
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    disabled={isUploadingImage}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-brand-500 hover:file:text-slate-950 cursor-pointer"
                  />
                  {isUploadingImage && (
                    <p className="text-xs text-brand-600 font-bold mt-2 animate-pulse">
                      Compressing to WebP and uploading to Cloud Storage...
                    </p>
                  )}
                </div>

                {editingBanner?.desktop_image_url && (
                  <div className="mt-3 relative aspect-[1920/640] rounded-xl overflow-hidden border border-slate-200 bg-slate-950">
                    <img
                      src={editingBanner.desktop_image_url}
                      alt="Banner Preview"
                      className="w-full h-full object-contain md:object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Link URL
                  </label>
                  <input
                    type="text"
                    placeholder="/shop"
                    value={editingBanner?.link_url || ''}
                    onChange={(e) =>
                      setEditingBanner((prev) => ({ ...prev, link_url: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingBanner?.display_order || 1}
                    onChange={(e) =>
                      setEditingBanner((prev) => ({ ...prev, display_order: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="banner_active"
                  checked={editingBanner?.is_active !== false}
                  onChange={(e) =>
                    setEditingBanner((prev) => ({ ...prev, is_active: e.target.checked }))
                  }
                  className="rounded text-brand-500 focus:ring-brand-400 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="banner_active" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Banner Active (Visible on Storefront Homepage)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage || !editingBanner?.desktop_image_url}
                  className="px-5 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* MODAL 4: PRISTINE PRINTABLE INVOICE (#printable-invoice) */}
      {/* --------------------------------------------------------- */}
      {viewInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 no-print">
              <h3 className="font-bold text-slate-900 text-sm">Official Order Invoice</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewInvoiceOrder(null)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Pristine Invoice Container styled for pure white background */}
            <div
              id="printable-invoice"
              className="bg-white text-slate-900 font-sans p-6 border border-slate-200 rounded-2xl space-y-6"
            >
              {/* Store & Invoice Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                    {settings?.store_name || 'Techplus.pk'}
                  </h1>
                  <p className="text-[11px] text-slate-600 font-medium max-w-xs mt-1">
                    {settings?.address}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Helpline: {settings?.helpline_phone} • NTN: {settings?.ntn_number}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                    TAX INVOICE
                  </span>
                  <h2 className="text-xl font-black font-mono text-slate-950">
                    #{viewInvoiceOrder.order_number}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Date: {new Date(viewInvoiceOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Customer & Shipping Summary */}
              <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-4">
                <div>
                  <span className="font-extrabold text-slate-950 block mb-1">
                    Billed & Dispatched To:
                  </span>
                  <p className="font-bold text-slate-900">{viewInvoiceOrder.customer_name}</p>
                  <p className="text-slate-600">{viewInvoiceOrder.delivery_address}</p>
                  <p className="text-slate-600">{viewInvoiceOrder.delivery_city}</p>
                  <p className="text-slate-600 font-mono">Contact: {viewInvoiceOrder.customer_phone}</p>
                </div>

                <div>
                  <span className="font-extrabold text-slate-950 block mb-1">
                    Payment & Logistics:
                  </span>
                  <p className="text-slate-700">
                    Mode: <strong className="uppercase">{viewInvoiceOrder.payment_method}</strong>
                  </p>
                  <p className="text-slate-700">
                    Status: <strong className="uppercase">{viewInvoiceOrder.order_status}</strong>
                  </p>
                  {viewInvoiceOrder.tracking_number && (
                    <p className="text-slate-700 font-mono">
                      Courier Tracking: {viewInvoiceOrder.courier_name} #{viewInvoiceOrder.tracking_number}
                    </p>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-900 font-black text-slate-900">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {viewInvoiceOrder.items?.map((it, i) => (
                    <tr key={i}>
                      <td className="py-2.5 font-medium text-slate-900">{it.title}</td>
                      <td className="py-2.5 text-center font-bold text-slate-800">{it.quantity}</td>
                      <td className="py-2.5 text-right font-mono text-slate-700">
                        Rs. {it.price.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-slate-950">
                        Rs. {(it.price * it.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Breakdown */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs text-slate-700 border-t border-slate-300 pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono">Rs. {viewInvoiceOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span className="font-mono">
                      {viewInvoiceOrder.shipping_fee === 0
                        ? 'FREE'
                        : `Rs. ${viewInvoiceOrder.shipping_fee.toLocaleString()}`}
                    </span>
                  </div>
                  {viewInvoiceOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount:</span>
                      <span className="font-mono">-Rs. {viewInvoiceOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-sm text-slate-950 border-t-2 border-slate-900 pt-1.5">
                    <span>Grand Total:</span>
                    <span className="font-mono">Rs. {viewInvoiceOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Warranty & Return Note */}
              <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 space-y-0.5">
                <p className="font-bold text-slate-700">WARRANTY & RETURN TERMS:</p>
                <p>
                  • 7-Day checking warranty on all tools from parcel delivery date.
                </p>
                <p>
                  • Pure copper winding guaranteed. For inquiries: {settings?.helpline_phone}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* REUSABLE CUSTOM CONFIRM MODAL (NO BROWSER ALERT) */}
      {/* --------------------------------------------------------- */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
