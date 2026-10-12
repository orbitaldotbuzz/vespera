"use client";

// ============================================================
// VÉSPERA — checkout: dados → PIX (QR + copia-e-cola) → pago
// ============================================================

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, Loader2, PartyPopper } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCarrinho } from "@/lib/carrinho";
import { formatarPreco, type PedidoResposta } from "@/lib/vespera";

interface Props {
  aberto: boolean;
  onOpenChange: (v: boolean) => void;
  pedido: PedidoResposta | null;
  onPedidoCriado: (p: PedidoResposta) => void;
  /** chamado ao fechar com pedido concluído — pai reseta o estado */
  onConcluido: () => void;
}

export function CheckoutModal({ aberto, onOpenChange, pedido, onPedidoCriado, onConcluido }: Props) {
  const { toast } = useToast();
  const itens = useCarrinho((s) => s.itens);
  const limpar = useCarrinho((s) => s.limpar);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pago, setPago] = useState(false);
  const [copiado, setCopiado] = useState(false);

  function fechar() {
    onOpenChange(false);
    if (pago) onConcluido();
  }

  async function criarPedido(e: React.FormEvent) {
    e.preventDefault();
    if (itens.length === 0) return;
    setEnviando(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: nome,
          customerEmail: email,
          items: itens.map((i) => ({
            produtoSlug: i.produtoSlug,
            tamanho: i.tamanho,
            qty: i.qty,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro ao criar o pedido.");
      onPedidoCriado(json as PedidoResposta);
    } catch (err) {
      toast({
        title: "Não foi possível criar o pedido",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setEnviando(false);
    }
  }

  async function simularPagamento() {
    if (!pedido) return;
    try {
      const res = await fetch("/api/checkout/pagar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: pedido.code }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro ao confirmar.");
      setPago(true);
      limpar();
    } catch (err) {
      toast({ title: "Erro", description: (err as Error).message, variant: "destructive" });
    }
  }

  async function copiarPix() {
    if (!pedido) return;
    await navigator.clipboard.writeText(pedido.pixCode);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
    toast({ title: "Código PIX copiado" });
  }

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-lg border-border bg-background sm:rounded-none">
        <DialogTitle className="sr-only">Checkout</DialogTitle>

        {/* ===== Etapa 1: dados ===== */}
        {!pedido && (
          <form onSubmit={criarPedido} className="space-y-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-primary">Checkout</p>
              <h2 className="mt-1 font-display text-3xl text-foreground">QUASE SUA</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Preencha para gerar o PIX do seu pedido. Os itens serão reservados do estoque.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="chk-nome">Nome</Label>
                <Input
                  id="chk-nome"
                  required
                  minLength={2}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Como no documento"
                  className="border-border bg-card"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="chk-email">E-mail</Label>
                <Input
                  id="chk-email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                  className="border-border bg-card"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={enviando || itens.length === 0}
              className="h-12 w-full font-display text-base tracking-wide bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : "GERAR PIX"}
            </Button>
          </form>
        )}

        {/* ===== Etapa 2: PIX ===== */}
        {pedido && !pago && (
          <div className="space-y-5">
            <div className="text-center">
              <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
                Pedido {pedido.code}
              </p>
              <h2 className="mt-1 font-display text-3xl text-foreground">
                {formatarPreco(pedido.total)}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Escaneie o QR ou use o copia-e-cola. Válido por 30 minutos.
              </p>
            </div>

            <div className="mx-auto w-fit border border-border bg-card p-3">
              <Image
                src={pedido.pixQrDataUrl}
                alt={`QR Code PIX do pedido ${pedido.code}`}
                width={220}
                height={220}
                unoptimized
                className="block"
              />
            </div>

            <div>
              <Label htmlFor="pix-code" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                PIX copia-e-cola
              </Label>
              <div className="mt-1.5 flex gap-2">
                <Input
                  id="pix-code"
                  readOnly
                  value={pedido.pixCode}
                  className="flex-1 border-border bg-card font-mono text-[11px] text-muted-foreground"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={copiarPix}
                  className="border-border bg-transparent hover:bg-secondary hover:text-foreground min-h-[44px] px-4"
                >
                  {copiado ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              onClick={simularPagamento}
              className="h-12 w-full font-display text-base tracking-wide bg-primary text-primary-foreground hover:bg-primary/90"
            >
              SIMULAR PAGAMENTO
            </Button>
            <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Demo de portfólio — nenhum pagamento real é processado
            </p>
          </div>
        )}

        {/* ===== Etapa 3: confirmado ===== */}
        {pedido && pago && (
          <div className="space-y-5 py-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
              <PartyPopper className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-3xl text-foreground">É SUA!</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Pedido <span className="font-mono text-foreground">{pedido.code}</span> confirmado.
                <br />
                Enviamos os detalhes para seu e-mail e o código de rastreio
                assim que sair do ateliê — em até 3 dias úteis.
              </p>
            </div>
            <Button
              onClick={fechar}
              variant="outline"
              className="border-border bg-transparent hover:bg-secondary hover:text-foreground"
            >
              Voltar para a loja
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
