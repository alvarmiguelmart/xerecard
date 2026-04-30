import { ButtonLink } from "@/components/ui/button";

export function EmptyStateCTA() {
  return (
    <div className="glass-panel rounded-xl p-6 text-center lg:col-span-3">
      <h3 className="text-2xl font-black text-ink">Nenhum serviço publicado ainda</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-ink/62">
        Seja o primeiro a publicar e comece a receber contatos pelo marketplace.
      </p>
      <div className="mt-5 flex justify-center">
        <ButtonLink href="/servicos/novo">Publicar anúncio</ButtonLink>
      </div>
    </div>
  );
}

