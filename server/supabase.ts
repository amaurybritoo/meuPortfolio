import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_SECRET_KEY;
  if (!url || !chave) throw new Error("Configure SUPABASE_URL e SUPABASE_SECRET_KEY nas variáveis privadas da Vercel.");
  return createClient(url, chave, { auth: { persistSession: false, autoRefreshToken: false } });
}
