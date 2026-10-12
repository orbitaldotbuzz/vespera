"use client";

// ============================================================
// VÉSPERA — carrinho (Sheet lateral) com progresso de frete
// ============================================================

import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCarrinho } from "@/lib/carrinho";
import {
  formatarPreco,
  FRETE_GRATIS_ACIMA_DE,
  FRETE_PADRAO,
} from "@/lib/vespera";

interface Props {
  aberto: boolean;
  onOpenChange: (v: boolean) => void;
  aoFinalizar: () => void;
}

export function CarrinhoDrawer({ aberto, onOpenChange, aoFinalizar }: Props) {
  const itens = useCarrinho((s) => s.itens);
  const alterarQty = useCarrinho((s) => s.alterarQty);
  const remover = useCarrinho((s) => s.remover);

  const subtotal = itens.reduce((a, i) => a + i.preco * i.qty, 0);
  const frete = subtotal === 0 || subtotal >= FRETE_GRATIS_ACIMA_DE ? 0 : FRETE_PADRAO;
  const falta = Math.max(0, FRETE_GRATIS_ACIMA_DE - subtotal);
  const progresso = Math.min(100, Math.round((subtotal / FRETE_GRATIS_ACIMA_DE) * 100));

  return (
    <Sheet open={aberto} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-border bg-background p-0 sm:max-w-md"
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <SheetTitle className="font-display text-2xl tracking-wide text-foreground">
            CARRINHO
          </SheetTitle>
          <span className="font-mono text-xs text-muted-foreground">
            {itens.reduce((a, i) => a + i.qty, 0)} {itens.reduce((a, i) => a + i.qty, 0) === 1 ? "item" : "itens"}
          </span>
        </div>

        {itens.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Seu carrinho está vazio.
              <br />
              O drop não espera — bora escolher.
            </p>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mt-2 border-border bg-transparent hover:bg-secondary hover:text-foreground"
            >
              Ver a coleção
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5">
              {/* progresso frete grátis */}
              <div className="mb-5 border border-border bg-card p-4">
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  <Truck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {falta > 0 ? (
                    <>Faltam {formatarPreco(falta)} para frete grátis</>
                  ) : (
                    <span className="text-primary">Frete grátis desbloqueado ✓</span>
                  )}
                </p>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${progresso}%` }}
                    role="progressbar"
                    aria-valuenow={progresso}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Progresso para frete grátis"
                  />
                </div>
              </div>

              <ul className="space-y-4">
                {itens.map((i) => (
                  <li
                    key={`${i.produtoSlug}-${i.tamanho}`}
                    className="flex gap-3 border border-border bg-card p-3"
                  >
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-secondary">
                      <Image src={i.imagem} alt={i.nome} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{i.nome}</p>
                          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                            Tam. {i.tamanho} · {formatarPreco(i.preco)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remover(i.produtoSlug, i.tamanho)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label={`Remover ${i.nome} do carrinho`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            onClick={() => alterarQty(i.produtoSlug, i.tamanho, -1)}
                            className="h-9 w-9 text-foreground hover:bg-secondary"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="mx-auto h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center font-mono text-sm tabular-nums">{i.qty}</span>
                          <button
                            type="button"
                            onClick={() => alterarQty(i.produtoSlug, i.tamanho, 1)}
                            className="h-9 w-9 text-foreground hover:bg-secondary"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="mx-auto h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-mono text-sm tabular-nums text-foreground">
                          {formatarPreco(i.preco * i.qty)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border p-5">
              <div className="space-y-1.5 font-mono text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatarPreco(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Frete</span>
                  <span className="tabular-nums">
                    {frete === 0 ? <span className="text-primary">Grátis</span> : formatarPreco(frete)}
                  </span>
                </div>
              </div>
              <Separator className="my-3 bg-border" />
              <div className="flex justify-between font-display text-xl text-foreground">
                <span>TOTAL</span>
                <span className="tabular-nums">{formatarPreco(subtotal + frete)}</span>
              </div>
              <Button
                size="lg"
                onClick={aoFinalizar}
                className="mt-4 h-12 w-full font-display text-base tracking-wide bg-primary text-primary-foreground hover:bg-primary/90"
              >
                FINALIZAR COM PIX
              </Button>
              <p className="mt-2.5 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Simulação de portfólio · nenhum pagamento real
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
