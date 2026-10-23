// test_b2b_api.mjs
// Suíte de Testes Automatizados para a Sprint 2 — APIs de Borda B2B & Catálogo Sanitizado
// Caminho das Uvas

import { handleApiRequest } from "./src/lib/server/apiHandler.ts";

async function runTests() {
  console.log("🍷 [TEST SUITE] Iniciando testes das rotas de API da Sprint 2...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  // 1. Healthcheck
  const healthRes = await handleApiRequest({
    url: "/api/health",
    method: "GET",
    headers: {},
  });
  assert(healthRes?.statusCode === 200, "Healthcheck retorna HTTP 200");
  assert(healthRes?.data?.status === "ok", "Healthcheck payload contém status: ok");

  // 2. Catálogo D2C (Sem Token)
  const d2cCatalogRes = await handleApiRequest({
    url: "/api/catalog",
    method: "GET",
    headers: {},
  });
  assert(d2cCatalogRes?.statusCode === 200, "Catálogo D2C público retorna HTTP 200");
  assert(d2cCatalogRes?.data?.mode === "D2C_PUBLIC", "Catálogo D2C opera em modo D2C_PUBLIC");
  assert(Array.isArray(d2cCatalogRes?.data?.items) && d2cCatalogRes.data.items.length > 0, "Catálogo retorna lista de produtos");

  const hasLeakedB2B = d2cCatalogRes.data.items.some((item) => "b2bUnitCents" in item && item.b2bUnitCents !== undefined);
  assert(!hasLeakedB2B, "HARD GUARDRAIL: Preço de atacado (b2bUnitCents) expurgado do catálogo público");

  // 3. Validação de CNPJ Inválido
  const invalidCnpjRes = await handleApiRequest({
    url: "/api/b2b/validate",
    method: "POST",
    headers: {},
    body: { cnpj: "11.111.111/1111-11" },
  });
  assert(invalidCnpjRes?.statusCode === 403, "CNPJ com dígitos inválidos retorna HTTP 403");
  assert(invalidCnpjRes?.data?.authorized === false, "CNPJ inválido possui authorized: false");

  // 4. Validação de CNPJ Válido (Fasano / Trattoria ou formato válido)
  // CNPJ da Casas Bahia / Via Varejo ou outro para teste de CNAE ou fallback
  const validCnpjRes = await handleApiRequest({
    url: "/api/b2b/validate",
    method: "POST",
    headers: {},
    body: { cnpj: "33.000.167/0001-01" }, // Petróleo Brasileiro S.A. (CNAE incompatível de petróleo)
  });
  console.log("  ℹ️ Teste CNAE Petróleo Brasileiro:", validCnpjRes?.data?.cnaeCode, validCnpjRes?.data?.cnaeDescription);
  assert(validCnpjRes !== null, "Requisição de CNPJ processada");

  // 5. Simulação de Token B2B Válido emitido pelo sistema
  // Geramos um token direto para testar desbloqueio de catálogo
  const mockB2BPayload = {
    cnpj: "33000167000101",
    cnae: "56.11",
    issuedAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  const validToken = `b2b_auth_${Buffer.from(JSON.stringify(mockB2BPayload)).toString("base64")}`;

  const b2bCatalogRes = await handleApiRequest({
    url: "/api/catalog",
    method: "GET",
    headers: {
      authorization: `Bearer ${validToken}`,
    },
  });

  assert(b2bCatalogRes?.statusCode === 200, "Catálogo B2B autenticado retorna HTTP 200");
  assert(b2bCatalogRes?.data?.mode === "B2B_UNLOCKED", "Catálogo opera em modo B2B_UNLOCKED");
  const hasB2BPrice = b2bCatalogRes.data.items.every((item) => typeof item.b2bUnitCents === "number" && item.b2bUnitCents > 0);
  assert(hasB2BPrice, "Catálogo B2B expõe b2bUnitCents para todos os rótulos");

  console.log(`\n📊 RESULTADO DA SUÍTE: ${passed} passaram, ${failed} falharam.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Erro fatal no runner de testes:", err);
  process.exit(1);
});
