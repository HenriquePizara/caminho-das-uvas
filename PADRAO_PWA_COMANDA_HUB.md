# PADRÃO CANÔNICO PWA: COMANDA-HUB (APP DA MESA) $\to$ CAMINHO DAS UVAS

> Mapeamento de transposição da arquitetura de alta conversão do Comanda-Hub (`portfolio/comanda-hub/src/pages/mesa/[id].astro`) para o PWA da distribuidora **Caminho das Uvas**.

---

## 1. COMPARAÇÃO ESTRUTURAL DAS 4 ABAS (SPA MULTI-VIEW)

O modelo PWA do Comanda-Hub resolve o problema de performance e retenção móvel operando como uma Single Page Application (SPA) nativa dividida em 4 abas sem reload de tela:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HEADER FIXO COM STATUS                          │
│  Logo Dourado + Seletor de Modo (PJ / D2C) + Chip Climatizado 24h      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ABA 1: CATÁLOGO]       [ABA 2: BUSCA]    [ABA 3: SIMULADOR] [ABA 4: SOMMELIER]
│  - Chips Horizontais     - Campo Busca      - Mark-up Carta    - Fichas PDF
│  - Cards 1:1 Estilo      - Grid de Países   - Lucro da Adega   - Perfil PJ/PF
│    iFood com Garrafas      (PT, IT, FR...)  - Cálculo Margem   - WhatsApp 24/7
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                 BARRA FLUTUANTE DE COTAÇÃO / CAIXAS                    │
│                 [ 🛒 4 Caixas • R$ 1.840,00 ] [ Finalizar Cotação > ]  │
├────────────────────────────────────────────────────────────────────────┤
│                   BOTTOM NAVIGATION BAR (4 ÍCONES)                     │
│               [ 🍷 Catálogo ]  [ 🔍 Busca ]  [ 📊 Simulador ]  [ 👤 Sommelier ]
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. MAPEAMENTO DETALHADO COMPONENTE A COMPONENTE

| Padrão no Comanda-Hub (`mesa/[id].astro`) | Equivalente Canônico no Caminho das Uvas | Função de Conversão |
|---|---|---|
| **Splash Screen 360°** (`SplashScreen.astro`) | **Splash Screen Monograma Ouro** (`#D4AF37`) | Imersão instantânea ao abrir o app da adega, transmitindo prestígio e autoridade antes do carregamento. |
| **Chips Horizontais estilo iFood** | **Carrossel de Países & Estilos** | `🍇 Todos`, `🇵🇹 Portugal`, `🇮🇹 Itália`, `🇫🇷 França`, `🇨🇱 Chile & Argentina`, `🫒 Azeites`. Filtra o catálogo em 0ms. |
| **Cards de Produto 1:1** com foto lateral e botão `+ Pedir` | **Cards de Vinho 1:1** com garrafa recortada, produtor, premiação (ex: *95 pts*) e botão `+ Cotar / Pedir` | Permite adicionar caixas fechadas ou garrafas avulsas sem sair do feed principal. |
| **Drawer / Modal de Customização** | **Drawer de Ficha Técnica Aberta (Caves Santa Cruz)** | Ao tocar no card, abre drawer com castas, tipo de solo, tempo de barrica, notas de prova e harmonização gastronômica pronta para garçons. |
| **Aba Buscar com Grid de Ícones** | **Aba Buscar & Terroirs** | Busca instantânea por produtor, uva (Touriga, Nebbiolo, Malbec) ou prato, com grid visual de regiões e contagem de rótulos. |
| **Aba Pedidos / Comanda da Mesa** | **Aba Simulador de Margem B2B da Carta** | Calculadora interativa onde o dono do restaurante ajusta o mark-up (100% a 180%) e vê o custo vs. preço na carta e o lucro líquido. |
| **Aba Perfil & Benefícios da Casa** | **Aba Sommelier & Central do Cliente** | Alternância entre modo PJ e D2C, download de tabelas de preços em PDF e contato direto com o sommelier via WhatsApp. |
| **Bottom Navigation Bar Fixa** | **Bottom Nav Bar Dark Glassmorphism** | 4 abas nativas no rodapé móvel (`#0D0B0A` com borda bronze e ícones dourados). |

---

## 3. BENEFÍCIOS TÉCNICOS HERDADOS DO COMANDA-HUB

1. **Zero Latência de Transição:** Todas as 4 abas coexistem no DOM com classes `.app-tab-view` e `.active`, alternando a visibilidade em menos de 16 milissegundos (60 FPS puros).
2. **Suporte Touch Nativo:** Sem zoom acidental (`maximum-scale=1.0, user-scalable=no`), sem destaque azul de toque (`-webkit-tap-highlight-color: transparent`) e com feedback visual de clique (`active:scale-95`).
3. **Persistência de Sessão e Cotação Local:** Cotações e caixas selecionadas permanecem salvas no `localStorage`, evitando que o sommelier perca o lote montado se a tela do celular apagar ou se o navegador fechar.
