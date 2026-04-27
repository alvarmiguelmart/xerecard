import type { Plan } from "@prisma/client";

export const planPriceIds: Record<Exclude<Plan, "FREE">, string | undefined> = {
  ESSENTIAL: process.env.STRIPE_ESSENTIAL_PRICE_ID,
  PROFESSIONAL: process.env.STRIPE_PROFESSIONAL_PRICE_ID
};

export const pixAmounts: Record<Exclude<Plan, "FREE">, number> = {
  ESSENTIAL: 990,
  PROFESSIONAL: 1990
};

export function normalizePaidPlan(plan: unknown): Exclude<Plan, "FREE"> {
  return plan === "PROFESSIONAL" ? "PROFESSIONAL" : "ESSENTIAL";
}
