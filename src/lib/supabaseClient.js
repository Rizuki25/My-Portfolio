import { createClient } from '@supabase/supabase-js'
import { hasSupabaseConfig, supabasePublishableKey, supabaseUrl } from './supabaseConfig'

export { hasSupabaseConfig }

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null
