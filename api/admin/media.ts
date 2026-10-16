import { createHash } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { exigirSessao, responderJson } from "../../server/adminAuth.js";
import { mensagemErroSupabase, supabaseAdmin } from "../../server/supabase.js";

type Requisicao = IncomingMessage & { body?: unknown };
const EXTENSOES: Record<string, string> = {
  "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif", "image/svg+xml": "svg", "application/pdf": "pdf",
  "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov",
};

export default async function handler(req: Requisicao, res: ServerResponse) {
  if (!exigirSessao(req, res)) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    responderJson(res, 405, { error: "Método não permitido." });
    return;
  }
  const dataUrl = req.body && typeof req.body === "object" && "dataUrl" in req.body && typeof req.body.dataUrl === "string" ? req.body.dataUrl : "";
  const partes = /^data:([^;,]+);base64,([a-z\d+/]+=*)$/i.exec(dataUrl);
  if (!partes || !EXTENSOES[partes[1]]) {
    responderJson(res, 400, { error: "Arquivo inválido ou tipo não permitido." });
    return;
  }
  const mime = partes[1];
  const bytes = Buffer.from(partes[2], "base64");
  if (!bytes.length || bytes.length > 3.2 * 1024 * 1024) {
    responderJson(res, 413, { error: "O arquivo precisa ter até 3,2 MB. Reduza o tamanho e tente novamente." });
    return;
  }
  const nome = `${createHash("sha256").update(bytes).digest("hex").slice(0, 24)}.${EXTENSOES[mime]}`;
  try {
    const supabase = supabaseAdmin();
    const { error } = await supabase.storage.from("portfolio-media").upload(nome, bytes, { contentType: mime, upsert: true, cacheControl: "31536000" });
    if (error) throw error;
    const { data } = supabase.storage.from("portfolio-media").getPublicUrl(nome);
    responderJson(res, 200, { url: data.publicUrl });
  } catch (erro) {
    console.error("Falha ao enviar mídia ao Supabase:", erro);
    responderJson(res, 503, { error: mensagemErroSupabase(erro, "Não foi possível enviar o arquivo ao Supabase.") });
  }
}
