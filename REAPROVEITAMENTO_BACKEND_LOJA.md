# MATRIZ DE REAPROVEITAMENTO DO BACKEND: LOJA WB $\to$ CAMINHO DAS UVAS

> Mapeamento cirúrgico dos módulos, regras de negócio e componentes já homologados e em produção em `portfolio/loja` (Next.js 16 / PostgreSQL / Redis) prontos para transposição e aceleração do ecossistema **Caminho das Uvas**.

---

## 1. RESUMO EXECUTIVO DO PATRIMÔNIO TECNOLÓGICO DISPONÍVEL

O e-commerce `loja.wbmonster.com.br` passou por 5 baterias de homologação SRE (**VANDOR**, 250 varreduras acumuladas) e conta com um conjunto de regras robustas que resolvem 90% dos gargalos transacionais, fiscais e de segurança de uma distribuidora.

Abaixo está a matriz de módulos diretamente reaproveitáveis:

| Módulo Original em `portfolio/loja` | Arquivo Fonte | O Que Faz (Regra Pronta) | Adaptação para Caminho das Uvas (Vinhos B2B/D2C) |
|---|---|---|---|
| **1. Máquina de Estados Finitos (FSM)** | [`src/lib/orderFsm.ts`](file:///home/henrique/portfolio/loja/src/lib/orderFsm.ts) | Transições determinísticas legais com compliance CDC, bloqueio de saltos de status inválidos. | Adicionar os estados de crédito B2B: `AWAITING_CREDIT_APPROVAL` (Análise Sintegra) e `BILLED_BOLETO` (Faturamento 28/35/42d). |
| **2. Serviço de Pedidos & Lock Pessimista** | [`src/lib/orderService.ts`](file:///home/henrique/portfolio/loja/src/lib/orderService.ts) | `SELECT ... FOR UPDATE` prevenindo concorrência, idempotência em 24h e estorno atômico de estoque em cancelamentos. | Controla alocação de safras raras e caixas fechadas. Se o restaurante cancela, o lote de Barolo/Pousio volta ao estoque instantaneamente. |
| **3. Aritmética Financeira em Centavos** | [`src/lib/money.ts`](file:///home/henrique/portfolio/loja/src/lib/money.ts) | Cálculo 100% livre de ponto flutuante (`centsToBRL`, `brlToCents`, margens e descontos). | Motor de cálculo do **Simulador de Margem B2B da Carta** (custo vs. preço de venda do restaurante com mark-up 100%-180%). |
| **4. Formatadores e Validadores BR** | [`src/lib/formatters.ts`](file:///home/henrique/portfolio/loja/src/lib/formatters.ts) | Validador e máscara de CNPJ/CPF, formatação E.164 internacional de telefone e máscaras de CEP. | Validação instantânea do CNPJ do restaurante na solicitação de cotação e abertura limpa de WhatsApp. |
| **5. Rate Limiting em Camada Dupla** | [`src/lib/rateLimit.ts`](file:///home/henrique/portfolio/loja/src/lib/rateLimit.ts) | Rate limit no Redis por IP e por identificador (email/documento), mitigação de bot e scraping. | Impede que concorrentes ou bots façam scraping massivo do estoque e preços de importação direta. |
| **6. Geração de PIX Dinâmico Real** | [`src/lib/payments/mockProvider.ts`](file:///home/henrique/portfolio/loja/src/lib/payments/mockProvider.ts) | QR Code PIX 320x320 PNG via biblioteca `qrcode` (nível M de correção) e linha copia-e-cola. | Pagamento instantâneo para pedidos D2C e para caixas de validação/amostras faturadas à vista para restaurantes. |
| **7. Integração WhatsApp Segura** | [`src/lib/whatsapp/evolutionClient.ts`](file:///home/henrique/portfolio/loja/src/lib/whatsapp/evolutionClient.ts) | Despacho via Evolution API v2 com sanitização, normalização E.164 e guardrail estrito da Regra 35. | Envio de espelho de pedido em PDF, alertas de cotação para o time comercial e confirmação de entrega. |
| **8. Singletons de Banco e Cache** | [`src/lib/db.ts`](file:///home/henrique/portfolio/loja/src/lib/db.ts) e [`src/lib/redis.ts`](file:///home/henrique/portfolio/loja/src/lib/redis.ts) | Pool de conexões estável para PostgreSQL e Redis, consumo de memória < 250MB em Dokku. | Zero overhead na VPS, permitindo que a loja do Caminho das Uvas rode com extrema eficiência. |

---

## 2. DETALHAMENTO DAS REGRAS ESPECÍFICAS PARA VINHOS & BEBIDAS B2B

### 2.1 Gestão Atômica de Estoque de Safras Limitadas (`orderService.ts`)
- **Regra Importada:** O `orderService.ts` implementa o estorno atômico de inventário:
  ```typescript
  if ((toStatus === "CANCELED" || toStatus === "REFUNDED") && from !== "CANCELED" && from !== "REFUNDED") {
    // Incrementa estoque no banco atomicamente via transação ACID
    await tx.variant.updateMany({
      where: { id: it.variantId },
      data: { stock: { increment: it.qty } },
    });
  }
  ```
- **Aplicação no Vinho:** Em safras limitadas (ex: *Marmelar*, *Châteauneuf-du-Pape* ou *Barolo San Carlo*), pedidos em cotação retêm o estoque temporariamente. Se o boleto de 35 dias não for aprovado, o lote retorna automaticamente para o catálogo sem risco de overselling.

### 2.2 Validação de CNPJ & Faturamento B2B (`formatters.ts` & `checkout/route.ts`)
- **Regra Importada:** `validateCNPJ` matemático com verificação dos 2 dígitos verificadores e rejeição de sequências repetidas (`11111111111111`, etc.).
- **Aplicação no Vinho:** No modo B2B, o restaurante digita o CNPJ; a aplicação valida a estrutura antes de enviar para o WhatsApp ou cadastrar na fila de análise de crédito.

### 2.3 Simulador de Margem Alimentado por `money.ts`
- **Regra Importada:** Manuseio de dinheiro exclusivamente em centavos inteiros (`priceCents`).
- **Aplicação no Vinho:** 
  $$\text{Preço na Carta} = \text{Custo da Garrafa} \times \left(1 + \frac{\text{Mark-up}}{100}\right)$$
  $$\text{Margem Líquida por Caixa} = (\text{Preço na Carta} - \text{Custo da Garrafa}) \times 6$$
  O componente calcula na tela do restaurante em milissegundos sem qualquer distorção de arredondamento.
