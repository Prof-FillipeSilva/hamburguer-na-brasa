"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/products";
import { OrderInfo, getWhatsAppUrl } from "@/lib/whatsapp";
import TicketPreview from "./TicketPreview";

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

const stepLabels: Record<Step, string> = {
  1: "Seus Dados",
  2: "Como receber?",
  3: "Pagamento",
  4: "Observações",
  5: "Confirmar Pedido",
};

const labelClass = "text-xs font-bold uppercase tracking-widest text-flame-orange block mb-1.5";

export default function CheckoutFlow({ isOpen, onClose }: CheckoutFlowProps) {
  const { items, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>(1);
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    customerName: "",
    customerPhone: "",
    deliveryType: "retirada",
    addressStreet: "",
    addressNumber: "",
    addressNeighborhood: "",
    addressComplement: "",
    addressReference: "",
    tableNumber: "",
    paymentMethod: "pix",
    changeFor: undefined,
    observation: "",
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep(1);
      setErrors({});
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const total = getTotal();

  const patch = (updates: Partial<OrderInfo>) => {
    setOrderInfo((prev) => ({ ...prev, ...updates }));
    // Clear errors for fields being updated
    if (Object.keys(errors).length > 0) {
      const newErrors = { ...errors };
      Object.keys(updates).forEach((key) => delete newErrors[key]);
      setErrors(newErrors);
    }
  };

  const getInputClass = (field: string, extraClasses = "") => {
    const base = "w-full px-4 py-3 bg-card border rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-colors text-sm";
    const borderClass = errors[field]
      ? "border-red-500 focus:border-red-500"
      : "border-white/10 focus:border-flame-orange";
    return `${base} ${borderClass} ${extraClasses}`.trim();
  };

  const phoneMask = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  };

  const validateStep = (currentStep: Step): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 1) {
      if (orderInfo.customerName.trim().length < 2) {
        newErrors.customerName = "Digite seu nome completo";
        isValid = false;
      }
      if (orderInfo.customerPhone.trim().length < 14) {
        newErrors.customerPhone = "Celular inválido ou incompleto";
        isValid = false;
      }
    }

    if (currentStep === 2) {
      if (orderInfo.deliveryType === "entrega") {
        if (!(orderInfo.addressStreet?.trim())) {
          newErrors.addressStreet = "Obrigatório";
          isValid = false;
        }
        if (!(orderInfo.addressNumber?.trim())) {
          newErrors.addressNumber = "Obrigatório";
          isValid = false;
        }
        if (!(orderInfo.addressNeighborhood?.trim())) {
          newErrors.addressNeighborhood = "Obrigatório";
          isValid = false;
        }
      }
      if (orderInfo.deliveryType === "mesa") {
        if (!(orderInfo.tableNumber?.trim())) {
          newErrors.tableNumber = "Informe a mesa";
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((s) => (s + 1) as Step);
    }
  };

  const handleSendWhatsApp = () => {
    const url = getWhatsAppUrl(items, orderInfo);
    window.open(url, "_blank");
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-lg max-h-[95vh] bg-[#1e0f0f] border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden checkout-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => (s - 1) as Step)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined text-muted-foreground text-xl">arrow_back</span>
              </button>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Passo {step} de 5</p>
              <h2 className="text-base font-heading font-bold leading-tight">{stepLabels[step]}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-muted-foreground">close</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-surface-container shrink-0">
          <div
            className="h-full bg-gradient-to-r from-ember-red to-flame-orange transition-all duration-500 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-6">

          {/* STEP 1: Customer Info */}
          {step === 1 && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">Para quem será o pedido?</p>
              <div>
                <label className={labelClass}>Nome completo</label>
                <input
                  type="text"
                  placeholder="Seu nome e sobrenome"
                  value={orderInfo.customerName}
                  onChange={(e) => patch({ customerName: e.target.value })}
                  className={getInputClass("customerName")}
                />
                {errors.customerName && <p className="text-red-500 text-xs mt-1 animate-in slide-in-from-top-1">{errors.customerName}</p>}
              </div>
              <div>
                <label className={labelClass}>WhatsApp</label>
                <input
                  type="tel"
                  placeholder="(61) 99999-9999"
                  value={orderInfo.customerPhone}
                  onChange={(e) => patch({ customerPhone: phoneMask(e.target.value) })}
                  className={getInputClass("customerPhone")}
                />
                {errors.customerPhone && <p className="text-red-500 text-xs mt-1 animate-in slide-in-from-top-1">{errors.customerPhone}</p>}
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Type */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">Como deseja receber seu pedido?</p>

              {/* 3 Options */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "retirada" as const, label: "Retirada", sub: "No balcão", icon: "storefront" },
                  { key: "entrega" as const, label: "Entrega", sub: "No endereço", icon: "delivery_dining" },
                  { key: "mesa" as const, label: "Na Mesa", sub: "Consumir aqui", icon: "table_restaurant" },
                ].map(({ key, label, sub, icon }) => (
                  <button
                    key={key}
                    onClick={() => patch({ deliveryType: key })}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 flex flex-col items-center gap-1 ${orderInfo.deliveryType === key
                      ? "border-flame-orange bg-flame-orange/10 text-foreground"
                      : "border-white/10 text-muted-foreground hover:border-white/20"
                      }`}
                  >
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                    <span className="font-heading font-bold text-xs block">{label}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{sub}</span>
                  </button>
                ))}
              </div>

              {/* Endereço (entrega) */}
              {orderInfo.deliveryType === "entrega" && (
                <div className="space-y-4 animate-in slide-in-from-bottom-3 duration-300">
                  <div className="grid grid-cols-[1fr_auto] gap-3">
                    <div>
                      <label className={labelClass}>Rua / Avenida *</label>
                      <input type="text" placeholder="Ex: Rua das Flores" value={orderInfo.addressStreet} onChange={(e) => patch({ addressStreet: e.target.value })} className={getInputClass("addressStreet")} />
                      {errors.addressStreet && <p className="text-red-500 text-xs mt-1 animate-in slide-in-from-top-1">{errors.addressStreet}</p>}
                    </div>
                    <div className="w-24">
                      <label className={labelClass}>Número *</label>
                      <input type="text" placeholder="Nº" value={orderInfo.addressNumber} onChange={(e) => patch({ addressNumber: e.target.value })} className={getInputClass("addressNumber")} />
                      {errors.addressNumber && <p className="text-red-500 text-xs mt-1 animate-in slide-in-from-top-1">{errors.addressNumber}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Bairro *</label>
                    <input type="text" placeholder="Ex: Ceilândia Norte" value={orderInfo.addressNeighborhood} onChange={(e) => patch({ addressNeighborhood: e.target.value })} className={getInputClass("addressNeighborhood")} />
                    {errors.addressNeighborhood && <p className="text-red-500 text-xs mt-1 animate-in slide-in-from-top-1">{errors.addressNeighborhood}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Complemento <span className="font-normal normal-case text-muted-foreground">(opcional)</span></label>
                    <input type="text" placeholder="Apto, Bloco, Casa..." value={orderInfo.addressComplement} onChange={(e) => patch({ addressComplement: e.target.value })} className={getInputClass("addressComplement")} />
                  </div>
                  <div>
                    <label className={labelClass}>Ponto de Referência <span className="font-normal normal-case text-muted-foreground">(opcional)</span></label>
                    <input type="text" placeholder="Ex: Próximo ao mercado X" value={orderInfo.addressReference} onChange={(e) => patch({ addressReference: e.target.value })} className={getInputClass("addressReference")} />
                  </div>
                </div>
              )}

              {/* Mesa (na loja) */}
              {orderInfo.deliveryType === "mesa" && (
                <div className="animate-in slide-in-from-bottom-3 duration-300">
                  <label className={labelClass}>Número da Mesa *</label>
                  <input
                    type="text"
                    placeholder="Ex: 5"
                    value={orderInfo.tableNumber}
                    onChange={(e) => patch({ tableNumber: e.target.value })}
                    className={getInputClass("tableNumber", "text-2xl text-center font-heading font-bold tracking-widest")}
                  />
                  {errors.tableNumber && <p className="text-red-500 text-xs mt-1 text-center animate-in slide-in-from-top-1">{errors.tableNumber}</p>}
                  {!errors.tableNumber && <p className="text-xs text-muted-foreground mt-2 text-center">O número está indicado na sua mesa.</p>}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">Como vai pagar?</p>
              <div className="space-y-3">
                {[
                  { key: "pix" as const, label: "PIX", icon: "qr_code_2", desc: "Pagamento instantâneo" },
                  { key: "cartao" as const, label: "Cartão", icon: "credit_card", desc: "Débito ou Crédito (Máquina)" },
                  { key: "dinheiro" as const, label: "Dinheiro", icon: "payments", desc: "Pagamento em espécie" },
                ].map(({ key, label, icon, desc }) => (
                  <button
                    key={key}
                    onClick={() => patch({ paymentMethod: key })}
                    className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 ${orderInfo.paymentMethod === key
                      ? "border-flame-orange bg-flame-orange/10"
                      : "border-white/10 hover:border-white/20"
                      }`}
                  >
                    <span
                      className={`material-symbols-outlined text-2xl ${orderInfo.paymentMethod === key ? "text-flame-orange" : "text-muted-foreground"}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >{icon}</span>
                    <div className="text-left">
                      <span className="font-heading font-bold text-foreground block text-sm">{label}</span>
                      <span className="text-xs text-muted-foreground">{desc}</span>
                    </div>
                    {orderInfo.paymentMethod === key && (
                      <span className="material-symbols-outlined text-flame-orange ml-auto" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                  </button>
                ))}
              </div>

              {orderInfo.paymentMethod === "dinheiro" && (
                <div className="animate-in slide-in-from-bottom-3 duration-300">
                  <label className={labelClass}>Troco para quanto?</label>
                    <input
                      type="number"
                      placeholder="Ex: 100"
                      value={orderInfo.changeFor || ""}
                      onChange={(e) => patch({ changeFor: Number(e.target.value) || undefined })}
                      className={getInputClass("changeFor")}
                    />
                    {errors.changeFor && <p className="text-red-500 text-xs mt-1 animate-in slide-in-from-top-1">{errors.changeFor}</p>}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Observation */}
          {step === 4 && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">Alguma observação especial? <span className="italic">(opcional)</span></p>
              <textarea
                placeholder="Ex: Tirar cebola do Clássico, caprichar no molho..."
                value={orderInfo.observation}
                onChange={(e) => patch({ observation: e.target.value })}
                rows={5}
                className={getInputClass("observation", "resize-none")}
              />
            </div>
          )}

          {/* STEP 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center mb-4">Confira seu pedido antes de enviar:</p>
              <TicketPreview items={items} orderInfo={orderInfo} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-5 py-4 shrink-0 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{items.reduce((s, i) => s + i.quantity, 0)} item(ns)</span>
            <span className="text-flame-orange font-bold font-heading text-lg">{formatCurrency(total)}</span>
          </div>

          {step < 5 ? (
            <button
              onClick={handleNextStep}
              className="w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-base bg-flame-orange text-background hover:opacity-90 active:scale-[0.98] shadow-lg shadow-flame-orange/20"
            >
              CONTINUAR
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handleSendWhatsApp}
              className="w-full py-4 bg-gradient-to-r from-ember-red to-flame-orange text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:opacity-90 active:scale-[0.98] shadow-lg shadow-ember-red/40 text-base"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              ENVIAR PELO WHATSAPP
            </button>
          )}
        </div>
      </div>

      <style>{`
        .checkout-slide-up {
          animation: checkoutSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes checkoutSlideUp {
          from { transform: translateY(60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
