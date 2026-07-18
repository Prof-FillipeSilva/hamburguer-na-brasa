"use client";

import { Product, formatCurrency } from "@/lib/products";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { Eye, CheckCircle2, PlusCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export default function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const { addItem, items } = useCartStore();
  const [justAdded, setJustAdded] = useState(false);

  const itemInCart = items.find((i) => i.id === product.id);
  const cartCount = itemInCart?.quantity ?? 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  return (
    <div
      onClick={() => onOpenModal(product)}
      className="group relative bg-card rounded-2xl overflow-hidden flex flex-col shadow-xl border border-white/5 cursor-pointer transition-all duration-300 hover:border-flame-orange/30 hover:shadow-flame-orange/10 hover:shadow-2xl active:scale-[0.98]"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-[#2B1111]">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url('${product.image}')` }}
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-ember-red/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
            {product.badge}
          </span>
        )}

        {/* Cart badge (if already in cart) */}
        {cartCount > 0 && (
          <span className="absolute top-3 right-3 bg-flame-orange text-background text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
            {cartCount}
          </span>
        )}

        {/* "Ver detalhes" overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 border border-white/20">
            <Eye size={15} strokeWidth={2.25} />
            Ver detalhes
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-base font-heading font-semibold leading-tight">{product.name}</h4>
          <span className="text-flame-orange font-bold whitespace-nowrap text-base font-heading">
            {formatCurrency(product.price)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 flex-grow leading-relaxed">
          {product.description}
        </p>

        {/* CTA */}
        <button
          onClick={handleQuickAdd}
          className={`w-full mt-2 py-2.5 font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-300 text-sm ${
            justAdded
              ? "bg-green-600/20 text-green-400 border border-green-500/40"
              : "bg-flame-orange/10 border border-flame-orange/30 text-flame-orange hover:bg-flame-orange/20"
          }`}
        >
          {justAdded
            ? <CheckCircle2 size={16} strokeWidth={2.25} />
            : <PlusCircle size={16} strokeWidth={2.25} />}
          {justAdded ? "Adicionado!" : "Adicionar"}
        </button>
      </div>
    </div>
  );
}
