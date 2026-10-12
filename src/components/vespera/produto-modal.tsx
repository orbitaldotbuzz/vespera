"use client";

// ============================================================
// VÉSPERA - modal do produto: variações, qty e add ao carrinho
// ============================================================

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Package, Ruler, Truck, Undo2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCarrinho } from "@/lib/carrinho";
import {
  formatarPreco,
  LIMITE_QTY,
  ROTULO_CATEGORIA,
  type ProdutoDTO,
} from "@/lib/vespera";

interface Props {
  produto: ProdutoDTO | null;
  aberto: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ProdutoModal({ produto, aberto, onOpenChange }: Props) {
  const { toast } = useToast();
  const adicionar = useCarrinho((s) => s.adicionar);
  const abrirCarrinho = useCarrinho((s) => s.abrir);

  const [tamanho, setTamanho] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  // reseta seleção quando abre outro produto
  const slugAtual = produto?.slug ?? null;
  const [ultimoSlug, setUltimoSlug] = useState<string | null>(null);
  if (slugAtual !== ultimoSlug) {
    setUltimoSlug(slugAtual);
    setTamanho(produto?.variants.find((v) => v.stock > 0)?.size ?? null);
    setQty(1);
  }

  const varianteSelecionada = useMemo(
    () => produto?.variants.find((v) => v.size === tamanho) ?? null,
    [produto, tamanho]
  );

  if (!produto) return null;

  const estoque = varianteSelecionada?.stock ?? 0;

  function adicionarAoCarrinho() {
    if (!produto || !tamanho || estoque < 1) return;
    adicionar({
      produtoSlug: produto.slug,
      nome: produto.name,
      tamanho,
      preco: produto.price,
      imagem: produto.image,
      qty: Math.min(qty, estoque, LIMITE_QTY),
    });
    onOpenChange(false);
    toast({
      title: "No carrinho",
      description: `${produto.name} · ${tamanho} · ${formatarPreco(produto.price * Math.min(qty, estoque))}`,
      action: (
        <Button size="sm" variant="outline" onClick={abrirCarrinho} className="border-border">
          Ver
        </Button>
      ),
    });
  }

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden border-border bg-background p-0 sm:rounded-none">
        <DialogTitle className="sr-only">{produto.name}</DialogTitle>

        <div className="grid max-h-[85vh] overflow-y-auto sm:max-h-[80vh] sm:grid-cols-2">
          <div className="relative aspect-square bg-card sm:aspect-auto sm:min-h-[520px]">
            <Image
              src={produto.image}
              alt={produto.name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col p-5 sm:p-7">
            <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
              {ROTULO_CATEGORIA[produto.category]} · {produto.drop}
            </p>
            <h2 className="mt-2 font-display text-3xl text-foreground leading-tight">
              {produto.name}
            </h2>
            <p className="mt-2 font-mono text-lg tabular-nums text-foreground">
              {formatarPreco(produto.price)}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {produto.description}
            </p>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Tamanho
                </p>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <Ruler className="h-3 w-3" /> Modelagem boxy
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Escolher tamanho">
                {produto.variants.map((v) => {
                  const semEstoque = v.stock === 0;
                  const selecionado = v.size === tamanho;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      role="radio"
                      aria-checked={selecionado}
                      disabled={semEstoque}
                      onClick={() => {
                        setTamanho(v.size);
                        setQty(1);
                      }}
                      className={`min-h-[44px] min-w-[52px] border px-3 font-mono text-sm transition-colors ${
                        semEstoque
                          ? "cursor-not-allowed border-border text-muted-foreground/40 line-through"
                          : selecionado
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-foreground hover:border-foreground"
                      }`}
                      title={semEstoque ? "Esgotado" : `${v.stock} em estoque`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
              {tamanho && estoque > 0 && estoque <= 4 && (
                <p className="mt-2 font-mono text-[11px] text-primary">
                  Apenas {estoque} un. restantes neste tamanho
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center border border-border">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-11 w-11 font-mono text-lg text-foreground hover:bg-secondary"
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>
                <span className="w-10 text-center font-mono text-sm tabular-nums" aria-live="polite">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(estoque || 1, LIMITE_QTY, q + 1))}
                  className="h-11 w-11 font-mono text-lg text-foreground hover:bg-secondary"
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>
              <Button
                size="lg"
                disabled={estoque < 1 || !tamanho}
                onClick={adicionarAoCarrinho}
                className="h-11 flex-1 font-display text-base tracking-wide bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {estoque < 1 ? "Esgotado" : "Adicionar ao carrinho"}
              </Button>
            </div>

            <ul className="mt-7 space-y-2.5 border-t border-border pt-5 text-[13px] text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Truck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Frete grátis acima de R$ 250 · envio em até 3 dias úteis
              </li>
              <li className="flex items-center gap-2.5">
                <Undo2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Primeira troca grátis em até 30 dias
              </li>
              <li className="flex items-center gap-2.5">
                <Package className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Tiragem limitada, sem reposição
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Malha pesada, costura reforçada, pré-encolhida
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
