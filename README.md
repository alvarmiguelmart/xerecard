# Xerecard

Marketplace em Next.js onde usuarios podem publicar pedidos, anunciar servicos/conteudos digitais, assinar planos e liberar contato privado via WhatsApp.


## Recursos implementados

- Cadastro e login reais por e-mail/senha.
- Login social por Google quando as credenciais OAuth estiverem configuradas.
- Perfil com nome e foto editaveis.
- Publicacao de pedidos e ofertas com upload de imagem.
- Marketplace minimalista com filtros por categoria, tipo e publico restrito.
- Age gate para confirmar maioridade antes de navegar.
- Categorias para packs digitais, conteudo premium, lives privadas, privacidade e divulgacao.
- Identidade visual em `public/brand/xerecard.png`.
- Listagem, detalhe, curtidas, notas e contato por WhatsApp.
- Perfil publico do usuario com avatar, publicacoes, curtidas recebidas e avaliacoes.
- Gate de assinatura: usuario gratuito nao abre o WhatsApp do anuncio.
- Planos Essencial e Profissional com checkout por cartao ou Pix.
- Webhook da Stripe para liberar plano e criar notificacao de assinatura.
- Notificacoes privadas para publicacao no ar, interesse, curtidas, notas e assinatura.
- Cadastro de WhatsApp com DDD e numero, sem precisar informar codigo do pais.
- Imagens geradas em `public/generated/`.
