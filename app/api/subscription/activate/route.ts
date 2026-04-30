import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import {
  hasActiveContactAccess,
  normalizePaidPlan,
  planPriceIds,
  subscriptionTrialDays
} from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import { getAppUrl, getStripe } from "@/lib/stripe";

type ActivatePayload = {
  plan?: string;
  method?: "card";
};

export async function POST(request: Request) {
  try {
    return await createCheckoutSession(request);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { message: error.message || "Stripe não conseguiu iniciar o pagamento." },
        { status: error.statusCode ?? 502 }
      );
    }

    throw error;
  }
}

async function createCheckoutSession(request: Request) {
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
  const method = "card";
  const appUrl = getAppUrl();
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user?.email) {
    return NextResponse.json(
      { message: "Usuário sem email válido para checkout." },
      { status: 400 }
    );
  }

  if (hasActiveContactAccess(user)) {
    return NextResponse.json({
      ok: true,
      url: `${appUrl}/minha-conta?checkout=already-active`
    });
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
  } else {
    try {
      await stripe.customers.retrieve(customerId);
    } catch (error) {
      if (!(error instanceof Stripe.errors.StripeError && error.code === "resource_missing")) {
        throw error;
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id }
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: null,
          stripeSubscriptionStatus: null
        }
      });
    }
  }

  if (method === "card") {
    const price = planPriceIds[plan];
    const trialEligible = !user.stripeSubscriptionId && user.plan === "FREE";

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
      subscription_data: {
        trial_period_days: trialEligible ? subscriptionTrialDays : undefined,
        metadata: { userId: user.id, plan, method }
      },
      success_url: `${appUrl}/minha-conta?checkout=success`,
      cancel_url: `${appUrl}/minha-conta?checkout=cancel`,
      metadata: {
        userId: user.id,
        plan,
        method,
        trialDays: trialEligible ? String(subscriptionTrialDays) : "0"
      }
    });

    return NextResponse.json({ ok: true, url: checkout.url });
  }

  return NextResponse.json(
    { message: "Pix temporariamente indisponível. Use cartão para ativar o teste." },
    { status: 400 }
  );
}

