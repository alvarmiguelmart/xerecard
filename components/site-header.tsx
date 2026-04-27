import { Bell, Crown, Plus, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const navigation = [
  { label: "Serviços", href: "/servicos" },
  { label: "Planos", href: "/minha-conta#assinatura" },
  { label: "Anunciar", href: "/servicos/novo" }
];

export async function SiteHeader() {
  const session = await auth();
  const isSubscriber =
    session?.user.plan === "ESSENTIAL" || session?.user.plan === "PROFESSIONAL";

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/92 backdrop-blur-xl">
      <div className="container-page flex min-h-18 items-center justify-between gap-3 py-3 md:min-h-20">
        <Link
          href="/"
          className="focus-ring flex items-center gap-3 rounded-md text-2xl font-black uppercase tracking-normal text-ink md:text-4xl"
          aria-label="Xerecard início"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-acid text-base shadow-[0_8px_18px_rgba(0,225,11,0.22)] md:size-11 md:text-xl">
            X
          </span>
          <span>Xerecard</span>
        </Link>

        <nav className="hidden items-center rounded-full border border-ink/10 bg-white/70 p-1 md:flex" aria-label="Principal">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-full px-4 py-2 text-sm font-black text-ink/64 hover:bg-cloud hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/servicos"
            className="focus-ring grid size-10 place-items-center rounded-lg border border-ink/10 bg-white text-ink hover:bg-cloud sm:hidden"
            aria-label="Buscar serviços"
          >
            <Search size={18} aria-hidden="true" />
          </Link>
          {session ? (
            <>
              <Link
                href="/notificacoes"
                className="focus-ring hidden size-11 place-items-center rounded-lg border border-ink/10 bg-white text-ink hover:bg-cloud sm:grid"
                aria-label="Notificações"
              >
                <Bell size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/minha-conta"
                className="focus-ring hidden items-center gap-2 rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm font-black text-ink hover:bg-cloud lg:flex"
              >
                {isSubscriber ? (
                  <Crown size={17} aria-hidden="true" />
                ) : (
                  <UserRound size={17} aria-hidden="true" />
                )}
                {session.user.name ?? "Minha conta"}
              </Link>
              <ButtonLink
                href="/servicos/novo"
                size="sm"
                icon={<Plus size={16} aria-hidden="true" />}
              >
                Anunciar
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="secondary" size="sm">
                Entrar
              </ButtonLink>
              <ButtonLink href="/cadastrar" size="sm">
                Começar
              </ButtonLink>
            </>
          )}
        </div>
      </div>
      <nav className="container-page flex gap-2 overflow-x-auto pb-3 md:hidden" aria-label="Principal mobile">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="focus-ring rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-black text-ink/70"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
