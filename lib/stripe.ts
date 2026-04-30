import Stripe from "stripe";
export { getAppUrl } from "@/lib/env";

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
    ?.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\s/g, "");

  if (!secretKey) {
    return null;
  }

  return new Stripe(secretKey, {
    apiVersion: "2026-04-22.dahlia"
  });
}
