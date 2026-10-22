// src/components/SearchTab.tsx
// Aba 2: Buscar & Terroirs — Caminho das Uvas
// Busca rápida por uva, região, produtor ou harmonização gastronômica + Grid de Terroirs

import React, { useState, useMemo } from "react";
import { WINE_CATALOG, WineProduct } from "../data/catalog";
import { WineCard } from "./WineCard";

interface SearchTabProps {
  isB2BUnlocked: boolean;
  onSelectWine: (wine: WineProduct) => void;
  onAddBox?: (wine: WineProduct) => void;
}

export const SearchTab: React.FC<SearchTabProps> = ({
  isB2BUnlocked,
  onSelectWine,
  onAddBox,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Mapeamento de Terroirs com contagem
  const TERROIRS = [
    { country: "Portugal", flag: "🇵🇹", count: WINE_CATALOG.filter((w) => w.country === "Portugal").length, desc: "Alentejo, Douro, Minho & Algarve" },
    { country: "Itália", flag: "🇮🇹", count: WINE_CATALOG.filter((w) => w.country === "Itália").length, desc: "Piemonte (Langhe) & Puglia (Salento)" },
    { country: "França", flag: "🇫🇷", count: WINE_CATALOG.filter((w) => w.country === "França").length, desc: "Vale do Rhône Sul (Châteauneuf)" },
    { country: "Argentina", flag: "🇦🇷", count: WINE_CATALOG.filter((w) => w.country === "Argentina").length, desc: "Valle de Uco (Mendoza)" },
  ];

  const filteredWines = useMemo(() => {
    return WINE_CATALOG.filter((wine) => {
      const matchCountry = selectedCountry ? wine.country === selectedCountry : true;
      if (!matchCountry) return false;

      if (!searchTerm.trim()) return true;

      const term = searchTerm.toLowerCase();
      const matchName = wine.name.toLowerCase().includes(term);
      const matchProducer = wine.producer.toLowerCase().includes(term);
      const matchRegion = wine.region.toLowerCase().includes(term);
      const matchGrapes = wine.grapes.some((g) => g.toLowerCase().includes(term));
      const matchPairing = wine.foodPairing.some((f) => f.toLowerCase().includes(term));

      return matchName || matchProducer || matchRegion || matchGrapes || matchPairing;
    });
  }, [searchTerm, selectedCountry]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-4 text-[#F5F2EB]">
      {/* Título */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#F5F2EB]">
          Buscar no Catálogo & Terroirs
        </h2>
        <p className="text-xs text-[#A89F91] mt-0.5">
          Pesquise por castas (Touriga, Nebbiolo, Malbec), vinícolas, regiões ou pratos para harmonizar.
        </p>
      </div>

      {/* Campo de Busca com Ícone */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ex: Barolo, Alicante Bouschet, Cordeiro, Douro..."
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-[#171413] border border-[#2D2622] text-sm text-[#F5F2EB] placeholder:text-stone-500 focus:outline-none focus:border-[#C5A059] shadow-lg transition-all"
        />
        <span className="absolute left-4 top-3.5 text-[#C5A059] text-base">
          🔍
        </span>
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-3.5 top-3.5 text-[#A89F91] hover:text-white text-xs font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Grid de Terroirs / Países */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider">
            Navegar por Região Produtora
          </span>
          {selectedCountry && (
            <button
              type="button"
              onClick={() => setSelectedCountry(null)}
              className="text-xs text-[#C5A059] hover:underline cursor-pointer"
            >
              ✕ Ver Todos os Países
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TERROIRS.map((t) => (
            <button
              key={t.country}
              type="button"
              onClick={() => setSelectedCountry(selectedCountry === t.country ? null : t.country)}
              className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer active:scale-95 ${
                selectedCountry === t.country
                  ? "bg-[#C5A059]/15 border-[#C5A059] shadow-md"
                  : "bg-[#171413] border-[#2D2622] hover:border-[#C5A059]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{t.flag}</span>
                <span className="text-[10px] font-mono font-bold text-[#C5A059]">
                  {t.count} rótulos
                </span>
              </div>
              <h3 className="font-serif font-bold text-sm text-[#F5F2EB] mt-1.5 leading-tight">
                {t.country}
              </h3>
              <p className="text-[10px] text-[#A89F91] mt-0.5 line-clamp-1">
                {t.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Resultados da Busca */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider">
            {filteredWines.length} {filteredWines.length === 1 ? "Rótulo Encontrado" : "Rótulos Encontrados"}
          </span>
        </div>

        {filteredWines.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#171413] border border-[#2D2622] text-center space-y-2">
            <span className="text-3xl">🍷</span>
            <p className="font-serif text-base font-bold text-[#F5F2EB]">
              Nenhum rótulo encontrado para "{searchTerm}"
            </p>
            <p className="text-xs text-[#A89F91]">
              Tente buscar por termos como "Alentejo", "Syrah", "Bacalhau" ou limpe os filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {filteredWines.map((wine) => (
              <WineCard
                key={wine.id}
                wine={wine}
                isB2BUnlocked={isB2BUnlocked}
                onSelectWine={onSelectWine}
                onAddBox={onAddBox}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
