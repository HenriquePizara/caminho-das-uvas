// src/components/WineCard.tsx
// Card Vertical Editorial (Proporção 2:3) — Padrão Alta Adega
// Caminho das Uvas • Desacoplado do visual de fast-food / delivery

import React from "react";
import { WineProduct } from "../data/catalog";
import { formatBRL, calcBoxTotalCents } from "../lib/money";

interface WineCardProps {
  wine: WineProduct;
  isB2BUnlocked: boolean;
  onSelectWine: (wine: WineProduct) => void;
  onAddBox?: (wine: WineProduct) => void;
}

export const WineCard: React.FC<WineCardProps> = ({
  wine,
  isB2BUnlocked,
  onSelectWine,
  onAddBox,
}) => {
  const boxTotalCents = calcBoxTotalCents(wine.b2bUnitCents, wine.boxUnits, 1);
  const boxTotalFormatted = formatBRL(boxTotalCents, true);
  const unitB2BFormatted = formatBRL(wine.b2bUnitCents, true);
  const unitD2CFormatted = formatBRL(wine.d2cSuggestedUnitCents, true);

  return (
    <div className="group relative rounded-3xl bg-[#171413] border border-[#2D2622] hover:border-[#C5A059]/50 transition-all duration-300 p-4 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl active:scale-[0.99]">
      
      {/* Topo do Card: País & Prêmios */}
      <div className="flex items-center justify-between z-10 mb-2">
        <span className="flex items-center gap-1.5 text-xs text-[#A89F91]">
          <span className="text-base">{wine.countryFlag}</span>
          <span className="font-mono text-[10px] tracking-wider uppercase text-[#C5A059] font-semibold">
            {wine.region}
          </span>
        </span>

        {wine.points && (
          <span className="bg-[#721422] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30 shadow-xs">
            {wine.points.score} pts
          </span>
        )}
      </div>

      {/* Área da Garrafa (Proporção Vertical 2:3 Centralizada) */}
      <div
        onClick={() => onSelectWine(wine)}
        className="relative my-3 h-48 sm:h-56 flex items-center justify-center cursor-pointer group-hover:scale-105 transition-transform duration-300"
      >
        {/* Glow sutil ao fundo da garrafa */}
        <div className="absolute w-28 h-28 rounded-full bg-[#C5A059]/5 blur-xl group-hover:bg-[#C5A059]/10 transition-colors" />

        {/* Garrafa estilizada recortada */}
        <div className="w-16 h-44 sm:w-20 sm:h-52 rounded-xl bg-gradient-to-t from-stone-950 via-stone-900 to-stone-800 border border-[#C5A059]/25 flex flex-col items-center justify-between p-2 text-center shadow-xl relative overflow-hidden">
          <div className="w-5 h-5 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] text-[9px] font-serif font-bold">
            C
          </div>

          <div className="my-auto">
            <span className="font-serif text-[10px] sm:text-xs font-bold text-[#F5F2EB] leading-tight line-clamp-2 block px-0.5">
              {wine.name}
            </span>
            <span className="text-[8px] font-mono text-[#A89F91] block mt-0.5">
              {wine.vintage}
            </span>
          </div>

          <span className="text-[8px] uppercase font-mono tracking-widest text-[#C5A059]/80 pb-1">
            {wine.type}
          </span>
        </div>
      </div>

      {/* Informações do Vinho */}
      <div className="mt-1 space-y-1.5 flex-1 flex flex-col justify-end">
        <p className="text-[10px] text-[#A89F91] uppercase tracking-wider font-mono line-clamp-1">
          {wine.producer}
        </p>

        <h3
          onClick={() => onSelectWine(wine)}
          className="font-serif text-base sm:text-lg font-bold text-[#F5F2EB] leading-tight line-clamp-1 hover:text-[#C5A059] transition-colors cursor-pointer"
        >
          {wine.name}
        </h3>

        <p className="text-[11px] text-stone-400 line-clamp-1">
          {wine.grapes.join(", ")}
        </p>

        {/* Bloco de Preços Dinâmicos (Atacado B2B vs Sugerido D2C) */}
        <div className="pt-2 border-t border-[#2D2622]">
          {isB2BUnlocked ? (
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] text-[#A89F91]">Garrafa PJ:</span>
                <span className="font-serif font-black text-sm text-[#F5F2EB]">
                  {unitB2BFormatted}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[10px] font-semibold text-[#C5A059]">
                  Caixa ({wine.boxUnits} un):
                </span>
                <span className="font-serif font-bold text-sm text-[#C5A059]">
                  {boxTotalFormatted}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] text-[#A89F91]">Sugerido Carta:</span>
                <span className="font-serif font-bold text-sm text-[#F5F2EB]">
                  {unitD2CFormatted}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#C5A059]">
                <span>Preço Atacado:</span>
                <span className="flex items-center gap-1 font-semibold">
                  <span>🔒</span>
                  <span>Via CNPJ</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="pt-2 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelectWine(wine)}
            className="flex-1 py-2 px-2 rounded-xl bg-[#0D0B0A] hover:bg-white/5 border border-[#2D2622] text-[11px] font-semibold text-[#F5F2EB] transition-colors cursor-pointer text-center"
          >
            Ficha Técnica
          </button>

          {isB2BUnlocked && onAddBox && (
            <button
              type="button"
              onClick={() => onAddBox(wine)}
              className="py-2 px-3 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0B0A] text-[11px] font-black transition-all active:scale-95 shadow-xs cursor-pointer flex items-center gap-1"
              title={`Adicionar 1 caixa com ${wine.boxUnits} garrafas`}
            >
              <span>+ Cx</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
