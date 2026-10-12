"use client";

// ============================================================
// VÉSPERA — seção coleção: filtros por categoria + grid
// ============================================================

import { useState } from "react";
import { ProdutoCard } from "./produto-card";
import { ROTULO_CATEGORIA, type ProdutoDTO } from "@/lib/vespera";

const FILTROS = [
  { chave: "tudo", rotulo: "Tudo" },
  ...Object.entries(ROTULO_CATEGORIA).map(([chave, rotulo]) => ({ chave, rotulo })),
] as const;

type FiltroChave = (typeof FILTROS)[number]["chave"];

interface Props {
  produtos: ProdutoDTO[];
  aoAbrir: (p: ProdutoDTO) => void;
}

export function Colecao({ produtos, aoAbrir }: Props) {
  const [filtro, setFiltro] = useState<FiltroChave>("tudo");

  const visiveis =
    filtro === "tudo" ? produtos : produtos.filter((p) => p.category === filtro);

  return (
    <section id="colecao" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
            Coleção
          </p>
          <h2 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">
            NOITE 01
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {produtos.length} peças em tiragem curta. Tamanhos esgotados somem do grid em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por categoria">
          {FILTROS.map((f) => (
            <button
              key={f.chave}
              type="button"
              role="tab"
              aria-selected={filtro === f.chave}
              onClick={() => setFiltro(f.chave)}
              className={`min-h-[44px] border px-4 font-mono text-xs uppercase tracking-widest transition-colors ${
                filtro === f.chave
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {f.rotulo}
            </button>
          ))}
        </div>
      </div>

      {visiveis.length === 0 ? (
        <p className="mt-14 border border-dashed border-border p-10 text-center font-mono text-sm text-muted-foreground">
          Nada por aqui nesta categoria — aguarde o próximo drop.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {visiveis.map((p) => (
            <ProdutoCard key={p.id} produto={p} aoAbrir={aoAbrir} />
          ))}
        </div>
      )}
    </section>
  );
}
