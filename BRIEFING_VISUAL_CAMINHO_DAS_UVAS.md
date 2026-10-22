# BRIEFING DE IDENTIDADE VISUAL, CORES & TIPOGRAFIA
## Caminho das Uvas — Ecossistema Digital B2B & D2C de Alta Adega

> Documento de Referência Estética e Diretrizes de Design System elaborado para a distribuidora **Caminho das Uvas**, combinando o prestígio editorial de importação direta à engenharia de performance móvel (PWA).

---

## 1. ARQUÉTIPO VISUAL: ALTA ADEGA EDITORIAL (DARK LUXURY)

Diferente de interfaces convencionais de e-commerce e aplicativos de fast-food (chips saturados, botões berrantes e cards horizontais de delivery), a estética do **Caminho das Uvas** foi desenhada para valorizar garrafas de **R$ 50 a R$ 450** com a sobriedade e o respeito de uma adega centenária:

- **Inspirações Internacionais:** *Hedonism Wines* (Mayfair, Londres), *Berry Bros. & Rudd* (St. James's) e catálogo técnico *Caves Santa Cruz*.
- **Composição de Telas:** Cards verticais na **proporção 2:3**, dando protagonismo à silhueta da garrafa de vidro escuro, ao relevo do rótulo e à cápsula lacrada.
- **Micro-espaçamentos & Respiro:** Superfícies escuras acetinadas com contraste suave, sem ruído visual e com feedback tátil de toque (`active:scale-[0.98]`).

---

## 2. PALETA DE CORES (TOKENS OFICIAIS)

| Papel no Design System | Hexadecimal | Amostra & Nome Técnico | Aplicação Prática na Interface |
|---|---|---|---|
| **Fundo Primário** | `#0D0B0A` | ⬛ **Preto Ônix Acetinado** | Fundo mestre da aplicação, simulando papel de alta gramatura de rótulos nobres. |
| **Superfície / Cards** | `#171413` | 🔲 **Carvão Mineral Profundo** | Background dos cards verticais de vinhos, modais e drawer de ficha técnica. |
| **Bordas & Divisórias** | `#2D2622` | 🟫 **Bronze Escuro Fosco** | Linhas divisórias sutis, separadores de seções e contorno padrão de inputs. |
| **Dourado Nobre** | `#C5A059` / `#D4AF37` | 🟨 **Ouro Envelhecido Fosco** | Monograma 'C', acentos metálicos, badges de CNAE, preços de destaque e botões B2B. |
| **Rubi Bordô** | `#721422` | 🍷 **Bordô / Vermelho Rubi** | Badges de pontuação de críticos internacionais (*95 pts Robert Parker* / *Decanter*). |
| **Texto Primário** | `#F5F2EB` | ⬜ **Branco Marfim / Algodão** | Tipografia principal de títulos, safras, nomes de produtores e valores. |
| **Texto Secundário** | `#A89F91` | 🔘 **Champagne Acinzentado** | Textos de apoio, notas de degustação, dados de terroir e descrições técnicas. |
| **Verde de Conversão** | `#25D366` / `#1EBE5D` | 🟢 **Verde WhatsApp Oficial** | Botões primários de cotação com o sommelier e despacho de pedidos. |
| **Verde de Sucesso Fiscal**| `#10B981` | ✳️ **Verde Esmeralda** | Indicadores de status do CNPJ validado e garantia de frete bonificado. |

---

## 3. SISTEMA TIPOGRÁFICO DE AUTORIDADE

A identidade adota uma tríade tipográfica de alto rigor editorial:

### 3.1 Display & Títulos: *Cormorant Garamond* (Google Fonts)
- **Classificação:** Serifada Clássica / Editorial
- **Pesos Utilizados:** `Bold (700)` e `Black (900)`
- **Aplicação:** Nomes dos vinhos (*Dezzani Barolo San Carlo DOCG*, *Pousio Reserva*, *Morgado do Quintão Curtimenta*), títulos das abas, headlines do hero e chamadas de autoridade.
- **Sensação:** Tradição, curadoria europeia e prestígio de alta gastronomia.

### 3.2 Corpo, Navegação & Interfaces: *Inter* / *Plus Jakarta Sans*
- **Classificação:** Sem Serifa (Sans-Serif Geométrica)
- **Pesos Utilizados:** `Regular (400)`, `Medium (500)`, `SemiBold (600)` e `Bold (700)`
- **Aplicação:** Notas de degustação olfativas/gustativas, chips de categorias, botões de ação e acordion de FAQ.
- **Sensação:** Clareza imediata e leitura sem cansaço visual em telas OLED de smartphones.

### 3.3 Códigos Fiscais, Logística & Números: *Space Mono* (Google Fonts)
- **Classificação:** Monospaçada Técnica
- **Pesos Utilizados:** `Regular (400)` e `Bold (700)`
- **Aplicação:** Códigos de barras EAN unitários, DUN-14 de embarque, classificação fiscal NCM (`2204` e `1509`), safras (*2019*, *2021*), teor alcoólico (*14.5% vol.*) e CNPJ da sessão.
- **Sensação:** Rigor técnico de importação e rastreabilidade logística direta.

---

## 4. PROPORÇÕES, COMPONENTES & ESTADOS DE INTERFACE

1. **Cards de Vinho (Proporção 2:3 Vertical):**
   - Garrafa recortada ao centro com glow sutil dourado ao fundo (`#C5A059/10`).
   - Bandeira do país de origem + região produtora no topo esquerdo.
   - Badge de pontuação internacional no topo direito (*95 pts Robert Parker*).
   - Nome do produtor e castas em destaque.
   - Preço dinâmico: Preço de atacado por garrafa + valor total da caixa (`boxUnits: 3 | 6 | 12`) se desbloqueado; preço sugerido na carta se bloqueado.
   - Micro-interação tátil de toque: `active:scale-[0.98]`.
2. **Drawer de Ficha Técnica Aberta (Caves Santa Cruz):**
   - Slide-in lateral suave cobrindo 100% da tela mobile e max-w-lg no desktop.
   - Seções padronizadas de **Notas de Degustação** (*Visual*, *Olfato*, *Paladar*), **Temperatura de Serviço** (*16°C a 18°C*) e **Harmonização Gastronômica com Ícones** (*Carnes*, *Peixes*, *Risottos*).
   - Códigos fiscais e botão direto de WhatsApp.
3. **Pill de Segurança no Header (`B2BHeaderToggle`):**
   - Se bloqueado: `[ 🔒 Tabela Restaurantes ]` (abre o modal de CNPJ).
   - Se desbloqueado: `[ 🟢 33.000.167/0001-01 • 🔒 Ocultar ]` (permite ao sommelier esconder os preços com um toque na mesa do salão).

---

## 5. REGRAS DE MATRIZ DE EMBALAGEM B2B

- **Caixa com 12 Unidades:** Linha Adega Grande Mesa Regional (R$ 33,54/gf • Caixa = R$ 402,48).
- **Caixa com 6 Unidades:** Linhas Pousio Selection, Pousio Reserva, Barolo San Carlo, Susumaniello, Châteauneuf-du-Pape e Flor Silvestre Malbec.
- **Caixa com 3 Unidades:** Conde d'Ervideira Private Selection (Caixa de madeira de luxo) e Galão de Azeite Casa Cruz 5L (Caixa com 3 galões = 15 Litros).
- **Caixa de Prova do Sommelier (Kit Homologação):** 6 garrafas sortidas por R$ 490,00 para novos restaurantes.

---

🏛️ *Caminho das Uvas • Diretrizes Oficiais de Design System & Brand Identity*
