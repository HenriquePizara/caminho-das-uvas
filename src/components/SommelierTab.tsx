// src/components/SommelierTab.tsx
// Aba 4: Sommelier & Central do Cliente — Caminho das Uvas
// Atendimento consultivo, downloads de catálogos e FAQ anti-objeções de vendas

import React, { useState } from "react";
import { B2BSession, lockB2BSession } from "../lib/b2bAuth";

interface SommelierTabProps {
  session: B2BSession | null;
  onOpenGatekeeper: () => void;
}

export const SommelierTab: React.FC<SommelierTabProps> = ({
  session,
  onOpenGatekeeper,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isUnlocked = session !== null;

  const FAQS = [
    {
      q: "Qual o pedido mínimo para compras no atacado / PJ?",
      a: "Atendemos a partir de apenas 1 caixa fechada (podendo ser de 3, 6 ou 12 garrafas dependendo da linha do produtor, como Adega Grande em 12 un, Pousio em 6 un ou Conde d'Ervideira em 3 un). Na primeira compra de validação, permitimos mesclar caixas selecionadas.",
    },
    {
      q: "Como funciona o faturamento via boleto para restaurantes?",
      a: "Disponibilizamos faturamento em boleto bancário a prazo (28, 35 ou 42 dias) mediante aprovação cadastral simplificada do CNPJ (Sintegra ativo e análise de crédito ágil em até 2 horas úteis).",
    },
    {
      q: "Qual o prazo de entrega para Grande São Paulo, ABC e Interior?",
      a: "Entregas expressas em até 24 a 48 horas úteis para a capital paulista, Região Metropolitana e ABC. Nossos veículos contam com proteção térmica para preservar a integridade das garrafas.",
    },
    {
      q: "Vocês fornecem material para treinamento da equipe do restaurante?",
      a: "Sim! Disponibilizamos fichas técnicas completas estilo Caves Santa Cruz com notas sensoriais, temperatura de serviço e sugestões de harmonização gastronômica prontas para garçons e maîtres aumentarem o ticket médio da mesa.",
    },
    {
      q: "Consumidor final (pessoa física) pode comprar garrafas avulsas?",
      a: "Sim, no modo D2C atendemos apreciadores com pedidos faturados diretamente pelo nosso time de atendimento sommelier no WhatsApp para compras acima de R$ 350,00.",
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 py-4 text-[#F5F2EB]">
      {/* Título */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#F5F2EB]">
          Sommelier & Central de Atendimento
        </h2>
        <p className="text-xs text-[#A89F91] mt-0.5">
          Suporte especializado para cartas de vinhos gastronômicas, cotações e reposição de lotes.
        </p>
      </div>

      {/* Card de Status da Sessão */}
      <div className="p-5 rounded-3xl bg-[#171413] border border-[#2D2622] shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{isUnlocked ? "🏢" : "👤"}</span>
            <div>
              <h3 className="font-serif font-bold text-base text-[#F5F2EB]">
                {isUnlocked ? session.companyName : "Modo Consumidor Final (D2C)"}
              </h3>
              <p className="text-xs text-[#A89F91]">
                {isUnlocked
                  ? `CNPJ: ${session.formattedCnpj} • Tabela de Distribuição Ativa`
                  : "Visualizando preços sugeridos de varejo"}
              </p>
            </div>
          </div>

          {isUnlocked ? (
            <button
              type="button"
              onClick={lockB2BSession}
              className="px-3 py-1.5 rounded-xl bg-[#0D0B0A] hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              🔒 Bloquear
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenGatekeeper}
              className="px-3.5 py-1.5 rounded-xl bg-[#C5A059] text-[#0D0B0A] text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              Validar CNPJ
            </button>
          )}
        </div>
      </div>

      {/* Card de Contato Direto com Sommelier */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#171413] via-[#1A1615] to-[#0D0B0A] border border-[#C5A059]/40 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0D0B0A] border border-[#C5A059]/40 flex items-center justify-center text-2xl shadow-inner">
            🍷
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] font-bold">
              Plantão de Atendimento Consultivo
            </span>
            <h3 className="font-serif font-bold text-lg text-[#F5F2EB]">
              Falar com Sommelier Executivo
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#A89F91] leading-relaxed">
          Tire dúvidas técnicas sobre safras, composição de carta, margem protegida ou solicite um espelho de pedido formal via WhatsApp.
        </p>

        <a
          href="https://wa.me/5511983750676?text=Ol%C3%A1%20Caminho%20das%20Uvas%2C%20gostaria%20de%20falar%20com%20o%20sommelier%20para%20alinhar%20uma%20cota%C3%A7%C3%A3o%20comercial."
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs tracking-wider uppercase transition-all active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>💬 Conversar no WhatsApp (+55 11 98375-0676)</span>
          <span>↗</span>
        </a>
      </div>

      {/* Downloads de Catálogos em PDF */}
      <div className="p-5 rounded-3xl bg-[#171413] border border-[#2D2622] space-y-3">
        <span className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider block">
          Documentos Técnicos Oficiais
        </span>

        <div className="space-y-2">
          <div className="p-3 rounded-2xl bg-[#0D0B0A] border border-[#2D2622] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📄</span>
              <div>
                <p className="font-serif text-sm font-bold text-[#F5F2EB]">
                  Catálogo Técnico Caves Santa Cruz 2026
                </p>
                <p className="text-[10px] text-[#A89F91]">
                  Fichas completas, notas de prova e códigos DUN/EAN
                </p>
              </div>
            </div>
            <a
              href="https://wa.me/5511983750676?text=Ol%C3%A1%2C%20gostaria%20de%20receber%20o%20PDF%20do%20Cat%C3%A1logo%20T%C3%A9cnico%20Caves%20Santa%20Cruz."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#0D0B0A] hover:bg-white/5 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold transition-all cursor-pointer"
            >
              Solicitar PDF
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Comercial (Sanando Objeções) */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-[#A89F91] uppercase tracking-wider block">
          Perguntas Frequentes (FAQ Comercial)
        </span>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#171413] border border-[#2D2622] overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#F5F2EB] cursor-pointer hover:text-[#C5A059] transition-colors"
              >
                <span className="pr-2">{faq.q}</span>
                <span className="text-[#C5A059] text-sm shrink-0">
                  {openFaq === i ? "▲" : "▼"}
                </span>
              </button>

              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-[#A89F91] leading-relaxed border-t border-[#2D2622] pt-2.5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer de Compliance */}
      <div className="pt-4 pb-12 text-center text-[10px] text-stone-500 space-y-1">
        <p>Caminho das Uvas Distribuidora de Bebidas Ltda. • CNPJ em homologação</p>
        <p>Beba com moderação. Venda proibida para menores de 18 anos (Lei 8.069/90).</p>
      </div>
    </div>
  );
};
