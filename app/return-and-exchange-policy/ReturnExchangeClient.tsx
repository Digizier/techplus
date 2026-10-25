'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

export default function ReturnExchangeClient() {
  const { settings } = useSettings();

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 pb-16">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
          <RotateCcw className="w-7 h-7" />
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-slate-900">
          Return & Exchange Policy
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Transparent, hassle-free replacement support for all tools & machinery across Pakistan.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xs space-y-6 text-xs md:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>7-Day Checking Warranty</span>
          </h2>
          <p>
            At {settings.store_name}, customer satisfaction is our highest priority. All electric tools, cordless drills, and adapter attachments come with a <strong>7-Day Checking Warranty</strong> from the date of parcel receipt.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Eligibility for Replacement</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Product is non-functional or has a manufacturing motor defect upon delivery.</li>
            <li>Item delivered does not match the specifications or order description.</li>
            <li>Tool accessories or parts are missing from the package.</li>
            <li>The item must be in its original packaging along with all provided attachments.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Exchange Procedure</span>
          </h2>
          <p>
            To initiate an exchange, please capture a brief 10-second video demonstrating the issue and WhatsApp it to our official helpline at <strong>{settings.whatsapp_number}</strong> with your Order ID. Our technician team will verify and dispatch a replacement unit promptly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Return Shipping Address</span>
          </h2>
          <p className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
            <strong>Recipient:</strong> {settings.store_name} Return Department<br />
            <strong>Address:</strong> {settings.address}<br />
            <strong>Contact:</strong> {settings.helpline_phone}
          </p>
        </section>
      </div>
    </div>
  );
}
