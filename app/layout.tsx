import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { getMetadataBaseUrl } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xerecard | Marketplace de serviços",
  description:
    "Xerecard conecta quem precisa contratar com quem oferece serviços, com anúncios, avisos de interesse e contato pelo WhatsApp para assinantes.",
  metadataBase: new URL(getMetadataBaseUrl()),
  openGraph: {
    title: "Xerecard",
    description:
      "Publique pedidos, anuncie serviços e desbloqueie contatos diretos pelo WhatsApp.",
    images: ["/opengraph-image"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Xerecard",
    description:
      "Publique pedidos, anuncie serviços e desbloqueie contatos diretos pelo WhatsApp.",
    images: ["/opengraph-image"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('xerecard-theme')==='light')document.body.classList.add('theme-light')}catch(e){}"
          }}
        />
        <div id="google_translate_element" className="hidden" />
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "window.googleTranslateElementInit=function(){new window.google.translate.TranslateElement({pageLanguage:'pt',includedLanguages:'en,pt',autoDisplay:false},'google_translate_element')};"
          }}
        />
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}

