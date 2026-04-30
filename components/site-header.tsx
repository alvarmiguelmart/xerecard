import { Crown, Plus, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { LanguageButton } from "@/components/language-button";
import { NotificationLink } from "@/components/notification-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const navigation = [
  { label: "Serviços", href: "/servicos" },
  { label: "Planos", href: "/#planos" },
  { label: "Anunciar", href: "/servicos/novo" }
];

export async function SiteHeader() {
  const session = await auth();
  const isSubscriber =
    session?.user.plan === "ESSENTIAL" || session?.user.plan === "PROFESSIONAL";
  const unreadNotifications = session
    ? await prisma.notification.count({
        where: { recipientId: session.user.id, readAt: null }
      })
    : 0;

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/82 backdrop-blur-xl">
      <div className="container-page flex min-h-18 items-center justify-between gap-3 py-3 md:min-h-20">
        <Link
          href="/"
          className="focus-ring flex items-center rounded-md text-2xl font-black tracking-normal text-ink md:text-4xl"
          aria-label="xR início"
        >
          <span className="grid size-9 place-items-center rounded-lg border border-sky/35 bg-panel text-sm text-white shadow-[0_10px_24px_rgba(56,189,248,0.14)] md:size-11 md:text-base">
            xR
          </span>
        </Link>

        <nav className="hidden items-center rounded-full border border-ink/10 bg-white/70 p-1 shadow-[0_12px_30px_rgba(0,0,0,0.16)] md:flex" aria-label="Principal">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-full px-4 py-2 text-sm font-black text-ink/64 transition hover:bg-panel hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageButton />
          <Link
            href="/servicos"
            className="focus-ring action-secondary grid size-10 place-items-center rounded-lg sm:hidden"
            aria-label="Buscar serviços"
          >
            <Search size={18} aria-hidden="true" />
          </Link>
          {session ? (
            <>
              <NotificationLink initialUnreadCount={unreadNotifications} />
              <Link
                href="/minha-conta"
                className="focus-ring action-primary grid size-10 place-items-center rounded-lg ring-2 ring-sky/30 lg:hidden"
                aria-label="Minha conta: editar perfil"
                title="Minha conta: editar perfil"
              >
                <UserRound size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/minha-conta"
                className="focus-ring action-primary relative hidden items-center gap-2 rounded-lg px-4 py-3 text-sm font-black ring-2 ring-sky/30 transition duration-200 hover:-translate-y-0.5 lg:flex"
                title="Minha conta: editar perfil"
              >
                <span className="absolute -top-2 right-2 rounded-full bg-sky px-2 py-0.5 text-[10px] font-black uppercase text-ink shadow-sm">
                  Editar perfil
                </span>
                {isSubscriber ? (
                  <Crown size={17} aria-hidden="true" />
                ) : (
                  <UserRound size={17} aria-hidden="true" />
                )}
                Minha conta
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
              <Link
                href="/login"
                className="focus-ring action-primary group relative inline-flex min-h-10 shrink-0 items-center justify-center overflow-hidden rounded-lg px-4 text-sm font-black transition duration-200 hover:-translate-y-0.5"
              >
                <span className="absolute inset-y-0 -left-8 w-6 skew-x-[-18deg] bg-white/35 opacity-0 transition duration-300 group-hover:left-[115%] group-hover:opacity-100" />
                <span className="relative">Entrar</span>
              </Link>
              <ButtonLink href="/cadastrar" size="sm">
                Criar conta
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

