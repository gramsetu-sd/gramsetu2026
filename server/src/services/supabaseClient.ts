import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('placeholder')
);

export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
    console.log('✅ Connected to Supabase PostgreSQL at:', supabaseUrl);
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase client. Running in Local Demonstration Store mode.', err);
    supabase = null;
  }
} else {
  console.log('ℹ️ Running in Demonstration Mode (In-memory PostgreSQL-compatible store). Configure .env for live Supabase.');
}
