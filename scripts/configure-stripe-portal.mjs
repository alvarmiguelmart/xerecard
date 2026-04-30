import fs from "node:fs";
import Stripe from "stripe";

function readEnvFile(path) {
  const env = {};

  for (const line of fs.readFileSync(path, "utf8").split(/\r?\n/)) {
    const index = line.indexOf("=");

    if (index < 1 || line.trimStart().startsWith("#")) {
      continue;
    }

    let value = line.slice(index + 1).trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    env[line.slice(0, index).trim()] = value;
  }

  return env;
}

const env = fs.existsSync(".env.vercel") ? readEnvFile(".env.vercel") : process.env;

if (!env.STRIPE_SECRET_KEY) {
  const stripeKeys = Object.keys(env).filter((key) => key.includes("STRIPE")).join(", ");
  throw new Error(`STRIPE_SECRET_KEY missing from .env.vercel. Found: ${stripeKeys}`);
}

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia"
});

const configs = await stripe.billingPortal.configurations.list({ limit: 10 });
const existing = configs.data.find((config) => config.active);

const configInput = {
  business_profile: {
    headline: "Gerencie sua assinatura Xerecard"
  },
  features: {
    customer_update: {
      enabled: true,
      allowed_updates: ["email", "name"]
    },
    invoice_history: {
      enabled: true
    },
    payment_method_update: {
      enabled: true
    },
    subscription_cancel: {
      enabled: true,
      mode: "at_period_end",
      cancellation_reason: {
        enabled: true,
        options: ["too_expensive", "missing_features", "switched_service", "unused", "other"]
      }
    },
    subscription_update: {
      enabled: false
    }
  }
};

const config = existing
  ? await stripe.billingPortal.configurations.update(existing.id, configInput)
  : await stripe.billingPortal.configurations.create(configInput);

console.log(`stripe_portal_configuration=${config.id}`);
console.log(`active=${config.active}`);
console.log(`default=${config.is_default}`);
