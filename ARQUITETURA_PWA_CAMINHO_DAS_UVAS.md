# ARQUITETURA PWA DE ALTA CONVERSÃO — CAMINHO DAS UVAS (2026)

> Análise de Viabilidade, Retorno sobre Investimento (ROI) e Especificação Técnica do Progressive Web App (PWA) para a Distribuidora Caminho das Uvas.

---

## 1. VEREDITO ESTRATÉGICO: POR QUE O PWA É UMA DECISÃO BRILHANTE?

No segmento de vinhos finos de importação direta com operação híbrida (B2B 65% / D2C 35%), o PWA **não é apenas uma boa ideia: é uma vantagem competitiva desproporcional** sobre os concorrentes tradicionais.

### 1.1 O Superpoder no B2B (Restaurantes, Sommeliers e Hotéis):
- **O Cenário Real:** O sommelier ou gerente de salão toma decisões de reposição dentro da adega climatizada, no subsolo ou no salão durante o serviço, ambientes onde o sinal 4G/Wi-Fi costuma oscilar ou falhar.
- **Vantagem PWA 1 (Catálogo e Fichas Técnicas 100% Offline):** O Service Worker mantém em cache as notas de prova, temperatura de serviço e harmonização gastronômica de todos os 190 rótulos. O sommelier pode consultar na frente do cliente à mesa com resposta em 0ms.
- **Vantagem PWA 2 (Ícone Direto na Home do Celular):** O comprador não precisa digitar URL, pesquisar no Google ou caçar mensagens antigas no WhatsApp. O ícone dourado do *Caminho das Uvas* fica fixo na tela inicial do celular do decisor.
- **Vantagem PWA 3 (Reorder em 2 Toques):** Histórico de caixas compradas previamente com botão "Repor Lote", gerando o pedido direto via WhatsApp ou boleto faturado.
- **Vantagem PWA 4 (Web Push Notifications Estratégicas):**
  - *"Alerta de Safra: Restam apenas 12 caixas do Barolo San Carlo 2019."*
  - *"Corte Logístico: Pedidos até as 16h chegam amanhã no seu restaurante na Grande SP."*

### 1.2 O Superpoder no D2C Premium (Consumidor A/B):
- **Zero Fricção de App Store:** O consumidor de alta renda não baixa um app nativo de 120MB na App Store/Play Store apenas para comprar vinho. O PWA instala em menos de 2 segundos com um toque no banner discreto.
- **Sensação de Aplicativo Nativo:** Tela cheia (`display: standalone`), sem barra de endereço do navegador, suporte a gestos de deslize, navegação por abas inferiores (*Bottom Navigation Bar*) e resposta tátil de 60 FPS.

---

## 2. ESPECIFICAÇÃO TÉCNICA DO PWA (Next.js 15)

### 2.1 Manifest (`app/manifest.ts` ou `public/manifest.json`)
```json
{
  "name": "Caminho das Uvas — Distribuidora de Vinhos & Terroirs",
  "short_name": "Caminho das Uvas",
  "description": "Curadoria direta de vinhos internacionais premiados e azeites nobres para restaurantes e enófilos.",
  "start_url": "/?source=pwa",
  "display": "standalone",
  "background_color": "#0D0B0A",
  "theme_color": "#0D0B0A",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

### 2.2 Estratégia de Cache do Service Worker (Serwist / Workbox)
1. **Cache-First (Imutável):**
   - Fontes serifadas (*Cormorant Garamond*, *Inter*, *Space Mono*).
   - Assets estáticos, ícones Lucide e fotos das garrafas em alta resolução.
2. **Stale-While-Revalidate (Conteúdo Rápido com Atualização em Background):**
   - Fichas técnicas, castas, notas de degustação e perfis de produtores.
3. **Network-First (Sempre Atualizado):**
   - Saldos de estoque de safras raras e cotações de preços em tempo real.

### 2.3 Interface Mobile com Bottom Navigation Bar (4 Abas)
Na versão PWA móvel, a navegação abandona menus complexos e adota uma barra inferior elegante com efeito *glassmorphism* escuro:
- 🍷 **Catálogo:** Grid com filtros de Terroir (Portugal, Itália, França, Chile, Argentina).
- 📋 **Fichas:** Busca rápida de harmonização para garçons e maîtres no salão.
- 📊 **Simulador:** Calculadora de mark-up e margem da carta de vinhos.
- 💬 **Sommelier:** Botão direto para o atendimento consultivo no WhatsApp.
