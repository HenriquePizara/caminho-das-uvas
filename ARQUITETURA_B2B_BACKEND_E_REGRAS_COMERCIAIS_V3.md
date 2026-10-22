# ARQUITETURA B2B BACKEND & REGRAS COMERCIAIS V3 — CAMINHO DAS UVAS
> Solução dos 5 Riscos Críticos: Gatekeeper Server-Side (CNAE), Banco PostgreSQL Dinâmico, Trava de Frete B2B, Kit de Entrada do Sommelier e Payload Estruturado de WhatsApp.

---

## 1. GATEKEEPER SERVER-SIDE: CHECAGEM REAL DE CNAE & TOKENIZAÇÃO

### 1.1 A Vulnerabilidade do Frontend Descartada:
- A validação puramente client-side via algoritmo módulo 11 foi rebaixada para mera máscara de digitação (UX).
- **Hard Rule de Segurança de Dados:** A rota pública de catálogo `GET /api/catalog` **NUNCA** envia os campos `b2bUnitCents` no JSON para o cliente D2C. Se o usuário abrir o DevTools ou interceptar requisições, os preços de atacado simplesmente não existem no payload.

### 1.2 Endpoint Server-Side: `POST /api/b2b/validate`
1. O cliente envia o CNPJ.
2. O servidor valida o algoritmo e consulta a API da Receita Federal / BrasilAPI (com cache em Redis de 30 dias para evitar sobrecarga).
3. **Auditoria Estrita de CNAE:** A empresa deve possuir CNAE principal ou secundária em atividades autorizadas de hospitalidade/bebidas:
   - `56.11-2`: Restaurantes e similares
   - `56.12-1`: Serviços ambulantes de alimentação
   - `56.20-1`: Serviços de catering e buffet
   - `47.23-7`: Comércio varejista de bebidas (adegas, empórios)
   - `55.10-8`: Hotéis e hospedagem
   - `46.35-4`: Comércio atacadista de bebidas
4. Se aprovado, emite um token assinado (JWT B2B) contendo `{ cnpj, razaoSocial, cnae, exp }`.
5. Com este token no header `Authorization: Bearer <token>`, o endpoint `GET /api/catalog` retorna o catálogo completo com os preços de importação direta.

---

## 2. CATÁLOGO DINÂMICO NO POSTGRESQL (DESACOPLADO DO GIT)

### 2.1 O Papel do `catalog.ts`:
- O arquivo `catalog.ts` atua **exclusivamente como seed inicial** e fallback de emergência.
- Todos os 190+ rótulos residem no banco de dados **PostgreSQL 16** hospedado na VPS Dokku (`caminho_production` em `127.0.0.1:5432`).
- As rotas Next.js utilizam **ISR (Incremental Static Regeneration)** com revalidação de 60 segundos ou webhook de purga instantânea disparado pelo ERP (Tiny/Bling) ao alterar preços ou zerar estoque.

---

## 3. TRAVA COMERCIAL DE TICKET & FRETE BONIFICADO

Para evitar que um restaurante compre 1 caixa de vinho de entrada de R$ 335,40 e exija boleto a prazo com frete grátis para o interior:

### 3.1 Fórmula da Trava Dupla:
$$\text{Pedido Válido} = (\text{Total de Caixas} \ge 1) \ \ \mathbf{E} \ \ (\text{Valor Total} \ge \text{R\$} \ 600,00 \text{ para Grande SP ou R\$} \ 1.200,00 \text{ para Interior})$$

### 3.2 Regras de Aplicação no `FloatingQuoteBar.tsx`:
- Se $\text{Valor Total} < \text{R\$} \ 600,00$:
  - A cotação pode ser enviada, mas com a tag explícita: `[FRETE_A_COMBINAR]`.
  - A barra exibe uma barra de progresso dourada: *"Adicione mais R$ X,XX para garantir Frete Grátis na Grande SP"*.
- Condição de Boleto Bancário (28/35/42d): Faturamento mínimo de **R$ 1.000,00**. Pedidos abaixo desse valor são faturados via Pix à vista ou cartão corporativo.

---

## 4. O CAVALO DE TROIA: KIT DE ENTRADA DO SOMMELIER (DEGUSTAÇÃO B2B)

Para quebrar a hesitação de novos restaurantes comprarem caixas monorótulo de 6 ou 12 unidades:

### 4.1 "Caixa de Prova do Sommelier" (Kit Homologação B2B):
- **SKU:** `kit-homologacao-sommelier-6`
- **Composição Sortida de 6 Garrafas:**
  1. 1x Espumante / Vinho Verde Nobre: *Monólogo Avesso DOC 2022*
  2. 1x Branco Gastronômico / Ânfora: *Morgado do Quintão Curtimenta*
  3. 2x Tintos de Alto Giro: *Pousio Selection Tinto* e *Adega Grande Regional*
  4. 1x Tinto Ícone de Carta: *Pousio Reserva Tinto 2020 (92 pts Decanter)*
  5. 1x Azeite Premium 500ml: *Azeite Extra Virgem Casa Cruz 0,2%*
- **Condição Especial:** Permitida a compra de apenas 1 kit por CNPJ na primeira compra pelo valor promocional de **R$ 490,00** à vista ou boleto 14d.

---

## 5. PAYLOAD ESTRUTURADO DE WHATSAPP (MACHINE-READABLE)

O despacho para o WhatsApp corporativo deixa de ser texto livre e passa a conter uma estrutura parseável por IA / ERP:

```
[COTACAO_B2B_CAMINHO_DAS_UVAS]
CNPJ: 33.000.167/0001-01
EMPRESA: Trattoria Fasano Ltda
CNAE: 56.11-2-01 (Restaurante)
DATA: 2026-10-21T23:05:00Z

ITENS:
- SKU: pousio-reserva-tinto | QTD_CX: 2 | EMB: 6 un | TOTAL_GFS: 12 | UNIT_CENTS: 13840 | SUB_CENTS: 166080
- SKU: dezzani-barolo-san-carlo | QTD_CX: 1 | EMB: 6 un | TOTAL_GFS: 6 | UNIT_CENTS: 37234 | SUB_CENTS: 223404

METRICAS:
TOTAL_CAIXAS: 3
TOTAL_GARRAFAS: 18
VALOR_TOTAL_CENTAVOS: 389484
VALOR_TOTAL_BRL: R$ 3.894,84
STATUS_FRETE: BONIFICADO_GRANDE_SP (Acima de R$ 600,00)
CONDICAO_SOLICITADA: BOLETO_FATURADO_28D
```
