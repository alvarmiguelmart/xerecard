import type { Plan } from "@prisma/client";

export type PaidPlan = Exclude<Plan, "FREE">;

function cleanEnv(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, "").replace(/\s/g, "");
}

export const planPriceIds: Record<Exclude<Plan, "FREE">, string | undefined> = {
  ESSENTIAL: cleanEnv(process.env.STRIPE_ESSENTIAL_PRICE_ID),
  PROFESSIONAL: cleanEnv(process.env.STRIPE_PROFESSIONAL_PRICE_ID)
};

export const pixAmounts: Record<Exclude<Plan, "FREE">, number> = {
  ESSENTIAL: 599,
  PROFESSIONAL: 1299
};

export const subscriptionTrialDays = 30;

const activeSubscriptionStatuses = new Set(["active", "trialing"]);

export type ContactAccessUser = {
  plan: Plan;
  planExpiresAt?: Date | null;
  stripeSubscriptionId?: string | null;
  stripeSubscriptionStatus?: string | null;
};

export function normalizePaidPlan(plan: unknown): PaidPlan {
  return plan === "PROFESSIONAL" ? "PROFESSIONAL" : "ESSENTIAL";
}

export function hasActiveContactAccess(user: ContactAccessUser | null | undefined, now = new Date()) {
  if (!user || user.plan === "FREE") {
    return false;
  }

  if (user.planExpiresAt && user.planExpiresAt.getTime() <= now.getTime()) {
    return false;
  }

  if (!user.stripeSubscriptionId) {
    return Boolean(user.planExpiresAt && user.planExpiresAt.getTime() > now.getTime());
  }

  if (!user.stripeSubscriptionStatus) {
    return true;
  }

  return activeSubscriptionStatuses.has(user.stripeSubscriptionStatus);
}

export function subscriptionStatusHasContactAccess(status: string | null | undefined) {
  return Boolean(status && activeSubscriptionStatuses.has(status));
}
