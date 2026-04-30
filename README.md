# Xerecard

Marketplace em Next.js para conectar quem precisa contratar servicos com quem quer encontrar clientes. Usuarios criam perfil, publicam pedidos ou ofertas e assinantes liberam contato direto pelo WhatsApp.


## Recursos implementados

- Cadastro e login reais por e-mail/senha.
- Login social por Google quando as credenciais OAuth estiverem configuradas.
- Perfil com nome, foto e tipo de usuario editaveis.
- Publicacao de pedidos e ofertas de servicos com upload de imagem.
- Marketplace minimalista em verde escuro com filtros por categoria, tipo, cidade e verificados.
- Fluxo inspirado em marketplaces conhecidos: descoberta primeiro, perfil publico, prova social e contato direto.
- Identidade visual em `public/brand/xerecard.png`.
- Listagem, detalhe, curtidas, notas e contato por WhatsApp.
- Perfil publico do usuario com avatar, publicacoes, curtidas recebidas e avaliacoes.
- Gate de assinatura: usuario gratuito publica e navega, assinante abre WhatsApp do anuncio.
- Planos de baixo custo: Essencial por R$ 5,99/mes e Profissional por R$ 12,99/mes.
- Teste gratis de 30 dias no cartao via Stripe Billing.
- Checkout por cartao recorrente ou Pix avulso de 30 dias.
- Portal do Cliente Stripe para gerenciar assinatura ativa.
- Webhook da Stripe para liberar plano e criar notificacao de assinatura.
- Sincronizacao de status da assinatura para cancelar ou pausar acesso quando o pagamento falha.
- Notificacoes privadas para publicacao no ar, interesse, curtidas, notas e assinatura.
- Cadastro de WhatsApp com DDD e numero, sem precisar informar codigo do pais.
- Imagens geradas em `public/generated/`.
- Uploads em producao devem usar Supabase Storage.
- Dados em Supabase Postgres com Prisma migrations e RLS habilitado nas tabelas publicas.
- Deploy em Vercel com variaveis de ambiente para Supabase, Auth.js e Stripe.
