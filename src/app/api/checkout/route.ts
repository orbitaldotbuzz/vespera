import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import QRCode from "qrcode";
import { db } from "@/lib/db";
import { gerarPixCopiaECola } from "@/lib/pix";
import { FRETE_GRATIS_ACIMA_DE, FRETE_PADRAO, LIMITE_QTY } from "@/lib/vespera";

// ============================================================
// POST /api/checkout — cria o pedido e gera o PIX (simulado)
// ------------------------------------------------------------
// Valida estoque, decrementa variantes em transação e persiste
// o pedido com payload PIX no formato EMV (BR Code). Portfólio:
// nenhum pagamento real é processado.
// ============================================================

const schema = z.object({
  customerName: z.string().trim().min(2, "Informe seu nome").max(80),
  customerEmail: z.string().trim().toLowerCase().email("E-mail inválido"),
  items: z
    .array(
      z.object({
        produtoSlug: z.string().min(1),
        tamanho: z.string().min(1).max(10),
        qty: z.number().int().min(1).max(LIMITE_QTY),
      })
    )
    .min(1, "Carrinho vazio"),
});

function gerarCodigoPedido(): string {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  return `VSP-${s}`;
}

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }

    const { customerName, customerEmail, items } = parsed.data;

    // 1) Carrega produtos e valida itens + estoque
    const slugs = [...new Set(items.map((i) => i.produtoSlug))];
    const produtos = await db.product.findMany({
      where: { slug: { in: slugs } },
      include: { variants: true },
    });
    if (produtos.length !== slugs.length) {
      return NextResponse.json({ error: "Produto indisponível no catálogo." }, { status: 400 });
    }

    const mapa = new Map(produtos.map((p) => [p.slug, p]));
    const linhas: Array<{ slug: string; nome: string; tamanho: string; qty: number; preco: number; varianteId: string }> = [];

    for (const item of items) {
      const p = mapa.get(item.produtoSlug)!;
      const v = p.variants.find((x) => x.size === item.tamanho);
      if (!v) {
        return NextResponse.json(
          { error: `Tamanho ${item.tamanho} indisponível em ${p.name}.` },
          { status: 409 }
        );
      }
      const acumulada = linhas
        .filter((l) => l.slug === p.slug && l.tamanho === item.tamanho)
        .reduce((a, l) => a + l.qty, 0);
      if (v.stock < acumulada + item.qty) {
        return NextResponse.json(
          { error: `Estoque insuficiente: ${p.name} · ${item.tamanho} (${v.stock} un. restantes).` },
          { status: 409 }
        );
      }
      linhas.push({
        slug: p.slug,
        nome: p.name,
        tamanho: item.tamanho,
        qty: item.qty,
        preco: p.price,
        varianteId: v.id,
      });
    }

    const subtotal = linhas.reduce((a, l) => a + l.preco * l.qty, 0);
    const frete = subtotal >= FRETE_GRATIS_ACIMA_DE ? 0 : FRETE_PADRAO;
    const total = subtotal + frete;

    // 2) Transação: decrementa estoque + cria pedido
    const pedido = await db.$transaction(async (tx) => {
      for (const l of linhas) {
        const v = await tx.productVariant.findUnique({ where: { id: l.varianteId } });
        if (!v || v.stock < l.qty) {
          throw new Error(`ESTOQUE:${l.nome} ${l.tamanho}`);
        }
        await tx.productVariant.update({
          where: { id: l.varianteId },
          data: { stock: { decrement: l.qty } },
        });
      }

      let code = gerarCodigoPedido();
      // evita colisão improvável de código
      while (await tx.order.findUnique({ where: { code } })) {
        code = gerarCodigoPedido();
      }

      const pixCode = gerarPixCopiaECola({
        chave: "portfolio@vespera.example",
        nome: "VESPERA STUDIO LTDA",
        cidade: "SAO PAULO",
        valor: total,
        txid: code,
      });

      return tx.order.create({
        data: {
          code,
          customerName,
          customerEmail,
          total,
          shipping: frete,
          pixCode,
          items: {
            create: linhas.map((l) => ({
              productSlug: l.slug,
              productName: l.nome,
              size: l.tamanho,
              qty: l.qty,
              price: l.preco,
            })),
          },
        },
      });
    });

    const pixQrDataUrl = await QRCode.toDataURL(pedido.pixCode, {
      margin: 1,
      width: 320,
      color: { dark: "#0b0a08", light: "#f2efe9" },
    });

    return NextResponse.json({
      ok: true,
      code: pedido.code,
      total: pedido.total,
      shipping: pedido.shipping,
      pixCode: pedido.pixCode,
      pixQrDataUrl,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.startsWith("ESTOQUE:")) {
      return NextResponse.json({ error: msg.replace("ESTOQUE:", "") + " acabou de esgotar." }, { status: 409 });
    }
    console.error("[/api/checkout] erro:", error);
    return NextResponse.json({ error: "Erro ao criar o pedido. Tente novamente." }, { status: 500 });
  }
}
