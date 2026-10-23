// src/data/catalog.ts
// Catálogo Técnico Oficial — Caminho das Uvas (Base Caves Santa Cruz & Importação Direta)
// Versão do Catálogo: 1.0.1 (Revalidação via SW_VERSION)

export interface WineProduct {
  id: string;
  slug: string;
  name: string;
  commercialLine: string;
  producer: string;
  country: "Portugal" | "Itália" | "França" | "Chile" | "Argentina";
  countryFlag: string;
  region: string;
  vintage: string;
  category: "alto_giro" | "terroirs_icones" | "biologicos_inovacao" | "azeites_especiais" | "kit_degustacao";
  type: "Tinto" | "Branco" | "Rosé" | "Laranja" | "Fortificado" | "Azeite" | "Kit Misto";
  grapes: string[];
  alcoholPct: number;
  woodAgingMonths?: number;
  points?: {
    score: number;
    critic: "Robert Parker" | "Decanter" | "James Suckling" | "Luca Maroni" | "Berlin GOOA" | "Brazil IOOC" | "Wine Enthusiast" | string;
    medal?: string;
  };
  
  // ── Embalagem & Logística B2B Real (Sem a armadilha de caixa fixa de 6) ──
  boxUnits: 3 | 6 | 12; // Unidades físicas reais da caixa
  minOrderBoxes: number; // Mínimo de caixas para faturamento atacado (default 1)
  bottleVolumeMl: number; // 750ml, 500ml ou 5000ml (galão)
  
  // ── Precificação em Centavos Inteiros (money.ts) ──
  b2bUnitCents: number; // Preço unitário da tabela de importação (custo restaurante)
  d2cSuggestedUnitCents: number; // Preço sugerido de varejo na carta / D2C (mark-up protegido)
  
  // ── Metadados Fiscais e Logísticos ──
  ncm: string; // "2204" (vinhos) ou "1509" (azeites)
  ean: string;
  dun14: string;
  
  // ── Ficha Técnica Aberta (Estilo Caves Santa Cruz para Brigadas) ──
  tastingNotes: {
    visual: string;
    aroma: string;
    palate: string;
  };
  serviceTemp: string;
  foodPairing: string[];
  certifiedOrganicOrBio?: boolean;
  imageUrl: string;
}

export const SW_CATALOG_VERSION = "v1.0.1";

export const WINE_CATALOG: WineProduct[] = [
  // ─────────────────────────────────────────────────────────────
  // 0. KIT DE HOMOLOGAÇÃO: CAIXA DE PROVA DO SOMMELIER (B2B ENTRY)
  // ─────────────────────────────────────────────────────────────
  {
    id: "kit-homologacao-sommelier-6",
    slug: "kit-homologacao-sommelier-6",
    name: "Caixa de Prova do Sommelier (Kit Homologação B2B)",
    commercialLine: "Seleção do Sommelier",
    producer: "Caminho das Uvas (Curadoria Especial)",
    country: "Portugal",
    countryFlag: "🍷",
    region: "Portugal, França & Itália",
    vintage: "Lote Degustação 2026",
    category: "kit_degustacao",
    type: "Kit Misto",
    grapes: ["Alicante Bouschet", "Avesso", "Crato Branco", "Aragonez", "Touriga Nacional"],
    alcoholPct: 13.5,
    boxUnits: 6, // 6 garrafas sortidas para teste de salão
    minOrderBoxes: 1,
    bottleVolumeMl: 750,
    b2bUnitCents: 49000, // R$ 490,00 o kit completo de 6 rótulos
    d2cSuggestedUnitCents: 79000, // R$ 790,00 se comprado avulso no varejo
    ncm: "2204.21.00",
    ean: "5609999000011",
    dun14: "15609999000018",
    tastingNotes: {
      visual: "Mosaico cromático: do palha brilhante ao rubi opaco.",
      aroma: "Painel completo de terroirs: frescor mineral atlântico, laranjas de ânfora e fruta madura alentejana.",
      palate: "Projetado para validação em salão: permite à brigada degustar os 6 perfis antes da compra de lotes maiores."
    },
    serviceTemp: "Conforme cada garrafa (10°C a 18°C)",
    foodPairing: ["Cardápio executivo", "Menu degustação", "Testes de harmonização da equipe de salão"],
    imageUrl: "/wines/kit-sommelier.png"
  },
  // ─────────────────────────────────────────────────────────────
  // 1. TERROIRS & ÍCONES: PORTUGAL (ALENTEJO)
  // ─────────────────────────────────────────────────────────────
  {
    id: "pousio-selection-tinto",
    slug: "pousio-selection-tinto",
    name: "Pousio Selection Tinto",
    commercialLine: "Pousio",
    producer: "Herdade Monte da Ribeira",
    country: "Portugal",
    countryFlag: "🇵🇹",
    region: "Alentejo (Vidigueira)",
    vintage: "2022",
    category: "alto_giro",
    type: "Tinto",
    grapes: ["Alicante Bouschet", "Trincadeira", "Aragonez"],
    alcoholPct: 14.0,
    boxUnits: 6,
    minOrderBoxes: 1,
    bottleVolumeMl: 750,
    b2bUnitCents: 5191, // R$ 51,91 (Caixa com 6 = R$ 311,46)
    d2cSuggestedUnitCents: 8990, // R$ 89,90 na carta
    ncm: "2204.21.00",
    ean: "5603770001012",
    dun14: "15603770001019",
    tastingNotes: {
      visual: "Granada profunda com auréola rubi viva.",
      aroma: "Frutos silvestres maduros, amoras e notas balsâmicas discretas.",
      palate: "Taninos macios, frescor equilibrado e final persistente e aveludado."
    },
    serviceTemp: "16°C a 18°C",
    foodPairing: ["Carnes grelhadas", "Costela bovina", "Queijos curados de ovelha"],
    imageUrl: "/wines/pousio-selection.png"
  },
  {
    id: "pousio-reserva-tinto",
    slug: "pousio-reserva-tinto",
    name: "Pousio Reserva Tinto",
    commercialLine: "Pousio",
    producer: "Herdade Monte da Ribeira",
    country: "Portugal",
    countryFlag: "🇵🇹",
    region: "Alentejo (Vidigueira)",
    vintage: "2020",
    category: "terroirs_icones",
    type: "Tinto",
    grapes: ["Alicante Bouschet", "Touriga Nacional", "Syrah"],
    alcoholPct: 14.5,
    woodAgingMonths: 12,
    points: { score: 92, critic: "Decanter", medal: "Silver Medal" },
    boxUnits: 6,
    minOrderBoxes: 1,
    bottleVolumeMl: 750,
    b2bUnitCents: 13840, // R$ 138,40 (Caixa com 6 = R$ 830,40)
    d2cSuggestedUnitCents: 22900, // R$ 229,00 na carta
    ncm: "2204.21.00",
    ean: "5603770002040",
    dun14: "15603770002047",
    tastingNotes: {
      visual: "Rubi intenso quase opaco com reflexos violáceos.",
      aroma: "Compota de amora preta, cacau nobre, especiarias doces e baunilha francesa.",
      palate: "Estrutura monumental, taninos polidos pela barrica e final longo de excepcional elegância."
    },
    serviceTemp: "16°C a 18°C",
    foodPairing: ["Bife Ancho na brasa", "Cordeiro assado no alecrim", "Risotto de ossobuco"],
    imageUrl: "/wines/pousio-reserva.png"
  },
  {
    id: "pousio-marmelar-icon",
    slug: "pousio-marmelar-icon",
    name: "Marmelar Tinto Ícone",
    commercialLine: "Pousio",
    producer: "Herdade Monte da Ribeira",
    country: "Portugal",
    countryFlag: "🇵🇹",
    region: "Alentejo (Vidigueira)",
    vintage: "2017",
    category: "terroirs_icones",
    type: "Tinto",
    grapes: ["Alicante Bouschet", "Touriga Nacional"],
    alcoholPct: 15.0,
    woodAgingMonths: 18,
    points: { score: 94, critic: "Robert Parker" },
    boxUnits: 6,
    minOrderBoxes: 1,
    bottleVolumeMl: 750,
    b2bUnitCents: 37400, // R$ 374,00 (Caixa com 6 = R$ 2.244,00)
    d2cSuggestedUnitCents: 59000, // R$ 590,00 na carta
    ncm: "2204.21.00",
    ean: "5603770003023",
    dun14: "15603770003020",
    tastingNotes: {
      visual: "Púrpura impenetrável.",
      aroma: "Complexidade extrema: figos secos, tabaco cubano, couro legítimo e grafite.",
      palate: "Densidade mastigável, acidez vibrante de terroir e final que dura mais de 60 segundos."
    },
    serviceTemp: "18°C (Recomenda-se decantação de 45 min)",
    foodPairing: ["Javali estufado", "Carré de cordeiro trufado", "Queijo Serra da Estrela amanteigado"],
    imageUrl: "/wines/marmelar-icon.png"
  },

  // ─────────────────────────────────────────────────────────────
  // 2. BIOLÓGICOS, VINHOS DE ÂNFORA & INOVAÇÃO
  // ─────────────────────────────────────────────────────────────
  {
    id: "morgado-quintao-curtimenta",
    slug: "morgado-quintao-curtimenta",
    name: "Morgado do Quintão Curtimenta Branco / Laranja",
    commercialLine: "Morgado do Quintão",
    producer: "Morgado do Quintão (Vinhas Centenárias)",
    country: "Portugal",
    countryFlag: "🇵🇹",
    region: "Algarve (Lagoa)",
    vintage: "2021",
    category: "biologicos_inovacao",
    type: "Laranja",
    grapes: ["Crato Branco (Roupeiro)", "Arinto"],
    alcoholPct: 12.5,
    woodAgingMonths: 6,
    certifiedOrganicOrBio: true,
    points: { score: 93, critic: "Robert Parker" },
    boxUnits: 6,
    minOrderBoxes: 1,
    bottleVolumeMl: 750,
    b2bUnitCents: 38710, // R$ 387,10
    d2cSuggestedUnitCents: 59900, // R$ 599,00
    ncm: "2204.21.00",
    ean: "5600789012345",
    dun14: "15600789012342",
    tastingNotes: {
      visual: "Âmbar brilhante com reflexos alaranjados de maceração pelicular prolongada.",
      aroma: "Casca de laranja confitada, flor de laranjeira, damascos secos e salinidade atlântica.",
      palate: "Taninos finos e textura envolvente de vinho laranja autêntico, com acidez cortante e final salino."
    },
    serviceTemp: "12°C a 14°C",
    foodPairing: ["Polvo à lagareiro", "Moqueca capixaba", "Culinária japonesa e peixes gordos"],
    imageUrl: "/wines/morgado-curtimenta.png"
  },
  {
    id: "a-and-d-monologo-avesso",
    slug: "a-and-d-monologo-avesso",
    name: "Monólogo Avesso P706 DOC",
    commercialLine: "A&D Wines",
    producer: "Quinta de Santa Teresa",
    country: "Portugal",
    countryFlag: "🇵🇹",
    region: "Vinho Verde (Sub-região de Baião)",
    vintage: "2022",
    category: "biologicos_inovacao",
    type: "Branco",
    grapes: ["Avesso 100%"],
    alcoholPct: 13.0,
    certifiedOrganicOrBio: true,
    points: { score: 91, critic: "Wine Enthusiast" },
    boxUnits: 6,
    minOrderBoxes: 1,
    bottleVolumeMl: 750,
    b2bUnitCents: 10342, // R$ 103,42
    d2cSuggestedUnitCents: 17900, // R$ 179,00
    ncm: "2204.21.00",
    ean: "5600345009876",
    dun14: "15600345009873",
    tastingNotes: {
      visual: "Amarelo palha com reflexos esverdeados límpidos.",
      aroma: "Pêra williams, notas florais delicadas e pedra molhada mineral.",
      palate: "Untuoso, acidez cítrica gastronômica e grande tensão em boca."
    },
    serviceTemp: "10°C a 12°C",
    foodPairing: ["Bacalhau à Brás", "Frutos do mar", "Ceviche peruano"],
    imageUrl: "/wines/monologo-avesso.png"
  },
  {
    id: "flor-silvestre-organic-malbec",
    slug: "flor-silvestre-organic-malbec",
    name: "Flor Silvestre Organic Malbec",
    commercialLine: "Flor Silvestre",
    producer: "Finca Flor Silvestre",
    country: "Argentina",
    countryFlag: "🇦🇷",
    region: "Valle de Uco (Tupungato - Mendoza)",
    vintage: "2021",
    category: "biologicos_inovacao",
    type: "Tinto",
    grapes: ["Malbec 100%"],
    alcoholPct: 14.2,
    certifiedOrganicOrBio: true,
    boxUnits: 6,
    minOrderBoxes: 1,
    bottleVolumeMl: 750,
    b2bUnitCents: 11480, // R$ 114,80
    d2cSuggestedUnitCents: 18900, // R$ 189,00
    ncm: "2204.21.00",
    ean: "7798123456789",
    dun14: "17798123456786",
    tastingNotes: {
      visual: "Vermelho violáceo vivo e brilhante.",
      aroma: "Ameixas frescas, violetas do Valle de Uco e sutil mineralidade de giz.",
      palate: "Vinificação em ovos de concreto antigos: fruta pura sem maquiagem de madeira, taninos sedosos."
    },
    serviceTemp: "15°C a 17°C",
    foodPairing: ["Chorizo argentino na parrilla", "Empanadas mendocinas", "Hambúrguer artesanal gourmet"],
    imageUrl: "/wines/flor-silvestre.png"
  },

  // ─────────────────────────────────────────────────────────────
  // 3. ÍCONES DA ITÁLIA (PIEMONTE & PUGLIA)
  // ─────────────────────────────────────────────────────────────
  {
    id: "dezzani-barolo-san-carlo",
    slug: "dezzani-barolo-san-carlo",
    name: "Barolo San Carlo DOCG 91 pts",
    commercialLine: "Dezzani Prestígio",
    producer: "Dezzani (Fundada em 1934)",
    country: "Itália",
    countryFlag: "🇮🇹",
    region: "Piemonte (Langhe)",
    vintage: "2019",
    category: "terroirs_icones",
    type: "Tinto",
    grapes: ["Nebbiolo 100%"],
    alcoholPct: 14.5,
    woodAgingMonths: 36, // 24 meses em barricas de carvalho da Eslavônia
    points: { score: 91, critic: "James Suckling" },
    boxUnits: 6,
    minOrderBoxes: 1,
    bottleVolumeMl: 750,
    b2bUnitCents: 37234, // R$ 372,34 (Caixa com 6 = R$ 2.234,04)
    d2cSuggestedUnitCents: 58000, // R$ 580,00 na carta
    ncm: "2204.21.00",
    ean: "8002345678901",
    dun14: "18002345678908",
    tastingNotes: {
      visual: "Granada clássico com halos alaranjados típicos da Nebbiolo de grande guarda.",
      aroma: "Pétalas de rosa seca, alcatrão (tar & roses), trufas negras de Alba e especiarias refinadas.",
      palate: "Taninos vigorosos de alta gastronomia, acidez aristocrática e persistência etérea."
    },
    serviceTemp: "18°C (Decantação sugerida de 1 hora)",
    foodPairing: ["Bisteca alla Fiorentina", "Risotto al Barolo com trufas", "Queijo Parmigiano Reggiano 36 meses"],
    imageUrl: "/wines/barolo-san-carlo.png"
  },
  {
    id: "rocca-torri-d-oro-susumaniello",
    slug: "rocca-torri-d-oro-susumaniello",
    name: "Torri d'Oro Susumaniello Puglia IGP 95 pts",
    commercialLine: "Torri d'Oro",
    producer: "Rocca Vini (Dal 1880)",
    country: "Itália",
    countryFlag: "🇮🇹",
    region: "Puglia (Salento)",
    vintage: "2021",
    category: "alto_giro",
    type: "Tinto",
    grapes: ["Susumaniello 100%"],
    alcoholPct: 14.5,
    woodAgingMonths: 6,
    points: { score: 95, critic: "Luca Maroni" },
    boxUnits: 6,
    minOrderBoxes: 1,
    bottleVolumeMl: 750,
    b2bUnitCents: 16082, // R$ 160,82
    d2cSuggestedUnitCents: 26900, // R$ 269,00
    ncm: "2204.21.00",
    ean: "8008765432109",
    dun14: "18008765432106",
    tastingNotes: {
      visual: "Vermelho rubi denso com reflexos azulados brilhantes.",
      aroma: "Mirtilo, cereja preta madura, toques de alcaçuz e baunilha.",
      palate: "Aveludado e envolvente, taninos doces de Puglia e uma explosão frutada no retrogosto."
    },
    serviceTemp: "16°C a 18°C",
    foodPairing: ["Massas com ragù de carne", "Pizzas de fermentação natural", "Polpette ao pomodoro"],
    imageUrl: "/wines/torri-doro-susumaniello.png"
  },

  // ─────────────────────────────────────────────────────────────
  // 4. PRESTÍGIO FRANCÊS & FORTIFICADOS DO DOURO
  // ─────────────────────────────────────────────────────────────
  {
    id: "bonpas-chateauneuf-du-pape",
    slug: "bonpas-chateauneuf-du-pape",
    name: "Don Herbert Bonpas Châteauneuf-du-Pape AOC",
    commercialLine: "Don Herbert Bonpas",
    producer: "Bonpas (Abadia Fundada em 1318)",
    country: "França",
    countryFlag: "🇫🇷",
    region: "Vale do Rhône Sul",
    vintage: "2019",
    category: "terroirs_icones",
    type: "Tinto",
    grapes: ["Grenache 70%", "Syrah 20%", "Mourvèdre 10%"],
    alcoholPct: 15.0,
    woodAgingMonths: 12,
    points: { score: 93, critic: "Robert Parker" },
    boxUnits: 6,
    minOrderBoxes: 1,
    bottleVolumeMl: 750,
    b2bUnitCents: 43322, // R$ 433,22 (Caixa com 6 = R$ 2.599,32)
    d2cSuggestedUnitCents: 69000, // R$ 690,00 na carta
    ncm: "2204.21.00",
    ean: "3267123456789",
    dun14: "13267123456786",
    tastingNotes: {
      visual: "Vermelho rubi intenso com reflexos violáceos profundos.",
      aroma: "Garrigue provençal, cerejas kirsch, pimenta preta moída e notas de cedro.",
      palate: "Poderoso e aveludado, com taninos nobres moldados pelo calor das pedras 'galets roulés'."
    },
    serviceTemp: "16°C a 18°C",
    foodPairing: ["Magret de canard", "Paleta de cordeiro confitada", "Queijo Roquefort"],
    imageUrl: "/wines/chateauneuf-du-pape.png"
  },
  {
    id: "vallegre-porto-tawny-10-anos",
    slug: "vallegre-porto-tawny-10-anos",
    name: "Porto Vallegre Tawny 10 Anos",
    commercialLine: "Vallegre Porto",
    producer: "Vallegre Vinhos do Porto S.A. (Quinta da Vista Alegre)",
    country: "Portugal",
    countryFlag: "🇵🇹",
    region: "Douro DOC (Cima Corgo)",
    vintage: "10 Anos Lote",
    category: "terroirs_icones",
    type: "Fortificado",
    grapes: ["Touriga Nacional", "Touriga Franca", "Tinta Roriz", "Tinto Cão"],
    alcoholPct: 19.5,
    woodAgingMonths: 120, // 10 anos em pipas de carvalho
    points: { score: 92, critic: "Decanter" },
    boxUnits: 6,
    minOrderBoxes: 1,
    bottleVolumeMl: 750,
    b2bUnitCents: 26558, // R$ 265,58
    d2cSuggestedUnitCents: 42000, // R$ 420,00
    ncm: "2204.21.00",
    ean: "5601987654321",
    dun14: "15601987654328",
    tastingNotes: {
      visual: "Âmbar alaranjado brilhante.",
      aroma: "Nozes tostadas, amêndoas, figos secos e casca de tangerina com caramelo fino.",
      palate: "Untuosidade exuberante, doçura equilibrada por acidez viva e retrogosto interminável."
    },
    serviceTemp: "12°C a 14°C (ou temperatura ambiente fresca)",
    foodPairing: ["Crème brûlée", "Petit gâteau de chocolate amargo", "Torta de nozes e queijos azuis"],
    imageUrl: "/wines/porto-vallegre-10.png"
  },

  // ─────────────────────────────────────────────────────────────
  // 5. ENTRADA DE ALTO GIRO: CAIXAS DE 12 UNIDADES
  // ─────────────────────────────────────────────────────────────
  {
    id: "adega-grande-mesa-tinto",
    slug: "adega-grande-mesa-tinto",
    name: "Adega Grande Mesa Regional Tinto",
    commercialLine: "Adega Grande",
    producer: "Caves Santa Cruz (Origem Ribatejo)",
    country: "Portugal",
    countryFlag: "🇵🇹",
    region: "Península de Setúbal / Tejo",
    vintage: "2023",
    category: "alto_giro",
    type: "Tinto",
    grapes: ["Castelão", "Aragonez", "Trincadeira"],
    alcoholPct: 13.0,
    boxUnits: 12, // ⚠️ ATENÇÃO: Caixa com 12 garrafas (Regra real Caves Santa Cruz)
    minOrderBoxes: 1,
    bottleVolumeMl: 750,
    b2bUnitCents: 3354, // R$ 33,54 (Caixa com 12 = R$ 402,48)
    d2cSuggestedUnitCents: 5990, // R$ 59,90 na carta do restaurante
    ncm: "2204.21.00",
    ean: "5602468135790",
    dun14: "15602468135797",
    tastingNotes: {
      visual: "Rubi brilhante de média intensidade.",
      aroma: "Frutas vermelhas frescas, morangos silvestres e leve toque herbáceo agradável.",
      palate: "Leve, fácil de beber, acidez gastronômica para o dia a dia e taninos gentis."
    },
    serviceTemp: "14°C a 16°C",
    foodPairing: ["Pratos executivos de carne", "Massas ao sugo", "Petiscos de boteco e tábuas de frios"],
    imageUrl: "/wines/adega-grande.png"
  },

  // ─────────────────────────────────────────────────────────────
  // 6. LINHA EXTREMO LUXO & AZEITES: CAIXAS DE 3 UNIDADES
  // ─────────────────────────────────────────────────────────────
  {
    id: "conde-ervideira-private-selection",
    slug: "conde-ervideira-private-selection",
    name: "Conde d'Ervideira Private Selection",
    commercialLine: "Ervideira Coleção",
    producer: "Ervideira Vinhos de Portugal",
    country: "Portugal",
    countryFlag: "🇵🇹",
    region: "Alentejo (Reguengos de Monsaraz)",
    vintage: "2019",
    category: "terroirs_icones",
    type: "Tinto",
    grapes: ["Touriga Nacional", "Aragonez", "Alicante Bouschet", "Cabernet Sauvignon"],
    alcoholPct: 14.5,
    woodAgingMonths: 18,
    points: { score: 94, critic: "Decanter", medal: "Gold Medal" },
    boxUnits: 3, // ⚠️ ATENÇÃO: Caixa de Madeira de Luxo com 3 garrafas
    minOrderBoxes: 1,
    bottleVolumeMl: 750,
    b2bUnitCents: 27456, // R$ 274,56 (Caixa com 3 = R$ 823,68)
    d2cSuggestedUnitCents: 44000, // R$ 440,00
    ncm: "2204.21.00",
    ean: "5603890123456",
    dun14: "15603890123453",
    tastingNotes: {
      visual: "Vermelho rubi impenetrável com auréola granada.",
      aroma: "Aromas aristocráticos de compota de cereja preta, baunilha, notas defumadas e café torrado.",
      palate: "Extremamente volumoso, textura sedosa impecável e final suntuoso."
    },
    serviceTemp: "16°C a 18°C",
    foodPairing: ["Cortes nobres Angus", "Prime Rib", "Queijos maturados de cura longa"],
    imageUrl: "/wines/conde-ervideira.png"
  },
  {
    id: "azeite-casa-cruz-extra-virgem-5l",
    slug: "azeite-casa-cruz-extra-virgem-5l",
    name: "Azeite Extra Virgem Casa Cruz (Galão 5L Gastronomia)",
    commercialLine: "Casa Cruz Nobre",
    producer: "Casa Cruz (Abrantes - Portugal)",
    country: "Portugal",
    countryFlag: "🇵🇹",
    region: "Ribatejo / Abrantes",
    vintage: "Safra 2025/2026",
    category: "azeites_especiais",
    type: "Azeite",
    grapes: ["Galega 70%", "Cobrançosa 30%"],
    alcoholPct: 0.0,
    points: { score: 96, critic: "Berlin GOOA", medal: "Silver 2024 / Gold Brazil IOOC 2025" },
    boxUnits: 3, // ⚠️ ATENÇÃO: Caixa com 3 Galões de 5 Litros (Total 15L para cozinhas)
    minOrderBoxes: 1,
    bottleVolumeMl: 5000,
    b2bUnitCents: 53700, // R$ 537,00 por galão (Caixa com 3 galões = R$ 1.611,00)
    d2cSuggestedUnitCents: 78000, // R$ 780,00 por galão de 5L
    ncm: "1509.10.00",
    ean: "5604567890123",
    dun14: "15604567890120",
    tastingNotes: {
      visual: "Verde dourado límpido e brilhante.",
      aroma: "Erva recém-cortada, folha de oliveira verde, maçã verde e tomateiro fresco.",
      palate: "Acidez extrema <0,2%, amargo e picante em harmonia perfeita, toque aveludado sem oleosidade pesada."
    },
    serviceTemp: "Temperatura ambiente (Conservar ao abrigo da luz)",
    foodPairing: ["Finalização de risottos", "Crudos de peixe e carpaccios", "Bacalhau ao forno e alta gastronomia"],
    imageUrl: "/wines/azeite-casa-cruz-5l.png"
  }
];
