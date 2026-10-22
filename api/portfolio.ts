import type { IncomingMessage, ServerResponse } from "node:http";
import { responderJson } from "../server/adminAuth.js";
import { supabaseAdmin } from "../server/supabase.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    responderJson(res, 405, { error: "Método não permitido." });
    return;
  }
  try {
    const { data, error } = await supabaseAdmin().from("portfolio_content").select("content").eq("id", "main").maybeSingle();
    if (error) throw error;
    responderJson(res, 200, { content: data?.content ?? null });
  } catch (erro) {
    console.error("Falha ao ler portfólio do Supabase:", erro);
    responderJson(res, 503, { error: "Não foi possível carregar o conteúdo." });
  }
}
