import type { IncomingMessage, ServerResponse } from "node:http";
import { exigirSessao, responderJson } from "../../server/adminAuth";
import { supabaseAdmin } from "../../server/supabase";

type Requisicao = IncomingMessage & { body?: unknown };

export default async function handler(req: Requisicao, res: ServerResponse) {
  if (!exigirSessao(req, res)) return;
  if (req.method === "GET") {
    try {
      const { data, error } = await supabaseAdmin().from("portfolio_content").select("content").eq("id", "main").maybeSingle();
      if (error) throw error;
      responderJson(res, 200, { content: data?.content ?? null });
    } catch (erro) {
      console.error("Falha ao ler conteúdo do admin:", erro);
      responderJson(res, 503, { error: erro instanceof Error ? erro.message : "Não foi possível carregar o conteúdo do banco." });
    }
    return;
  }
  if (req.method === "PUT") {
    const content = req.body && typeof req.body === "object" && "content" in req.body ? req.body.content : null;
    if (!content || typeof content !== "object" || Array.isArray(content)) {
      responderJson(res, 400, { error: "O conteúdo recebido é inválido." });
      return;
    }
    try {
      const { error } = await supabaseAdmin().from("portfolio_content").upsert({ id: "main", content, updated_at: new Date().toISOString() });
      if (error) throw error;
      responderJson(res, 200, { saved: true });
    } catch (erro) {
      console.error("Falha ao salvar conteúdo do admin:", erro);
      responderJson(res, 503, { error: erro instanceof Error ? erro.message : "Não foi possível salvar no Supabase." });
    }
    return;
  }
  res.setHeader("Allow", "GET, PUT");
  responderJson(res, 405, { error: "Método não permitido." });
}
