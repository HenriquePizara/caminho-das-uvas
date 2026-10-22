# PLANO ESTRATÉGICO & ARQUITETURA TECNOLÓGICA — CAMINHO DAS UVAS
> Análise de Mercado (2026), Modelagem de Vendas Híbridas (B2B 65% / D2C 35%) e Stack de Alta Conversão

---

## 1. DIAGNÓSTICO DE MERCADO: POR QUE E-COMMERCES TRADICIONAIS FALHAM NESTE SEGMENTO?

Plataformas monolíticas tradicionais (Shopify padrão, WooCommerce, VTEX genérico) falham categoricamente para distribuição de vinhos finos e importação direta pelos seguintes motivos estruturais:

1. **A Dinâmica do Comprador B2B (Restaurantes, Adegas, Hotéis):**
   - O sommelier ou gerente de A&B **não fecha pedidos de R$ 3.000 a R$ 20.000 via carrinho com cartão de crédito**.
   - A compra depende de **faturamento em boleto a prazo (28/35/42 dias)**, validação de crédito e CNPJ, cálculo exato de **Substituição Tributária (ICMS-ST)** e **DIFAL** por estado e NCM.
   - O gatilho de fidelização é o **atendimento sommelier ágil**, garantia de safra, apoio no treinamento da equipe de salão e agilidade de entrega semanal.
2. **A Experiência do Comprador D2C Premium:**
   - Vinhos de R$ 150 a R$ 450 exigem percepção de luxo, curadoria editorial, história do produtor e confiança na integridade térmica. Interfaces padronizadas com banners promocionais agressivos e cronômetros de escassez destroem o posicionamento de prestígio.
3. **A Solução de Consenso Global no Mercado Moderno:**
   - **Headless Editorial Commerce + Comércio Conversacional com Sommelier de IA no WhatsApp + Ferramental Interativo de Margem B2B.**

---

## 2. A MELHOR FORMA DE VENDER: A TRÍADE DO COMÉRCIO CONSULTIVO

### Pilar 1: Vitrine Editorial de Altíssimo Padrão (Headless Web)
- Navegação fluida (< 800ms) com design escuro acetinado (`#0D0B0A`), tipografia serifada de autoridade (*Cormorant Garamond*) e detalhes metálicos em dourado nobre (`#D4AF37`).
- **Seletor de Modo no Header:**
  - **Modo Restaurantes & PJ:** Exibe preços de importação por caixa fechada, faixas de desconto por volume, cálculo de ST, simulador de mark-up para carta e botão de faturamento via boleto.
  - **Modo Consumidor Final (D2C):** Foco em terroir, notas sensoriais, harmonização com pratos e compra assistida.

### Pilar 2: Simulador Interativo de Margem & Carta (O Ímã de Leads B2B)
- O dono do restaurante seleciona seu perfil de ticket médio e o simulador demonstra visualmente:
  - *Custo da garrafa importada vs. Preço sugerido na carta do restaurante.*
  - *Mark-up real de 100% a 180%.*
  - *Lucro mensal estimado com base no giro de garrafas.*
- Botão instantâneo: *"Quero montar minha carta com esse lucro no WhatsApp"*.

### Pilar 3: Esteira Conversacional & Sommelier IA (WhatsApp LangGraph)
- O WhatsApp é o canal onde 90%+ das transações B2B de hospitalidade são fechadas no Brasil.
- A aplicação web gera links de WhatsApp com **payloads dinâmicos codificados**:
  - Exemplo: `https://wa.me/5511...?text=Olá, sou do Restaurante [X] (CNPJ: ...). Gostaria de cotar 2 cxs do Barolo San Carlo DOCG e 3 cxs do Pousio Reserva com faturamento PJ.`
- No WhatsApp, um Agente Sommelier inteligente (operado via LangGraph e Evolution API):
  1. Identifica o perfil do lead (PJ ou PF) e consulta o CNPJ na Receita/Sintegra.
  2. Esclarece dúvidas técnicas de safra, solo, teor alcoólico e harmonização gastronômica.
  3. Gera a proposta formal em PDF ou espelho de pedido com frete e prazo de entrega.
  4. Realiza o transbordo sem atrito para o consultor humano da Caminho das Uvas com histórico completo.

---

## 3. ARQUITETURA TECNOLÓGICA RECOMENDADA

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CAMADA DE EXPERIÊNCIA WEB                       │
│  Next.js 15+ (App Router, Turbopack, Tailwind CSS v4, Lucide Icons)     │
│  - Dual View (B2B Wholesale Mode vs. D2C Luxury Mode)                  │
│  - Simulador Interativo de Margem & Mark-up da Carta de Vinhos         │
│  - Ficha Técnica Aberta (Estilo Caves Santa Cruz: Castas, Solo, Notas) │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     MOTOR DE DADOS & APIS (Postgres)                   │
│  PostgreSQL 16 + Drizzle/Prisma ORM (Docker / Dokku PaaS)              │
│  - Catálogo de Terroirs, Safras, Rótulos, DUN/EAN e Produtores         │
│  - Regras Fiscais: NCM 2204, ICMS-ST e DIFAL parametrizados            │
│  - Tabelas de Preços Dinâmicas (Tabela Direta PJ vs. Tabela D2C)       │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   MENSAGERIA & CONVERSÃO CONVERSACIONAL                │
│  WhatsApp Engine (Evolution API v2 / Cloud API + LangGraph ReAct)      │
│  - Geração de Espelho de Cotação em PDF Instantâneo                   │
│  - Consulta de CNPJ & Análise de Limite de Crédito Faturado            │
│  - Transbordo para Sommelier Humano com Contexto Fechado               │
└────────────────────────────────────────────────────────────────────────┘
```

### Componentes de Tecnologia:
1. **Frontend / UI:** Next.js 15 (React 19, Tailwind CSS v4, Framer Motion para transições do drawer e sliders do simulador).
2. **Design Tokens:** OKLCH / CSS Variables no padrão do framework (`#0D0B0A`, `#171413`, `#2D2622`, `#D4AF37`, `#721422`, `#F5F2EB`).
3. **Database:** PostgreSQL 16 (Dokku PaaS / 127.0.0.1) com persistência de leads, cotações e catálogo técnico.
4. **Busca & Filtros:** Full-Text Search com índices trigram (`pg_trgm`) por país, uva, graduação alcoólica, faixa de preço e harmonização gastronômica.
5. **Automação de WhatsApp:** Integração nativa com a infraestrutura já existente na VPS (Evolution API / WhatsApp Business).

---

## 4. PLANO DE AÇÃO PASSO A PASSO PARA DESENVOLVIMENTO

### Fase 1: Catálogo Técnico & Estrutura de Dados
- Criar a modelagem de tipos e dados em TypeScript (`src/data/catalog.ts`), cadastrando os 12 rótulos emblemáticos das Caves Santa Cruz com todos os metadados (EAN, DUN, castas, solo, estágio em barrica, prêmios, notas de prova e preços PJ/D2C).

### Fase 2: Scaffold Front-End & Design System
- Criar a aplicação Next.js em `portfolio/caminho-das-uvas`.
- Configurar fontes Google Fonts (*Cormorant Garamond*, *Inter*, *Space Mono*).
- Aplicar tokens visuais da paleta Ônix / Dourado / Rubi no Tailwind CSS.

### Fase 3: Desenvolvimento dos Componentes de Conversão
- **Header Inteligente:** Com seletor de perfil (Restaurantes & B2B | Consumidor D2C) e botão WhatsApp.
- **Hero de Autoridade:** Headline de curadoria, selos dos 5 países (Portugal, Itália, França, Chile, Argentina) e badges de credibilidade (190+ rótulos, estoque climatizado, envio em 24h, eureciclo).
- **Tabs de Curadoria Interativa:** Filtros rápidos (Alto Giro, Grandes Terroirs, Biológicos & Inovação, Azeites Premiados).
- **Cards de Produto:** Exibição da garrafa recortada, produtor, premiação, faixa de preço e botão para abrir a Ficha Técnica.
- **Drawer de Ficha Técnica (Estilo Caves Santa Cruz):** Slide-in lateral com fichas completas, notas de degustação e harmonizações para garçons.
- **Simulador Interativo de Margem para Restaurantes:** Sliders dinâmicos de custo de garrafa e mark-up (100% a 180%), projetando faturamento e margem líquida.
- **Seção de Procedência & Climatização:** Prova visual do armazenamento e frete protegido.
- **FAQ Comercial:** Sanando objeções de pedido mínimo (1 caixa / 6 garrafas), prazos e faturamento no boleto.
- **Footer Técnico:** Dados corporativos, CNPJ e consumo responsável.

### Fase 4: Quality Gates & Deploy
- Executar auditoria de design anti-slop ([`[UI]`](file:///home/henrique/.gemini/rules/03-design-gate.md)).
- Executar testes de formulários e botões ([`[QA]`](file:///home/henrique/.gemini/rules/00-global.md)).
- Build Next.js Turbopack e deploy na PaaS Dokku (`caminhodasuvas.wbmonster.com.br`) com SSL TLS 1.3 Let's Encrypt.
