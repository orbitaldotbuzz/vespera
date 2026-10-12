"use client";

// ============================================================
// VÉSPERA - hero editorial + ticker marquee
// ============================================================

import Image from "next/image";
import { ArrowDown, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "./countdown";

export function Hero({ deadline }: { deadline: number }) {
  return (
    <section aria-label="Apresentação da marca" className="relative overflow-hidden">
      <div className="grade-fundo absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="animar-subir">
            <p className="mb-4 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-primary">
              <span className="dot-ao-vivo inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              Drop NOITE 01 · ao vivo agora
            </p>

            <h1 className="font-display text-[19vw] leading-[0.9] sm:text-[13vw] lg:text-[8.5rem] xl:text-[9.5rem] text-foreground">
              ROUPA DE
              <br />
              <span className="text-primary">AUTOR</span> QUE
              <br />
              NUNCA ESPERA
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              VÉSPERA é streetwear feito em São Paulo em tiragens curtas.
              Cada drop tem data de fim: quando esgota, fica para a história.
            </p>

            <div className="mt-8 flex flex-col gap-6">
              <Countdown deadline={deadline} />
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="font-display text-base tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
                  <a href="#colecao">Ver a coleção</a>
                </Button>
                <a
                  href="#manifesto"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
                >
                  O manifesto <ArrowDown className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="relative animar-subir" style={{ animationDelay: "120ms" }}>
            <div className="relative aspect-[4/3] overflow-hidden border border-border">
              <Image
                src="/produtos/hero-drop.png"
                alt="Campanha do drop NOITE 01: look completo preto sob luz de sódio"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <p className="font-mono text-[11px] uppercase tracking-widest text-foreground/90">
                  Campanha · Rooftop, SP · 19h47
                </p>
                <Flame className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const TICKER = [
  "FRETE GRÁTIS ACIMA DE R$ 250",
  "DROP NOITE 01 · TIRAGEM LIMITADA",
  "FEITO EM SÃO PAULO",
  "PAGAMENTO VIA PIX",
  "QUANTO ESGOTA, NÃO VOLTA",
];

export function Marquee() {
  const linha = TICKER.map((t, i) => (
    <span key={i} className="mx-6 inline-flex items-center gap-6">
      <span className="font-mono text-xs uppercase tracking-widest text-foreground/80">{t}</span>
      <span className="text-primary" aria-hidden="true">✦</span>
    </span>
  ));

  return (
    <div
      className="overflow-hidden border-y border-border bg-card py-3"
      aria-hidden="true"
    >
      <div className="texto-marquee flex w-max whitespace-nowrap">
        <div className="flex">{linha}</div>
        <div className="flex">{linha}</div>
      </div>
    </div>
  );
}
