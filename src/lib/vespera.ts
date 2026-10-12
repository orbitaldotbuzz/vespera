// ============================================================
// VÉSPERA - tipos compartilhados entre servidor e cliente
// ============================================================

export interface VarianteDTO {
  id: string;
  size: string;
  stock: number;
}

export interface ProdutoDTO {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // centavos
  category: "camisetas" | "moletons" | "bones";
  image: string;
  featured: boolean;
  drop: string;
  variants: VarianteDTO[];
}

export interface ItemCarrinho {
  produtoSlug: string;
  nome: string;
  tamanho: string;
  preco: number; // centavos unitário
  imagem: string;
  qty: number;
}

export interface PedidoResposta {
  ok: true;
  code: string;
  total: number;
  shipping: number;
  pixCode: string;
  pixQrDataUrl: string;
}

export const FRETE_GRATIS_ACIMA_DE = 25_000; // centavos
export const FRETE_PADRAO = 1_990; // centavos
export const LIMITE_QTY = 10;

export function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Estoque somado do produto a partir das variantes */
export function estoqueTotal(p: ProdutoDTO): number {
  return p.variants.reduce((acc, v) => acc + v.stock, 0);
}

export const ROTULO_CATEGORIA: Record<ProdutoDTO["category"], string> = {
  camisetas: "Camisetas",
  moletons: "Moletons",
  bones: "Bonés",
};
