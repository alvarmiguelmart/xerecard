import { ArrowRight, BadgeCheck, BriefcaseBusiness, LockKeyhole, MessageCircle } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";

const highlights = [
  {
    icon: <BriefcaseBusiness size={18} aria-hidden="true" />,
    title: "Post services and requests",
    text: "Create a public listing for what you offer or what you need."
  },
  {
    icon: <MessageCircle size={18} aria-hidden="true" />,
    title: "Contact through WhatsApp",
    text: "Subscribers can open direct WhatsApp contact from listings."
  },
  {
    icon: <BadgeCheck size={18} aria-hidden="true" />,
    title: "Build profile trust",
    text: "Add profile photo, banner, bio, and public listings before users contact you."
  }
];

export default function EnglishPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-depth py-12 md:py-16">
        <section className="container-page grid gap-10 lg:grid-cols-[0.95fr_0.75fr] lg:items-center">
          <div className="motion-rise">
            <p className="page-kicker">
              <LockKeyhole size={14} aria-hidden="true" />
              English version
            </p>
            <h1 className="mt-3 text-5xl font-black leading-tight text-ink">
              Xerecard connects service providers and clients.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/64">
              Publish service offers, post requests, manage your public profile, and unlock
              direct WhatsApp conversations with an active subscription.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/servicos" icon={<ArrowRight size={17} aria-hidden="true" />}>
                Browse marketplace
              </ButtonLink>
              <ButtonLink href="/cadastrar" variant="secondary">
                Create account
              </ButtonLink>
              <Link className="focus-ring action-secondary inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-sm font-black" href="/">
                Português
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {highlights.map((item) => (
              <article key={item.title} className="glass-panel rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="surface-panel grid size-10 shrink-0 place-items-center rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-ink">{item.title}</h2>
                    <p className="mt-1 text-sm font-semibold leading-6 text-ink/58">
                      {item.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
