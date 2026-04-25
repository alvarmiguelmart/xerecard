# Xerecard

Marketplace de servicos em Next.js onde usuarios podem publicar pedidos, oferecer servicos, assinar planos baratos e liberar contato via WhatsApp.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Auth.js / NextAuth v5
- Prisma ORM
- Stripe Checkout para cartao e Pix
- ESLint

## Recursos implementados

- Cadastro e login reais por e-mail/senha.
- Login social por Google quando as credenciais OAuth estiverem configuradas.
- Perfil com nome e foto editaveis.
- Publicacao de pedidos e ofertas com upload de imagem.
- Marketplace com listagem por trilhos horizontais, detalhe, curtidas, notas e contato por WhatsApp.
- Perfil publico do usuario com avatar, publicacoes, curtidas recebidas e avaliacoes.
- Gate de assinatura: usuario gratuito nao abre o WhatsApp do anuncio.
- Planos Essencial e Profissional com checkout por cartao ou Pix.
- Webhook da Stripe para liberar plano e criar notificacao de assinatura.
- Notificacoes privadas para publicacao no ar, interesse, curtidas, notas e assinatura.
- Cadastro de WhatsApp com DDD e numero, sem precisar informar codigo do pais.
- Imagens geradas em `public/generated/`.

## Como rodar localmente

```bash
copy .env.example .env
npm install
npm run db:push
npm run dev
```

Acesse `http://localhost:3000`.

## Variaveis de ambiente

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="replace-with-a-long-random-secret"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""

STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_ESSENTIAL_PRICE_ID=""
STRIPE_PROFESSIONAL_PRICE_ID=""
```

Para desenvolvimento, o projeto usa SQLite via Prisma. Para producao na Vercel, use um banco persistente, como Vercel Postgres, Neon ou Supabase, e ajuste `DATABASE_URL` e o provider do Prisma conforme o banco escolhido antes de rodar `npm run db:push`.

## Stripe

Crie dois produtos/precos recorrentes na Stripe:

- Essencial: `R$ 9,90/mês`
- Profissional: `R$ 19,90/mês`

Depois preencha:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_ESSENTIAL_PRICE_ID`
- `STRIPE_PROFESSIONAL_PRICE_ID`

O webhook de producao deve apontar para:

```text
https://seu-dominio.com/api/stripe/webhook
```

O pagamento por cartao usa assinatura recorrente. O Pix usa Checkout de pagamento unico e libera o plano por 30 dias apos o webhook `checkout.session.completed`.

## Google OAuth

No Google Cloud Console, configure um OAuth Client e use o callback:

```text
http://localhost:3000/api/auth/callback/google
```

Em producao, troque pelo dominio real:

```text
https://seu-dominio.com/api/auth/callback/google
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run prisma:generate
npm run db:push
npm run prisma:studio
```

## Rotas principais

- `/`: apresentacao e vitrine do marketplace.
- `/cadastrar`: cadastro por e-mail/senha ou Google.
- `/login`: login por e-mail/senha ou Google.
- `/servicos`: listagem de pedidos e ofertas.
- `/servicos/escolher`: escolha entre pedir ou oferecer servico.
- `/servicos/novo`: publicacao autenticada com upload de foto.
- `/servicos/[id]`: detalhe, perfil do autor, curtida, avaliacao e contato via WhatsApp protegido.
- `/usuarios/[id]`: perfil publico do usuario e suas publicacoes.
- `/notificacoes`: notificacoes privadas do usuario logado.
- `/minha-conta`: perfil, foto, plano atual e checkout.

## Observacoes de producao

- `public/uploads` funciona para desenvolvimento local. Em producao serverless, substitua por Vercel Blob, S3 ou outro storage persistente.
- Defina `AUTH_SECRET` com um valor forte antes do deploy.
- Configure `NEXT_PUBLIC_APP_URL` com o dominio final para redirects da Stripe.
- Execute `npm run build`, `npm run lint` e `npm run typecheck` antes de publicar.
