import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.CHAVE_SECRETA;
  if (!url) throw new Error("A variável SUPABASE_URL não chegou à função neste deployment. Confira o ambiente da variável e quando este deployment foi criado.");
  if (!chave) throw new Error("A variável CHAVE_SECRETA não chegou à função neste deployment. Confira o ambiente da variável e quando este deployment foi criado.");
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
