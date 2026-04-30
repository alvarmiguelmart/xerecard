"use client";

import { Languages } from "lucide-react";

export function LanguageButton() {
  function toggleEnglishVersion() {
    const isEnglish = document.cookie.includes("googtrans=/pt/en");
    const nextValue = isEnglish ? "/pt/pt" : "/pt/en";
    const maxAge = 60 * 60 * 24 * 365;

    document.cookie = `googtrans=${nextValue};path=/;max-age=${maxAge}`;

    if (!window.location.hostname.includes("localhost")) {
      document.cookie = `googtrans=${nextValue};path=/;domain=.${window.location.hostname};max-age=${maxAge}`;
    }

    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo) {
      combo.value = isEnglish ? "pt" : "en";
      combo.dispatchEvent(new Event("change"));
      return;
    }

    window.location.reload();
  }

  return (
    <button
      type="button"
      className="notranslate focus-ring action-secondary inline-flex min-h-10 min-w-16 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-black"
      aria-label="Alternar versão em inglês e português"
      title="English / Português"
      translate="no"
      onClick={toggleEnglishVersion}
    >
      <Languages size={15} aria-hidden="true" />
      <span translate="no">EN</span>
    </button>
  );
}
