// src/components/B2BHeaderToggle.tsx
// Seletor e Status de Gatekeeping B2B no Header — Caminho das Uvas

import React, { useState, useEffect } from "react";
import { getB2BSession, lockB2BSession, subscribeB2BAuth, B2BSession } from "../lib/b2bAuth";

interface B2BHeaderToggleProps {
  onOpenGatekeeperModal: () => void;
}

export const B2BHeaderToggle: React.FC<B2BHeaderToggleProps> = ({
  onOpenGatekeeperModal,
}) => {
  const [session, setSession] = useState<B2BSession | null>(null);

  useEffect(() => {
    setSession(getB2BSession());
    const unsubscribe = subscribeB2BAuth((_unlocked, newSession) => {
      setSession(newSession);
    });
    return unsubscribe;
  }, []);

  const isUnlocked = session !== null;

  return (
    <div className="flex items-center gap-2">
      {isUnlocked ? (
        <div className="flex items-center gap-1.5 p-1 pl-2.5 rounded-full bg-[#171413] border border-emerald-500/40 text-xs shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] text-emerald-400 font-semibold hidden sm:inline">
            {session.formattedCnpj}
          </span>
          <span className="text-[10px] text-[#A89F91] font-semibold sm:hidden">
            PJ Ativo
          </span>
          <button
            type="button"
            onClick={lockB2BSession}
            title="Bloquear tabela de atacado (ocultar margens do cliente final)"
            className="ml-1 px-2 py-0.5 rounded-full bg-[#0D0B0A] hover:bg-rose-950/50 hover:text-rose-300 text-[#A89F91] text-[10px] border border-[#2D2622] transition-colors cursor-pointer"
          >
            🔒 Ocultar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenGatekeeperModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold transition-all cursor-pointer active:scale-95"
        >
          <span>🔒</span>
          <span>Tabela Restaurantes</span>
        </button>
      )}
    </div>
  );
};
