export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: "hamburgueres" | "acompanhamentos" | "bebidas";
  badge?: string;
  ingredients?: string[];
  serving?: string;
  calories?: string;
};

export const products: Product[] = [
  // === HAMBÚRGUERES ===
  {
    id: "classico-brasa",
    name: "Clássico Brasa",
    price: 34.90,
    description: "Blend 160g angus, muito cheddar, bacon crocante no açúcar mascavo e maionese defumada.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200",
    category: "hamburgueres",
    serving: "1 unidade + embalagem",
    calories: "~820 kcal",
    ingredients: [
      "Blend bovino 160g (angus)",
      "Pão brioche artesanal",
      "Cheddar inglês fatiado",
      "Bacon crocante ao açúcar mascavo",
      "Maionese defumada da casa",
      "Alface americana",
      "Tomate italiano",
      "Cebola roxa em conserva",
    ],
  },
  {
    id: "fogo-e-mel",
    name: "Fogo e Mel",
    price: 38.90,
    description: "Blend 160g, cebola caramelizada, gorgonzola cremoso e mel de pimenta artesanal.",
    image: "https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=1200",
    category: "hamburgueres",
    badge: "🔥 Mais Pedido",
    serving: "1 unidade + embalagem",
    calories: "~940 kcal",
    ingredients: [
      "Blend bovino 160g",
      "Pão brioche artesanal",
      "Gorgonzola cremoso italiano",
      "Cebola caramelizada ao vinho",
      "Mel de pimenta artesanal",
      "Rúcula fresca",
      "Mostarda dijon",
    ],
  },
  {
    id: "smash-brasa",
    name: "Smash Brasa",
    price: 28.90,
    description: "Dois smashes de 80g, queijo americano, picles da casa e molho especial secreto.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1200",
    category: "hamburgueres",
    serving: "2 smashes + embalagem",
    calories: "~760 kcal",
    ingredients: [
      "2x Smash bovino 80g",
      "Pão potato tostado na manteiga",
      "Queijo americano",
      "Picles artesanal da casa",
      "Molho secreto (receita exclusiva)",
      "Cebola crispy",
    ],
  },
  {
    id: "duplo-inferno",
    name: "Duplo Inferno",
    price: 42.90,
    description: "Dois blends de 160g, cheddar duplo, jalapeño, onion rings e molho chipotle.",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1200",
    category: "hamburgueres",
    badge: "🌶️ Picante",
    serving: "1 unidade mega + embalagem",
    calories: "~1.180 kcal",
    ingredients: [
      "2x Blend bovino 160g",
      "Pão brioche XL artesanal",
      "Cheddar duplo fundido",
      "Jalapeño em rodelas",
      "Onion rings crocantes",
      "Molho chipotle defumado",
      "Alface americana",
    ],
  },
  // === ACOMPANHAMENTOS ===
  {
    id: "batata-rustica",
    name: "Batata Rústica",
    price: 18.90,
    description: "Batatas rústicas crocantes com cheddar, bacon e cebolinha.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1200",
    category: "acompanhamentos",
    serving: "Porção ~300g",
    calories: "~520 kcal",
    ingredients: [
      "Batatas rústicas fritas",
      "Cheddar cremoso",
      "Bacon em cubos",
      "Cebolinha fresca",
      "Tempero da casa",
    ],
  },
  {
    id: "onion-rings",
    name: "Onion Rings",
    price: 16.90,
    description: "Anéis de cebola empanados artesanalmente, crocantes por fora e macios por dentro.",
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=1200",
    category: "acompanhamentos",
    serving: "Porção ~8 anéis",
    calories: "~410 kcal",
    ingredients: [
      "Cebola doce em anéis",
      "Empanado artesanal crocante",
      "Molho ranch da casa",
    ],
  },
  // === BEBIDAS ===
  {
    id: "coca-cola-lata",
    name: "Coca-Cola Lata",
    price: 7.90,
    description: "Coca-Cola Original 350ml.",
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?q=80&w=1200",
    category: "bebidas",
    serving: "350ml",
  },
  {
    id: "suco-natural",
    name: "Suco Natural",
    price: 12.90,
    description: "Suco natural da polpa. Sabores: Maracujá, Manga e Goiaba.",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=1200",
    category: "bebidas",
    serving: "400ml",
    calories: "~180 kcal",
    ingredients: [
      "Polpa natural sem conservantes",
      "Água filtrada",
      "Açúcar demerara",
    ],
  },
];

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
