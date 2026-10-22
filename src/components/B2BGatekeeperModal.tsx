// src/components/B2BGatekeeperModal.tsx
// Modal de Gatekeeping B2B — Caminho das Uvas
// Desbloqueio da Tabela de Importação Direta e Simulador de Margem via CNPJ

import React, { useState, useEffect } from "react";
import { formatCNPJ, validateCNPJ } from "../lib/formatters";
import { unlockB2BSession, getB2BSession, B2BSession } from "../lib/b2bAuth";

interface B2BGatekeeperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (session: B2BSession) => void;
}

export const B2BGatekeeperModal: React.FC<B2BGatekeeperModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [cnpj, setCnpj] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<B2BSession["role"]>("restaurante");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsSuccess(false);
      const current = getB2BSession();
      if (current) {
        setCnpj(current.formattedCnpj);
        setCompanyName(current.companyName || "");
        setRole(current.role);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatCNPJ(raw);
    setCnpj(formatted);
    if (error) setError(null);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCnpj = cnpj.replace(/\D/g, "");

    if (cleanCnpj.length !== 14) {
      setError("O CNPJ deve conter exatamente 14 dígitos.");
      return;
    }

    if (!validateCNPJ(cleanCnpj)) {
      setError("CNPJ com dígitos verificadores inválidos. Verifique os dados da sua empresa.");
      return;
    }

    const result = unlockB2BSession(cleanCnpj, companyName, role);

    if (result.success && result.session) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess?.(result.session!);
        onClose();
      }, 700);
    } else {
      setError(result.error || "Não foi possível validar o CNPJ.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 selection:bg-[#721422] selection:text-white"
    >
      <div className="w-full max-w-md bg-[#171413] border border-[#C5A059]/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-[#F5F2EB]">
        
        {/* Glow sutil dourado no topo */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-80" />

        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute top-4 right-4 text-[#A89F91] hover:text-[#F5F2EB] p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-sm"
        >
          ✕
        </button>

        {/* Cabeçalho de Autoridade */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-[#0D0B0A] border border-[#C5A059]/30 flex items-center justify-center text-xl shadow-inner">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-black text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 px-2 py-0.5 rounded-md">
                Área Exclusiva PJ
              </span>
            </div>
            <h2 className="font-serif text-lg font-bold text-[#F5F2EB] leading-tight mt-0.5">
              Desbloqueio de Tabela para Restaurantes
            </h2>
          </div>
        </div>

        {/* Mensagem de Compliance & Proteção de Canal */}
        <div className="p-3.5 rounded-2xl bg-[#0D0B0A]/80 border border-[#2D2622] text-xs text-[#A89F91] space-y-1.5 mb-5">
          <p className="font-semibold text-[#F5F2EB] flex items-center gap-1.5">
            <span>🔒</span>
            <span>Por que exigimos o CNPJ?</span>
          </p>
          <p className="leading-relaxed">
            Protegemos a <strong>margem da carta de vinhos</strong> do seu restaurante. Para que seu cliente final não tenha acesso aos preços diretos de atacado, a tabela por caixa fechada é restrita a estabelecimentos cadastrados.
          </p>
        </div>

        {/* Formulário de Desbloqueio */}
        <form onSubmit={handleUnlock} className="space-y-4">
          {/* Campo CNPJ */}
          <div>
            <label className="block text-xs font-semibold text-[#F5F2EB] mb-1.5">
              CNPJ do Estabelecimento <span className="text-[#C5A059]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cnpj}
                onChange={handleCnpjChange}
                placeholder="00.000.000/0001-00"
                maxLength={18}
                inputMode="numeric"
                className={`w-full px-4 py-3 rounded-xl bg-[#0D0B0A] border text-sm font-mono text-[#F5F2EB] placeholder:text-stone-600 focus:outline-none transition-all ${
                  error
                    ? "border-rose-600 focus:border-rose-500"
                    : isSuccess
                    ? "border-emerald-500 focus:border-emerald-400"
                    : "border-[#2D2622] focus:border-[#C5A059]"
                }`}
                autoFocus
              />
              <span className="absolute right-3.5 top-3 text-sm">
                {isSuccess ? "✅" : cnpj.length === 18 && validateCNPJ(cnpj) ? "🟢" : "🏢"}
              </span>
            </div>
          </div>

          {/* Nome Fantasia (Opcional) */}
          <div>
            <label className="block text-xs font-semibold text-[#F5F2EB] mb-1.5">
              Nome Fantasia do Restaurante ou Adega <span className="text-stone-500 text-[10px]">(Opcional)</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Trattoria Fasano / Adega Boutique"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0B0A] border border-[#2D2622] text-sm text-[#F5F2EB] placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Tipo de Estabelecimento */}
          <div>
            <label className="block text-xs font-semibold text-[#F5F2EB] mb-1.5">
              Perfil do Negócio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "restaurante", label: "Restaurante" },
                { id: "adega", label: "Adega / Empório" },
                { id: "sommelier", label: "Sommelier / A&B" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id as B2BSession["role"])}
                  className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer text-center ${
                    role === item.id
                      ? "bg-[#C5A059]/15 border-[#C5A059] text-[#C5A059]"
                      : "bg-[#0D0B0A] border-[#2D2622] text-[#A89F91] hover:border-stone-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback de Erro */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2 animate-shake">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Feedback de Sucesso */}
          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
              <span>✅</span>
              <span>CNPJ Homologado com sucesso! Desbloqueando tabela de importação...</span>
            </div>
          )}

          {/* Botão de Ação */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSuccess}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#C5A059] text-[#0D0B0A] font-bold text-sm tracking-wide shadow-lg hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isSuccess ? "DESBLOQUEADO" : "DESBLOQUEAR TABELA PJ"}</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs text-[#A89F91] hover:text-[#F5F2EB] transition-colors cursor-pointer text-center"
            >
              Continuar navegando como consumidor final (D2C)
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
