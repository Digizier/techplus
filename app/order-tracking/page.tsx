'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/lib/types';
import { useSettings } from '@/lib/settings-context';

export default function OrderTrackingPage() {
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);
    setOrder(null);

    const term = searchTerm.trim();

    // Query by order_number or phone
    const { data } = await supabase
      .from('orders')
      .select('*')
      .or(`order_number.ilike.%${term}%,customer_phone.ilike.%${term}%`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    setOrder(data as Order | null);
    setLoading(false);
  };

  const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = order ? steps.indexOf(order.order_status) : -1;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-amber-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
          <Truck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-slate-900">
          Track Your Shipment
        </h1>
        <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
          Enter your Order Number (e.g. TP-1001) or Registered Phone Number to inspect live courier progress.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="Enter Order Number or 0323XXXXXXX"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-500 rounded-2xl text-xs md:text-sm font-semibold focus:outline-hidden transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-xs md:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Truck className="w-4 h-4" />
            <span>{loading ? 'Searching...' : 'Track Order'}</span>
          </button>
        </form>
      </div>

      {/* Result Display */}
      {searched && (
        <>
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Looking up database records...</p>
            </div>
          ) : order ? (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-8 animate-fadeIn">
              {/* Order Quick Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-brand-600 tracking-wider">
                    Order Tracking Record
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 font-mono mt-0.5">
                    {order.order_number}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block mb-0.5">Current Status</span>
                  <span
                    className={`inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      order.order_status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.order_status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.order_status}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              {order.order_status !== 'Cancelled' && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                    Courier Progress Timeline
                  </h3>
                  <div className="grid grid-cols-5 gap-2 relative text-center">
                    {steps.map((st, i) => {
                      const isComplete = i <= currentStepIndex;
                      const isCurrent = i === currentStepIndex;
                      return (
                        <div key={st} className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                              isComplete
                                ? 'bg-brand-500 text-slate-950 ring-4 ring-amber-100'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {isComplete ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                          </div>
                          <span
                            className={`text-[10px] md:text-xs font-bold mt-2 ${
                              isCurrent
                                ? 'text-brand-600'
                                : isComplete
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {st}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Courier Tracking Info if dispatched */}
              {order.tracking_number && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-emerald-700 font-bold">Courier Assigned: </span>
                    <strong className="text-slate-900">{order.courier_name || 'TCS / Leopards'}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-bold">Tracking # </span>
                    <span className="font-mono font-black text-slate-900">{order.tracking_number}</span>
                  </div>
                </div>
              )}

              {/* Destination & Ordered Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-600" />
                    <span>Shipping Address</span>
                  </h4>
                  <p className="text-slate-700 font-semibold">{order.customer_name}</p>
                  <p className="text-slate-500">{order.delivery_address}</p>
                  <p className="text-slate-500">{order.delivery_city}</p>
                  <p className="text-slate-500">Contact: {order.customer_phone}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-brand-600" />
                    <span>Order Summary</span>
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {order.items?.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-slate-600">
                        <span className="truncate pr-2">{it.title} (x{it.quantity})</span>
                        <span className="font-bold text-slate-900">
                          Rs. {(it.price * it.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm mt-2">
                    <span>Total Amount ({order.payment_method.toUpperCase()}):</span>
                    <span className="text-brand-600">Rs. {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Order Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active records match &quot;{searchTerm}&quot;. Please verify the order number or contact our helpline.
              </p>
              <a
                href={`tel:${settings.helpline_phone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl mt-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Helpline: {settings.helpline_phone}</span>
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
