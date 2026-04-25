import type { Metadata, Viewport } from "next";
import { AgeGate } from "@/components/age-gate";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xerecard | Marketplace de contatos privados",
  description:
    "Xerecard conecta pedidos, ofertas, serviços digitais, comunidades e contatos privados em uma vitrine simples.",
  metadataBase: new URL("https://xerecard.vercel.app"),
  openGraph: {
    title: "Xerecard",
    description:
      "Marketplace simples para publicar, descobrir e liberar contatos privados.",
    images: ["/brand/xerecard.png"]
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
