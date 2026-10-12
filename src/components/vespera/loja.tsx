"use client";

// ============================================================
// VÉSPERA — orquestrador da loja (client)
// Recebe o catálogo do servidor e coordena modais/carrinho.
// ============================================================

import { useMemo, useState } from "react";
import Image from "next/image";
import { Header } from "./header";
import { Hero, Marquee } from "./hero";
import { Drop } from "./drop";
import { Colecao } from "./colecao";
import { ProdutoModal } from "./produto-modal";
import { CarrinhoDrawer } from "./carrinho-drawer";
import { CheckoutModal } from "./checkout-modal";
import { useCarrinho } from "@/lib/carrinho";
import { estoqueTotal, type ProdutoDTO, type PedidoResposta } from "@/lib/vespera";

interface Props {
  produtos: ProdutoDTO[];
  deadline: number;
}

export function Loja({ produtos, deadline }: Props) {
  const [produtoAberto, setProdutoAberto] = useState<ProdutoDTO | null>(null);
  const [checkoutAberto, setCheckoutAberto] = useState(false);
  const [pedido, setPedido] = useState<PedidoResposta | null>(null);

  const carrinhoAberto = useCarrinho((s) => s.aberto);
  const setCarrinhoAberto = useCarrinho((s) => s.fechar);
  const abrirCarrinho = useCarrinho((s) => s.abrir);
  const itens = useCarrinho((s) => s.itens);

  const destaques = useMemo(() => {
    const feat = produtos.filter((p) => p.featured && estoqueTotal(p) > 0);
    return feat.slice(0, 2);
  }, [produtos]);

  function abrirCheckout() {
    if (itens.length === 0) return;
    setCarrinhoAberto();
    setPedido(null);
    setCheckoutAberto(true);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero deadline={deadline} />
        <Marquee />
        <Drop destaques={destaques} deadline={deadline} aoAbrir={setProdutoAberto} />
        <Colecao produtos={produtos} aoAbrir={setProdutoAberto} />
        <Manifesto />
      </main>
      <Footer />

      <ProdutoModal
        produto={produtoAberto}
        aberto={produtoAberto !== null}
        onOpenChange={(v) => !v && setProdutoAberto(null)}
      />

      <CarrinhoDrawer
        aberto={carrinhoAberto}
        onOpenChange={(v) => {
          if (!v) setCarrinhoAberto();
          else abrirCarrinho();
        }}
        aoFinalizar={abrirCheckout}
      />

      <CheckoutModal
        aberto={checkoutAberto}
        onOpenChange={setCheckoutAberto}
        pedido={pedido}
        onPedidoCriado={setPedido}
        onConcluido={() => {
          setPedido(null);
          setCheckoutAberto(false);
        }}
      />
    </div>
  );
}

// ============================================================
// Manifesto — identidade editorial da marca
// ============================================================

function Manifesto() {
  return (
    <section
      id="manifesto"
      className="scroll-mt-20 border-t border-border bg-card/40"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative aspect-[3/4] max-h-[560px] w-full overflow-hidden border border-border">
          <Image
            src="/produtos/lookbook-1.png"
            alt="Lookbook VÉSPERA: detalhe de moletom preto sob luz quente"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
            Manifesto
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[1.02] text-foreground sm:text-6xl">
            A VÉSPERA É O MOMENTO ANTES.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              É o minuto em que o sol já se foi, mas a cidade ainda guarda o
              calor do dia. É quando tudo pode acontecer — e é dessa energia
              que nascemos. Cada peça sai do ateliê em São Paulo em tiragem
              curta, numerada e datada, como um ingresso para algo que não
              se repete.
            </p>
            <p>
              Não fazemos reposição. Não fazemos fast fashion. Quando o drop
              encerra, encerra de verdade: o que sobrou vira arquivo, e o que
              esgotou vira história. É moda de autor para quem prefere vestir
              uma ideia a repetir um algoritmo.
            </p>
            <p className="font-mono text-sm text-foreground">
              — Estúdio VÉSPERA, desde 2026
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Footer — sticky bottom por flex-col + mt-auto no pai
// ============================================================

function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-3xl tracking-wide text-foreground">VÉSPERA</p>
            <p className="mt-2 max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-widest text-muted-foreground">
              Streetwear autoral · drops limitados · São Paulo, Brasil
            </p>
          </div>

          <nav aria-label="Links do rodapé" className="grid grid-cols-2 gap-x-12 gap-y-2.5">
            {["Trocas e devoluções", "Guia de tamanhos", "Prazos de envio", "Contato", "Instagram", "Política de privacidade"].map(
              (l) => (
                <a
                  key={l}
                  href="#"
                  className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l}
                </a>
              )
            )}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            © 2026 VÉSPERA Studio — projeto de portfólio
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Pagamentos simulados · nenhum produto é cobrado
          </p>
        </div>
      </div>
    </footer>
  );
}
