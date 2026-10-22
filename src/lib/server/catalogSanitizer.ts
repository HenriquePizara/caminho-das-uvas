// src/lib/server/catalogSanitizer.ts
// Higienização de Catálogo Server-Side — Caminho das Uvas
// Elimina b2bUnitCents do JSON caso o cliente não possua token B2B autenticado

import { WINE_CATALOG, WineProduct } from "../../data/catalog";
import { verifyB2BToken } from "./b2bValidator";

export type PublicWineProduct = Omit<WineProduct, "b2bUnitCents"> & {
  b2bUnitCents?: number;
  isB2BUnlocked: boolean;
};

export function getSanitizedCatalog(authHeaderOrToken?: string | null): PublicWineProduct[] {
  let token = authHeaderOrToken;
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  const isB2B = verifyB2BToken(token);

  return WINE_CATALOG.map((wine) => {
    if (isB2B) {
      return {
        ...wine,
        isB2BUnlocked: true,
      };
    }

    // Modo D2C / Visitante: EXPURGA b2bUnitCents do payload
    const { b2bUnitCents, ...publicFields } = wine;
    return {
      ...publicFields,
      isB2BUnlocked: false,
    };
  });
}
