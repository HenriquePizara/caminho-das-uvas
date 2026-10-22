// src/lib/money.ts
// Cálculos Financeiros Determinísticos em Centavos Inteiros (Zero Floating-Point Error)
// Adaptado de portfolio/loja para o ecossistema Caminho das Uvas

export function formatBRL(centsOrReais: number, isCents = true): string {
  const amount = isCents ? centsOrReais / 100 : centsOrReais;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

export function calcBoxTotalCents(unitCents: number, boxUnits: number, quantityBoxes = 1): number {
  return Math.round(unitCents * boxUnits * quantityBoxes);
}

/**
 * Calcula o mark-up e lucro da carta de vinhos para o restaurante
 * @param b2bUnitCents Preço de custo da garrafa na distribuidora em centavos
 * @param markupPct Porcentagem de mark-up pretendida pelo restaurante (ex: 120 para 120%)
 */
export function calcMenuMargin(b2bUnitCents: number, markupPct: number) {
  const menuPriceCents = Math.round(b2bUnitCents * (1 + markupPct / 100));
  const profitPerBottleCents = menuPriceCents - b2bUnitCents;
  const marginPct = (profitPerBottleCents / menuPriceCents) * 100;

  return {
    costUnitCents: b2bUnitCents,
    menuPriceCents,
    profitPerBottleCents,
    marginPct: Number(marginPct.toFixed(1)),
    costUnitFormatted: formatBRL(b2bUnitCents, true),
    menuPriceFormatted: formatBRL(menuPriceCents, true),
    profitFormatted: formatBRL(profitPerBottleCents, true),
  };
}

/**
 * Calcula a projeção de receita e lucro mensal de uma carta de vinhos
 * @param bottlesSoldPerMonth Quantidade estimada de garrafas vendidas no salão por mês
 * @param b2bUnitCents Custo médio da garrafa em centavos
 * @param markupPct Mark-up médio praticado (ex: 140%)
 */
export function calcMonthlyProjection(bottlesSoldPerMonth: number, b2bUnitCents: number, markupPct: number) {
  const single = calcMenuMargin(b2bUnitCents, markupPct);
  const totalRevenueCents = single.menuPriceCents * bottlesSoldPerMonth;
  const totalCostCents = single.costUnitCents * bottlesSoldPerMonth;
  const totalProfitCents = single.profitPerBottleCents * bottlesSoldPerMonth;

  return {
    bottlesSoldPerMonth,
    totalRevenueFormatted: formatBRL(totalRevenueCents, true),
    totalCostFormatted: formatBRL(totalCostCents, true),
    totalProfitFormatted: formatBRL(totalProfitCents, true),
  };
}
