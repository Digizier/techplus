'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  CreditCard,
  Building,
  Home,
  MessageCircle,
  Copy,
  Check,
  Tag,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/lib/cart-context';
import { useSettings } from '@/lib/settings-context';
import { createOrder, validateCoupon } from '@/lib/db';
import { OrderItem } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { settings } = useSettings();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('Islamabad');
  const [addressType, setAddressType] = useState<'home' | 'office'>('home');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer'>('cod');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Submission & Confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: string; total: number } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Calculations
  const threshold = settings.free_shipping_threshold || 3500;
  const isFreeShipping = subtotal >= threshold;
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : (settings.base_shipping_fee || 250);
  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = await validateCoupon(couponCode, subtotal);
    if (res.isValid) {
      setAppliedDiscount({ code: couponCode.trim().toUpperCase(), amount: res.discount });
      setCouponMsg({ text: res.message, isError: false });
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Your cart is empty. Please add products before checking out.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim() || !deliveryCity.trim()) {
      alert('Please fill out all required delivery fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique Order Number
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedOrderNumber = `TP-${Date.now().toString().slice(-4)}${randomSuffix}`;

      const orderItems: OrderItem[] = items.map((i) => ({
        id: i.product.id,
        title: i.product.title,
        slug: i.product.slug,
        price: i.product.price,
        quantity: i.quantity,
        thumbnail_url: i.product.thumbnail_url,
      }));

      await createOrder({
        order_number: generatedOrderNumber,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim() || null,
        delivery_address: deliveryAddress.trim(),
        delivery_city: deliveryCity.trim(),
        address_type: addressType,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
        order_status: 'Pending',
        subtotal,
        shipping_fee: shippingFee,
        discount: discountAmount,
        total: grandTotal,
        items: orderItems,
        delivery_notes: deliveryNotes.trim() || null,
        tracking_number: null,
        courier_name: null,
      });

      // Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setOrderSuccess({ orderNumber: generatedOrderNumber, total: grandTotal });
      clearCart();
    } catch (err: any) {
      console.error('Order creation error:', err);
      alert(`Order placement failed: ${err.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (orderSuccess) {
    const whatsappOrderUrl = `https://wa.me/92${settings.whatsapp_number.replace(/^0/, '')}?text=${encodeURIComponent(
      `Assalam-o-Alaikum Techplus.pk, I have placed order #${orderSuccess.orderNumber} for Rs. ${orderSuccess.total.toLocaleString()} (${paymentMethod.toUpperCase()}). Please confirm dispatch!`
    )}`;

    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Order Confirmed
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
              Thank You for Your Order!
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Your order has been recorded in our dispatch system. We will contact you before shipping.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>Order Number:</span>
              <strong className="text-slate-900 font-mono text-sm">{orderSuccess.orderNumber}</strong>
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>Payment Mode:</span>
              <strong className="text-slate-900 uppercase font-bold">{paymentMethod}</strong>
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>Grand Total:</span>
              <strong className="text-brand-600 font-bold text-sm">
                Rs. {orderSuccess.total.toLocaleString()}
              </strong>
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>Delivery Time:</span>
              <strong className="text-slate-900">2-5 Working Days</strong>
            </div>
          </div>

          {/* Payment instructions if online payment selected */}
          {paymentMethod !== 'cod' && (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 text-left space-y-1">
              <p className="font-bold">Next Step: Payment Verification</p>
              <p>
                Please send your payment screenshot to our official WhatsApp along with order number <strong>{orderSuccess.orderNumber}</strong>.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Confirm on WhatsApp</span>
            </a>

            <Link
              href="/order-tracking"
              prefetch={false}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Track Your Order</span>
            </Link>
          </div>

          <Link href="/" className="inline-block text-xs font-bold text-slate-400 hover:text-slate-700 underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // EMPTY CART GUARD
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-4">
          <Truck className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            Express Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete your order with Cash on Delivery or Secure Instant Payment
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>SSL 256-bit Encrypted</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Payment Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Customer Delivery Details Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs space-y-5">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-brand-500 text-slate-950 rounded-full flex items-center justify-center text-xs font-black">
                1
              </span>
              <span>Delivery Details</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0323XXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Address Type Card Selector (Home vs Office) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Address Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAddressType('home')}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      addressType === 'home'
                        ? 'border-brand-500 bg-amber-50/60 text-slate-900 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Home className="w-4 h-4 text-brand-600" />
                    <div>
                      <div className="font-bold">Home Delivery</div>
                      <div className="text-[10px] text-slate-400 font-normal">All day delivery</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddressType('office')}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      addressType === 'office'
                        ? 'border-brand-500 bg-amber-50/60 text-slate-900 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4 text-brand-600" />
                    <div>
                      <div className="font-bold">Office / Commercial</div>
                      <div className="text-[10px] text-slate-400 font-normal">9am - 6pm delivery</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address (House, Street, Area) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House/Shop #, Street, Sector / Area"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Islamabad / Rawalpindi / Lahore"
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Notes / Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Near landmark, call before arriving..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs space-y-5">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-brand-500 text-slate-950 rounded-full flex items-center justify-center text-xs font-black">
                2
              </span>
              <span>Payment Method</span>
            </h2>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-brand-500 bg-amber-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Standard
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pay securely in cash when the courier rider delivers the parcel to your doorstep.
                  </p>
                </div>
              </label>

              {/* Option 2: JazzCash */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'jazzcash'
                    ? 'border-brand-500 bg-amber-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'jazzcash'}
                  onChange={() => setPaymentMethod('jazzcash')}
                  className="mt-1 text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      JazzCash Mobile Account
                    </span>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      Instant
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Send amount via JazzCash app / USSD to our official business number.
                  </p>

                  {paymentMethod === 'jazzcash' && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Account Title:</span>
                        <strong className="text-slate-900">{settings.jazzcash_title}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Account Number:</span>
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                          <span>{settings.jazzcash_number}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(settings.jazzcash_number, 'jc')}
                            className="p-1 hover:text-brand-600"
                          >
                            {copiedField === 'jc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: EasyPaisa */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'easypaisa'
                    ? 'border-brand-500 bg-amber-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'easypaisa'}
                  onChange={() => setPaymentMethod('easypaisa')}
                  className="mt-1 text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      EasyPaisa Mobile Account
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Instant
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Transfer directly via EasyPaisa app to our official account.
                  </p>

                  {paymentMethod === 'easypaisa' && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Account Title:</span>
                        <strong className="text-slate-900">{settings.easypaisa_title}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Account Number:</span>
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                          <span>{settings.easypaisa_number}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(settings.easypaisa_number, 'ep')}
                            className="p-1 hover:text-brand-600"
                          >
                            {copiedField === 'ep' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 4: Bank Transfer */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-brand-500 bg-amber-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Direct Bank Transfer / IBFT
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Bank IBFT
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Transfer online through any Pakistani bank app or ATM.
                  </p>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Bank:</span>
                        <strong className="text-slate-900">{settings.bank_name}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Account Title:</span>
                        <strong className="text-slate-900">{settings.bank_title}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">IBAN:</span>
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                          <span className="text-[11px]">{settings.bank_iban}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(settings.bank_iban, 'iban')}
                            className="p-1 hover:text-brand-600"
                          >
                            {copiedField === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs space-y-5">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-semibold text-slate-500">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </h2>

            {/* Line items list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 text-xs">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={product.thumbnail_url || '/images/products/Polish_20201014_203208731-removebg-preview.png'}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{product.title}</p>
                    <p className="text-slate-400">Qty: {quantity} × Rs. {product.price.toLocaleString()}</p>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    Rs. {(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Voucher / Promo Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium uppercase focus:outline-hidden focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className={`text-[11px] font-medium ${couponMsg.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase">FREE</span>
                  ) : (
                    `Rs. ${shippingFee.toLocaleString()}`
                  )}
                </span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedDiscount.code})</span>
                  <span>-Rs. {appliedDiscount.amount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="text-brand-600">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free returns & verified quality dispatch</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
