import { CartItem } from "@/store/cartStore";
import { formatCurrency } from "./products";

export interface OrderInfo {
  customerName: string;
  customerPhone: string;
  deliveryType: "retirada" | "entrega" | "mesa";
  // Endereço em campos individuais
  addressStreet?: string;
  addressNumber?: string;
  addressNeighborhood?: string;
  addressComplement?: string;
  addressReference?: string;
  // Mesa (para "consumir na loja")
  tableNumber?: string;
  paymentMethod: "pix" | "cartao" | "dinheiro";
  changeFor?: number;
  observation?: string;
}

export function buildFullAddress(orderInfo: OrderInfo): string {
  const parts = [
    orderInfo.addressStreet,
    orderInfo.addressNumber ? `nº ${orderInfo.addressNumber}` : null,
    orderInfo.addressNeighborhood,
    orderInfo.addressComplement,
    orderInfo.addressReference ? `Ref: ${orderInfo.addressReference}` : null,
  ].filter(Boolean);
  return parts.join(", ");
}

export function getWhatsAppUrl(items: CartItem[], orderInfo: OrderInfo): string {
  const phone = "5561993586071"; // Número oficial da Hamburgueria
  const message = buildWhatsAppMessage(items, orderInfo);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function buildWhatsAppMessage(items: CartItem[], info: OrderInfo): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR");
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const paymentLabels: Record<string, string> = {
    pix: "PIX",
    cartao: "Cartão (Débito/Crédito)",
    dinheiro: "Dinheiro em Espécie",
  };

  let subtotal = 0;
  for (const item of items) {
    subtotal += item.price * item.quantity;
  }

  // ─── Cabeçalho ───────────────────────────────────────────────
  let msg = "";
  msg += `*HAMBÚRGUER NA BRASA*\n`;
  msg += `_Artesanal de verdade, feito no fogo._\n`;
  msg += `\`${dateStr} às ${timeStr}\`\n`;
  msg += `\n`;

  // ─── Pedido ──────────────────────────────────────────────────
  msg += `*PEDIDO*\n`;
  msg += `\`\`\`\n`;
  for (const item of items) {
    const itemTotal = item.price * item.quantity;
    const namePad = item.name.length > 20 ? item.name.substring(0, 18) + ".." : item.name;
    const qtyLabel = `${item.quantity}x ${namePad}`;
    const priceLabel = formatCurrency(itemTotal);
    const dots = ".".repeat(Math.max(2, 30 - qtyLabel.length - priceLabel.length));
    msg += `${qtyLabel}${dots}${priceLabel}\n`;
  }
  msg += `${"─".repeat(30)}\n`;
  const totalLabel = "TOTAL";
  const totalValue = formatCurrency(subtotal);
  const totalDots = ".".repeat(Math.max(2, 30 - totalLabel.length - totalValue.length));
  msg += `${totalLabel}${totalDots}${totalValue}\n`;
  msg += `\`\`\`\n`;
  msg += `\n`;

  // ─── Cliente ─────────────────────────────────────────────────
  msg += `*CLIENTE*\n`;
  msg += `Nome:      ${info.customerName}\n`;
  msg += `WhatsApp:  ${info.customerPhone}\n`;
  msg += `\n`;

  // ─── Modalidade ──────────────────────────────────────────────
  msg += `*MODALIDADE*\n`;
  if (info.deliveryType === "entrega") {
    const addr = buildFullAddress(info);
    msg += `Entrega a Domicílio\n`;
    msg += `Endereço: _${addr || "Não informado"}_\n`;
  } else if (info.deliveryType === "mesa") {
    msg += `Consumir na Loja\n`;
    msg += `Mesa: ${info.tableNumber || "Não informada"}\n`;
  } else {
    msg += `Retirada no Balcão\n`;
  }
  msg += `\n`;

  // ─── Pagamento ───────────────────────────────────────────────
  msg += `*PAGAMENTO*\n`;
  msg += `${paymentLabels[info.paymentMethod] || info.paymentMethod}`;
  if (info.paymentMethod === "dinheiro" && info.changeFor) {
    msg += ` — Troco para ${formatCurrency(info.changeFor)}`;
  }
  msg += `\n`;

  // ─── Observações ─────────────────────────────────────────────
  if (info.observation?.trim()) {
    msg += `\n*OBSERVAÇÕES*\n`;
    msg += `_${info.observation.trim()}_\n`;
  }

  // ─── Rodapé ──────────────────────────────────────────────────
  msg += `\n`;
  msg += `_Pedido recebido pelo site. Aguardando confirmação._`;

  return msg;
}

