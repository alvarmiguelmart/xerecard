# Xerecard Agent Guide

## Project Context

Xerecard is a Next.js marketplace for publishing requests and offers, gated WhatsApp contact, user profiles, notifications, and Stripe-backed subscription plans. The product is Brazilian Portuguese first, with an adult-content age gate and marketplace categories around digital services, creators, privacy, paid communities, and premium content.

Keep changes practical and production-minded. Preserve the marketplace flow: discover listings, publish a request or offer, view public profiles, unlock WhatsApp contact through a plan, and receive private notifications.

## Stack

- Next.js 16 App Router with React 19 and TypeScript.
- Tailwind CSS 4 via `app/globals.css` theme tokens.
- Auth.js / NextAuth v5 in `lib/auth.ts`.
- Prisma ORM with PostgreSQL/Supabase in `prisma/schema.prisma`.
- Stripe Checkout and webhooks in `lib/stripe.ts`, `lib/billing.ts`, and `app/api/stripe/webhook/route.ts`.
- ESLint 9 and TypeScript validation.

## Important Commands

Run from the repository root:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
npm run prisma:generate
npm run db:push
```

Use `npm run build`, `npm run lint`, and `npm run typecheck` before considering a production-facing change complete. Use `npm run db:push` only when Prisma schema changes need to be applied to the configured database.

## Environment

Copy `.env.example` to `.env` for local work. Required production-grade variables include:

- `DATABASE_URL` and `DIRECT_URL` for Supabase/PostgreSQL.
- `AUTH_SECRET`, `AUTH_URL`, and `NEXT_PUBLIC_APP_URL`.
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` for Google OAuth, optional locally.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_ESSENTIAL_PRICE_ID`, and `STRIPE_PROFESSIONAL_PRICE_ID`.

Do not commit real secrets. The app can fall back to seed marketplace data in development when `DATABASE_URL` is missing or unusable; database-backed actions still require a working Prisma connection.

## Repository Map

- `app/`: App Router pages and API routes.
- `app/api/auth/*`: registration and NextAuth route handlers.
- `app/api/services/*`: listing creation, likes, ratings, and WhatsApp contact protection.
- `app/api/subscription/activate/route.ts`: checkout session creation.
- `app/api/stripe/webhook/route.ts`: Stripe event handling and plan activation.
- `components/`: reusable UI and client components.
- `components/ui/button.tsx`: shared button and link styles.
- `lib/`: auth, Prisma, marketplace data access, phone normalization, billing, uploads, and utilities.
- `prisma/schema.prisma`: database models and enums.
- `public/brand/`: brand assets.
- `public/generated/`: generated marketplace imagery.

## Data Model Notes

The core Prisma models are:

- `User`: role, plan, profile data, Stripe identifiers, services, notifications, likes, and ratings.
- `Service`: request or offer listing with category, location, price label, description, WhatsApp, image, and owner.
- `Like` and `Rating`: unique per user and service.
- `Notification`: private user notifications for publishing, interest, likes, ratings, and subscriptions.
- Auth.js models: `Account`, `Session`, and `VerificationToken`.

Keep enum values aligned with existing code:

- `UserRole`: `CLIENT`, `PROFESSIONAL`.
- `Plan`: `FREE`, `ESSENTIAL`, `PROFESSIONAL`.
- `ServiceMode`: `REQUEST`, `OFFER`.
- `NotificationType`: `SERVICE_PUBLISHED`, `SERVICE_INTEREST`, `SERVICE_LIKE`, `SERVICE_RATING`, `SUBSCRIPTION`.

## Coding Guidelines

- Prefer server components and server-side data loading unless interactivity requires a client component.
- Use existing helpers before creating new ones: `prisma`, `auth`, `normalizeBrazilianWhatsApp`, marketplace data mappers, billing helpers, and `cn`.
- Validate external input in route handlers and forms. Existing code uses `zod`; keep using it.
- Normalize Brazilian WhatsApp numbers through `lib/phone.ts` before storing or building contact links.
- Keep database writes in API routes, server actions, or server-only helpers.
- Do not expose private contact information to free users; route WhatsApp access through the existing protected endpoint.
- Preserve the seed-data fallback behavior in marketplace reads where it already exists.
- Avoid broad refactors unless they directly support the requested change.

## UI And Product Guidelines

- Use the Tailwind theme tokens from `app/globals.css`: `ink`, `paper`, `cloud`, `line`, `coral`, `rose`, `mint`, `acid`, `sky`, `gold`, `blue`, and `lilac`.
- Reuse `Button` and `ButtonLink` from `components/ui/button.tsx`.
- Keep interface copy in Brazilian Portuguese.
- Preserve the current visual direction: clean marketplace surfaces, strong green/accent brand color, compact cards, clear CTAs, and mobile-first layouts.
- Keep age-gated/adult marketplace behavior explicit and respectful. Do not remove the age gate without a deliberate product decision.
- For new icons, use `lucide-react`, already installed.

## Auth, Billing, And Security

- Auth uses JWT sessions with Prisma-backed users. Session fields are enriched with `id`, `role`, `plan`, `name`, and `image` in `lib/auth.ts`.
- Password login uses `bcryptjs`; never store plaintext passwords.
- Stripe checkout supports card subscriptions and Pix-style one-time checkout flows. Plan activation should happen from verified webhook events.
- Webhook handlers must read the raw request body and verify signatures with `STRIPE_WEBHOOK_SECRET`.
- Keep redirects based on `NEXT_PUBLIC_APP_URL`.
- Never log secrets, tokens, raw payment payloads beyond what is needed for debugging.

## Uploads And Storage

`public/uploads` is suitable only for local development. For production serverless deployments, use persistent storage such as Vercel Blob, S3, or Supabase Storage. Do not build new production features that rely on local filesystem persistence unless the storage limitation is documented.

## Validation Checklist

Before handing off meaningful code changes:

1. Run `npm run typecheck`.
2. Run `npm run lint`.
3. Run `npm run build` for route, server component, and Prisma integration changes.
4. Run `npm run prisma:generate` after Prisma schema changes.
5. Check affected flows manually in `npm run dev` when UI, auth, upload, checkout, or protected WhatsApp contact behavior changes.

## Deployment Notes

- Vercel deployment needs all environment variables configured in the project.
- Stripe production webhook URL should be `/api/stripe/webhook` on the final domain.
- Google OAuth callback should be `/api/auth/callback/google` on both local and production domains.
- Run `npm run build`, `npm run lint`, and `npm run typecheck` before deployment.
