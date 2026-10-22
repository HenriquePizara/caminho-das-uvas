// src/components/BottomNavBar.tsx
// Barra de Navegação Inferior Fixa PWA — Padrão Comanda-Hub
// 4 Abas Canônicas: Catálogo (Home), Buscar & Terroirs, Simulador B2B e Sommelier

import React from "react";

export type TabId = "catalogo" | "buscar" | "simulador" | "sommelier";

interface BottomNavBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  quoteBoxCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  quoteBoxCount,
}) => {
  const TABS = [
    { id: "catalogo" as TabId, label: "Catálogo", icon: "🍷" },
    { id: "buscar" as TabId, label: "Buscar", icon: "🔍" },
    { id: "simulador" as TabId, label: "Simulador", icon: "📊" },
    { id: "sommelier" as TabId, label: "Sommelier", icon: "👤", badge: quoteBoxCount > 0 ? quoteBoxCount : null },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      aria-label="Navegação Principal do PWA"
      className="fixed bottom-0 inset-x-0 bg-[#0D0B0A]/95 backdrop-blur-md border-t border-[#2D2622] z-40 py-1.5 px-3 select-none shadow-2xl"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1 text-center">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all cursor-pointer active:scale-95 ${
                isActive
                  ? "text-[#C5A059] font-bold"
                  : "text-[#A89F91] hover:text-[#F5F2EB]"
              }`}
            >
              <span className="text-lg relative">
                {tab.icon}
                {tab.badge && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-[#721422] text-white text-[9px] font-mono font-black flex items-center justify-center border border-rose-500/40">
                    {tab.badge}
                  </span>
                )}
              </span>
              <span className={`text-[10px] mt-0.5 leading-tight ${isActive ? "font-bold text-[#C5A059]" : "font-medium"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
