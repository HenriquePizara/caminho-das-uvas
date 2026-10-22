// src/components/WineDrawer.tsx
// Drawer Lateral de Ficha Técnica Aberta — Padrão Caves Santa Cruz
// Permite que sommeliers e garçons consultem notas de prova, temperatura de serviço e harmonização

import React from "react";
import { WineProduct } from "../data/catalog";
import { formatBRL, calcBoxTotalCents } from "../lib/money";

interface WineDrawerProps {
  wine: WineProduct | null;
  isOpen: boolean;
  onClose: () => void;
  isB2BUnlocked: boolean;
  onOpenGatekeeper: () => void;
  onAddBoxToQuote?: (wine: WineProduct) => void;
}

export const WineDrawer: React.FC<WineDrawerProps> = ({
  wine,
  isOpen,
  onClose,
  isB2BUnlocked,
  onOpenGatekeeper,
  onAddBoxToQuote,
}) => {
  if (!isOpen || !wine) return null;

  const boxTotalCents = calcBoxTotalCents(wine.b2bUnitCents, wine.boxUnits, 1);
  const boxTotalFormatted = formatBRL(boxTotalCents, true);
  const unitB2BFormatted = formatBRL(wine.b2bUnitCents, true);
  const unitD2CFormatted = formatBRL(wine.d2cSuggestedUnitCents, true);

  const whatsappMessage = encodeURIComponent(
    `Olá Caminho das Uvas! Gostaria de consultar a disponibilidade do vinho ${wine.name} (${wine.vintage}) da vinícola ${wine.producer}.`
  );
  const whatsappUrl = `https://wa.me/5511983750676?text=${whatsappMessage}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-end selection:bg-[#721422] selection:text-white"
    >
      {/* Backdrop clicável para fechar */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Painel Lateral Slide-in */}
      <div className="relative w-full max-w-lg bg-[#171413] border-l border-[#C5A059]/30 h-full overflow-y-auto no-scrollbar shadow-2xl flex flex-col text-[#F5F2EB] z-10 animate-slide-in">
        
        {/* Header Fixo do Drawer */}
        <div className="sticky top-0 bg-[#171413]/95 backdrop-blur-md border-b border-[#2D2622] px-6 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="text-xl">{wine.countryFlag}</span>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block font-bold">
                {wine.region} • {wine.vintage}
              </span>
              <p className="font-serif text-sm font-bold text-[#F5F2EB] line-clamp-1">
                {wine.producer}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar ficha técnica"
            className="w-8 h-8 rounded-full bg-[#0D0B0A] hover:bg-white/10 border border-[#2D2622] flex items-center justify-center text-[#A89F91] hover:text-white transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Corpo com Rolagem */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Apresentação Visual do Rótulo */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#0D0B0A] to-[#1F1B1A] border border-[#2D2622] p-6 flex flex-col items-center text-center overflow-hidden">
            
            {/* Badges de Prêmios */}
            {wine.points && (
              <div className="absolute top-3 left-3 bg-[#721422] text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-rose-500/30 flex items-center gap-1 shadow-md">
                <span>★</span>
                <span>{wine.points.score} pts {wine.points.critic}</span>
              </div>
            )}

            {wine.certifiedOrganicOrBio && (
              <div className="absolute top-3 right-3 bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span>🌱</span>
                <span>Biológico / Orgânico</span>
              </div>
            )}

            {/* Imagem da Garrafa com Moldura de Autoridade */}
            <div className="h-64 sm:h-72 w-32 relative my-2 flex items-center justify-center">
              <div className="w-24 h-60 rounded-xl bg-gradient-to-t from-stone-900 to-stone-800 border border-[#C5A059]/20 flex flex-col items-center justify-center p-2 text-center shadow-2xl relative overflow-hidden">
                <div className="w-8 h-8 rounded-full border border-[#C5A059]/50 flex items-center justify-center text-[#C5A059] text-xs font-serif font-black mb-2">
                  C
                </div>
                <span className="font-serif text-[11px] font-bold text-[#F5F2EB] leading-tight">
                  {wine.name}
                </span>
                <span className="text-[9px] font-mono text-[#A89F91] mt-1">
                  {wine.vintage}
                </span>
                <div className="mt-3 text-[10px] text-[#C5A059]">
                  {wine.type}
                </div>
              </div>
            </div>

            <h1 className="font-serif text-2xl font-bold text-[#F5F2EB] mt-2 leading-tight">
              {wine.name}
            </h1>
            <p className="text-xs text-[#A89F91] mt-1">
              {wine.commercialLine} • {wine.bottleVolumeMl}ml
            </p>
          </div>

          {/* Bloco de Precificação Dinâmica (B2B vs D2C) */}
          <div className="p-4 rounded-2xl bg-[#0D0B0A] border border-[#2D2622] space-y-3">
            <div className="flex items-center justify-between border-b border-[#2D2622] pb-2.5">
              <span className="text-xs uppercase tracking-wider text-[#A89F91] font-semibold">
                Condições Comerciais
              </span>
              {isB2BUnlocked ? (
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  Tabela PJ Desbloqueada
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded-md border border-[#C5A059]/20">
                  Preço Sugerido Carta
                </span>
              )}
            </div>

            {isB2BUnlocked ? (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#A89F91]">Preço Garrafa (Atacado):</span>
                  <span className="font-serif font-bold text-xl text-[#F5F2EB]">
                    {unitB2BFormatted}
                  </span>
                </div>

                <div className="flex items-baseline justify-between p-2.5 rounded-xl bg-[#171413] border border-[#C5A059]/30">
                  <div>
                    <span className="text-xs font-bold text-[#C5A059] block">
                      Caixa com {wine.boxUnits} unidades:
                    </span>
                    <span className="text-[10px] text-[#A89F91]">
                      Mínimo: {wine.minOrderBoxes} caixa
                    </span>
                  </div>
                  <span className="font-serif font-black text-lg text-[#C5A059]">
                    {boxTotalFormatted}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#A89F91] pt-1">
                  <span>Preço Sugerido na Carta do Restaurante:</span>
                  <span className="font-semibold text-emerald-400">{unitD2CFormatted}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#A89F91]">Preço Sugerido ao Consumidor:</span>
                  <span className="font-serif font-bold text-xl text-[#F5F2EB]">
                    {unitD2CFormatted}
                  </span>
                </div>
                
                <div className="p-3 rounded-xl bg-[#171413] border border-[#C5A059]/40 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <p className="font-bold text-[#C5A059]">É Restaurante ou Sommelier?</p>
                    <p className="text-[10px] text-[#A89F91] leading-tight mt-0.5">
                      Desbloqueie os preços de importação direta com seu CNPJ.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenGatekeeper}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-[#C5A059] text-[#0D0B0A] text-xs font-bold hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  >
                    Desbloquear
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Especificações Técnicas (Padrão Caves Santa Cruz) */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#C5A059] uppercase tracking-wider">
              Ficha Técnica do Terroir
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-[#0D0B0A] border border-[#2D2622]">
                <span className="text-[10px] text-[#A89F91] block uppercase tracking-wider">Castas / Uvas</span>
                <span className="font-semibold text-[#F5F2EB] mt-0.5 block">
                  {wine.grapes.join(", ")}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0D0B0A] border border-[#2D2622]">
                <span className="text-[10px] text-[#A89F91] block uppercase tracking-wider">Graduação Alcoólica</span>
                <span className="font-semibold text-[#F5F2EB] mt-0.5 block">
                  {wine.alcoholPct}% vol.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0D0B0A] border border-[#2D2622]">
                <span className="text-[10px] text-[#A89F91] block uppercase tracking-wider">Estágio em Barrica</span>
                <span className="font-semibold text-[#F5F2EB] mt-0.5 block">
                  {wine.woodAgingMonths ? `${wine.woodAgingMonths} meses` : "Sem passagem por madeira"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0D0B0A] border border-[#2D2622]">
                <span className="text-[10px] text-[#A89F91] block uppercase tracking-wider">Temperatura de Serviço</span>
                <span className="font-semibold text-[#F5F2EB] mt-0.5 block">
                  {wine.serviceTemp}
                </span>
              </div>
            </div>
          </div>

          {/* Notas de Degustação para Brigada de Salão */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#C5A059] uppercase tracking-wider">
              Notas de Degustação & Guia de Salão
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#0D0B0A] border border-[#2D2622]">
                <span className="text-[10px] text-[#C5A059] font-bold block uppercase tracking-wider">Visual</span>
                <p className="text-[#F5F2EB] mt-0.5 leading-relaxed">
                  {wine.tastingNotes.visual}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0D0B0A] border border-[#2D2622]">
                <span className="text-[10px] text-[#C5A059] font-bold block uppercase tracking-wider">Olfato</span>
                <p className="text-[#F5F2EB] mt-0.5 leading-relaxed">
                  {wine.tastingNotes.aroma}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0D0B0A] border border-[#2D2622]">
                <span className="text-[10px] text-[#C5A059] font-bold block uppercase tracking-wider">Paladar</span>
                <p className="text-[#F5F2EB] mt-0.5 leading-relaxed">
                  {wine.tastingNotes.palate}
                </p>
              </div>
            </div>
          </div>

          {/* Harmonização Gastronômica */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#C5A059] uppercase tracking-wider">
              Harmonizações Recomendadas
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {wine.foodPairing.map((food, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-[#0D0B0A] border border-[#2D2622] text-xs text-[#F5F2EB] flex items-center gap-1.5"
                >
                  <span className="text-[#C5A059]">🍽️</span>
                  <span>{food}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Metadados Fiscais (DUN / EAN / NCM) */}
          <div className="p-3.5 rounded-xl bg-[#0D0B0A] border border-[#2D2622] text-[11px] font-mono text-[#A89F91] space-y-1">
            <div className="flex justify-between">
              <span>EAN Unitário:</span>
              <span className="text-[#F5F2EB]">{wine.ean}</span>
            </div>
            <div className="flex justify-between">
              <span>DUN-14 (Caixa de {wine.boxUnits}):</span>
              <span className="text-[#F5F2EB]">{wine.dun14}</span>
            </div>
            <div className="flex justify-between">
              <span>Classificação Fiscal NCM:</span>
              <span className="text-[#F5F2EB]">{wine.ncm}</span>
            </div>
          </div>
        </div>

        {/* Footer com Botões de Ação */}
        <div className="sticky bottom-0 bg-[#171413]/95 backdrop-blur-md border-t border-[#2D2622] p-4 flex items-center gap-2 z-20">
          {isB2BUnlocked && onAddBoxToQuote && (
            <button
              type="button"
              onClick={() => onAddBoxToQuote(wine)}
              className="flex-1 py-3 px-3 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#0D0B0A] text-xs font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>+ Adicionar 1 Cx ({wine.boxUnits} gfs)</span>
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 text-center cursor-pointer"
          >
            <span>💬 Cotar no WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
