import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

// ============================================================
// POST /api/checkout/pagar — simulação de confirmação do PIX
// ------------------------------------------------------------
// Portfólio: em produção isto viria do webhook do PSP. Aqui, o
// botão "simular pagamento" da tela do PIX chama este endpoint
// e marca o pedido como PAGO.
// ============================================================

const schema = z.object({
  code: z.string().trim().regex(/^VSP-[A-Z0-9]{6}$/, "Código de pedido inválido"),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Código de pedido inválido." }, { status: 400 });
    }

    const pedido = await db.order.findUnique({ where: { code: parsed.data.code } });
    if (!pedido) {
      return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
    }
    if (pedido.status === "PAGO") {
      return NextResponse.json({ ok: true, status: "PAGO" });
    }

    await db.order.update({ where: { code: pedido.code }, data: { status: "PAGO" } });
    return NextResponse.json({ ok: true, status: "PAGO" });
  } catch (error) {
    console.error("[/api/checkout/pagar] erro:", error);
    return NextResponse.json({ error: "Erro ao confirmar pagamento. Tente novamente." }, { status: 500 });
  }
}
