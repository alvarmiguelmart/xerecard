import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { normalizePaidPlan, pixAmounts, planPriceIds } from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import { getAppUrl, getStripe } from "@/lib/stripe";

type ActivatePayload = {
  plan?: string;
  method?: "card" | "pix";
};

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { message: "Entre para ativar uma assinatura." },
      { status: 401 }
    );
  }

  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json(
      { message: "Configure STRIPE_SECRET_KEY para habilitar pagamentos reais." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as ActivatePayload | null;
  const plan = normalizePaidPlan(body?.plan);
  const method = body?.method === "pix" ? "pix" : "card";
  const appUrl = getAppUrl();
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user?.email) {
    return NextResponse.json(
      { message: "Usuário sem email válido para checkout." },
      { status: 400 }
    );
  }

  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id }
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId }
    });
  }

  if (method === "card") {
    const price = planPriceIds[plan];

    if (!price) {
      return NextResponse.json(
        { message: "Configure o Price ID recorrente do Stripe para este plano." },
        { status: 503 }
      );
    }

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price, quantity: 1 }],
      success_url: `${appUrl}/minha-conta?checkout=success`,
      cancel_url: `${appUrl}/minha-conta?checkout=cancel`,
      metadata: { userId: user.id, plan, method }
    });

    return NextResponse.json({ ok: true, url: checkout.url });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    payment_method_types: ["pix"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: { name: `Xerecard ${plan === "ESSENTIAL" ? "Essencial" : "Profissional"}` },
          unit_amount: pixAmounts[plan]
        },
        quantity: 1
      }
    ],
    payment_method_options: {
      pix: { expires_after_seconds: 3600 }
    },
    success_url: `${appUrl}/minha-conta?checkout=success`,
    cancel_url: `${appUrl}/minha-conta?checkout=cancel`,
    metadata: { userId: user.id, plan, method }
  });

  return NextResponse.json({ ok: true, url: checkout.url });
}
