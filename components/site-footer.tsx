export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white py-10">
      <div className="container-page flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-black uppercase text-ink">Xerecard</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink/58">
            Marketplace de serviços com assinatura acessível, login, publicação
            de anúncios, notificações e contato via WhatsApp liberado para assinantes.
          </p>
        </div>
        <p className="text-sm font-semibold text-ink/50">
          Primeira versão pronta para receber banco, pagamentos e verificação real.
        </p>
      </div>
    </footer>
  );
}
