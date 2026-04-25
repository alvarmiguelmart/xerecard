import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xerecard | Marketplace de serviços",
  description:
    "Xerecard é um marketplace para publicar pedidos, oferecer serviços, entrar na conta e gerenciar assinatura.",
  metadataBase: new URL("https://xerecard.vercel.app"),
  openGraph: {
    title: "Xerecard",
    description:
      "Publique pedidos, ofereça serviços, acompanhe notificações e gerencie sua conta.",
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
      <body>{children}</body>
    </html>
  );
}
