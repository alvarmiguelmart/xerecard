export type UserRole = "cliente" | "profissional";
export type PlanId = "FREE" | "ESSENTIAL" | "PROFESSIONAL";
export type ServiceMode = "request" | "offer";

export type MarketplaceService = {
  id: string;
  mode: ServiceMode;
  title: string;
  category: string;
  location: string;
  priceLabel: string;
  description: string;
  ownerId: string;
  ownerName: string;
  ownerImage: string | null;
  rating: number;
  ratingCount: number;
  likeCount: number;
  image: string;
  whatsapp: string;
  tags: string[];
  verified: boolean;
  isAdult?: boolean;
  contentType?: string;
};

export const businessProof = [
  { value: "Direto", label: "publique ou encontre oportunidades" },
  { value: "Privado", label: "contato protegido por assinatura" },
  { value: "Categorias", label: "serviços, conteúdos e comunidades" }
] as const;

export type AppNotification = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  unread: boolean;
};

export const plans = [
  {
    id: "FREE",
    name: "Grátis",
    price: "R$ 0",
    description: "Para testar o marketplace, publicar pedidos e entender a demanda.",
    features: ["Cadastro e login", "Publicar pedidos", "Ver serviços disponíveis", "Perfil público básico"]
  },
  {
    id: "ESSENTIAL",
    name: "Essencial",
    price: "R$ 6,99/mês",
    description: "Para quem quer contratar rápido e falar com profissionais direto no WhatsApp.",
    features: ["Abrir WhatsApp dos anúncios", "Receber notificações", "Publicar serviços", "Contato protegido contra curiosos"]
  },
  {
    id: "PROFESSIONAL",
    name: "Profissional",
    price: "R$ 12,99/mês",
    description: "Para prestadores que querem parecer mais confiáveis e receber mais oportunidades.",
    features: ["Destaque na listagem", "Selo verificado", "Prioridade nas notificações", "Perfil preparado para conversão"]
  }
] as const satisfies Array<{
  id: PlanId;
  name: string;
  price: string;
  description: string;
  features: string[];
}>;

export const categories = [
  "Perfis verificados",
  "Packs digitais",
  "Conteúdo premium",
  "Lives privadas",
  "Ensaios sensuais",
  "Fotografia adulta",
  "Divulgação adulta",
  "Social media privado",
  "Loja de conteúdo",
  "Assinaturas e fãs",
  "Comunidades privadas",
  "Atendimento personalizado",
  "Verificação de perfil",
  "Segurança e privacidade",
  "Casa e manutenção",
  "Eventos",
  "Conteúdo digital",
  "Comunidades e aulas",
  "Lojas e revenda",
  "Beleza e bem-estar",
  "Tecnologia",
  "Aulas e consultoria",
  "Transporte",
  "Construção e reforma",
  "Limpeza e diarista",
  "Saúde e cuidados",
  "Pet care",
  "Design e marketing",
  "Serviços automotivos",
  "Jurídico e contábil",
  "Gastronomia",
  "Fotografia e vídeo",
  "Entrega e mudanças"
] as const;

export const categoryStories = [
  {
    name: "Descoberta simples",
    description: "Encontre serviços, conteúdos, comunidades e perfis em poucos cliques."
  },
  {
    name: "Publicação rápida",
    description: "Crie pedidos ou ofertas com preço, categoria, imagem e contato privado."
  },
  {
    name: "Contato protegido",
    description: "A vitrine é aberta; a conversa direta é liberada para assinantes."
  }
] as const;

export const seedServices: MarketplaceService[] = [
  {
    id: "1",
    mode: "request",
    title: "Preciso de ajuda para evento no sábado",
    category: "Eventos",
    location: "Irati, PR",
    priceLabel: "A combinar",
    description:
      "Busco uma pessoa disponível para auxiliar na organização, recepção e apoio durante um evento pequeno no sábado à noite.",
    ownerId: "seed-owner",
    ownerName: "Marina Lopes",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.7,
    ratingCount: 3100,
    likeCount: 42,
    image: "/generated/service-request.png",
    whatsapp: "5542999990001",
    tags: ["Evento", "Sábado", "Resposta rápida"],
    verified: true
  },
  {
    id: "2",
    mode: "request",
    title: "Procuro manutenção residencial",
    category: "Casa e manutenção",
    location: "Centro",
    priceLabel: "Até R$ 180",
    description:
      "Preciso de orçamento para pequenos reparos em casa. Tenho fotos e detalhes para enviar pelo WhatsApp.",
    ownerId: "seed-owner",
    ownerName: "Camila Rocha",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.8,
    ratingCount: 820,
    likeCount: 19,
    image: "/generated/service-request.png",
    whatsapp: "5542999990002",
    tags: ["Casa", "Orçamento", "Hoje"],
    verified: false
  },
  {
    id: "3",
    mode: "request",
    title: "Suporte para site e redes sociais",
    category: "Tecnologia",
    location: "Remoto",
    priceLabel: "R$ 250",
    description:
      "Preciso ajustar uma página simples, configurar domínio e organizar links de atendimento.",
    ownerId: "seed-owner",
    ownerName: "Rafa Mendes",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.6,
    ratingCount: 430,
    likeCount: 31,
    image: "/generated/service-request.png",
    whatsapp: "5542999990003",
    tags: ["Remoto", "Site", "Domínio"],
    verified: true
  },
  {
    id: "4",
    mode: "offer",
    title: "Faço serviços gerais com agenda flexível",
    category: "Casa e manutenção",
    location: "Irati e região",
    priceLabel: "A partir de R$ 90",
    description:
      "Atendo pequenos reparos, organização e demandas rápidas com orçamento direto pelo WhatsApp.",
    ownerId: "seed-owner",
    ownerName: "João Pereira",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.9,
    ratingCount: 1260,
    likeCount: 56,
    image: "/generated/service-offer.png",
    whatsapp: "5542999990004",
    tags: ["Serviços gerais", "Agenda flexível", "Verificado"],
    verified: true
  },
  {
    id: "5",
    mode: "offer",
    title: "Atendimento para eventos e recepção",
    category: "Eventos",
    location: "Região central",
    priceLabel: "R$ 120/hora",
    description:
      "Ofereço apoio para eventos, recepção, organização de convidados e suporte operacional.",
    ownerId: "seed-owner",
    ownerName: "Bruno Lima",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.7,
    ratingCount: 690,
    likeCount: 24,
    image: "/generated/service-offer.png",
    whatsapp: "5542999990005",
    tags: ["Eventos", "Recepção", "Noite"],
    verified: false
  },
  {
    id: "6",
    mode: "offer",
    title: "Consultoria rápida para presença digital",
    category: "Tecnologia",
    location: "Online",
    priceLabel: "R$ 80",
    description:
      "Organizo perfil, bio, links e primeiras campanhas para quem quer receber mais contatos.",
    ownerId: "seed-owner",
    ownerName: "Diego Martins",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.9,
    ratingCount: 940,
    likeCount: 48,
    image: "/generated/service-offer.png",
    whatsapp: "5542999990006",
    tags: ["Online", "Marketing", "WhatsApp"],
    verified: true
  },
  {
    id: "7",
    mode: "request",
    title: "Preciso de diarista para apartamento",
    category: "Limpeza e diarista",
    location: "Irati, PR",
    priceLabel: "R$ 160",
    description:
      "Procuro diarista para limpeza completa em apartamento pequeno, com preferência para sexta-feira de manhã.",
    ownerId: "seed-owner",
    ownerName: "Larissa Alves",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.8,
    ratingCount: 260,
    likeCount: 15,
    image: "/generated/service-request.png",
    whatsapp: "42999990007",
    tags: ["Limpeza", "Sexta-feira", "Apartamento"],
    verified: false
  },
  {
    id: "8",
    mode: "request",
    title: "Busco fotógrafo para fotos profissionais",
    category: "Fotografia e vídeo",
    location: "Centro",
    priceLabel: "Até R$ 350",
    description:
      "Preciso de um ensaio simples para perfil profissional e material de divulgação nas redes sociais.",
    ownerId: "seed-owner",
    ownerName: "Nathalia Costa",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.7,
    ratingCount: 140,
    likeCount: 22,
    image: "/generated/service-request.png",
    whatsapp: "42999990008",
    tags: ["Fotografia", "Perfil", "Redes sociais"],
    verified: true
  },
  {
    id: "9",
    mode: "offer",
    title: "Diarista com referências",
    category: "Limpeza e diarista",
    location: "Irati e região",
    priceLabel: "A partir de R$ 150",
    description:
      "Faço limpeza residencial, pós-obra leve e organização de ambientes com agenda semanal.",
    ownerId: "seed-owner",
    ownerName: "Sandra Moraes",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.9,
    ratingCount: 730,
    likeCount: 64,
    image: "/generated/service-offer.png",
    whatsapp: "42999990009",
    tags: ["Diarista", "Referências", "Semanal"],
    verified: true
  },
  {
    id: "10",
    mode: "offer",
    title: "Designer para cartões, posts e identidade",
    category: "Design e marketing",
    location: "Remoto",
    priceLabel: "A partir de R$ 120",
    description:
      "Crio peças para divulgação, posts de Instagram, cartão digital e identidade visual para pequenos negócios.",
    ownerId: "seed-owner",
    ownerName: "Felipe Gomes",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.8,
    ratingCount: 410,
    likeCount: 39,
    image: "/generated/service-offer.png",
    whatsapp: "42999990010",
    tags: ["Design", "Marketing", "Remoto"],
    verified: false
  },
  {
    id: "11",
    mode: "offer",
    title: "Edição de vídeos curtos para Reels e TikTok",
    category: "Conteúdo digital",
    location: "Remoto",
    priceLabel: "A partir de R$ 45",
    description:
      "Corto vídeos, coloco legenda dinâmica, música, capa e chamada para ação para criadores e pequenos negócios publicarem com mais consistência.",
    ownerId: "seed-owner",
    ownerName: "Livia Santtos",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.9,
    ratingCount: 580,
    likeCount: 73,
    image: "/generated/service-offer.png",
    whatsapp: "42999990011",
    tags: ["Reels", "TikTok", "Entrega rápida"],
    verified: true
  },
  {
    id: "12",
    mode: "request",
    title: "Preciso montar loja simples para vender no WhatsApp",
    category: "Lojas e revenda",
    location: "Online",
    priceLabel: "Até R$ 300",
    description:
      "Tenho produtos e fotos, mas preciso organizar catálogo, links, texto de venda e uma vitrine simples para receber pedidos pelo WhatsApp.",
    ownerId: "seed-owner",
    ownerName: "Renan Souza",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.6,
    ratingCount: 190,
    likeCount: 28,
    image: "/generated/service-request.png",
    whatsapp: "42999990012",
    tags: ["Catálogo", "WhatsApp", "Pequeno negócio"],
    verified: false
  },
  {
    id: "13",
    mode: "offer",
    title: "Organizo comunidade paga e aulas ao vivo",
    category: "Comunidades e aulas",
    location: "Remoto",
    priceLabel: "R$ 180",
    description:
      "Ajudo perfis, professores e consultores a estruturar grupo, calendário de aulas, benefícios para membros e rotina de atendimento.",
    ownerId: "seed-owner",
    ownerName: "Maya Ribeiro",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.8,
    ratingCount: 360,
    likeCount: 52,
    image: "/generated/service-offer.png",
    whatsapp: "42999990013",
    tags: ["Comunidade", "Aulas", "Monetização"],
    verified: true
  },
  {
    id: "14",
    mode: "request",
    title: "Busco apoio para live de lançamento",
    category: "Eventos",
    location: "Irati, PR",
    priceLabel: "A combinar",
    description:
      "Quero fazer uma live para lançar produtos locais e preciso de alguém para roteiro, moderação do chat e organização dos links de compra.",
    ownerId: "seed-owner",
    ownerName: "Paula Nogueira",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.7,
    ratingCount: 220,
    likeCount: 34,
    image: "/generated/service-request.png",
    whatsapp: "42999990014",
    tags: ["Live", "Lançamento", "Produtos locais"],
    verified: true
  },
  {
    id: "15",
    mode: "offer",
    title: "Perfil verificado com packs digitais",
    category: "Perfis verificados",
    location: "Online",
    priceLabel: "A partir de R$ 29",
    description:
      "Perfil com conteúdo próprio, atendimento privado e catálogo organizado para assinantes.",
    ownerId: "seed-owner",
    ownerName: "Nina Valen",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.9,
    ratingCount: 1280,
    likeCount: 214,
    image: "/generated/service-offer.png",
    whatsapp: "42999990015",
    tags: ["Restrito", "Verificado", "Packs"],
    verified: true,
    isAdult: true,
    contentType: "Perfil"
  },
  {
    id: "16",
    mode: "offer",
    title: "Divulgação para perfil privado",
    category: "Divulgação adulta",
    location: "Remoto",
    priceLabel: "R$ 90",
    description:
      "Ajudo perfis a organizar bio, chamada, vitrine, calendário de posts e campanhas com foco em privacidade.",
    ownerId: "seed-owner",
    ownerName: "Studio Norte",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.8,
    ratingCount: 540,
    likeCount: 88,
    image: "/generated/service-offer.png",
    whatsapp: "42999990016",
    tags: ["Marketing", "Restrito", "Privacidade"],
    verified: true,
    isAdult: true,
    contentType: "Serviço"
  },
  {
    id: "17",
    mode: "request",
    title: "Procuro editor para conteúdo premium",
    category: "Conteúdo premium",
    location: "Online",
    priceLabel: "Até R$ 250",
    description:
      "Preciso de edição discreta, capas, organização de arquivos e padronização visual para conteúdo privado.",
    ownerId: "seed-owner",
    ownerName: "Perfil Reservado",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.7,
    ratingCount: 310,
    likeCount: 46,
    image: "/generated/service-request.png",
    whatsapp: "42999990017",
    tags: ["Edição", "Restrito", "Premium"],
    verified: false,
    isAdult: true,
    contentType: "Pedido"
  },
  {
    id: "18",
    mode: "offer",
    title: "Consultoria de segurança para perfil privado",
    category: "Segurança e privacidade",
    location: "Remoto",
    priceLabel: "R$ 160",
    description:
      "Configuro rotinas de privacidade, separação de contas, proteção de identidade, watermark e checklist de publicação segura.",
    ownerId: "seed-owner",
    ownerName: "Ana Privacy",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.9,
    ratingCount: 760,
    likeCount: 96,
    image: "/generated/service-offer.png",
    whatsapp: "42999990018",
    tags: ["Privacidade", "Verificação", "Restrito"],
    verified: true,
    isAdult: true,
    contentType: "Consultoria"
  },
  {
    id: "19",
    mode: "offer",
    title: "Fotografia sensual com direção discreta",
    category: "Ensaios sensuais",
    location: "Irati e região",
    priceLabel: "A partir de R$ 380",
    description:
      "Ensaio com contrato, direção de poses, tratamento de imagem e entrega privada.",
    ownerId: "seed-owner",
    ownerName: "Luz Baixa Studio",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.8,
    ratingCount: 420,
    likeCount: 71,
    image: "/generated/service-offer.png",
    whatsapp: "42999990019",
    tags: ["Fotografia", "Restrito", "Contrato"],
    verified: true,
    isAdult: true,
    contentType: "Serviço"
  },
  {
    id: "20",
    mode: "offer",
    title: "Organizo comunidade privada para fãs",
    category: "Comunidades privadas",
    location: "Online",
    priceLabel: "R$ 220",
    description:
      "Estruturo benefícios, regras, moderação, calendário e fluxo de entrada para comunidades com acesso controlado.",
    ownerId: "seed-owner",
    ownerName: "Maya Ribeiro",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.8,
    ratingCount: 390,
    likeCount: 57,
    image: "/generated/service-offer.png",
    whatsapp: "42999990020",
    tags: ["Comunidade", "Fãs", "Restrito"],
    verified: true,
    isAdult: true,
    contentType: "Comunidade"
  },
  {
    id: "21",
    mode: "request",
    title: "Quero montar loja de packs com vitrine discreta",
    category: "Loja de conteúdo",
    location: "Online",
    priceLabel: "Até R$ 450",
    description:
      "Preciso de estrutura simples para vitrine, categorias, texto de venda, políticas e direcionamento para atendimento privado.",
    ownerId: "seed-owner",
    ownerName: "Criadora Nova",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.6,
    ratingCount: 210,
    likeCount: 39,
    image: "/generated/service-request.png",
    whatsapp: "42999990021",
    tags: ["Loja", "Packs", "Restrito"],
    verified: false,
    isAdult: true,
    contentType: "Pedido"
  },
  {
    id: "22",
    mode: "offer",
    title: "Verificação e organização de perfil privado",
    category: "Verificação de perfil",
    location: "Remoto",
    priceLabel: "R$ 120",
    description:
      "Reviso perfil, identidade visual, prova de autenticidade, regras de segurança e sinais de confiança para novos assinantes.",
    ownerId: "seed-owner",
    ownerName: "CheckPro",
    ownerImage: "/generated/marketplace-hero.png",
    rating: 4.7,
    ratingCount: 330,
    likeCount: 51,
    image: "/generated/service-offer.png",
    whatsapp: "42999990022",
    tags: ["Verificação", "Perfil", "Restrito"],
    verified: true,
    isAdult: true,
    contentType: "Serviço"
  }
];

export const seedNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "Juninho tem interesse",
    description: "Ele quer conversar sobre seu serviço publicado em Eventos.",
    createdAt: "Agora",
    unread: true
  },
  {
    id: "n2",
    title: "Ronaldo tem interesse",
    description: "Novo contato disponível para seu anúncio de serviços gerais.",
    createdAt: "12 min",
    unread: true
  },
  {
    id: "n3",
    title: "Assinatura necessária",
    description: "Ative o plano Essencial para abrir links de WhatsApp.",
    createdAt: "Hoje",
    unread: false
  }
];
