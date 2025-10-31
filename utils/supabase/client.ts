// utils/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

// ดึงค่าจาก .env (Vite ใช้ import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// สร้างและ export client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)