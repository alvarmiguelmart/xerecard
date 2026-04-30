import Stripe from "stripe";
import { NextResponse } from "next/server";
import { normalizePaidPlan, subscriptionStatusHasContactAccess } from "@/lib/billing";
import { createNotification } from "@/lib/marketplace-db";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

type StripeLookup = {
  userId?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
};

type StripeUser = {
  id: string;
  plan: "FREE" | "ESSENTIAL" | "PROFESSIONAL";
  stripeCustomerId: string | null;
};

function getStripeObjectId(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return typeof id === "string" ? id : null;
  }

  return null;
}

async function findStripeUser({
  userId,
  customerId,
  subscriptionId
}: StripeLookup): Promise<StripeUser | null> {
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, plan: true, stripeCustomerId: true }
    });

    if (!user || (user.stripeCustomerId && customerId && user.stripeCustomerId !== customerId)) {
      return null;
    }

    return user;
  }

  const clauses = [
    subscriptionId ? { stripeSubscriptionId: subscriptionId } : null,
    customerId ? { stripeCustomerId: customerId } : null
  ].filter(Boolean) as Array<{ stripeSubscriptionId: string } | { stripeCustomerId: string }>;

  if (clauses.length === 0) {
    return null;
  }

  return prisma.user.findFirst({
    where: { OR: clauses },
    select: { id: true, plan: true, stripeCustomerId: true }
  });
}

async function activateCheckout(checkout: Stripe.Checkout.Session, stripe: Stripe) {
  const userId = checkout.metadata?.userId;
  const plan = normalizePaidPlan(checkout.metadata?.plan);
  const customerId = getStripeObjectId(checkout.customer);
  const subscriptionId = getStripeObjectId(checkout.subscription);

  if (!customerId) {
    return;
  }

  const user = await findStripeUser({ userId, customerId, subscriptionId });

  if (!user) {
    return;
  }

  const subscription =
    checkout.mode === "subscription" && subscriptionId
      ? await stripe.subscriptions.retrieve(subscriptionId)
      : null;
  const subscriptionStatus = subscription?.status ?? null;
  const hasAccess =
    checkout.mode === "payment"
      ? checkout.payment_status === "paid"
      : subscriptionStatusHasContactAccess(subscriptionStatus);

  if (!hasAccess) {
    return;
  }

  const planExpiresAt =
    checkout.mode === "payment"
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : null;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan,
      planExpiresAt,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripeSubscriptionStatus: subscriptionStatus
    }
  });

  await createNotification({
    recipientId: user.id,
    type: "SUBSCRIPTION",
    title:
      subscriptionStatus === "trialing"
        ? "Teste grátis ativado"
        : "Assinatura ativada",
    message:
      checkout.mode === "payment"
        ? "Pagamento Pix aprovado. Seu acesso foi liberado por 30 dias."
        : subscriptionStatus === "trialing"
          ? "Seu teste grátis de 30 dias começou. WhatsApp liberado."
          : "Assinatura por cartão aprovada. WhatsApp liberado."
  });
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const customerId = getStripeObjectId(subscription.customer);
  const user = await findStripeUser({
    userId: subscription.metadata?.userId,
    customerId,
    subscriptionId
  });

  if (!user) {
    return;
  }

  const hasAccess = subscriptionStatusHasContactAccess(subscription.status);
  const plan = hasAccess
    ? normalizePaidPlan(subscription.metadata?.plan ?? user.plan)
    : "FREE";

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan,
      planExpiresAt: null,
      stripeCustomerId: customerId ?? user.stripeCustomerId,
      stripeSubscriptionId: subscriptionId,
      stripeSubscriptionStatus: subscription.status
    }
  });

  if (!hasAccess) {
    await createNotification({
      recipientId: user.id,
      type: "SUBSCRIPTION",
      title: "Assinatura pausada",
      message: "Seu plano não está ativo no momento. Renove para abrir contatos pelo WhatsApp."
    });
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = getStripeObjectId((invoice as { subscription?: unknown }).subscription);
  const customerId = getStripeObjectId(invoice.customer);
  const user = await findStripeUser({ customerId, subscriptionId });

  if (!user) {
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: "FREE",
      planExpiresAt: null,
      stripeCustomerId: customerId ?? user.stripeCustomerId,
      stripeSubscriptionId: subscriptionId ?? undefined,
      stripeSubscriptionStatus: "payment_failed"
    }
  });

  await createNotification({
    recipientId: user.id,
    type: "SUBSCRIPTION",
    title: "Pagamento não aprovado",
    message: "Não conseguimos confirmar o pagamento. Atualize o plano para reabrir contatos."
  });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { message: "Stripe webhook não configurado." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ message: "Assinatura ausente." }, { status: 400 });
  }

  const rawBody = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await activateCheckout(event.data.object as Stripe.Checkout.Session, stripe);
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      await syncSubscription(event.data.object as Stripe.Subscription);
    }

    if (event.type === "invoice.payment_failed") {
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ message: "Webhook inválido." }, { status: 400 });
  }
}

