"use client";

import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/products";
import { useState, useEffect } from "react";

interface ActiveOrderBarProps {
  onOpenCart: () => void;
}

export default function ActiveOrderBar({ onOpenCart }: ActiveOrderBarProps) {
  const { items, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [lastCount, setLastCount] = useState(0);
  const [bump, setBump] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const count = items.reduce((s, i) => s + i.quantity, 0);
    if (count > 0) {
      setVisible(true);
      if (count !== lastCount) {
        setBump(true);
        setTimeout(() => setBump(false), 400);
      }
    } else {
      setVisible(false);
    }
    setLastCount(count);
  }, [items, mounted, lastCount]);

  if (!mounted || !visible) return null;

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const total = getTotal();

  return (
    <div className={`fixed bottom-20 md:bottom-6 left-4 z-40 flex pointer-events-none`}>
      <button
        onClick={onOpenCart}
        className={`pointer-events-auto w-auto bg-flame-orange text-background font-bold rounded-full flex items-center gap-4 px-4 py-2.5 shadow-xl shadow-flame-orange/20 transition-all duration-300 hover:opacity-95 active:scale-[0.98] border border-background/10 ${
          bump ? "scale-[1.04]" : ""
        }`}
        style={{ transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-background/20 rounded-full flex items-center justify-center font-heading text-xs font-black">
            {totalItems}
          </span>
          <span className="text-sm font-bold hidden sm:inline">Ver Pedido</span>
        </div>

        <div className="flex items-center gap-1.5 pl-2 border-l border-background/20">
          <span className="text-sm font-heading font-black">{formatCurrency(total)}</span>
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            shopping_bag
          </span>
        </div>
      </button>
    </div>
  );
}
