import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  title: "Hambúrguer na Brasa | Ceilândia - DF",
  description: "Hambúrgueres artesanais, suculentos e com aquele toque de fumaça que você só encontra aqui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* Conecta cedo ao CDN de imagens e pré-carrega a imagem do hero (LCP) */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=70&w=1000"
          fetchPriority="high"
        />
      </head>
      <body className={`${inter.variable} ${oswald.variable} font-body bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
