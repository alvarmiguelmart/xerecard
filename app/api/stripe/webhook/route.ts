import { NextResponse } from "next/server";
import { normalizePaidPlan } from "@/lib/billing";
import { createNotification } from "@/lib/marketplace-db";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

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

    if (event.type === "checkout.session.completed") {
      const checkout = event.data.object;
      const userId = checkout.metadata?.userId;
      const plan = normalizePaidPlan(checkout.metadata?.plan);

      if (userId) {
        const planExpiresAt =
          checkout.mode === "payment"
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            : null;

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            planExpiresAt,
            stripeCustomerId:
              typeof checkout.customer === "string" ? checkout.customer : undefined,
            stripeSubscriptionId:
              typeof checkout.subscription === "string"
                ? checkout.subscription
                : undefined
          }
        });

        await createNotification({
          recipientId: userId,
          type: "SUBSCRIPTION",
          title: "Assinatura ativada",
          message:
            checkout.mode === "payment"
              ? "Pagamento Pix aprovado. Seu acesso foi liberado por 30 dias."
              : "Assinatura por cartão aprovada. WhatsApp liberado."
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ message: "Webhook inválido." }, { status: 400 });
  }
}
