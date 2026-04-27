import type { Metadata, Viewport } from "next";
import { AgeGate } from "@/components/age-gate";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xerecard | Marketplace de serviços",
  description:
    "Xerecard conecta quem precisa contratar com quem oferece serviços, com anúncios, avisos de interesse e contato pelo WhatsApp para assinantes.",
  metadataBase: new URL("https://xerecard.vercel.app"),
  openGraph: {
    title: "Xerecard",
    description:
      "Publique pedidos, anuncie serviços e desbloqueie contatos diretos pelo WhatsApp.",
    images: ["/generated/marketplace-hero.png"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7af28d"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AgeGate />
        {children}
      </body>
    </html>
  );
}
