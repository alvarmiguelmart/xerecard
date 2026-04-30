"use client";

import { Languages } from "lucide-react";
import { useState } from "react";

const GOOGLE_TRANSLATE_COOKIE = "googtrans";
const ENGLISH_VALUE = "/pt/en";
const PORTUGUESE_VALUE = "/pt/pt";

function getCookieValue(name: string) {
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1];
}

function isTranslatedToEnglish() {
  return getCookieValue(GOOGLE_TRANSLATE_COOKIE) === ENGLISH_VALUE;
}

function setTranslateCookie(value: string) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=${value};path=/;max-age=${maxAge};SameSite=Lax`;

  const hostname = window.location.hostname;
  if (hostname !== "localhost" && hostname.includes(".")) {
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=${value};path=/;domain=.${hostname};max-age=${maxAge};SameSite=Lax`;
  }
}

function applyGoogleTranslate(language: "en" | "pt") {
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!combo) {
    return false;
  }

  combo.value = language;
  combo.dispatchEvent(new Event("change"));
  return true;
}

export function LanguageButton() {
  const [isEnglish, setIsEnglish] = useState(() =>
    typeof document === "undefined" ? false : isTranslatedToEnglish()
  );

  function toggleEnglishVersion() {
    const nextIsEnglish = !isEnglish;
    const nextCookieValue = nextIsEnglish ? ENGLISH_VALUE : PORTUGUESE_VALUE;
    const nextLanguage = nextIsEnglish ? "en" : "pt";

    setTranslateCookie(nextCookieValue);
    setIsEnglish(nextIsEnglish);

    if (applyGoogleTranslate(nextLanguage)) {
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
      aria-pressed={isEnglish}
      onClick={toggleEnglishVersion}
    >
      <Languages size={15} aria-hidden="true" />
      <span translate="no">{isEnglish ? "PT" : "EN"}</span>
    </button>
  );
}
