// src/lib/pwaCache.ts
// Diretrizes de Ciclo de Vida do Cache PWA — Caminho das Uvas
// Prevenção de ruptura de safra, divergência de EAN e desatualização de teor alcoólico

export const PWA_CACHE_CONFIG = {
  // Versão canônica de invalidação global: ao alterar a versão, o SW purga caches obsoletos
  SW_VERSION: "v1.0.1",

  // 1. Assets Imutáveis / Pesados (Cache-First)
  // Fotos de garrafas em alta resolução, brasões, monograma dourado, ícones e fontes Google
  STATIC_ASSETS_CACHE: {
    name: "caminho-static-v1.0.1",
    maxEntries: 120,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
  },

  // 2. Fichas Técnicas, Safras e Tabelas de Preços (Stale-While-Revalidate com TTL Estrito)
  // Garante que o sommelier não venda uma safra de 2021 se a 2022 já entrou no estoque central
  CATALOG_DATA_CACHE: {
    name: "caminho-catalog-v1.0.1",
    maxEntries: 50,
    maxAgeSeconds: 60 * 60, // 60 minutos de TTL máximo para revalidação obrigatória
  },

  // 3. Status de Estoque em Tempo Real & Cotações PJ (Network-First)
  // Consulta diretamente a API do PostgreSQL Dokku para validar saldo de caixas
  STOCK_API_CACHE: {
    name: "caminho-stock-live",
    networkTimeoutSeconds: 3, // Se falhar em 3s, cai no último cache conhecido
  },
};

/**
 * Inspeciona e limpa versões antigas de caches no Service Worker
 */
export async function cleanOldCaches(currentVersion = PWA_CACHE_CONFIG.SW_VERSION) {
  if (typeof window === "undefined" || !("caches" in window)) return;
  const cacheNames = await caches.keys();
  const validPrefixes = [`caminho-static-${currentVersion}`, `caminho-catalog-${currentVersion}`];

  await Promise.all(
    cacheNames.map((cacheName) => {
      if (cacheName.startsWith("caminho-") && !validPrefixes.includes(cacheName)) {
        return caches.delete(cacheName);
      }
      return Promise.resolve(false);
    })
  );
}
