// src/server.ts
// Servidor de Produção Dokku PaaS & API de Borda — Caminho das Uvas
// Serve os arquivos estáticos compilados (dist/) e expõe /api/b2b/validate e /api/catalog

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { handleApiRequest } from "./lib/server/apiHandler";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = path.resolve(__dirname, "dist");

app.use(cors());
app.use(express.json());

// Logger de Acesso B2B
app.use((req, _res, next) => {
  if (req.url.startsWith("/api/")) {
    console.log(`[API ${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Middleware Unificado para Rotas /api/*
app.all("/api/*", async (req: Request, res: Response) => {
  try {
    const apiReq = {
      url: req.originalUrl || req.url,
      method: req.method,
      headers: req.headers as Record<string, string | string[] | undefined>,
      body: req.body,
    };

    const apiRes = await handleApiRequest(apiReq);

    if (!apiRes) {
      return res.status(404).json({ error: "Endpoint de API não encontrado." });
    }

    res.status(apiRes.statusCode);
    for (const [headerKey, headerVal] of Object.entries(apiRes.headers)) {
      res.setHeader(headerKey, headerVal);
    }
    return res.json(apiRes.data);
  } catch (err: any) {
    console.error("[API ERROR]", err);
    return res.status(500).json({ error: "Erro interno no servidor.", details: err?.message });
  }
});

// Servir Arquivos Estáticos compilados do Vite
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, { maxAge: "1d", etag: true }));

  // Fallback SPA para navegação client-side
  app.get("*", (_req, res) => {
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.status(503).send("Build estático não encontrado. Execute 'npm run build' primeiro.");
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🍷 [Caminho das Uvas] Servidor B2B & PWA ativo na porta ${PORT}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  console.log(`🛡️ Gatekeeper CNAE: /api/b2b/validate`);
  console.log(`📦 Catálogo Sanitizado: /api/catalog`);
});
