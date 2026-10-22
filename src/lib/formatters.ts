// src/lib/formatters.ts
// Formatadores e Validadores Fiscais Brasileiros
// Portado diretamente de portfolio/loja para validação de CNPJ do Gatekeeper B2B

export function formatCNPJ(val: string): string {
  const clean = val.replace(/\D/g, "").slice(0, 14);
  if (clean.length <= 2) return clean;
  if (clean.length <= 5) return `${clean.slice(0, 2)}.${clean.slice(2)}`;
  if (clean.length <= 8) return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5)}`;
  if (clean.length <= 12) return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8)}`;
  return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8, 12)}-${clean.slice(12, 14)}`;
}

export function validateCNPJ(val?: string | null): boolean {
  if (!val) return false;
  const digits = val.replace(/\D/g, "");
  if (digits.length !== 14) return false;

  // Rejeita sequências de dígitos idênticos (ex: 00000000000000, 11111111111111)
  if (/^(\d)\1+$/.test(digits)) return false;

  // Validação do 1º dígito verificador
  let size = 12;
  let numbers = digits.substring(0, size);
  let pos = size - 7;
  let sum = 0;
  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(12))) return false;

  // Validação do 2º dígito verificador
  size = 13;
  numbers = digits.substring(0, size);
  pos = size - 7;
  sum = 0;
  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === Number(digits.charAt(13));
}

export function formatCEP(cep: string): string {
  const clean = cep.replace(/\D/g, "");
  if (clean.length <= 5) return clean;
  return `${clean.slice(0, 5)}-${clean.slice(5, 8)}`;
}

export function toE164Phone(val?: string | null): string | null {
  if (!val) return null;
  let digits = val.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    return `+${digits}`;
  }
  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`;
  }
  if (digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }
  return null;
}
