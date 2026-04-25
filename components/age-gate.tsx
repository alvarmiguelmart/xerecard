"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const storageKey = "xerecard-age-confirmed";

export function AgeGate() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(window.localStorage.getItem(storageKey) !== "true");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function confirmAge() {
    window.localStorage.setItem(storageKey, "true");
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/82 p-4 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-xl border border-white/10 bg-white p-6 shadow-2xl">
        <p className="text-sm font-black uppercase text-sky">Xerecard</p>
        <h2 className="mt-3 text-3xl font-black leading-tight text-ink">
          Algumas áreas são para maiores de 18 anos.
        </h2>
        <p className="mt-4 text-sm leading-6 text-ink/62">
          Ao continuar, você confirma que tem 18 anos ou mais e entende que
          determinadas categorias podem ter acesso restrito.
        </p>
        <div className="mt-6 grid gap-3">
          <Button type="button" onClick={confirmAge} size="lg">
            Continuar
          </Button>
          <a
            href="https://www.google.com"
            className="focus-ring inline-flex min-h-12 items-center justify-center rounded-lg border border-ink/12 bg-white px-5 text-sm font-bold text-ink hover:bg-cloud"
          >
            Sair
          </a>
        </div>
      </section>
    </div>
  );
}
