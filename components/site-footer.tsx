export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-panel py-10 text-white">
      <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-black uppercase text-white">Xerecard</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/62">
            Marketplace para pedir, oferecer e encontrar serviços com contato
            direto pelo WhatsApp para assinantes.
          </p>
        </div>
        <p className="rounded-full border border-white/12 px-4 py-2 text-sm font-black text-white/72">
          Contatos liberados no plano Essencial
        </p>
      </div>
    </footer>
  );
}

