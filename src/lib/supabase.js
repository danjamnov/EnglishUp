import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://apdquqpqlquodxxskecf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZHF1cXBxbHF1b2R4eHNrZWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzE3NDUsImV4cCI6MjA4ODc0Nzc0NX0.DjvzP5xm_U_NbOyX5AoVmNpDoxpKwq2hypg1QcHEcLA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Load English progress for the current user.
 * Returns null if no row exists yet.
 */
export async function loadProgress(userId) {
  const { data, error } = await supabase
    .from('english_progress')
    .select('data')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('loadProgress error:', error);
    return null;
  }
  return data?.data ?? null;
}

/**
 * Save (upsert) English progress for the current user.
 */
export async function saveProgress(userId, progressData) {
  const { error } = await supabase
    .from('english_progress')
    .upsert(
      { user_id: userId, data: progressData, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );

  if (error) {
    console.error('saveProgress error:', error);
  }
}
