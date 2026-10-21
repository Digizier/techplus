'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PhoneCall,
  Send,
  Sparkles,
  Flame,
} from 'lucide-react';
import { createServiceInquiry } from '@/lib/db';
import { useSettings } from '@/lib/settings-context';

export default function ServicesPage() {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    service_type: 'AC Repair & High Pressure Cleaning',
    city: 'Islamabad',
    address: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone) {
      setErrorMsg('Please provide your name and phone number');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await createServiceInquiry({
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        service_type: formData.service_type,
        city: formData.city.trim(),
        address: formData.address.trim(),
        message: formData.message.trim(),
        status: 'New',
      });
      setSubmitted(true);
      setFormData({
        customer_name: '',
        customer_phone: '',
        service_type: 'AC Repair & High Pressure Cleaning',
        city: 'Islamabad',
        address: '',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit inquiry. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const servicesList = [
    {
      title: 'AC Service & High Pressure Cleaning',
      badge: 'Summer Special Discount',
      desc: 'Complete master indoor/outdoor deep wash using high pressure water gun, gas leak check, condenser coil chemical wash, and compressor efficiency testing.',
      bullets: [
        'High-Pressure Water Gun Deep Wash',
        'Freon Gas Leak Testing & Refill',
        'Indoor Blower & Filter Sanitization',
        'Emergency 24-Hour Technician Dispatch',
      ],
      icon: Flame,
    },
    {
      title: 'Certified Solar System Installation',
      badge: 'GoodWe Authorized',
      desc: 'Complete turnkey hybrid, on-grid, and off-grid solar installation for residential and commercial properties in Islamabad & Rawalpindi.',
      bullets: [
        'GoodWe & Tier-1 Inverter Integration',
        'Net Metering Application Assistance',
        'High-Efficiency Mono-PERC Solar Panels',
        'Lifetime Structural & 10-Yr Workmanship Support',
      ],
      icon: Zap,
    },
    {
      title: 'Home Appliances Repair & Maintenance',
      badge: 'Genuine Replacement Parts',
      desc: 'On-site troubleshooting and repair for refrigerators, automatic washing machines, microwave ovens, and electric motors.',
      bullets: [
        'Refrigerator Compressor & Gas Recharging',
        'Automatic Washing Machine PCB & Motor Repair',
        'Microwave Magnetron & Heating Diagnosis',
        'Guaranteed Genuine Replacement Components',
      ],
      icon: Wrench,
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 md:p-14 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-brand-500/20 text-brand-400 rounded-full text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>EXPERT TECHNICIANS IN ISLAMABAD & RAWALPINDI</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Professional AC, Appliance & Solar Services
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            From high-pressure water gun AC servicing to tier-1 solar panel installations and electronic appliance repairs, Techplus provides verified, certified doorstep service.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={`tel:${settings.helpline_phone}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-lg transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Helpline: {settings.helpline_phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {servicesList.map((service, i) => {
          const Icon = service.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-brand-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-100/70 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {service.badge}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2">{service.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">{service.desc}</p>

                <div className="space-y-2.5 mb-6">
                  {service.bullets.map((b, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="#book-service"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, service_type: service.title }))
                }
                className="w-full text-center py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Select & Book Service
              </a>
            </div>
          );
        })}
      </div>

      {/* 3. Appointment / Inquiry Form */}
      <div
        id="book-service"
        className="bg-white rounded-3xl p-6 md:p-12 border border-slate-100 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-amber-50 px-3 py-1 rounded-full uppercase">
            <Clock className="w-3.5 h-3.5" /> Fast Doorstep Visit
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
            Schedule an Inspection or Installation
          </h2>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            Fill in your contact details below. Our technical supervisor will immediately call you to confirm your appointment, quote inspection fees, and assign an engineer.
          </p>

          <div className="space-y-3 pt-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Coverage in all sectors of Islamabad & Rawalpindi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Transparent diagnostic reports & genuine parts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Shop Location: Shop 07-B Chinar Plaza, St-48, G-6/1-1, Islamabad</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Inquiry Received!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you! Our technical service team will call you within 30 minutes at your phone number.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ali"
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
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
                    value={formData.customer_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Islamabad / Rawalpindi"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service Type *
                </label>
                <select
                  value={formData.service_type}
                  onChange={(e) =>
                    setFormData({ ...formData, service_type: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500 cursor-pointer"
                >
                  <option value="AC Repair & High Pressure Cleaning">
                    AC Repair & High Pressure Water Gun Cleaning
                  </option>
                  <option value="Certified Solar System Installation">
                    Certified GoodWe Solar System Installation
                  </option>
                  <option value="Home Appliances Repair">
                    Home Appliances Repair (Fridge, Washing Machine, Microwave)
                  </option>
                  <option value="Tools Repair & Copper Rewinding">
                    Power Tools Repair & Copper Rewinding
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="House/Plot, Street, Sector"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Issue Description or Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe the issue or service needed..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-brand-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Booking...' : 'Book Technician Appointment'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
