import { SiteSettings, DEFAULT_SITE_SETTINGS } from '@/types/siteSettings';
import initialSettingsData from '@/data/siteSettings.json';
import { getSupabaseServer, isSupabaseServerConfigured } from '@/lib/supabaseServer';

let inMemorySettings: SiteSettings = {
  ...DEFAULT_SITE_SETTINGS,
  ...(initialSettingsData as unknown as SiteSettings),
};

export async function getStoredSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = getSupabaseServer();
      if (supabase) {
        const { data, error } = await supabase
          .from('site_settings')
          .select('content')
          .eq('id', 'default')
          .maybeSingle();

        if (!error && data?.content) {
          inMemorySettings = {
            ...DEFAULT_SITE_SETTINGS,
            ...data.content,
          };
          return inMemorySettings;
        }
      }
    } catch (err) {
      console.warn('[siteSettingsStore] Supabase query error, falling back to local defaults:', err);
    }
  }

  return inMemorySettings;
}

export async function updateStoredSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getStoredSiteSettings();
  const merged: SiteSettings = {
    ...current,
    ...updates,
    hero: { ...current.hero, ...(updates.hero || {}) },
    marquee: { ...current.marquee, ...(updates.marquee || {}) },
    campaignFilm: { ...current.campaignFilm, ...(updates.campaignFilm || {}) },
    manifesto: { ...current.manifesto, ...(updates.manifesto || {}) },
    contact: { ...current.contact, ...(updates.contact || {}) },
  };

  inMemorySettings = merged;

  if (isSupabaseServerConfigured()) {
    try {
      const supabase = getSupabaseServer();
      if (supabase) {
        const { error } = await supabase.from('site_settings').upsert({
          id: 'default',
          content: merged,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error('[siteSettingsStore] Supabase save error:', error.message);
        }
      }
    } catch (err) {
      console.error('[siteSettingsStore] Supabase save exception:', err);
    }
  }

  return merged;
}
