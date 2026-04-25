import { Bell, Crown, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const navigation = [
  { label: "Serviços", href: "/servicos" },
  { label: "Planos", href: "/minha-conta#assinatura" },
  { label: "Publicar", href: "/servicos/novo" }
];

export async function SiteHeader() {
  const session = await auth();
  const isSubscriber =
    session?.user.plan === "ESSENTIAL" || session?.user.plan === "PROFESSIONAL";

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/92 backdrop-blur-xl">
      <div className="container-page flex min-h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="focus-ring rounded-md text-3xl font-black uppercase tracking-normal text-ink md:text-4xl"
          aria-label="Xerecard início"
        >
          Xerecard
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-md text-sm font-bold text-ink/64 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
                className="focus-ring hidden items-center gap-2 rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm font-bold text-ink hover:bg-cloud lg:flex"
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
                Publicar
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="secondary" size="sm">
                Entrar
              </ButtonLink>
              <ButtonLink href="/cadastrar" size="sm">
                Criar conta
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
