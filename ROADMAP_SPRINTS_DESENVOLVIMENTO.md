# ROADMAP DE SPRINTS DE DESENVOLVIMENTO — CAMINHO DAS UVAS
## Planejamento de Execução Técnica & Quality Gates (v1.0 — 21/10/2026)

> Divisão modular em 6 Sprints com entregáveis claros, arquivos afetados e critérios de aceite estritos para a construção do ecossistema **Caminho das Uvas**.

---

## VISÃO GERAL DAS SPRINTS

```
┌────────────────────────────────────────────────────────────────────────┐
│ SPRINT 1: Fundação do Projeto, Toolchain Web & Setup PWA               │
│ - package.json, Tailwind CSS v4, Fontes Google e Manifest PWA         │
├────────────────────────────────────────────────────────────────────────┤
│ SPRINT 2: Backend de Borda, Validação CNAE & Rotas de API Seguras      │
│ - POST /api/b2b/validate (BrasilAPI), GET /api/catalog sanitizado      │
├────────────────────────────────────────────────────────────────────────┤
│ SPRINT 3: Experiência Visual de Alta Adega (Aba 1 Catálogo & Aba 2)    │
│ - Cards Verticais 2:3, Chips, Busca e Drawer de Ficha Técnica Aberta   │
├────────────────────────────────────────────────────────────────────────┤
│ SPRINT 4: Inteligência Comercial B2B (Aba 3 Simulador & Trava Frete)   │
│ - Sliders Mark-up, Projeção Mensal, Trava R$ 600 e Payload WhatsApp   │
├────────────────────────────────────────────────────────────────────────┤
│ SPRINT 5: Central do Sommelier, Kit de Homologação & FAQ (Aba 4)       │
│ - Kit Prova 6 gfs R$ 490, Botão de Pânico Header e Central de PDFs    │
├────────────────────────────────────────────────────────────────────────┤
│ SPRINT 6: Quality Gates 360 (UI, QA, SecOps) & Deploy Dokku PaaS       │
│ - Design Gate Anti-Slop, Bulletproof QA, SecOps Scan e SSL Dokku       │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 🚀 SPRINT 1: Fundação do Projeto, Toolchain Web & Setup PWA
- **Objetivo:** Estabelecer a base do projeto web com empacotamento ultraleve, tipografia Google Fonts configurada, manifesto PWA standalone e ponto de entrada funcional.
- **Arquivos Afetados:**
  - `package.json`: Dependências React 19, Lucide, Tailwind CSS v4.
  - `tsconfig.json`: Configurações estritas de TypeScript.
  - `public/manifest.json`: Manifesto PWA com monograma dourado e cores `#0D0B0A`.
  - `src/index.html` ou `src/app/layout.tsx`: Ponto de montagem com Google Fonts (*Cormorant Garamond*, *Inter*, *Space Mono*).
- **Critérios de Teste & Aceite:**
  - `npm run build` ou compilação sem warnings ou erros de tipagem.
  - PWA reconhecido como instalável pelo navegador.
  - Renderização inicial do shell no navegador com tema escuro acetinado.

---

### 🛡️ SPRINT 2: Backend de Borda, Validação CNAE & Rotas de API
- **Objetivo:** Implementar as APIs que protegem os preços de atacado da visualização de clientes D2C e validam o CNPJ de restaurantes contra a Receita Federal.
- **Arquivos Afetados:**
  - `src/app/api/b2b/validate/route.ts`: Endpoint que consome `validateCnpjServerSide`, checa CNAEs autorizados (`56.11`, `47.23`, etc.) e emite token B2B assinado.
  - `src/app/api/catalog/route.ts`: Endpoint que consome `getSanitizedCatalog`, removendo `b2bUnitCents` de requisições D2C.
  - `prisma/schema.prisma` (ou migração SQL): Estrutura para persistência no PostgreSQL da VPS Dokku.
- **Critérios de Teste & Aceite:**
  - Requisição GET sem token retorna 200 OK sem o campo `b2bUnitCents` no JSON.
  - Requisição POST com CNPJ de restaurante válido retorna token B2B com sucesso.
  - Requisição com CNPJ incompatível (fora de hospitalidade/bebidas) retorna bloqueio com mensagem amigável.

---

### 🍷 SPRINT 3: Experiência Visual de Alta Adega (Aba 1 Catálogo & Aba 2 Buscar)
- **Objetivo:** Montar a vitrine editorial com proporção vertical 2:3 de garrafas, carrossel de terroirs e o drawer lateral de ficha técnica completa (Caves Santa Cruz).
- **Arquivos Afetados:**
  - `src/components/WineCard.tsx`: Card vertical 2:3 com selos internacionais e preço dinâmico.
  - `src/components/WineDrawer.tsx`: Slide-in com notas de degustação (visual, olfato, paladar), temperatura de serviço e códigos DUN/EAN.
  - `src/components/SearchTab.tsx`: Busca instantânea por uvas (Touriga, Nebbiolo, Malbec) e pratos.
- **Critérios de Teste & Aceite:**
  - Transições em 60 FPS sem engasgos no mobile.
  - Drawer abre e fecha suavemente ao toque em qualquer garrafa.
  - Filtros por país e categoria respondem em menos de 16ms no DOM.

---

### 📊 SPRINT 4: Inteligência Comercial B2B (Aba 3 Simulador & Trava de Frete)
- **Objetivo:** Conectar as regras financeiras em centavos (`money.ts`), permitindo que donos de restaurantes simulem o mark-up da carta de vinhos e montem cotações viáveis.
- **Arquivos Afetados:**
  - `src/components/SimulatorTab.tsx`: Sliders interativos de mark-up (80% a 220%) e projeção de lucro mensal.
  - `src/components/FloatingQuoteBar.tsx`: Barra flutuante com trava dupla de frete (R$ 600 Grande SP / R$ 1.200 Interior) e despacho estruturado para WhatsApp.
- **Critérios de Teste & Aceite:**
  - Cálculos matemáticos sem erros de arredondamento de ponto flutuante.
  - Barra de progresso de frete atualiza reativamente a cada caixa adicionada.
  - WhatsApp abre com o payload estruturado `[COTACAO_B2B_CAMINHO_DAS_UVAS]`.

---

### 👑 SPRINT 5: Central do Sommelier, Kit de Homologação & FAQ (Aba 4)
- **Objetivo:** Quebrar as últimas objeções de vendas, oferecendo a "Caixa de Prova do Sommelier" e ferramentas de segurança para o profissional em salão.
- **Arquivos Afetados:**
  - `src/components/SommelierTab.tsx`: Acordeão de FAQ (boletos 28/35/42d, pedido mínimo), perfil e downloads de catálogo em PDF.
  - `src/components/B2BHeaderToggle.tsx`: Botão de pânico que oculta os preços de atacado da tela com um único toque caso um cliente se aproxime da mesa.
  - `src/data/catalog.ts`: Validação de exibição do SKU `kit-homologacao-sommelier-6` (R$ 490,00).
- **Critérios de Teste & Aceite:**
  - O toque no botão de pânico bloqueia a sessão imediatamente e mascara os preços em todos os cards.
  - Fluxo de solicitação de catálogo e FAQ operando perfeitamente.

---

### 🛡️ SPRINT 6: Quality Gates 360 (UI, QA, SecOps) & Deploy Dokku PaaS
- **Objetivo:** Submeter a aplicação aos portais de qualidade inegociáveis da WbMonster e publicar em produção com alta performance.
- **Arquivos Afetados:**
  - `scripts/design-audit-runner.mjs` (`npm run design:gate`): Auditoria visual anti-slop, WCAG 2.2 AA e OKLCH.
  - `scripts/qa-bulletproof-runner.mjs` (`npm run qa:bulletproof`): Bateria de formulários, botões e prevenção de duplo clique.
  - `scripts/secops-audit-runner.mjs` (`npm run sec`): Scan de portas, segredos e cabeçalhos de segurança.
  - Deploy Dokku: Criação e publicação do app `caminhodasuvas.wbmonster.com.br` com SSL TLS 1.3 Let's Encrypt.
- **Critérios de Teste & Aceite:**
  - 100% PASS em todos os Quality Gates.
  - Produção ativa em `https://caminhodasuvas.wbmonster.com.br` com HTTP/2 200 OK.
