"use client";

// ============================================================
// VÉSPERA - card do catálogo (click abre modal de produto)
// ============================================================

import Image from "next/image";
import { formatarPreco, estoqueTotal, type ProdutoDTO } from "@/lib/vespera";

interface Props {
  produto: ProdutoDTO;
  aoAbrir: (p: ProdutoDTO) => void;
}

export function ProdutoCard({ produto, aoAbrir }: Props) {
  const estoque = estoqueTotal(produto);
  const esgotado = estoque === 0;
  const ultimas = estoque > 0 && estoque <= 6;

  return (
    <button
      type="button"
      onClick={() => aoAbrir(produto)}
      className="group flex h-full w-full flex-col text-left focus-visible:outline-2 focus-visible:outline-ring"
      aria-label={`Ver ${produto.name}, ${formatarPreco(produto.price)}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden border border-border bg-card">
        <Image
          src={produto.image}
          alt={produto.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-[1.04] ${
            esgotado ? "grayscale opacity-50" : ""
          }`}
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {esgotado && (
            <span className="bg-foreground px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-background">
              Esgotado
            </span>
          )}
          {ultimas && (
            <span className="bg-primary px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-primary-foreground">
              Últimas {estoque} un.
            </span>
          )}
          {produto.featured && !esgotado && (
            <span className="border border-border bg-background/85 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground backdrop-blur-sm">
              Destaque do drop
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground group-hover:text-primary transition-colors">
            {produto.name}
          </h3>
          <p className="font-mono text-sm tabular-nums text-foreground whitespace-nowrap">
            {formatarPreco(produto.price)}
          </p>
        </div>
        <p className="mt-auto pt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {produto.drop}
        </p>
      </div>
    </button>
  );
}
