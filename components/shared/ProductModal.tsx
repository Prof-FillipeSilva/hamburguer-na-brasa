"use client";

import { Product, formatCurrency } from "@/lib/products";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect, useCallback } from "react";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      setAdded(false);
      setQuantity(1);
      setImgLoaded(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  if (!product) return null;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      handleClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg max-h-[95vh] bg-[#1e0f0f] border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden modal-slide-up">

        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden flex-shrink-0 bg-[#2B1111]">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2B1111] to-[#1e0f0f] animate-pulse" />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e0f0f] via-transparent to-transparent" />

          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-black/70 transition-all"
          >
            <span className="material-symbols-outlined text-lg leading-none">close</span>
          </button>

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-4 left-4 bg-ember-red/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
              {product.badge}
            </span>
          )}

          {/* Title overlay */}
          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="text-2xl font-heading font-bold text-white">{product.name}</h2>
            {product.serving && (
              <p className="text-xs text-white/60 mt-1">{product.serving}{product.calories && ` · ${product.calories}`}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="px-5 pt-5 pb-2 space-y-5">
            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-3xl font-heading font-bold text-flame-orange">
                {formatCurrency(product.price)}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-flame-orange flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
                  Ingredientes
                </h3>
                <ul className="space-y-2">
                  {product.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-flame-orange/60 flex-shrink-0 mt-1.5" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-flame-orange">Quantidade</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <span className="text-2xl font-heading font-bold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
                <span className="ml-auto text-flame-orange font-bold text-lg font-heading">
                  {formatCurrency(product.price * quantity)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="border-t border-white/10 px-5 py-4 flex-shrink-0">
          <button
            onClick={handleAdd}
            className={`w-full py-4 font-bold text-lg rounded-xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] ${
              added
                ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                : "bg-flame-orange text-background hover:opacity-90 shadow-lg shadow-flame-orange/20"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              {added ? "check_circle" : "add_shopping_cart"}
            </span>
            {added ? "ADICIONADO AO PEDIDO ✓" : `ADICIONAR · ${formatCurrency(product.price * quantity)}`}
          </button>
        </div>
      </div>

      <style>{`
        .modal-slide-up {
          animation: modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes modalSlideUp {
          from { transform: translateY(60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
