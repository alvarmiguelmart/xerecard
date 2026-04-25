export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white py-8">
      <div className="container-page flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-black uppercase text-ink">Xerecard</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink/54">
            Marketplace para publicar, descobrir e liberar contatos privados.
          </p>
        </div>
        <p className="text-sm font-semibold text-ink/50">
          Simples, direto e privado.
        </p>
      </div>
    </footer>
  );
}
