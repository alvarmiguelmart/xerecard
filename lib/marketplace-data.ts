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
};

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
    description: "Para criar conta, publicar pedidos e navegar pelos serviços.",
    features: ["Cadastro e login", "Publicar pedidos", "Ver serviços disponíveis"]
  },
  {
    id: "ESSENTIAL",
    name: "Essencial",
    price: "R$ 9,90/mês",
    description: "Libera o contato via WhatsApp e notificações de interessados.",
    features: ["Abrir WhatsApp dos anúncios", "Receber notificações", "Publicar serviços"]
  },
  {
    id: "PROFESSIONAL",
    name: "Profissional",
    price: "R$ 19,90/mês",
    description: "Mais destaque para quem oferece serviços com frequência.",
    features: ["Destaque na listagem", "Selo verificado", "Prioridade nas notificações"]
  }
] as const satisfies Array<{
  id: PlanId;
  name: string;
  price: string;
  description: string;
  features: string[];
}>;

export const categories = [
  "Casa e manutenção",
  "Eventos",
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
