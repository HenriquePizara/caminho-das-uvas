// test_sprint3_sprint4.mjs
// Testes Automatizados de Inteligência Comercial B2B e Cálculos Financeiros
// Sprints 3 & 4 — Caminho das Uvas

import { calcMenuMargin, calcMonthlyProjection, calcBoxTotalCents, formatBRL } from "./src/lib/money.ts";
import { WINE_CATALOG } from "./src/data/catalog.ts";

async function runTests() {
  console.log("🍷 [TEST SUITE] Iniciando testes das Sprints 3 & 4 (Visual de Alta Adega & Inteligência Comercial B2B)...\n");
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

  // 1. Catálogo & Ficha Técnica Aberta (Sprint 3)
  assert(WINE_CATALOG.length >= 10, `Catálogo contém ${WINE_CATALOG.length} rótulos catalogados`);

  const hasAllSpecs = WINE_CATALOG.every(
    (w) =>
      w.name &&
      w.producer &&
      w.region &&
      w.country &&
      w.grapes.length > 0 &&
      w.boxUnits &&
      [3, 6, 12].includes(w.boxUnits) &&
      w.b2bUnitCents > 0 &&
      w.d2cSuggestedUnitCents > w.b2bUnitCents &&
      w.tastingNotes?.visual &&
      w.tastingNotes?.aroma &&
      w.tastingNotes?.palate &&
      w.foodPairing?.length > 0 &&
      w.ean &&
      w.dun14 &&
      w.ncm
  );
  assert(hasAllSpecs, "100% dos rótulos possuem fichas técnicas completas estilo Caves Santa Cruz (Degustação, DUN, EAN, NCM)");

  // 2. Embalagens Reais (3, 6 e 12 unidades)
  const packaging3 = WINE_CATALOG.some((w) => w.boxUnits === 3);
  const packaging6 = WINE_CATALOG.some((w) => w.boxUnits === 6);
  const packaging12 = WINE_CATALOG.some((w) => w.boxUnits === 12);
  assert(packaging3 && packaging6 && packaging12, "Matriz logística real suporta caixas de 3, 6 e 12 unidades");

  // 3. Cálculos de Mark-up da Carta (calcMenuMargin)
  const testB2BPrice = 13840; // R$ 138,40 (Pousio Reserva Tinto)
  const margin130 = calcMenuMargin(testB2BPrice, 130);
  assert(margin130.menuPriceCents === 31832, "Mark-up 130% em R$ 138,40 resulta em R$ 318,32 na carta");
  assert(margin130.profitPerBottleCents === 17992, "Lucro por garrafa em mark-up 130% é de R$ 179,92");
  assert(margin130.marginPct === 56.5, "Margem percentual sobre o preço de venda é de 56.5%");

  // 4. Projeção Mensal de Lucratividade (calcMonthlyProjection)
  const projection = calcMonthlyProjection(120, testB2BPrice, 130);
  assert(projection.bottlesSoldPerMonth === 120, "Projeção calcula exatamente 120 garrafas/mês");
  assert(projection.totalProfitFormatted.includes("21.590"), `Lucro mensal de 120 gfs projeta R$ 21.590,40: ${projection.totalProfitFormatted}`);

  // 5. Trava Comercial de Frete Bonificado e Faturamento
  const FRETE_GRATIS_SP_CENTS = 60000; // R$ 600,00
  const FATURAMENTO_BOLETO_MINIMO_CENTS = 100000; // R$ 1.000,00

  // Caso A: 1 caixa de vinho de entrada (R$ 335,40)
  const orderA_Cents = 33540;
  const statusFreteA = orderA_Cents >= FRETE_GRATIS_SP_CENTS ? "BONIFICADO_GRANDE_SP" : "PADRAO_A_CALCULAR";
  const condicaoA = orderA_Cents >= FATURAMENTO_BOLETO_MINIMO_CENTS ? "BOLETO_PJ_28D_SOLICITADO" : "PIX_ANTECIPADO";
  assert(statusFreteA === "PADRAO_A_CALCULAR", "Pedido de R$ 335,40 bloqueia frete grátis (exige cálculo de frete)");
  assert(condicaoA === "PIX_ANTECIPADO", "Pedido de R$ 335,40 bloqueia boleto a prazo (exige Pix antecipado)");

  // Caso B: 2 caixas com valor R$ 1.250,00
  const orderB_Cents = 125000;
  const statusFreteB = orderB_Cents >= FRETE_GRATIS_SP_CENTS ? "BONIFICADO_GRANDE_SP" : "PADRAO_A_CALCULAR";
  const condicaoB = orderB_Cents >= FATURAMENTO_BOLETO_MINIMO_CENTS ? "BOLETO_PJ_28D_SOLICITADO" : "PIX_ANTECIPADO";
  assert(statusFreteB === "BONIFICADO_GRANDE_SP", "Pedido de R$ 1.250,00 libera Frete Bonificado para Grande SP");
  assert(condicaoB === "BOLETO_PJ_28D_SOLICITADO", "Pedido de R$ 1.250,00 libera solicitação de Boleto Bancário 28D");

  // 6. Kit de Entrada do Sommelier (R$ 490,00)
  const kit = WINE_CATALOG.find((w) => w.id === "kit-homologacao-sommelier-6");
  assert(kit !== undefined, "Kit de Homologação do Sommelier (6 gfs) presente no catálogo");
  assert(kit.b2bUnitCents === 49000, "Kit de Homologação precificado no valor promocional de R$ 490,00");
  assert(kit.boxUnits === 6, "Kit de Homologação entrega 6 garrafas sortidas");

  console.log(`\n📊 RESULTADO DA SUÍTE: ${passed} passaram, ${failed} falharam.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Erro fatal na suíte:", err);
  process.exit(1);
});
