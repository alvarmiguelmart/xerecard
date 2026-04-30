"use client";

import { Languages } from "lucide-react";

export function LanguageButton() {
  function toggleEnglishVersion() {
    const currentUrl = new URL(window.location.href);

    if (currentUrl.pathname === "/en") {
      window.location.href = "/";
      return;
    }

    if (!currentUrl.hostname.includes("translate.google") && !currentUrl.hostname.endsWith(".translate.goog")) {
      window.location.href = "/en";
      return;
    }

    if (currentUrl.hostname.includes("translate.google")) {
      const originalUrl = currentUrl.searchParams.get("u");
      if (originalUrl) {
        window.location.href = originalUrl;
        return;
      }
    }

    if (currentUrl.hostname.endsWith(".translate.goog")) {
      const originalHost = currentUrl.hostname
        .replace(/\.translate\.goog$/, "")
        .replace(/-/g, ".");
      window.location.href = `https://${originalHost}${currentUrl.pathname}`;
      return;
    }

    const url = new URL("https://translate.google.com/translate");
    url.searchParams.set("sl", "pt");
    url.searchParams.set("tl", "en");
    url.searchParams.set("u", window.location.href);
    window.location.href = url.toString();
  }

  return (
    <button
      type="button"
      className="focus-ring action-secondary inline-flex min-h-10 min-w-16 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-black"
      aria-label="Alternar versão em inglês e português"
      title="English / Português"
      onClick={toggleEnglishVersion}
    >
      <Languages size={15} aria-hidden="true" />
      EN
    </button>
  );
}
