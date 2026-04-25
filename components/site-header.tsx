import { Bell, Plus, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const navigation = [
  { label: "Explorar", href: "/servicos" },
  { label: "Categorias", href: "/servicos" },
  { label: "Planos", href: "/minha-conta#assinatura" }
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/90 backdrop-blur-xl">
      <div className="container-page flex min-h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="focus-ring inline-flex items-center gap-2 rounded-md text-ink"
          aria-label="Xerecard início"
        >
          <span className="relative size-11 overflow-hidden rounded-lg bg-white">
            <Image
              src="/brand/xerecard.png"
              alt=""
              fill
              sizes="44px"
              className="object-contain"
              priority
            />
          </span>
          <span className="text-xl font-black uppercase tracking-normal">Xerecard</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
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
                className="focus-ring hidden size-11 place-items-center rounded-lg border border-ink/10 bg-white text-ink hover:bg-cloud sm:grid"
                aria-label="Minha conta"
              >
                <UserRound size={18} aria-hidden="true" />
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
              <ButtonLink href="/login" variant="ghost" size="sm">
                Entrar
              </ButtonLink>
              <ButtonLink href="/cadastrar" size="sm">
                Criar
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
