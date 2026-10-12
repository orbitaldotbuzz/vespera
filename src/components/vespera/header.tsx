"use client";

// ============================================================
// VÉSPERA - header sticky + carrinho
// ============================================================

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCarrinho } from "@/lib/carrinho";

const NAV = [
  { href: "#drop", rotulo: "Drop" },
  { href: "#colecao", rotulo: "Coleção" },
  { href: "#manifesto", rotulo: "Manifesto" },
];

export function Header() {
  const [compacto, setCompacto] = useState(false);
  const itens = useCarrinho((s) => s.itens);
  const abrir = useCarrinho((s) => s.abrir);
  const unidades = itens.reduce((a, i) => a + i.qty, 0);

  useEffect(() => {
    const onScroll = () => setCompacto(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md transition-all ${
        compacto ? "py-2.5" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-baseline gap-2 group" aria-label="VÉSPERA · início">
          <span className="font-display text-2xl tracking-wide text-foreground group-hover:text-primary transition-colors">
            VÉSPERA
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-muted-foreground tracking-widest">
            SÃO PAULO · BR
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {n.rotulo}
            </a>
          ))}
        </nav>

        <Button
          variant="outline"
          size="sm"
          onClick={abrir}
          className="relative gap-2 border-border bg-transparent hover:bg-secondary hover:text-foreground min-h-[44px]"
          aria-label={`Abrir carrinho (${unidades} itens)`}
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
          <span className="hidden sm:inline font-mono text-xs uppercase tracking-widest">Carrinho</span>
          {unidades > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-bold text-primary-foreground">
              {unidades}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
