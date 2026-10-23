import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { handleApiRequest } from "./src/lib/server/apiHandler";

// Plugin para emular as rotas /api/* no servidor de desenvolvimento Vite
function apiDevMiddleware(): Plugin {
  return {
    name: "vite-plugin-b2b-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) {
          return next();
        }

        try {
          let body: any = undefined;

          if (req.method === "POST" || req.method === "PUT") {
            const chunks: Uint8Array[] = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            const rawBody = Buffer.concat(chunks).toString("utf-8");
            try {
              body = JSON.parse(rawBody);
            } catch {
              body = rawBody;
            }
          }

          const apiReq = {
            url: req.url,
            method: req.method || "GET",
            headers: req.headers as Record<string, string | string[] | undefined>,
            body,
          };

          const apiRes = await handleApiRequest(apiReq);

          if (!apiRes) {
            return next();
          }

          res.statusCode = apiRes.statusCode;
          for (const [key, val] of Object.entries(apiRes.headers)) {
            res.setHeader(key, val);
          }
          res.end(JSON.stringify(apiRes.data));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Internal Server Error in Dev Middleware", details: err?.message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiDevMiddleware(),
  ],
  server: {
    port: 3033,
    host: true,
  },
  preview: {
    port: 3033,
    host: true,
  },
  build: {
    target: "es2022",
    outDir: "dist",
    assetsInlineLimit: 4096,
  },
});
