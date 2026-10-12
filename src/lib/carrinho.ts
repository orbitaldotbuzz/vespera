"use client";

// ============================================================
// VÉSPERA — carrinho (Zustand + persistência localStorage)
// ============================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ItemCarrinho } from "@/lib/vespera";

interface EstadoCarrinho {
  itens: ItemCarrinho[];
  aberto: boolean;
  abrir: () => void;
  fechar: () => void;
  adicionar: (item: ItemCarrinho) => void;
  alterarQty: (produtoSlug: string, tamanho: string, delta: number) => void;
  remover: (produtoSlug: string, tamanho: string) => void;
  limpar: () => void;
}

const mesmoItem = (a: ItemCarrinho, slug: string, tamanho: string) =>
  a.produtoSlug === slug && a.tamanho === tamanho;

export const useCarrinho = create<EstadoCarrinho>()(
  persist(
    (set) => ({
      itens: [],
      aberto: false,
      abrir: () => set({ aberto: true }),
      fechar: () => set({ aberto: false }),
      adicionar: (item) =>
        set((estado) => {
          const existente = estado.itens.find((i) => mesmoItem(item, item.produtoSlug, item.tamanho));
          if (existente) {
            return {
              itens: estado.itens.map((i) =>
                mesmoItem(i, item.produtoSlug, item.tamanho)
                  ? { ...i, qty: Math.min(i.qty + item.qty, 10) }
                  : i
              ),
            };
          }
          return { itens: [...estado.itens, item] };
        }),
      alterarQty: (produtoSlug, tamanho, delta) =>
        set((estado) => ({
          itens: estado.itens
            .map((i) =>
              mesmoItem(i, produtoSlug, tamanho)
                ? { ...i, qty: Math.max(0, Math.min(i.qty + delta, 10)) }
                : i
            )
            .filter((i) => i.qty > 0),
        })),
      remover: (produtoSlug, tamanho) =>
        set((estado) => ({
          itens: estado.itens.filter((i) => !mesmoItem(i, produtoSlug, tamanho)),
        })),
      limpar: () => set({ itens: [] }),
    }),
    {
      name: "vespera-carrinho",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
