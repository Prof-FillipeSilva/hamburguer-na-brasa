"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import MenuSection from "@/components/sections/MenuSection";
import CartDrawer from "@/components/shared/CartDrawer";
import CheckoutFlow from "@/components/shared/CheckoutFlow";
import ActiveOrderBar from "@/components/shared/ActiveOrderBar";

/* ─── Animated counter hook ─── */
function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─── Intersection Observer hook ─── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Stat card ─── */
function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: string }) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 1400, inView);
  return (
    <div ref={ref} className={`text-center space-y-1 animate-fade-in-up ${delay}`}>
      <p className="text-3xl md:text-4xl font-heading font-black text-gradient-fire">
        {inView ? count : 0}{suffix}
      </p>
      <p className="text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
    </div>
  );
}

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setTimeout(() => setIsCheckoutOpen(true), 200);
  };

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="pt-0">

        {/* ══════════════════════════════════════════
            HERO SECTION — CSS Animations
        ══════════════════════════════════════════ */}
        <section
          className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden charcoal-texture pt-24 pb-12"
        >
          {/* Fire orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-ember-red/20 blur-[140px] fire-orb" />
            <div className="absolute bottom-10 -left-56 w-[450px] h-[450px] bg-flame-orange/10 blur-[110px] fire-orb" style={{ animationDelay: "2.5s" }} />
          </div>

          {/* Bottom fade to background */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

          {/* Hero image — entrance */}
          <div
            className={`absolute right-0 bottom-0 w-full md:w-[58%] h-[50%] md:h-full pointer-events-none transition-all duration-1000 delay-300 ${heroVisible ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-105 translate-x-8"}`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1600')",
                WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.6) 30%, transparent 90%), linear-gradient(to top, transparent 0%, black 35%)",
                maskImage: "linear-gradient(to left, rgba(0,0,0,0.6) 30%, transparent 90%), linear-gradient(to top, transparent 0%, black 35%)",
                WebkitMaskComposite: "destination-in",
                maskComposite: "intersect",
              }}
            />
          </div>

          {/* Text content */}
          <div
            className="relative z-20 max-w-2xl space-y-7 px-6 md:px-12"
          >
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 w-fit transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <span className="text-xl animate-fire-flicker">🔥</span>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-flame-orange/90 border border-flame-orange/20 bg-flame-orange/5 px-3 py-1 rounded-full">
                Ceilândia · DF
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`text-[3rem] md:text-[5rem] lg:text-[6rem] font-heading font-black leading-[0.95] tracking-tight transition-all duration-700 delay-100 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              O Verdadeiro{" "}
              <span className="text-gradient-fire">Sabor<br />da Brasa</span>
              <br />
              <span className="text-foreground/75">em Ceilândia.</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-base md:text-lg text-muted-foreground max-w-md leading-relaxed transition-all duration-700 delay-200 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              Hambúrgueres artesanais, suculentos e com aquele toque de fumaça que você só encontra aqui.
              Feitos na hora, direto do carvão.
            </p>

            {/* CTAs */}
            <div className={`flex flex-wrap gap-3 pt-1 transition-all duration-700 delay-300 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <a
                href="#cardapio"
                className="inline-flex items-center gap-2 bg-ember-red text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-ember-red/30 text-sm hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant_menu</span>
                VER CARDÁPIO
              </a>
              <button
                onClick={() => setIsCartOpen(true)}
                className="inline-flex items-center gap-2 border border-white/20 text-foreground font-bold px-7 py-3.5 rounded-xl hover:bg-white/5 text-sm hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                MEU PEDIDO
              </button>
            </div>

            {/* Trust badges */}
            <div className={`flex flex-wrap gap-5 pt-2 transition-all duration-700 delay-500 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {[
                { icon: "verified", label: "Angus Selecionado" },
                { icon: "local_fire_department", label: "Grelhado no Carvão" },
                { icon: "delivery_dining", label: "Entrega Rápida" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="material-symbols-outlined text-ember-red text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  {label}
                </div>
              ))}
            </div>

            {/* Scroll cue */}
            <div
              className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50 pt-4 select-none transition-all duration-700 delay-700 ${heroVisible ? "opacity-100" : "opacity-0"} animate-bounce`}
            >
              <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
              Rolar para baixo
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════════ */}
        <section className="py-12 px-5 border-y border-white/5 bg-card/40">
          <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value={500} suffix="+" label="Pedidos / Mês" delay="delay-100" />
            <StatCard value={4} suffix=".9★" label="Avaliação Média" delay="delay-200" />
            <StatCard value={20} suffix="min" label="Tempo Médio" delay="delay-300" />
            <StatCard value={100} suffix="%" label="Artesanal" delay="delay-400" />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            "FEITO NO FOGO" FEATURE SECTION
        ══════════════════════════════════════════ */}
        <section className="py-20 px-5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-3 mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-ember-red">Nossa Essência</p>
              <h2 className="text-3xl md:text-4xl font-heading font-black">Por que somos diferentes?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "local_fire_department",
                  title: "Grelhado no Fogo",
                  desc: "Nossos blends são grelhados em fogo alto sobre carvão e lenha, garantindo suculência interna e aquela crostinha defumada inconfundível.",
                  delay: "delay-100",
                },
                {
                  icon: "eco",
                  title: "Ingredientes Frescos",
                  desc: "Selecionamos fornecedores locais. Cada ingrediente é escolhido com cuidado para garantir o máximo de sabor e frescor no seu prato.",
                  delay: "delay-200",
                },
                {
                  icon: "favorite",
                  title: "Feito com Amor",
                  desc: "Cada hambúrguer é preparado individualmente, com atenção a cada detalhe. Não é fast food — é comida de verdade, na hora.",
                  delay: "delay-300",
                },
              ].map(({ icon, title, desc, delay }) => (
                <div
                  key={title}
                  className={`group relative bg-card rounded-2xl p-7 border border-white/5 hover:border-ember-red/30 transition-all duration-300 hover:shadow-xl hover:shadow-ember-red/10 animate-fade-in-up ${delay}`}
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ember-red/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                  <div className="w-12 h-12 rounded-xl bg-ember-red/10 flex items-center justify-center mb-5 group-hover:bg-ember-red/20 transition-colors duration-300">
                    <span className="material-symbols-outlined text-ember-red text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-3">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            MENU SECTION
        ══════════════════════════════════════════ */}
        <MenuSection />

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <footer id="footer-contato" className="bg-[#0e0606] border-t border-white/5 pt-16 pb-28 md:pb-16">
          <div className="max-w-5xl mx-auto px-5">

            {/* Top Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

              {/* Brand Column */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-heading font-black text-gradient-fire">Hambúrguer na Brasa</h2>
                  <p className="text-sm text-muted-foreground mt-1 italic">Artesanal de verdade, feito no fogo.</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A melhor experiência em hamburgueria artesanal de Ceilândia. Cada mordida conta a história de quem faz com paixão.
                </p>
              </div>

              {/* Horários & Contato */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-ember-red flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                    Horário de Funcionamento
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Segunda — Quinta</span>
                      <span className="text-foreground font-medium">18h — 23h</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Sexta — Sábado</span>
                      <span className="text-foreground font-medium">18h — 00h</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Domingo</span>
                      <span className="text-foreground font-medium">18h — 23h</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-ember-red flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>contact_phone</span>
                    Contato
                  </h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <a href="https://wa.me/5561993586071" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ember-red transition-colors">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-ember-red shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      (61) 99358-6071
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ember-red transition-colors">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-ember-red shrink-0">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                      @hamburguernbrasa
                    </a>
                    <div className="flex items-start gap-2 pt-1">
                      <span className="material-symbols-outlined text-base text-ember-red mt-0.5">location_on</span>
                      <span>QNO 06 Conjunto B lote 30,<br />Ceilândia Norte — Brasília/DF</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-ember-red flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                  Como Chegar
                </h4>
                <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.9!2d-48.0!3d-15.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935bcc43c!2sCeil%C3%A2ndia%2C%20Bras%C3%ADlia%20-%20DF!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.5)" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização Hambúrguer na Brasa"
                  />
                </div>
                <a
                  href="https://maps.google.com/?q=Ceilândia+Norte+DF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-ember-red hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  Abrir no Google Maps
                </a>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                © 2026 Hambúrguer na Brasa. Todos os direitos reservados.
              </p>
              <p className="text-xs text-muted-foreground/50">
                Feito com 🔥 em Ceilândia — DF
              </p>
            </div>
          </div>
        </footer>

        {/* ══════════════════════════════════════════
            BOTTOM NAV (mobile only)
        ══════════════════════════════════════════ */}
        <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-2 bg-background/95 backdrop-blur-xl border-t border-white/10 md:hidden">
          <a href="#" className="flex flex-col items-center justify-center text-flame-orange py-1 px-3">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            <span className="text-[10px] mt-0.5 font-medium">Início</span>
          </a>
          <a href="#cardapio" className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors py-1 px-3">
            <span className="material-symbols-outlined text-xl">restaurant_menu</span>
            <span className="text-[10px] mt-0.5 font-medium">Cardápio</span>
          </a>
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors py-1 px-3"
          >
            <span className="material-symbols-outlined text-xl">shopping_bag</span>
            <span className="text-[10px] mt-0.5 font-medium">Sacola</span>
          </button>
          <a href="#footer-contato" className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors py-1 px-3">
            <span className="material-symbols-outlined text-xl">location_on</span>
            <span className="text-[10px] mt-0.5 font-medium">Local</span>
          </a>
        </nav>
      </main>

      {/* Pedido Ativo Flutuante */}
      <ActiveOrderBar onOpenCart={() => setIsCartOpen(true)} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* Checkout Flow */}
      <CheckoutFlow
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5561993586071"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 w-14 h-14 bg-ember-red text-white rounded-full flex items-center justify-center shadow-lg shadow-ember-red/30 hover:scale-110 active:scale-95 transition-all duration-300 animate-fade-in-up"
        aria-label="Falar no WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </>
  );
}
