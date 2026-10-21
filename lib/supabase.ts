import { createClient } from '@supabase/supabase-js';

const isValidHttpUrl = (url?: string): boolean => {
  if (!url) return false;
  const cleaned = url.trim().replace(/^["']|["']$/g, '');
  return cleaned.startsWith('http://') || cleaned.startsWith('https://');
};

const getValidApiUrl = (envUrl?: string, fallbackUrl: string = 'https://zmwkntfflkmumuwyhmjj.supabase.co'): string => {
  if (isValidHttpUrl(envUrl)) {
    return envUrl!.trim().replace(/^["']|["']$/g, '');
  }
  return fallbackUrl;
};

const supabaseUrl = getValidApiUrl(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  'https://zmwkntfflkmumuwyhmjj.supabase.co'
);

const supabaseAnonKey = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptd2tudGZmbGttdW11d3lobWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1NjY3MzIsImV4cCI6MjEwODE0MjczMn0.LFKyYpbcVhHo0uI8-8-2hytWvsGY79KmqbBH3p7K9so'
).trim().replace(/^["']|["']$/g, '');

// Browser-persistent singleton client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-application-name': 'techplus-storefront',
    },
  },
});
