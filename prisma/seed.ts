/**
 * VÉSPERA: seed do catálogo (drop NOITE 01)
 * Uso: bun prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type Seed = {
  slug: string;
  name: string;
  description: string;
  price: number; // centavos
  category: "camisetas" | "moletons" | "bones";
  image: string;
  featured?: boolean;
  sizes: Array<[string, number]>; // [tamanho, estoque]
};

const P = (n: number) => n * 100;

const CATALOGO: Seed[] = [
  {
    slug: "camiseta-vespera-logo",
    name: "Camiseta Véspera Logo",
    description:
      "A assinatura da casa. Malha pesada 100% algodão penteado 24.1, corte boxy com ombro caído e estampa em silk fluorescente que acende sob luz negra. Pré-encolhida e lavada à pedra para um caimento que já vem quebrado.",
    price: P(129),
    category: "camisetas",
    image: "/produtos/camiseta-vespera.png",
    featured: true,
    sizes: [["P", 8], ["M", 12], ["G", 9], ["GG", 3]],
  },
  {
    slug: "camiseta-solsticio",
    name: "Camiseta Solstício",
    description:
      "Off-white cru, tingimento natural e estampa tonal quase invisível, vista para quem entende sutileza. Malha 220g com gola dupla reforçada que não vira pastel depois da terceira lavada.",
    price: P(139),
    category: "camisetas",
    image: "/produtos/camiseta-solsticio.png",
    sizes: [["P", 5], ["M", 7], ["G", 6], ["GG", 0]],
  },
  {
    slug: "camiseta-nightfall",
    name: "Camiseta Nightfall",
    description:
      "Grafite profundo com estampa minimalista nas costas. O corte oversized com barra reta foi desenhado para cair reto em qualquer corpo. O básico que não parece básico.",
    price: P(149),
    category: "camisetas",
    image: "/produtos/camiseta-nightfall.png",
    sizes: [["P", 3], ["M", 4], ["G", 2], ["GG", 1]],
  },
  {
    slug: "camiseta-eclipse",
    name: "Camiseta Eclipse",
    description:
      "Vermelho queimado com lavagem vintage, peça a peça: nenhuma sai igual à outra. Estampa frontal inspirada nos cartões celestes dos anos 90. Edição limitada a 60 peças.",
    price: P(149),
    category: "camisetas",
    image: "/produtos/camiseta-eclipse.png",
    featured: true,
    sizes: [["P", 2], ["M", 3], ["G", 3], ["GG", 2]],
  },
  {
    slug: "moletom-equador",
    name: "Moletom Linha do Equador",
    description:
      "Felpa pesada 480g com interior escovado: o moletom que segura o inverno de São Paulo e o vento da madrugada. Capuz estruturado de três painéis e bolso canguru reforçado.",
    price: P(299),
    category: "moletons",
    image: "/produtos/moletom-equador.png",
    featured: true,
    sizes: [["P", 4], ["M", 6], ["G", 5], ["GG", 2]],
  },
  {
    slug: "moletom-crepusculo",
    name: "Moletom Crepúsculo",
    description:
      "Terracota queimada, a cor do céu às 18h47. Corte relaxed com punhos canelados grossos e capuz forrado em xadrez tonal. Peça de assinatura para quem não tem medo de cor.",
    price: P(279),
    category: "moletons",
    image: "/produtos/moletom-crepusculo.png",
    sizes: [["P", 3], ["M", 3], ["G", 2], ["GG", 0]],
  },
  {
    slug: "moletom-aurora",
    name: "Moletom Aurora Aberta",
    description:
      "Cinza mescla em sarja fleece com zíper YKK antiquado e gola alta dupla. A terceira peça que você veste na semana inteira sem culpa, e ninguém percebe.",
    price: P(289),
    category: "moletons",
    image: "/produtos/moletom-aurora.png",
    sizes: [["P", 2], ["M", 4], ["G", 4], ["GG", 1]],
  },
  {
    slug: "bone-orbita",
    name: "Boné Órbita",
    description:
      "Strapback não estruturado de 6 gomos em sarja preta, aba curva com bordado orbital discreto no lateral. Fecho de metal escovado. Um tamanho, todas as cabeças.",
    price: P(99),
    category: "bones",
    image: "/produtos/bone-orbita.png",
    sizes: [["ÚNICO", 14]],
  },
  {
    slug: "bone-horizonte",
    name: "Boné Horizonte",
    description:
      "Corduroy areia com aba reta e fecho de couro vegetal. Textura que muda de cor conforme a luz, como um horizonte às 19h. Baixíssimo estoque da última remessa.",
    price: P(109),
    category: "bones",
    image: "/produtos/bone-horizonte.png",
    sizes: [["ÚNICO", 4]],
  },
  {
    slug: "bone-vespera",
    name: "Boné Véspera",
    description:
      "Laranja lavado em canvas encerado, com logotipo bordado em ponto cruz no frontal. Envelhece bem: quanto mais você usa, mais parece seu.",
    price: P(99),
    category: "bones",
    image: "/produtos/bone-vespera.png",
    sizes: [["ÚNICO", 9]],
  },
];

async function main() {
  console.log("🧹 Limpando catálogo...");
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.productVariant.deleteMany();
  await db.product.deleteMany();

  console.log("👕 Criando produtos (drop NOITE 01)...");
  for (const p of CATALOGO) {
    await db.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        image: p.image,
        featured: p.featured ?? false,
        variants: {
          create: p.sizes.map(([size, stock]) => ({ size, stock })),
        },
      },
    });
    console.log(`  + ${p.name} (${p.sizes.length} variantes)`);
  }

  const total = await db.product.count();
  const estoque = await db.productVariant.aggregate({ _sum: { stock: true } });
  console.log(`\n✅ Seed concluído: ${total} produtos, ${estoque._sum.stock ?? 0} unidades em estoque.`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
