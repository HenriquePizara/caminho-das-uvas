// src/components/PwaApp.tsx
// Orquestrador Master da Aplicação PWA — Caminho das Uvas
// Padrão SPA 4 Abas sem reload + Estética Editorial Dark Luxury + Ficha Técnica Aberta

import React, { useState, useEffect } from "react";
import { WINE_CATALOG, WineProduct } from "../data/catalog";
import { getB2BSession, subscribeB2BAuth, B2BSession } from "../lib/b2bAuth";
import { WineCard } from "./WineCard";
import { WineDrawer } from "./WineDrawer";
import { B2BGatekeeperModal } from "./B2BGatekeeperModal";
import { B2BHeaderToggle } from "./B2BHeaderToggle";
import { BottomNavBar, TabId } from "./BottomNavBar";
import { FloatingQuoteBar, QuoteItem } from "./FloatingQuoteBar";
import { SimulatorTab } from "./SimulatorTab";
import { SearchTab } from "./SearchTab";
import { SommelierTab } from "./SommelierTab";

export const PwaApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("catalogo");
  const [session, setSession] = useState<B2BSession | null>(null);
  const [selectedWine, setSelectedWine] = useState<WineProduct | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGatekeeperOpen, setIsGatekeeperOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);

  // Sincronização de Sessão B2B com localStorage
  useEffect(() => {
    setSession(getB2BSession());
    const unsubscribe = subscribeB2BAuth((_unlocked, newSession) => {
      setSession(newSession);
    });
    return unsubscribe;
  }, []);

  const isB2BUnlocked = session !== null;

  // Filtragem de Categoria da Aba 1
  const CATEGORIES = [
    { id: "todos", label: "🍇 Todos os Vinhos" },
    { id: "terroirs_icones", label: "👑 Grandes Terroirs & Ícones" },
    { id: "alto_giro", label: "⚡ Alto Giro & Margem" },
    { id: "biologicos_inovacao", label: "🌱 Biológicos & Ânfora" },
    { id: "azeites_especiais", label: "🫒 Azeites Nobres" },
  ];

  const visibleWines = WINE_CATALOG.filter((w) => {
    if (selectedCategory === "todos") return true;
    return w.category === selectedCategory;
  });

  // Manipulação de Drawer
  const handleOpenWine = (wine: WineProduct) => {
    setSelectedWine(wine);
    setIsDrawerOpen(true);
  };

  const handleCloseWine = () => {
    setIsDrawerOpen(false);
  };

  // Manipulação de Cotação de Caixas
  const handleAddBox = (wine: WineProduct) => {
    setQuoteItems((prev) => {
      const existing = prev.find((item) => item.wine.id === wine.id);
      if (existing) {
        return prev.map((item) =>
          item.wine.id === wine.id ? { ...item, boxes: item.boxes + 1 } : item
        );
      }
      return [...prev, { wine, boxes: 1 }];
    });
  };

  const handleClearQuote = () => {
    setQuoteItems([]);
  };

  return (
    <div className="bg-[#0D0B0A] text-[#F5F2EB] min-h-screen antialiased selection:bg-[#721422] selection:text-white pb-28">
      
      {/* ── 1. HEADER FIXO DE AUTORIDADE ── */}
      <header className="sticky top-0 z-40 bg-[#0D0B0A]/95 backdrop-blur-md border-b border-[#2D2622] px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          
          {/* Logo e Nome */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#171413] to-[#25201E] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] font-serif font-black text-xl shadow-inner">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-[#F5F2EB] leading-tight">
                  Caminho das Uvas
                </span>
                <span className="text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded-full bg-[#171413] border border-[#2D2622] text-[#C5A059] hidden sm:inline">
                  Importação Direta
                </span>
              </div>
              <p className="text-[10px] text-[#A89F91] font-mono leading-none mt-0.5">
                Vinhos de Terroir & Gastronomia
              </p>
            </div>
          </div>

          {/* Seletor B2B / CNPJ */}
          <B2BHeaderToggle onOpenGatekeeperModal={() => setIsGatekeeperOpen(true)} />
        </div>
      </header>

      {/* ── 2. BARRA DE STATUS LOGÍSTICO (CLIMATIZADO 24/7) ── */}
      <div className="bg-[#171413] border-b border-[#2D2622] px-4 py-1.5 text-[10px] text-[#A89F91]">
        <div className="max-w-4xl mx-auto flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#F5F2EB]">Estoque Climatizado 24/7</span>
            <span className="text-stone-500">•</span>
            <span>Envio em 24h p/ Grande SP</span>
          </span>
          <span className="hidden sm:inline text-[#C5A059]">
            Logística Reversa eureciclo
          </span>
        </div>
      </div>

      {/* ── 3. CORPO MULTI-VIEW (4 ABAS SPA) ── */}
      <main className="max-w-4xl mx-auto">
        
        {/* ABA 1: CATÁLOGO DE VINHOS (HOME) */}
        {activeTab === "catalogo" && (
          <div className="p-4 space-y-6 animate-fade-in">
            
            {/* Hero de Autoridade */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#171413] via-[#1A1615] to-[#0D0B0A] border border-[#2D2622] relative overflow-hidden shadow-xl">
              <div className="max-w-xl space-y-2 relative z-10">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold">
                  Curadoria Técnica Caves Santa Cruz
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F2EB] leading-tight">
                  Vinhos que levam mais longe: do Velho ao Novo Mundo.
                </h1>
                <p className="text-xs text-[#A89F91] leading-relaxed">
                  Conexão direta com os terroirs mais autênticos de Portugal, Itália, França e América do Sul. Margem protegida para o seu restaurante e suporte sommelier especializado.
                </p>

                {/* Selos dos Países */}
                <div className="pt-2 flex items-center gap-3 text-xs text-[#F5F2EB]">
                  <span title="Portugal">🇵🇹 Portugal</span>
                  <span title="Itália">🇮🇹 Itália</span>
                  <span title="França">🇫🇷 França</span>
                  <span title="Argentina">🇦🇷 Argentina</span>
                  <span title="Chile">🇨🇱 Chile</span>
                </div>
              </div>
            </div>

            {/* Chips de Categorias Estilo iFood Refinado */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    selectedCategory === cat.id
                      ? "bg-[#C5A059] text-[#0D0B0A] font-bold shadow-md"
                      : "bg-[#171413] text-[#A89F91] hover:text-[#F5F2EB] border border-[#2D2622]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid de Cards Verticais (Proporção 2:3) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {visibleWines.map((wine) => (
                <WineCard
                  key={wine.id}
                  wine={wine}
                  isB2BUnlocked={isB2BUnlocked}
                  onSelectWine={handleOpenWine}
                  onAddBox={handleAddBox}
                />
              ))}
            </div>
          </div>
        )}

        {/* ABA 2: BUSCA & TERROIRS */}
        {activeTab === "buscar" && (
          <SearchTab
            isB2BUnlocked={isB2BUnlocked}
            onSelectWine={handleOpenWine}
            onAddBox={handleAddBox}
          />
        )}

        {/* ABA 3: SIMULADOR DE MARGEM B2B */}
        {activeTab === "simulador" && (
          <SimulatorTab
            isB2BUnlocked={isB2BUnlocked}
            onOpenGatekeeper={() => setIsGatekeeperOpen(true)}
          />
        )}

        {/* ABA 4: SOMMELIER & CENTRAL DO CLIENTE */}
        {activeTab === "sommelier" && (
          <SommelierTab
            session={session}
            onOpenGatekeeper={() => setIsGatekeeperOpen(true)}
          />
        )}
      </main>

      {/* ── 4. BARRA FLUTUANTE DE COTAÇÃO (QUANDO HOUVER ITENS) ── */}
      <FloatingQuoteBar
        items={quoteItems}
        onClearQuote={handleClearQuote}
      />

      {/* ── 5. BOTTOM NAVIGATION BAR FIXA (4 ABAS) ── */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        quoteBoxCount={quoteItems.reduce((acc, curr) => acc + curr.boxes, 0)}
      />

      {/* ── 6. DRAWER LATERAL DE FICHA TÉCNICA ABERTA ── */}
      <WineDrawer
        wine={selectedWine}
        isOpen={isDrawerOpen}
        onClose={handleCloseWine}
        isB2BUnlocked={isB2BUnlocked}
        onOpenGatekeeper={() => {
          setIsDrawerOpen(false);
          setIsGatekeeperOpen(true);
        }}
        onAddBoxToQuote={handleAddBox}
      />

      {/* ── 7. MODAL DE GATEKEEPING B2B (CNPJ) ── */}
      <B2BGatekeeperModal
        isOpen={isGatekeeperOpen}
        onClose={() => setIsGatekeeperOpen(false)}
        onSuccess={(newSession) => setSession(newSession)}
      />
    </div>
  );
};
