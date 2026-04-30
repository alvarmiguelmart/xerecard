import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAppUrl, getStripe } from "@/lib/stripe";

export async function POST() {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { message: "Entre para gerenciar sua assinatura." },
      { status: 401 }
    );
  }

  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json(
      { message: "Configure STRIPE_SECRET_KEY para habilitar o portal." },
      { status: 503 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true }
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { message: "Nenhum cliente Stripe encontrado para esta conta." },
      { status: 404 }
    );
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${getAppUrl()}/minha-conta?tab=assinatura`
  });

  return NextResponse.json({ ok: true, url: portal.url });
}

