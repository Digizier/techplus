import { supabase } from './supabase';
import { Product, Category, Banner, Order, Coupon, SiteSettings, ServiceInquiry } from './types';

// Lean column projections for optimal Supabase egress and sub-millisecond query latency
const PRODUCT_LIST_COLUMNS = 'id, title, slug, sku, price, regular_price, stock, thumbnail_url, images, short_description, description, category_id, is_featured, is_active, created_at';
const PRODUCT_DETAIL_COLUMNS = 'id, title, slug, sku, price, regular_price, stock, thumbnail_url, images, short_description, description, category_id, is_featured, is_active, created_at';

// -------------------------------------------------------------
// REALTIME SUBSCRIPTION BUS (Multi-Device & Cross-Tab Sync)
// -------------------------------------------------------------
if (typeof window !== 'undefined') {
  const channel = supabase
    .channel('storefront_realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
      window.dispatchEvent(new Event('tp_products_updated'));
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
      window.dispatchEvent(new Event('tp_categories_updated'));
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, () => {
      window.dispatchEvent(new Event('tp_banners_updated'));
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
      window.dispatchEvent(new Event('tp_orders_updated'));
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
      window.dispatchEvent(new Event('tp_settings_updated'));
    })
    .subscribe();
}

// -------------------------------------------------------------
// 1. PRODUCTS API
// -------------------------------------------------------------

export interface GetProductsOptions {
  page?: number;
  limit?: number; // STRICTLY 8 products per page default
  categoryId?: string;
  categorySlug?: string;
  featuredOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'title';
  includeInactive?: boolean;
}

export async function getProducts(options: GetProductsOptions = {}): Promise<{ products: Product[]; totalCount: number }> {
  const {
    page = 1,
    limit = 8, // STRICT 8 items pagination
    categoryId,
    categorySlug,
    featuredOnly,
    searchQuery,
    sortBy = 'newest',
    includeInactive = false
  } = options;

  let query = supabase
    .from('products')
    .select(PRODUCT_LIST_COLUMNS, { count: 'exact' });

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  if (featuredOnly) {
    query = query.eq('is_featured', true);
  }

  if (categoryId) {
    // Also include subcategory IDs if categoryId is a parent category
    const { data: subCats } = await supabase
      .from('categories')
      .select('id')
      .eq('parent_id', categoryId);

    const allCatIds = [categoryId, ...(subCats?.map((s) => s.id) || [])];
    query = query.in('category_id', allCatIds);
  } else if (categorySlug) {
    // Resolve category id or subcategories
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (catData) {
      // Also get any subcategory ids
      const { data: subCats } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', catData.id);

      const allCatIds = [catData.id, ...(subCats?.map((s) => s.id) || [])];
      query = query.in('category_id', allCatIds);
    }
  }

  if (searchQuery && searchQuery.trim() !== '') {
    query = query.ilike('title', `%${searchQuery.trim()}%`);
  }

  // Sorting
  switch (sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'title':
      query = query.order('title', { ascending: true });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  // Strict pagination range (8 products per page)
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching products:', error.message);
    return { products: [], totalCount: 0 };
  }

  return {
    products: (data as Product[]) || [],
    totalCount: count || 0,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_DETAIL_COLUMNS)
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) {
    console.warn(`Product not found for slug: ${slug}`, error?.message);
    return null;
  }

  return data as Product;
}

export async function getAllProductSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('slug')
    .eq('is_active', true);

  if (error || !data) return [];
  return data.map((p) => p.slug);
}

export async function createProduct(payload: Partial<Product>): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error.message);
    throw new Error(error.message);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tp_products_updated'));
  }

  return data as Product;
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error.message);
    throw new Error(error.message);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tp_products_updated'));
  }

  return data as Product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error.message);
    throw new Error(error.message);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tp_products_updated'));
  }

  return true;
}

// -------------------------------------------------------------
// 2. CATEGORIES & SUBCATEGORIES API
// -------------------------------------------------------------

export async function getCategories(includeInactive: boolean = false): Promise<Category[]> {
  let query = supabase
    .from('categories')
    .select('id, name, slug, parent_id, image_url, description, display_order, is_active, show_on_home')
    .order('display_order', { ascending: true });

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching categories:', error.message);
    return [];
  }

  // Build tree: parent categories with nested subcategories
  const allCats = (data as Category[]) || [];
  const parents = allCats.filter((c) => !c.parent_id);
  const subCats = allCats.filter((c) => c.parent_id);

  parents.forEach((parent) => {
    parent.subcategories = subCats.filter((sub) => sub.parent_id === parent.id);
  });

  return parents;
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('slug')
    .eq('is_active', true);

  if (error || !data) return [];
  return data.map((c) => c.slug);
}

// Helper to ensure clean category columns and avoid schema errors (strips computed subcategories)
function cleanCategoryPayload(payload: Partial<Category>) {
  const clean: any = {
    name: payload.name,
    parent_id: payload.parent_id || null,
    image_url: payload.image_url || null,
    description: payload.description || null,
    display_order: Number(payload.display_order || 1),
    is_active: payload.is_active !== undefined ? payload.is_active : true,
    show_on_home: payload.show_on_home !== undefined ? payload.show_on_home : true,
  };
  if (payload.slug) {
    clean.slug = payload.slug;
  }
  return clean;
}

// Generate unique slug to avoid categories_slug_key constraint violation
async function ensureUniqueCategorySlug(baseSlug: string, currentId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    let query = supabase.from('categories').select('id').eq('slug', slug);
    if (currentId) {
      query = query.neq('id', currentId);
    }
    const { data } = await query.maybeSingle();
    if (!data) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function createCategory(payload: Partial<Category>): Promise<Category | null> {
  const clean = cleanCategoryPayload(payload);
  if (clean.slug) {
    clean.slug = await ensureUniqueCategorySlug(clean.slug);
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([clean])
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tp_categories_updated'));
  }

  return data as Category;
}

export async function updateCategory(id: string, payload: Partial<Category>): Promise<Category | null> {
  const clean = cleanCategoryPayload(payload);
  if (clean.slug) {
    clean.slug = await ensureUniqueCategorySlug(clean.slug, id);
  }

  const { data, error } = await supabase
    .from('categories')
    .update(clean)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tp_categories_updated'));
  }

  return data as Category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tp_categories_updated'));
  }

  return true;
}

// -------------------------------------------------------------
// 3. HERO & PROMOTIONAL BANNERS API
// -------------------------------------------------------------

export async function getBanners(includeInactive: boolean = false): Promise<Banner[]> {
  let query = supabase
    .from('banners')
    .select('id, title, subtitle, desktop_image_url, mobile_image_url, link_url, button_text, display_order, is_active')
    .order('display_order', { ascending: true });

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching banners:', error.message);
    return [];
  }
  return (data as Banner[]) || [];
}

export async function createBanner(payload: Partial<Banner>): Promise<Banner | null> {
  const { data, error } = await supabase
    .from('banners')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tp_banners_updated'));
  }

  return data as Banner;
}

export async function updateBanner(id: string, payload: Partial<Banner>): Promise<Banner | null> {
  const { data, error } = await supabase
    .from('banners')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tp_banners_updated'));
  }

  return data as Banner;
}

export async function deleteBanner(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tp_banners_updated'));
  }

  return true;
}

// -------------------------------------------------------------
// 4. ORDERS & CHECKOUT API
// -------------------------------------------------------------

export async function createOrder(payload: Omit<Order, 'id' | 'created_at'>): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Order creation error:', error.message);
    throw new Error(error.message);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tp_orders_updated'));
  }

  return data as Order;
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error.message);
    return [];
  }

  return (data as Order[]) || [];
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber.trim())
    .maybeSingle();

  if (error || !data) return null;
  return data as Order;
}

export async function updateOrder(id: string, payload: Partial<Order>): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tp_orders_updated'));
  }

  return data as Order;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tp_orders_updated'));
  }

  return true;
}

// -------------------------------------------------------------
// 5. COUPONS & DISCOUNTS API
// -------------------------------------------------------------

export async function getCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data as Coupon[]) || [];
}

export async function validateCoupon(code: string, currentTotal: number): Promise<{ isValid: boolean; discount: number; message: string }> {
  if (!code || code.trim() === '') {
    return { isValid: false, discount: 0, message: 'Please enter a coupon code' };
  }

  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.trim().toUpperCase())
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    return { isValid: false, discount: 0, message: 'Invalid or expired coupon code' };
  }

  const coupon = data as Coupon;

  if (currentTotal < coupon.min_spend) {
    return {
      isValid: false,
      discount: 0,
      message: `Minimum order amount of Rs. ${coupon.min_spend.toLocaleString()} required for this coupon`,
    };
  }

  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = Math.round((currentTotal * coupon.discount_value) / 100);
  } else {
    discount = coupon.discount_value;
  }

  return {
    isValid: true,
    discount: Math.min(discount, currentTotal),
    message: `Coupon ${coupon.code} applied successfully!`,
  };
}

export async function createCoupon(payload: Partial<Coupon>): Promise<Coupon | null> {
  const { data, error } = await supabase
    .from('coupons')
    .insert([{ ...payload, code: payload.code?.toUpperCase() }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Coupon;
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
}

// -------------------------------------------------------------
// 6. SITE & FINANCIAL SETTINGS API
// -------------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettings> {
  const defaultSettings: SiteSettings = {
    id: 1,
    store_name: 'Techplus.pk',
    helpline_phone: '03235538700',
    whatsapp_number: '03235538700',
    secondary_phone: '03125556944',
    email: 'info@techplus.pk',
    address: 'Shop 07-B Chinar Plaza, St-48, G-6/1-1, Islamabad',
    working_hours: '09:00 - 20:00 Sat-Thu (Friday OFF)',
    base_shipping_fee: 250,
    free_shipping_threshold: 3500,
    cod_enabled: true,
    jazzcash_title: 'Tech Plus',
    jazzcash_number: '03235538700',
    easypaisa_title: 'Tech Plus',
    easypaisa_number: '03235538700',
    bank_name: 'Meezan Bank',
    bank_title: 'Tech Plus',
    bank_iban: 'PK00MEZN0000000000000000',
    ntn_number: 'NTN-78601-PK',
    announcement_text: 'FREE DELIVERY in Islamabad & Rawalpindi on orders above Rs. 3,500!',
  };

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error || !data) {
    return defaultSettings;
  }

  return { ...defaultSettings, ...data };
}

export async function updateSiteSettings(payload: Partial<SiteSettings>): Promise<SiteSettings> {
  const { id, ...cleanPayload } = payload;
  const { data, error } = await supabase
    .from('site_settings')
    .update({ ...cleanPayload, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tp_settings_updated'));
  }

  return data as SiteSettings;
}

// -------------------------------------------------------------
// 7. SERVICE INQUIRIES API (AC, Solar, Appliance Repair)
// -------------------------------------------------------------

export async function createServiceInquiry(payload: Omit<ServiceInquiry, 'id' | 'created_at'>): Promise<ServiceInquiry | null> {
  const { data, error } = await supabase
    .from('service_inquiries')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ServiceInquiry;
}

export async function getServiceInquiries(): Promise<ServiceInquiry[]> {
  const { data, error } = await supabase
    .from('service_inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data as ServiceInquiry[]) || [];
}

export async function updateServiceInquiryStatus(id: string, status: ServiceInquiry['status']): Promise<boolean> {
  const { error } = await supabase
    .from('service_inquiries')
    .update({ status })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
}

export async function deleteServiceInquiry(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('service_inquiries')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
}
