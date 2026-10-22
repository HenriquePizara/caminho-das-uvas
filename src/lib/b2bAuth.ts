// src/lib/b2bAuth.ts
// Gerenciador de Sessão e Gatekeeping B2B — Caminho das Uvas
// Proteção de canal de restaurantes contra exposição indevida ao consumidor final

import { validateCNPJ, formatCNPJ } from "./formatters";

export interface B2BSession {
  cnpj: string;
  formattedCnpj: string;
  companyName?: string;
  role: "restaurante" | "adega" | "hotel" | "emporio" | "sommelier";
  unlockedAt: string;
  token: string;
}

const STORAGE_KEY = "caminho_uvas_b2b_session_v1";
const AUTH_EVENT_NAME = "caminho:b2b-auth-changed";

export function getB2BSession(): B2BSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session: B2BSession = JSON.parse(raw);
    if (session && validateCNPJ(session.cnpj)) {
      return session;
    }
    // Se a sessão estiver corrompida ou inválida, expurga
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
}

export function isB2BUnlocked(): boolean {
  return getB2BSession() !== null;
}

export interface UnlockResult {
  success: boolean;
  error?: string;
  session?: B2BSession;
}

export function unlockB2BSession(
  cnpjInput: string,
  companyName?: string,
  role: B2BSession["role"] = "restaurante"
): UnlockResult {
  const cleanCnpj = cnpjInput.replace(/\D/g, "");

  if (!validateCNPJ(cleanCnpj)) {
    return {
      success: false,
      error: "CNPJ inválido. Verifique os dígitos digitados.",
    };
  }

  const session: B2BSession = {
    cnpj: cleanCnpj,
    formattedCnpj: formatCNPJ(cleanCnpj),
    companyName: companyName?.trim() || "Restaurante / Adega Parceira",
    role,
    unlockedAt: new Date().toISOString(),
    token: `b2b_${cleanCnpj}_${Date.now()}`,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    dispatchAuthChange(session);
    return { success: true, session };
  } catch {
    return {
      success: false,
      error: "Falha ao gravar sessão local no navegador.",
    };
  }
}

export function lockB2BSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    dispatchAuthChange(null);
  } catch {
    // Ignora erro de expurgo
  }
}

function dispatchAuthChange(session: B2BSession | null): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTH_EVENT_NAME, {
      detail: {
        unlocked: session !== null,
        session,
      },
    })
  );
}

export function subscribeB2BAuth(
  callback: (unlocked: boolean, session: B2BSession | null) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (e: Event) => {
    const custom = e as CustomEvent<{ unlocked: boolean; session: B2BSession | null }>;
    callback(custom.detail.unlocked, custom.detail.session);
  };

  window.addEventListener(AUTH_EVENT_NAME, handler);

  // Retorna função para unsubscribe
  return () => {
    window.removeEventListener(AUTH_EVENT_NAME, handler);
  };
}
