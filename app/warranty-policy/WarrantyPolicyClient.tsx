'use client';

import React from 'react';
import { ShieldCheck, Wrench, CheckCircle2 } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

export default function WarrantyPolicyClient() {
  const { settings } = useSettings();

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 pb-16">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-slate-900">
          Repair & Warranty Policy
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Pure copper winding commitment & certified technician warranty standards.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xs space-y-6 text-xs md:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pure Copper Winding Guarantee</span>
          </h2>
          <p>
            All professional power tools sold under {settings.store_name} (such as Rotary Hammer Drills, 10mm/13mm Impact Drills, and Variable Speed Polishers) are manufactured with <strong>100% pure copper motor armature and stator winding</strong>. We do not sell cheap aluminum or copper-clad imitation windings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Service & Maintenance Coverage</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>AC Servicing:</strong> High-pressure water gun cleaning includes a 15-day post-service cooling performance check.</li>
            <li><strong>Appliance Repair:</strong> Refrigerator, washing machine, and microwave repairs carry a 30-day warranty on replaced mechanical and electronic components.</li>
            <li><strong>Solar Installations:</strong> GoodWe inverters and solar arrays carry official manufacturer warranty terms (5-10 years on inverters, 25 years linear panel performance).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Exclusions</span>
          </h2>
          <p className="text-slate-600">
            Warranty does not cover accidental physical breakage from drops, water immersion into non-waterproof motor bodies, electrical voltage spikes exceeding 250V without surge protection, or unauthorized third-party tampering.
          </p>
        </section>
      </div>
    </div>
  );
}
