import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client only if variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface UserPreferences {
  userId: string;
  languages: string[];
  genres: string[];
  providers: string[];
}

export async function saveUserPreferences(prefs: UserPreferences) {
  if (!supabase) {
    console.warn('Supabase credentials missing. Saving preferences locally to localStorage.');
    localStorage.setItem(`kd_onboarding_${prefs.userId}`, JSON.stringify(prefs));
    return { data: prefs, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: prefs.userId,
        languages: prefs.languages,
        genres: prefs.genres,
        providers: prefs.providers,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Supabase save error, falling back to localStorage:', error);
    localStorage.setItem(`kd_onboarding_${prefs.userId}`, JSON.stringify(prefs));
    return { data: null, error };
  }
}
