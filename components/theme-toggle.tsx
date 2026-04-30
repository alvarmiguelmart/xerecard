"use client";

import { SunMoon } from "lucide-react";

const storageKey = "xerecard-theme";

export function ThemeToggle() {
  function toggleTheme() {
    const nextIsLight = !document.body.classList.contains("theme-light");
    document.body.classList.toggle("theme-light", nextIsLight);
    localStorage.setItem(storageKey, nextIsLight ? "light" : "dark");
  }

  return (
    <button
      type="button"
      className="focus-ring action-secondary grid size-10 place-items-center rounded-lg"
      aria-label="Alternar modo claro e escuro"
      title="Modo claro/escuro"
      onClick={toggleTheme}
    >
      <SunMoon size={18} aria-hidden="true" />
    </button>
  );
}
