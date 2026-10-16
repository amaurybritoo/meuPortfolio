import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.CHAVE_SECRETA;
  if (!url || !chave) throw new Error("Configure SUPABASE_URL e CHAVE_SECRETA nas variáveis privadas da Vercel.");
  return createClient(url, chave, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function mensagemErroSupabase(erro: unknown, padrao: string): string {
  if (erro instanceof Error) return erro.message;
  if (erro && typeof erro === "object") {
    const detalhe = erro as { message?: unknown; code?: unknown };
    if (typeof detalhe.message === "string" && detalhe.message.trim()) {
      const codigo = typeof detalhe.code === "string" && detalhe.code.trim() ? ` (${detalhe.code})` : "";
      return `${detalhe.message}${codigo}`;
    }
  }
  return padrao;
}
