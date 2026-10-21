'use client';

import React from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

export default function PrivacyPolicyPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 pb-16">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          How {settings.store_name} safeguards your personal data and delivery records.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xs space-y-6 text-xs md:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Information We Collect</span>
          </h2>
          <p>
            When you place an order or schedule a technician service on {settings.store_name}, we collect your Name, Phone Number, WhatsApp Number, Shipping Address, and optional Email Address solely to process your courier shipment and provide dispatch updates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero Third-Party Marketing Sharing</span>
          </h2>
          <p>
            We strictly protect your contact details. Your mobile number and delivery address are shared exclusively with authorized courier logistics partners (such as TCS, Leopards, or Trax) for package dispatch. We never sell, lease, or rent customer lists to advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Contact & Data Deletion</span>
          </h2>
          <p>
            If you wish to inspect or delete your archived customer records from our dispatch database, contact our support team at <strong>{settings.email}</strong> or WhatsApp <strong>{settings.whatsapp_number}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
