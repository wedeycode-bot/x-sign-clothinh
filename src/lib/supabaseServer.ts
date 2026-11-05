import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const isSupabaseServerConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    '';

  return Boolean(
    url &&
      key &&
      url.startsWith('http') &&
      !url.includes('your-project-id')
  );
};

let cachedServerClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export const getSupabaseServer = (): SupabaseClient | null => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    '';

  if (!url || !key || !url.startsWith('http') || url.includes('your-project-id')) {
    return null;
  }

  // Reuse client if credentials haven't changed
  if (cachedServerClient && url === lastUrl && key === lastKey) {
    return cachedServerClient;
  }

  try {
    cachedServerClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    lastUrl = url;
    lastKey = key;
    return cachedServerClient;
  } catch (err) {
    console.warn('[Supabase Server] Failed to initialize server client:', err);
    return null;
  }
};
