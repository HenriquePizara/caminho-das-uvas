// src/lib/server/apiHandler.ts
// Handler Unificado de APIs de Borda B2B & Catálogo Sanitizado
// Caminho das Uvas — Compatível com Vite Dev Middleware e Express em Produção Dokku

import { validateCnpjServerSide, verifyB2BToken } from "./b2bValidator";
import { getSanitizedCatalog } from "./catalogSanitizer";

export interface ApiRequest {
  url: string;
  method: string;
  headers: Record<string, string | string[] | undefined>;
  body?: any;
}

export interface ApiResponse {
  statusCode: number;
  headers: Record<string, string>;
  data: any;
}

export async function handleApiRequest(req: ApiRequest): Promise<ApiResponse | null> {
  const urlPath = req.url.split("?")[0];

  // 1. Healthcheck
  if (urlPath === "/api/health" && req.method === "GET") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      data: {
        status: "ok",
        service: "caminho-das-uvas-b2b-api",
        version: "1.0.1",
        timestamp: new Date().toISOString(),
      },
    };
  }

  // 2. Validação Server-Side de CNPJ & Emissão de Token B2B
  if (urlPath === "/api/b2b/validate" && req.method === "POST") {
    try {
      const cnpj = req.body?.cnpj || "";
      if (!cnpj || typeof cnpj !== "string") {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          data: {
            valid: false,
            authorized: false,
            error: "Campo 'cnpj' é obrigatório no corpo da requisição.",
          },
        };
      }

      const result = await validateCnpjServerSide(cnpj);
      const statusCode = result.valid && result.authorized ? 200 : 403;

      return {
        statusCode,
        headers: { "Content-Type": "application/json" },
        data: result,
      };
    } catch (err: any) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        data: {
          valid: false,
          authorized: false,
          error: "Erro interno no servidor de validação CNPJ.",
          details: err?.message,
        },
      };
    }
  }

  // 3. Catálogo Sanitizado (Expurga b2bUnitCents sem Token Válido)
  if (urlPath === "/api/catalog" && req.method === "GET") {
    try {
      const authHeader = (req.headers["authorization"] || req.headers["Authorization"]) as string | undefined;
      const catalog = getSanitizedCatalog(authHeader);

      const hasValidToken = verifyB2BToken(authHeader?.replace("Bearer ", ""));

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": hasValidToken
            ? "private, no-cache, no-store, must-revalidate"
            : "public, max-age=60, s-maxage=300",
        },
        data: {
          total: catalog.length,
          mode: hasValidToken ? "B2B_UNLOCKED" : "D2C_PUBLIC",
          items: catalog,
        },
      };
    } catch (err: any) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        data: {
          error: "Erro ao gerar catálogo sanitizado.",
          details: err?.message,
        },
      };
    }
  }

  return null; // Não é rota de API tratada
}
