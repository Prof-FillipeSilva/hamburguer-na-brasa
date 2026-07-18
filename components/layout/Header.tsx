"use client";

import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";

interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const items = useCartStore((s) => s.items);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;

  return (
    <header
      className={`fixed top-0 w-full z-50 flex justify-between items-center px-5 h-14 transition-all duration-300 animate-fade-in-up ${
        scrolled
          ? "bg-background/95 shadow-2xl backdrop-blur-xl border-b border-white/8"
          : "bg-transparent"
      }`}
    >
      {/* Logo wordmark */}
      <a href="#" className="flex items-center gap-2 group">
        <span className="text-flame-orange animate-fire-flicker text-lg">🔥</span>
        <span className="font-heading font-black text-base uppercase tracking-wider text-foreground group-hover:text-flame-orange transition-colors duration-200">
          Na Brasa
        </span>
      </a>

      {/* Right side: nav + cart */}
      <div className="flex items-center gap-2">
        <a
          href="#cardapio"
          className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
        >
          Cardápio
        </a>

        {/* Cart button — prominent pill */}
        <button
          onClick={onCartClick}
          className="relative flex items-center gap-2 bg-ember-red-deep hover:bg-ember-red-deep/90 text-white font-bold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-lg shadow-ember-red/30 text-sm active:scale-95 hover:scale-105"
          aria-label="Abrir carrinho"
        >
          <span
            className="material-symbols-outlined text-lg leading-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            shopping_bag
          </span>
          <span className="hidden sm:inline">Sacola</span>

          {totalItems > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-ember-red-deep text-[10px] font-black animate-bounce">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
