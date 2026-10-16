import { createHmac, timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

const COOKIE = "admin_session";

function assinatura(payload: string, segredo: string): Buffer {
  return createHmac("sha256", segredo).update(payload).digest();
}

export function sessaoAdminValida(req: IncomingMessage): boolean {
  const segredo = process.env.ADMIN_SESSION_SECRET;
  if (!segredo) return false;
  const cookies = req.headers.cookie ?? "";
  const valor = cookies.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!valor) return false;
  try {
    const [payload, assinaturaRecebida] = decodeURIComponent(valor).split(".");
    if (!payload || !assinaturaRecebida) return false;
    const recebida = Buffer.from(assinaturaRecebida, "base64url");
    const esperada = assinatura(payload, segredo);
    if (recebida.length !== esperada.length || !timingSafeEqual(recebida, esperada)) return false;
    const dados = Buffer.from(payload, "base64url").toString("utf8");
    const expira = Number(dados.split(".", 1)[0]);
    return Number.isFinite(expira) && expira > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function exigirSessao(req: IncomingMessage, res: ServerResponse): boolean {
  if (sessaoAdminValida(req)) return true;
  res.statusCode = 401;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.end(JSON.stringify({ error: "Sessão expirada. Entre novamente no painel." }));
  return false;
}

export function responderJson(res: ServerResponse, status: number, dados: Record<string, unknown>): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.end(JSON.stringify(dados));
}
