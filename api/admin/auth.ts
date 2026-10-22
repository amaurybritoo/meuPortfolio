import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { sessaoAdminValida } from "../../server/adminAuth.js";

const COOKIE = "admin_session";
const DURACAO_SEGUNDOS = 8 * 60 * 60;

type Requisicao = IncomingMessage & { body?: unknown };

function assinatura(payload: string, segredo: string): Buffer {
  return createHmac("sha256", segredo).update(payload).digest();
}

function responder(res: ServerResponse, status: number, dados: Record<string, unknown>): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.end(JSON.stringify(dados));
}

export default function handler(req: Requisicao, res: ServerResponse): void {
  const codigoCorreto = process.env.ADMIN_ACCESS_CODE;
  const segredoSessao = process.env.ADMIN_SESSION_SECRET;
  if (!codigoCorreto || !segredoSessao) {
    responder(res, 503, { authenticated: false, configured: false, error: "A autenticação do painel ainda não foi configurada no servidor." });
    return;
  }

  if (req.method === "GET") {
    const autenticado = sessaoAdminValida(req);
    responder(res, autenticado ? 200 : 401, { authenticated: autenticado, configured: true });
    return;
  }

  if (req.method === "DELETE") {
    const secure = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
    res.setHeader("Set-Cookie", `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure ? "; Secure" : ""}`);
    responder(res, 200, { authenticated: false, configured: true });
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, DELETE");
    responder(res, 405, { error: "Método não permitido." });
    return;
  }

  const codigo = req.body && typeof req.body === "object" && "code" in req.body && typeof req.body.code === "string"
    ? req.body.code
    : "";
  const recebido = Buffer.from(codigo);
  const esperado = Buffer.from(codigoCorreto);
  const correto = recebido.length === esperado.length && timingSafeEqual(recebido, esperado);
  if (!correto) {
    responder(res, 401, { authenticated: false, configured: true, error: "Código incorreto." });
    return;
  }

  const expira = Math.floor(Date.now() / 1000) + DURACAO_SEGUNDOS;
  const payload = Buffer.from(`${expira}.${randomBytes(16).toString("hex")}`).toString("base64url");
  const token = `${payload}.${assinatura(payload, segredoSessao).toString("base64url")}`;
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  res.setHeader("Set-Cookie", `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${DURACAO_SEGUNDOS}${secure ? "; Secure" : ""}`);
  responder(res, 200, { authenticated: true, configured: true });
}
