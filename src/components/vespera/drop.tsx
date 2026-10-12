"use client";

// ============================================================
// VÉSPERA - seção drop: destaque + countdown grande
// ============================================================

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Countdown } from "./countdown";
import { formatarPreco, estoqueTotal, type ProdutoDTO } from "@/lib/vespera";

interface Props {
  destaques: ProdutoDTO[];
  deadline: number;
  aoAbrir: (p: ProdutoDTO) => void;
}

export function Drop({ destaques, deadline, aoAbrir }: Props) {
  if (destaques.length === 0) return null;
  const [a, b] = destaques;

  return (
    <section id="drop" className="scroll-mt-20 border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
              <span className="dot-ao-vivo mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
              Drop encerra em
            </p>
            <h2 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">
              PEÇAS DE DESTAQUE
            </h2>
          </div>
          <Countdown deadline={deadline} />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-6">
          {[a, b].filter(Boolean).map((p) => {
            const estoque = estoqueTotal(p);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => aoAbrir(p)}
                className="group relative overflow-hidden border border-border text-left focus-visible:outline-2 focus-visible:outline-ring"
                aria-label={`Ver ${p.name}`}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
                      {estoque > 0 ? `${estoque} unidades restantes` : "Esgotado"}
                    </p>
                    <h3 className="mt-1 font-display text-2xl text-foreground sm:text-3xl">
                      {p.name}
                    </h3>
                    <p className="mt-1 font-mono text-sm tabular-nums text-muted-foreground">
                      {formatarPreco(p.price)}
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-background/80 text-foreground backdrop-blur-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
