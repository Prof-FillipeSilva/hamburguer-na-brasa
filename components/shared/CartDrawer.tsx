"use client";

import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/products";
import { useEffect, useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const total = getTotal();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-background border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-flame-orange text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              shopping_bag
            </span>
            <h2 className="text-xl font-heading font-bold">Sua Sacola</h2>
            <span className="text-xs bg-ember-red text-white px-2 py-0.5 rounded-full font-bold">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-muted-foreground">close</span>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <span className="material-symbols-outlined text-6xl text-muted-foreground/30">shopping_bag</span>
              <p className="text-muted-foreground text-lg">Sua sacola está vazia</p>
              <p className="text-muted-foreground/60 text-sm">Adicione itens do cardápio para começar!</p>
              <button onClick={onClose} className="mt-4 px-6 py-3 bg-flame-orange text-background font-semibold rounded-lg transition-all hover:opacity-90">
                Ver Cardápio
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-card rounded-xl p-4 border border-white/5 flex gap-4 items-center">
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-medium text-foreground truncate">{item.name}</h4>
                  <p className="text-flame-orange font-bold text-sm mt-1">{formatCurrency(item.price * item.quantity)}</p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 bg-background rounded-lg border border-white/10">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-ember-red transition-colors rounded-l-lg hover:bg-white/5"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {item.quantity === 1 ? "delete" : "remove"}
                    </span>
                  </button>
                  <span className="w-6 text-center font-bold text-foreground text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-flame-orange transition-colors rounded-r-lg hover:bg-white/5"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-5 py-4 space-y-4">
            {/* Clear cart */}
            <button
              onClick={() => {
                if (confirm("Limpar toda a sacola?")) clearCart();
              }}
              className="w-full text-center text-xs text-muted-foreground hover:text-ember-red transition-colors"
            >
              Limpar sacola
            </button>

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Total</span>
              <span className="text-2xl font-heading font-bold text-flame-orange">{formatCurrency(total)}</span>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={onCheckout}
              className="w-full py-4 bg-flame-orange text-background font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 active:scale-[0.98] shadow-lg shadow-flame-orange/20 text-lg"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              FINALIZAR PEDIDO
            </button>
          </div>
        )}
      </div>
    </>
  );
}
