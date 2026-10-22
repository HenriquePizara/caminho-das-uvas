// src/components/FloatingQuoteBar.tsx
// Barra Flutuante de Cotação de Caixas Fechadas — B2B
// Com Trava de Frete Bonificado (R$ 600 SP / R$ 1.200 Interior) e Payload Estruturado

import React from "react";
import { WineProduct } from "../data/catalog";
import { formatBRL } from "../lib/money";

export interface QuoteItem {
  wine: WineProduct;
  boxes: number;
}

interface FloatingQuoteBarProps {
  items: QuoteItem[];
  onClearQuote: () => void;
  cnpj?: string;
  companyName?: string;
}

const FRETE_GRATIS_SP_CENTS = 60000; // R$ 600,00
const FATURAMENTO_BOLETO_MINIMO_CENTS = 100000; // R$ 1.000,00 para boleto 28d

export const FloatingQuoteBar: React.FC<FloatingQuoteBarProps> = ({
  items,
  onClearQuote,
  cnpj = "CNPJ em validação",
  companyName = "Restaurante Parceiro",
}) => {
  const totalBoxes = items.reduce((acc, curr) => acc + curr.boxes, 0);
  const totalBottles = items.reduce((acc, curr) => acc + curr.boxes * curr.wine.boxUnits, 0);
  const totalCents = items.reduce(
    (acc, curr) => acc + curr.boxes * curr.wine.boxUnits * curr.wine.b2bUnitCents,
    0
  );

  if (totalBoxes === 0) return null;

  const totalFormatted = formatBRL(totalCents, true);
  const faltaFreteGratisCents = Math.max(0, FRETE_GRATIS_SP_CENTS - totalCents);
  const temFreteGratisSP = totalCents >= FRETE_GRATIS_SP_CENTS;
  const permiteBoletoFaturado = totalCents >= FATURAMENTO_BOLETO_MINIMO_CENTS;

  const progressPct = Math.min(100, Math.round((totalCents / FRETE_GRATIS_SP_CENTS) * 100));

  const handleSendQuoteWhatsApp = () => {
    // ── PAYLOAD ESTRUTURADO MACHINE-READABLE PARA IA / ERP ──
    const isoDate = new Date().toISOString();
    let msg = `[COTACAO_B2B_CAMINHO_DAS_UVAS]\n`;
    msg += `EMPRESA: ${companyName}\n`;
    msg += `CNPJ: ${cnpj}\n`;
    msg += `DATA: ${isoDate}\n\n`;

    msg += `ITENS:\n`;
    items.forEach((it) => {
      const lineCents = it.boxes * it.wine.boxUnits * it.wine.b2bUnitCents;
      msg += `- SKU: ${it.wine.slug} | QTD_CX: ${it.boxes} | EMB: ${it.wine.boxUnits}un | GFS: ${
        it.boxes * it.wine.boxUnits
      } | UNIT_BRL: ${formatBRL(it.wine.b2bUnitCents, true)} | SUB_BRL: ${formatBRL(lineCents, true)}\n`;
    });

    msg += `\nMETRICAS:\n`;
    msg += `TOTAL_CAIXAS: ${totalBoxes}\n`;
    msg += `TOTAL_GARRAFAS: ${totalBottles}\n`;
    msg += `SUBTOTAL_CENTAVOS: ${totalCents}\n`;
    msg += `SUBTOTAL_BRL: ${totalFormatted}\n`;
    msg += `STATUS_FRETE: ${temFreteGratisSP ? "BONIFICADO_GRANDE_SP" : "PADRAO_A_CALCULAR"}\n`;
    msg += `CONDICAO_PAGAMENTO: ${permiteBoletoFaturado ? "BOLETO_PJ_28D_SOLICITADO" : "PIX_ANTECIPADO"}\n\n`;

    msg += `Por favor, emitir espelho de pedido com rota de entrega para este lote.`;

    window.open(`https://wa.me/5511983750676?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <aside
      aria-label="Resumo da Cotação"
      className="fixed bottom-14 inset-x-0 z-30 px-3 pb-2 animate-slide-up"
    >
      <div className="max-w-md mx-auto bg-gradient-to-r from-[#171413] via-[#1E1917] to-[#171413] border border-[#C5A059]/60 rounded-2xl p-3.5 shadow-2xl space-y-2 text-[#F5F2EB]">
        
        {/* Barra de Progresso de Frete Bonificado */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono">
            {temFreteGratisSP ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span>🚚</span>
                <span>Frete Bonificado Garantido para Grande SP!</span>
              </span>
            ) : (
              <span className="text-[#A89F91]">
                Faltam <strong className="text-[#C5A059]">{formatBRL(faltaFreteGratisCents, true)}</strong> para Frete Bonificado na Grande SP
              </span>
            )}
            <span className="text-stone-400">{progressPct}%</span>
          </div>

          <div className="w-full bg-[#0D0B0A] h-1.5 rounded-full overflow-hidden border border-[#2D2622]">
            <div
              className={`h-full transition-all duration-500 ${
                temFreteGratisSP ? "bg-emerald-500" : "bg-[#C5A059]"
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Linha Principal com Valores e Botão de Ação */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-base">
              📦
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-sm text-[#F5F2EB]">
                  {totalBoxes} {totalBoxes === 1 ? "Caixa" : "Caixas"}
                </span>
                <span className="text-[10px] text-[#A89F91]">
                  ({totalBottles} gfs)
                </span>
              </div>
              <span className="font-serif font-bold text-xs text-[#C5A059] block">
                {totalFormatted}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClearQuote}
              title="Esvaziar cotação"
              className="p-2 rounded-xl bg-[#0D0B0A] hover:bg-rose-950/40 text-[#A89F91] hover:text-rose-300 text-xs border border-[#2D2622] transition-colors cursor-pointer"
            >
              ✕
            </button>

            <button
              type="button"
              onClick={handleSendQuoteWhatsApp}
              className="py-2.5 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Cotar</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
};
