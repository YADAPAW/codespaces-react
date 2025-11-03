// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uaimvnjkfmanbhimwwdt.supabase.co'  // เปลี่ยนเป็น URL ของคุณ
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaW12bmprZm1hbmJoaW13d2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDI0NTQsImV4cCI6MjA3NzQ3ODQ1NH0.k1OnPTTT0aNxt4Iw4gwtGjmYEH_tANEEjV7DOkLHwos'         // เปลี่ยนเป็น anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)