import { db } from "@/lib/db";
import { Loja } from "@/components/vespera/loja";
import type { ProdutoDTO } from "@/lib/vespera";

// ============================================================
// VÉSPERA - home: catálogo do drop NOITE 01 direto do banco
// ============================================================

export const dynamic = "force-dynamic";

/** Deadline do drop: sempre o próximo domingo 23:59:59 (America/Sao_Paulo → UTC-3) */
function proximoDrop(): number {
  const agora = new Date();
  // domingo = 0; queremos o próximo domingo às 23:59:59 no horário local do servidor
  const d = new Date(agora);
  const diasAteDomingo = (7 - d.getDay()) % 7 || 7;
  d.setDate(d.getDate() + diasAteDomingo);
  d.setHours(23, 59, 59, 0);
  return d.getTime();
}

export default async function Home() {
  const produtos = await db.product.findMany({
    include: { variants: { orderBy: { size: "asc" } } },
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
  });

  const dto: ProdutoDTO[] = produtos.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category as ProdutoDTO["category"],
    image: p.image,
    featured: p.featured,
    drop: p.drop,
    variants: p.variants.map((v) => ({ id: v.id, size: v.size, stock: v.stock })),
  }));

  return <Loja produtos={dto} deadline={proximoDrop()} />;
}
