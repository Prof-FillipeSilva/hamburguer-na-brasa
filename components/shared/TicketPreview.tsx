"use client";

import { CartItem } from "@/store/cartStore";
import { formatCurrency } from "@/lib/products";
import { OrderInfo, buildFullAddress } from "@/lib/whatsapp";

interface TicketPreviewProps {
  items: CartItem[];
  orderInfo: OrderInfo;
}

const deliveryLabels: Record<string, { icon: string; label: string }> = {
  retirada: { icon: "🏪", label: "Retirada no Balcão" },
  entrega: { icon: "🛵", label: "Entrega a Domicílio" },
  mesa: { icon: "🪑", label: "Consumir na Loja" },
};

const paymentLabels: Record<string, string> = {
  pix: "PIX",
  dinheiro: "Dinheiro em Espécie",
  cartao: "Cartão (Débito/Crédito)",
};

export default function TicketPreview({ items, orderInfo }: TicketPreviewProps) {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const now = new Date();
  const delivery = deliveryLabels[orderInfo.deliveryType] || deliveryLabels.retirada;

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Ticket container */}
      <div className="relative bg-gradient-to-b from-[#1e0f0f] to-[#2B2D42] rounded-t-2xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-ember-red via-flame-orange to-ember-red" />

        {/* Brand */}
        <div className="flex flex-col items-center pt-6 pb-4 px-5">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-flame-orange/60 shadow-lg shadow-flame-orange/30 mb-3 bg-[#1e0f0f]">
            <img src="/logo_hamb_rguer_na_brasa_atualizada.png" alt="Logo Hambúrguer na Brasa" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-base font-heading font-bold text-foreground tracking-wider uppercase">
            Hambúrguer na Brasa
          </h3>
          <p className="text-xs text-flame-orange italic mt-0.5">Artesanal de verdade, feito no fogo.</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {now.toLocaleDateString("pt-BR")} às {now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        <div className="border-t border-dashed border-white/20 mx-4" />

        {/* Customer */}
        <div className="px-5 py-4 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-flame-orange mb-2">Cliente</p>
          <Row label="Nome" value={orderInfo.customerName} />
          <Row label="WhatsApp" value={orderInfo.customerPhone} />
        </div>

        <div className="border-t border-dashed border-white/20 mx-4" />

        {/* Items */}
        <div className="px-5 py-4 space-y-2.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-flame-orange mb-2">Itens do Pedido</p>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start text-sm">
              <div className="flex items-start gap-2">
                <span className="text-flame-orange font-bold text-xs mt-0.5">{item.quantity}x</span>
                <span className="text-foreground leading-tight">{item.name}</span>
              </div>
              <span className="text-foreground font-medium whitespace-nowrap ml-2">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-white/20 mx-4" />

        {/* Delivery & Payment */}
        <div className="px-5 py-4 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-flame-orange mb-2">Entrega & Pagamento</p>
          <Row
            label={`${delivery.icon} ${delivery.label}`}
            value={
              orderInfo.deliveryType === "entrega"
                ? buildFullAddress(orderInfo) || "—"
                : orderInfo.deliveryType === "mesa"
                ? `Mesa ${orderInfo.tableNumber || "—"}`
                : "Balcão da loja"
            }
          />
          <Row label="Pagamento" value={paymentLabels[orderInfo.paymentMethod]} />
          {orderInfo.paymentMethod === "dinheiro" && orderInfo.changeFor && (
            <Row label="Troco para" value={formatCurrency(orderInfo.changeFor)} />
          )}
        </div>

        {/* Total */}
        <div className="bg-flame-orange/10 border-t border-flame-orange/30 px-5 py-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-heading font-bold text-flame-orange uppercase">Total</span>
            <span className="text-2xl font-heading font-bold text-flame-orange">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Observation */}
        {orderInfo.observation?.trim() && (
          <div className="px-5 py-3 bg-white/5">
            <p className="text-xs text-muted-foreground">
              📝 <span className="italic">{orderInfo.observation}</span>
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col items-center py-5 space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            Feito no fogo, feito com amor
          </p>
        </div>
      </div>

      {/* Torn edge */}
      <div className="w-full overflow-hidden h-4">
        <svg viewBox="0 0 400 16" className="w-full" preserveAspectRatio="none">
          <path
            d="M0,0 L10,8 L20,0 L30,8 L40,0 L50,8 L60,0 L70,8 L80,0 L90,8 L100,0 L110,8 L120,0 L130,8 L140,0 L150,8 L160,0 L170,8 L180,0 L190,8 L200,0 L210,8 L220,0 L230,8 L240,0 L250,8 L260,0 L270,8 L280,0 L290,8 L300,0 L310,8 L320,0 L330,8 L340,0 L350,8 L360,0 L370,8 L380,0 L390,8 L400,0 L400,16 L0,16 Z"
            fill="#2B2D42"
          />
        </svg>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-foreground font-medium text-right leading-tight">{value}</span>
    </div>
  );
}
