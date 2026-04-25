import { PlanId } from "@/lib/marketplace-data";

export const planPriceIds: Record<Exclude<PlanId, "FREE">, string | undefined> = {
  ESSENTIAL: process.env.STRIPE_ESSENTIAL_PRICE_ID,
  PROFESSIONAL: process.env.STRIPE_PROFESSIONAL_PRICE_ID
};

export const pixAmounts: Record<Exclude<PlanId, "FREE">, number> = {
  ESSENTIAL: 990,
  PROFESSIONAL: 1990
};

export function normalizePaidPlan(plan: unknown): Exclude<PlanId, "FREE"> {
  return plan === "PROFESSIONAL" ? "PROFESSIONAL" : "ESSENTIAL";
}
