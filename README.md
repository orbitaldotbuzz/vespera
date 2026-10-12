# VÉSPERA 🌒

> Streetwear autoral em drops limitados — loja de demonstração full-stack, feita para portfólio.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

**VÉSPERA** é uma experiência de e-commerce one-page no formato *drop culture*: catálogo em tiragem limitada com **countdown ao vivo**, badges de estoque, carrinho persistente e **checkout PIX simulado** (payload EMV/BR Code real, com CRC16 — nenhum pagamento é processado).

## ✨ Destaques

- **Drop countdown** — o drop NOITE 01 encerra no próximo domingo, com timer ao vivo
- **Estoque real por tamanho** — badges "ÚLTIMAS X UN." e "ESGOTADO" refletem o banco; tamanhos somem do grid em tempo real
- **Carrinho persistente** — Zustand + localStorage, sobrevive a refresh
- **Barra de frete grátis** — progresso visual até R$ 250
- **Checkout PIX** — pedido persistido em transação (valida e decrementa estoque), payload copia-e-cola no formato EMV do Banco Central com CRC16-CCITT, QR Code gerado server-side
- **Imagens editoriais geradas por IA** — fotos de produto com linguagem visual coesa (fundo carvão + luz de sódio)
- **Dark editorial** — tipografia display Anton + Geist Mono, marquee de beneficios, manifesto de marca

## 🧱 Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind CSS 4 + shadcn/ui + Lucide |
| Estado | Zustand (persist) |
| Banco | SQLite via Prisma ORM |
| PIX | Payload EMV próprio (`src/lib/pix.ts`) + `qrcode` |

## 🚀 Rodando

```bash
npm install
npm run db:push      # cria o banco
bun prisma/seed.ts   # popula o drop NOITE 01 (10 produtos)
npm run dev          # http://localhost:3000
```

## 🗂 Estrutura

```
src/
├── app/
│   ├── page.tsx              # home: catálogo do banco → <Loja>
│   └── api/checkout/         # cria pedido (transação + PIX) e simula pagamento
├── components/vespera/       # header, hero, drop, coleção, produto, carrinho, checkout
└── lib/
    ├── vespera.ts            # tipos + regras de negócio (frete, limites)
    ├── pix.ts                # gerador BR Code EMV com CRC16-CCITT
    └── carrinho.ts           # store Zustand persistido
prisma/                       # schema + seed do catálogo
public/produtos/              # fotos geradas por IA
```

## 🔒 Nota de segurança

Projeto de portfólio: o PIX é **simulado** (chave fictícia, botão "simular pagamento"). Nenhum dado real de pagamento é coletado e nenhum processador é integrado.

---

Feito por **orbitaldotbuzz** — veja também [RankRadar](https://github.com/orbitaldotbuzz/rankradar).
