// src/components/SimulatorTab.tsx
// Aba 3: Simulador Interativo de Margem da Carta de Vinhos — B2B
// Permite que o restaurateur ajuste mark-up (100% a 180%) e projete lucros mensais

import React, { useState } from "react";
import { WINE_CATALOG, WineProduct } from "../data/catalog";
import { calcMenuMargin, calcMonthlyProjection, formatBRL } from "../lib/money";

interface SimulatorTabProps {
  isB2BUnlocked: boolean;
  onOpenGatekeeper: () => void;
}

export const SimulatorTab: React.FC<SimulatorTabProps> = ({
  isB2BUnlocked,
  onOpenGatekeeper,
}) => {
  const [selectedWineId, setSelectedWineId] = useState(WINE_CATALOG[0].id);
  const [markupPct, setMarkupPct] = useState(130); // 130% padrão gastronômico
  const [monthlyBottles, setMonthlyBottles] = useState(120); // 120 garrafas/mês no restaurante

  const selectedWine = WINE_CATALOG.find((w) => w.id === selectedWineId) || WINE_CATALOG[0];
  const marginResult = calcMenuMargin(selectedWine.b2bUnitCents, markupPct);
  const projection = calcMonthlyProjection(monthlyBottles, selectedWine.b2bUnitCents, markupPct);

  // Estimativa de ICMS-ST / Diferencial de Alíquota (aproximação técnica para SP)
  const stEstimateCents = Math.round(selectedWine.b2bUnitCents * 0.12); // ~12% ST
  const stEstimateFormatted = formatBRL(stEstimateCents, true);

  const handleExportCartaWhatsApp = () => {
    const text = encodeURIComponent(
      `*Planejamento de Carta de Vinhos — Caminho das Uvas*\n\n` +
      `🍷 Rótulo: ${selectedWine.name} (${selectedWine.vintage})\n` +
      `📦 Embalagem: Caixa com ${selectedWine.boxUnits} garrafas\n` +
      `💵 Custo Importação: ${marginResult.costUnitFormatted}\n` +
      `📈 Mark-up sugerido: ${markupPct}%\n` +
      `📋 Preço na Carta: ${marginResult.menuPriceFormatted}\n` +
      `💰 Lucro por Garrafa: ${marginResult.profitFormatted} (${marginResult.marginPct}% de margem)\n` +
      `📊 Projeção Mensal (${monthlyBottles} gfs/mês): Lucro Líquido Estimado de ${projection.totalProfitFormatted}\n\n` +
      `Gostaria de formalizar uma proposta comercial faturada para o meu restaurante.`
    );
    window.open(`https://wa.me/5511983750676?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 py-4 text-[#F5F2EB]">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest font-black text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 px-2.5 py-0.5 rounded-md">
            Ferramenta para Restaurantes & Adegas
          </span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#F5F2EB] mt-1">
          Simulador de Margem & Carta de Vinhos
        </h2>
        <p className="text-xs text-[#A89F91] mt-0.5">
          Projete a lucratividade exata de cada garrafa servida no salão com base na tabela direta de importação.
        </p>
      </div>

      {/* Bloqueio se não estiver autenticado com CNPJ */}
      {!isB2BUnlocked && (
        <div className="p-5 rounded-3xl bg-[#171413] border border-[#C5A059]/40 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h3 className="font-serif text-base font-bold text-[#F5F2EB]">
                Tabela de Custos Bloqueada
              </h3>
              <p className="text-xs text-[#A89F91]">
                Para visualizar as margens reais de atacado e os custos de importação, valide o CNPJ do seu restaurante.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenGatekeeper}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0D0B0A] font-bold text-xs tracking-wider uppercase transition-all active:scale-98 cursor-pointer"
          >
            Desbloquear Simulador via CNPJ
          </button>
        </div>
      )}

      {/* Simulador Ativo */}
      <div className={`space-y-5 transition-opacity ${!isB2BUnlocked ? "opacity-50 pointer-events-none" : ""}`}>
        
        {/* 1. Seletor de Rótulo */}
        <div className="p-4 rounded-2xl bg-[#171413] border border-[#2D2622] space-y-2">
          <label className="block text-xs font-semibold text-[#A89F91] uppercase tracking-wider">
            Selecione o Rótulo para Simulação
          </label>
          <select
            value={selectedWineId}
            onChange={(e) => setSelectedWineId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0D0B0A] border border-[#2D2622] text-sm text-[#F5F2EB] font-serif font-bold focus:outline-none focus:border-[#C5A059]"
          >
            {WINE_CATALOG.map((wine) => (
              <option key={wine.id} value={wine.id}>
                {wine.countryFlag} {wine.name} ({wine.vintage}) — Caixa com {wine.boxUnits} gfs
              </option>
            ))}
          </select>
        </div>

        {/* 2. Sliders Interativos (Mark-up e Volume) */}
        <div className="p-5 rounded-2xl bg-[#171413] border border-[#2D2622] space-y-6">
          {/* Slider de Mark-up */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider">
                Mark-up Pretendido na Carta
              </label>
              <span className="font-serif font-black text-lg text-[#C5A059]">
                {markupPct}%
              </span>
            </div>
            <input
              type="range"
              min={80}
              max={220}
              step={5}
              value={markupPct}
              onChange={(e) => setMarkupPct(Number(e.target.value))}
              className="w-full accent-[#C5A059] h-2 bg-[#0D0B0A] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span>80% (Giro Rápido)</span>
              <span>130% (Padrão A&B)</span>
              <span>220% (Carta de Luxo)</span>
            </div>
          </div>

          {/* Slider de Giro Mensal */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider">
                Giro Estimado no Salão / Mês
              </label>
              <span className="font-serif font-black text-lg text-[#F5F2EB]">
                {monthlyBottles} garrafas
              </span>
            </div>
            <input
              type="range"
              min={24}
              max={600}
              step={12}
              value={monthlyBottles}
              onChange={(e) => setMonthlyBottles(Number(e.target.value))}
              className="w-full accent-[#C5A059] h-2 bg-[#0D0B0A] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span>24 gfs (2 a 4 cxs)</span>
              <span>120 gfs (Adega média)</span>
              <span>600 gfs (Grande casa)</span>
            </div>
          </div>
        </div>

        {/* 3. Cards com Métricas de Resultado da Garrafa */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-[#0D0B0A] border border-[#2D2622]">
            <span className="text-[10px] uppercase text-[#A89F91] block">Custo Garrafa (PJ)</span>
            <span className="font-serif font-bold text-lg text-[#F5F2EB] mt-1 block">
              {marginResult.costUnitFormatted}
            </span>
            <span className="text-[9px] text-[#A89F91] font-mono mt-0.5 block">
              Cx com {selectedWine.boxUnits} un
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D0B0A] border border-[#C5A059]/40">
            <span className="text-[10px] uppercase text-[#C5A059] block font-bold">Preço na Carta</span>
            <span className="font-serif font-black text-xl text-[#C5A059] mt-1 block">
              {marginResult.menuPriceFormatted}
            </span>
            <span className="text-[9px] text-emerald-400 font-mono mt-0.5 block">
              {marginResult.marginPct}% de margem
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-[#0D0B0A] border border-emerald-500/30">
            <span className="text-[10px] uppercase text-emerald-400 block font-bold">Lucro Líquido / gf</span>
            <span className="font-serif font-black text-xl text-emerald-400 mt-1 block">
              {marginResult.profitFormatted}
            </span>
            <span className="text-[9px] text-[#A89F91] font-mono mt-0.5 block">
              por garrafa servida
            </span>
          </div>
        </div>

        {/* 4. Caixa de Projeção Mensal de Faturamento & Lucro */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#171413] to-[#0D0B0A] border border-[#C5A059]/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2D2622] pb-3">
            <span className="text-xs uppercase font-bold text-[#C5A059] tracking-wider">
              Projeção Mensal para a sua Adega
            </span>
            <span className="text-xs font-mono text-[#A89F91]">
              {monthlyBottles} garrafas / mês
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-[#A89F91] block">Faturamento Bruto na Carta:</span>
              <span className="font-serif font-bold text-lg text-[#F5F2EB]">
                {projection.totalRevenueFormatted}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#A89F91] block">Custo de Aquisição:</span>
              <span className="font-serif font-bold text-lg text-stone-400">
                {projection.totalCostFormatted}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-300 block">
                Lucro Líquido Estimado da Operação:
              </span>
              <span className="text-[10px] text-emerald-400/80">
                Livre do custo da mercadoria vendida (CMV)
              </span>
            </div>
            <span className="font-serif font-black text-2xl text-emerald-300">
              {projection.totalProfitFormatted}
            </span>
          </div>

          {/* Dica Fiscal (ICMS-ST e NCM) */}
          <div className="text-[11px] text-[#A89F91] flex items-center justify-between pt-1">
            <span>Estimativa de ICMS-ST (SP) por garrafa:</span>
            <span className="font-mono text-[#F5F2EB]">{stEstimateFormatted} (NCM {selectedWine.ncm})</span>
          </div>
        </div>

        {/* 5. Ação: Exportar Carta para WhatsApp / Sommelier */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleExportCartaWhatsApp}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#1EBE5D] text-white font-black text-sm tracking-wide shadow-lg hover:brightness-105 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>💬 Exportar Carta e Pedir Lote no WhatsApp</span>
            <span>→</span>
          </button>
          <p className="text-center text-[10px] text-[#A89F91]">
            Envia o espelho deste cálculo para o consultor comercial da Caminho das Uvas.
          </p>
        </div>
      </div>
    </div>
  );
};
