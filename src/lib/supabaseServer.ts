import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseServerConfigured = Boolean(
  supabaseUrl &&
    serviceRoleKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-id')
);

let serverClient: SupabaseClient | null = null;

if (isSupabaseServerConfigured) {
  try {
    serverClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (err) {
    console.warn('[Supabase Server] Failed to initialize server client:', err);
  }
}

export const getSupabaseServer = (): SupabaseClient | null => {
  return serverClient;
};
