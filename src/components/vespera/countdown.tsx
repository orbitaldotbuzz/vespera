"use client";

// ============================================================
// VÉSPERA — countdown do drop (hidratação segura)
// ============================================================

import { useEffect, useState } from "react";

function partes(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    minutos: Math.floor((total % 3600) / 60),
    segundos: total % 60,
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export function Countdown({ deadline, compacto = false }: { deadline: number; compacto?: boolean }) {
  const [agora, setAgora] = useState<number | null>(null);

  useEffect(() => {
    setAgora(Date.now());
    const t = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (agora === null) {
    // placeholder estável antes da hidratação (mesma estrutura visual)
    return (
      <span className="font-mono tabular-nums" aria-hidden="true">
        {compacto ? "00:00:00:00" : null}
      </span>
    );
  }

  const { dias, horas, minutos, segundos } = partes(deadline - agora);
  const esgotado = deadline - agora <= 0;

  if (esgotado) {
    return <span className="font-mono text-primary">DROP ENCERRADO</span>;
  }

  if (compacto) {
    return (
      <span className="font-mono tabular-nums" role="timer" aria-label="Tempo restante do drop">
        {dias > 0 ? `${pad(dias)}d ` : ""}
        {pad(horas)}:{pad(minutos)}:{pad(segundos)}
      </span>
    );
  }

  const blocos = [
    { v: pad(dias), r: "DIA" },
    { v: pad(horas), r: "HRS" },
    { v: pad(minutos), r: "MIN" },
    { v: pad(segundos), r: "SEG" },
  ];

  return (
    <div className="flex gap-2 sm:gap-3" role="timer" aria-label="Tempo restante do drop">
      {blocos.map((b) => (
        <div
          key={b.r}
          className="flex flex-col items-center bg-secondary/80 border border-border px-3 py-2 sm:px-4 sm:py-3 min-w-[64px] sm:min-w-[76px]"
        >
          <span className="font-display text-2xl sm:text-4xl text-foreground tabular-nums leading-none">
            {b.v}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground mt-1.5 tracking-widest">
            {b.r}
          </span>
        </div>
      ))}
    </div>
  );
}
