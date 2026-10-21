'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from './types';
import { getSiteSettings } from './db';

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

interface SettingsContextType {
  settings: SiteSettings;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  refreshSettings: async () => {},
  loading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await getSiteSettings();
      setSettings(data);
    } catch (err) {
      console.warn('Failed to load live settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    const handleUpdate = () => {
      fetchSettings();
    };

    window.addEventListener('tp_settings_updated', handleUpdate);
    return () => {
      window.removeEventListener('tp_settings_updated', handleUpdate);
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings: fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
