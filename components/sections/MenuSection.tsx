"use client";

import { useState, useRef, useEffect } from "react";
import { products, Product } from "@/lib/products";
import ProductCard from "@/components/shared/ProductCard";
import ProductModal from "@/components/shared/ProductModal";
import { LayoutGrid, Sandwich, UtensilsCrossed, Coffee, ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORIES = [
  { key: "todos", label: "Todos", Icon: LayoutGrid },
  { key: "hamburgueres", label: "Hambúrgueres", Icon: Sandwich },
  { key: "acompanhamentos", label: "Acompanhamentos", Icon: UtensilsCrossed },
  { key: "bebidas", label: "Bebidas", Icon: Coffee },
] as const;

type CategoryKey = typeof CATEGORIES[number]["key"];

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    // Small delay so the DOM is ready before measuring
    const timer = setTimeout(checkScroll, 50);
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timer);
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 180 : -180, behavior: "smooth" });
  };

  const handleSelect = (key: CategoryKey, index: number) => {
    setActiveCategory(key);
    // Scroll button into view if partially hidden
    const el = scrollRef.current;
    if (!el) return;
    const btn = el.children[index] as HTMLElement;
    const btnLeft = btn.offsetLeft;
    const btnRight = btnLeft + btn.offsetWidth;
    const viewLeft = el.scrollLeft;
    const viewRight = viewLeft + el.clientWidth;
    if (btnLeft < viewLeft + 8) {
      el.scrollBy({ left: btnLeft - viewLeft - 12, behavior: "smooth" });
    } else if (btnRight > viewRight - 8) {
      el.scrollBy({ left: btnRight - viewRight + 12, behavior: "smooth" });
    }
  };

  return (
    <>
      <section id="cardapio" className="py-12 px-4 max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-flame-orange flex items-center gap-2">
            <span className="w-4 h-px bg-flame-orange" />
            Cardápio
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Escolha o seu favorito
          </h2>
        </div>

        {/* Category Tabs — 3 visible + arrow navigation */}
        <div className="flex items-center gap-2 mb-8">

          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Categorias anteriores"
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
              canScrollLeft
                ? "border-white/20 text-foreground bg-card hover:bg-white/10"
                : "border-white/5 text-white/20 cursor-default"
            }`}
          >
            <ChevronLeft size={18} strokeWidth={2.25} />
          </button>

          {/* Scrollable Track */}
          <div className="relative flex-1 min-w-0 overflow-hidden">
            {/* Left edge fade */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity duration-200 ${
                canScrollLeft ? "opacity-100" : "opacity-0"
              }`}
            />

            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto no-scrollbar"
            >
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat.key}
                  onClick={() => handleSelect(cat.key, i)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat.key
                      ? "bg-flame-orange text-background shadow-md shadow-flame-orange/25"
                      : "bg-card border border-white/10 text-muted-foreground hover:border-flame-orange/40 hover:text-foreground"
                  }`}
                  style={{ minWidth: "calc(33.333% - 0.35rem)" }}
                >
                  <cat.Icon size={18} strokeWidth={activeCategory === cat.key ? 2.5 : 2} />
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Right edge fade */}
            <div
              className={`absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity duration-200 ${
                canScrollRight ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Mais categorias"
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
              canScrollRight
                ? "border-flame-orange/40 text-flame-orange bg-flame-orange/10 hover:bg-flame-orange/20"
                : "border-white/5 text-white/20 cursor-default"
            }`}
          >
            <ChevronRight size={18} strokeWidth={2.25} />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenModal={setSelectedProduct}
            />
          ))}
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
