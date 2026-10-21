export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  image_url?: string | null;
  description?: string | null;
  display_order: number;
  is_active: boolean;
  show_on_home?: boolean;
  created_at?: string;
  subcategories?: Category[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku?: string | null;
  price: number;
  regular_price?: number | null;
  stock: number;
  category_id?: string | null;
  thumbnail_url: string;
  images: string[];
  short_description?: string | null;
  description?: string | null;
  is_featured: boolean;
  is_active: boolean;
  show_on_home?: boolean;
  created_at?: string;
  category?: Category | null;
}

export interface Banner {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  desktop_image_url: string;
  mobile_image_url?: string | null;
  link_url: string;
  button_text?: string | null;
  display_order: number;
  is_active: boolean;
  show_on_home?: boolean;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  quantity: number;
  thumbnail_url: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  delivery_address: string;
  delivery_city: string;
  address_type: 'home' | 'office';
  payment_method: 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer';
  payment_status: 'pending' | 'verified' | 'failed';
  order_status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  items: OrderItem[];
  delivery_notes?: string | null;
  tracking_number?: string | null;
  courier_name?: string | null;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: number;
  min_spend: number;
  is_active: boolean;
  show_on_home?: boolean;
  created_at?: string;
}

export interface SiteSettings {
  id: number;
  store_name: string;
  helpline_phone: string;
  whatsapp_number: string;
  secondary_phone?: string;
  email: string;
  address: string;
  working_hours: string;
  base_shipping_fee: number;
  free_shipping_threshold: number;
  cod_enabled: boolean;
  jazzcash_title: string;
  jazzcash_number: string;
  easypaisa_title: string;
  easypaisa_number: string;
  bank_name: string;
  bank_title: string;
  bank_iban: string;
  ntn_number: string;
  announcement_text: string;
  updated_at?: string;
}

export interface ServiceInquiry {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_type: string;
  city?: string;
  address?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Scheduled' | 'Completed';
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
