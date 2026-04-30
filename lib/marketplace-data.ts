import type { Plan, ServiceMode } from "@prisma/client";

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
  image: string;
  whatsapp: string;
  tags: string[];
  verified: boolean;
  contentType?: string;
  likeCount?: number;
  rating?: number;
  ratingCount?: number;
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
    description: "Para explorar o marketplace e publicar seus primeiros pedidos.",
    features: ["Criar perfil", "Publicar pedidos", "Ver anúncios disponíveis"]
  },
  {
    id: "ESSENTIAL",
    name: "Essencial",
    price: "R$ 5,99/mês",
    description: "Para desbloquear contatos no WhatsApp e acompanhar interessados.",
    features: ["Teste grátis de 30 dias", "Abrir WhatsApp dos anúncios", "Receber avisos de interesse"]
  },
  {
    id: "PROFESSIONAL",
    name: "Profissional",
    price: "R$ 12,99/mês",
    description: "Para quem anuncia com frequência e quer mais visibilidade.",
    features: ["Teste grátis de 30 dias", "Mais destaque na listagem", "Avisos com prioridade"]
  }
] as const satisfies Array<{
  id: Plan;
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
  "Entrega e mudanças",
  "Administração e assistência virtual",
  "Arquitetura e engenharia",
  "Artesanato e reparos manuais",
  "Babá e cuidados infantis",
  "Consultoria empresarial",
  "Costura e ajustes",
  "Educação e reforço escolar",
  "Eletricista",
  "Encanador",
  "Jardinagem e paisagismo",
  "Música e áudio",
  "Personal trainer",
  "Programação e automação",
  "Redação e tradução",
  "Segurança e vigilância",
  "Turismo e hospedagem",
  "Vendas e representação",
  "Outros"
] as const;

export const categoryMeta: Record<string, { color: string; description: string; icon: string }> = {
  "Casa e manutenção": { color: "#38bdf8", description: "Reparos, organização e cuidados", icon: "home" },
  "Eventos": { color: "#2558d9", description: "Recepção, organização e apoio", icon: "calendar" },
  "Beleza e bem-estar": { color: "#ff4f87", description: "Cuidados pessoais e estética", icon: "heart" },
  "Tecnologia": { color: "#2558d9", description: "Sites, apps e suporte", icon: "code" },
  "Aulas e consultoria": { color: "#ffe86b", description: "Ensino e orientação", icon: "book" },
  "Transporte": { color: "#38bdf8", description: "Carretos e locomoção", icon: "truck" },
  "Construção e reforma": { color: "#071014", description: "Obras e reparos estruturais", icon: "hammer" },
  "Limpeza e diarista": { color: "#38bdf8", description: "Limpeza e organização", icon: "sparkles" },
  "Saúde e cuidados": { color: "#ff6a3d", description: "Assistência e bem-estar", icon: "shield" },
  "Pet care": { color: "#38bdf8", description: "Cuidados com animais", icon: "paw" },
  "Design e marketing": { color: "#2558d9", description: "Identidade e divulgação", icon: "palette" },
  "Serviços automotivos": { color: "#071014", description: "Mecânica e estética", icon: "wrench" },
  "Jurídico e contábil": { color: "#38bdf8", description: "Consultoria especializada", icon: "scale" },
  "Gastronomia": { color: "#ff6a3d", description: "Buffet e delivery", icon: "utensils" },
  "Fotografia e vídeo": { color: "#2558d9", description: "Ensaios e produções", icon: "camera" },
  "Entrega e mudanças": { color: "#38bdf8", description: "Transporte de cargas", icon: "package" },
  "Administração e assistência virtual": { color: "#38bdf8", description: "Rotina, agenda e suporte", icon: "briefcase" },
  "Arquitetura e engenharia": { color: "#2558d9", description: "Projetos e laudos", icon: "ruler" },
  "Artesanato e reparos manuais": { color: "#ff6a3d", description: "Consertos e peças sob medida", icon: "wrench" },
  "Babá e cuidados infantis": { color: "#ff4f87", description: "Cuidado e acompanhamento", icon: "heart" },
  "Consultoria empresarial": { color: "#38bdf8", description: "Gestão, operação e estratégia", icon: "briefcase" },
  "Costura e ajustes": { color: "#ff4f87", description: "Roupas, ajustes e acabamentos", icon: "scissors" },
  "Educação e reforço escolar": { color: "#ffe86b", description: "Aulas e acompanhamento", icon: "book" },
  "Eletricista": { color: "#ffe86b", description: "Instalação e manutenção elétrica", icon: "zap" },
  "Encanador": { color: "#38bdf8", description: "Hidráulica e vazamentos", icon: "droplets" },
  "Jardinagem e paisagismo": { color: "#38bdf8", description: "Jardins e áreas externas", icon: "leaf" },
  "Música e áudio": { color: "#2558d9", description: "Produção, aulas e eventos", icon: "music" },
  "Personal trainer": { color: "#ff6a3d", description: "Treino e condicionamento", icon: "activity" },
  "Programação e automação": { color: "#2558d9", description: "Sistemas, scripts e integrações", icon: "code" },
  "Redação e tradução": { color: "#38bdf8", description: "Texto, revisão e idiomas", icon: "pen" },
  "Segurança e vigilância": { color: "#071014", description: "Proteção e monitoramento", icon: "shield" },
  "Turismo e hospedagem": { color: "#38bdf8", description: "Guias, reservas e apoio", icon: "map" },
  "Vendas e representação": { color: "#38bdf8", description: "Prospecção e atendimento", icon: "megaphone" },
  "Outros": { color: "#38bdf8", description: "Serviços não listados", icon: "sparkles" }
};

export const seedServices: MarketplaceService[] = [
  {
    id: "1",
    mode: "REQUEST",
    title: "Procuro apoio para evento no sábado",
    category: "Eventos",
    location: "Irati, PR",
    priceLabel: "A combinar",
    description:
      "Preciso de alguém para ajudar na organização, recepção e apoio geral durante um evento pequeno no sábado à noite.",
    ownerId: "seed-owner-1",
    ownerName: "Marina Lopes",
    ownerImage: "/generated/avatar-1.png",
    image: "/generated/service-request.png",
    whatsapp: "5542999990001",
    tags: ["Evento", "Sábado", "Resposta rápida"],
    verified: true
  },
  {
    id: "2",
    mode: "REQUEST",
    title: "Preciso de manutenção residencial",
    category: "Casa e manutenção",
    location: "Centro",
    priceLabel: "Até R$ 180",
    description:
      "Tenho pequenos reparos em casa e quero receber orçamento. Posso enviar fotos e detalhes pelo WhatsApp.",
    ownerId: "seed-owner-2",
    ownerName: "Camila Rocha",
    ownerImage: "/generated/avatar-2.png",
    image: "/generated/service-request.png",
    whatsapp: "5542999990002",
    tags: ["Casa", "Orçamento", "Hoje"],
    verified: false
  },
  {
    id: "3",
    mode: "REQUEST",
    title: "Procuro suporte para site e redes sociais",
    category: "Tecnologia",
    location: "Remoto",
    priceLabel: "R$ 250",
    description:
      "Quero ajustar uma página simples, configurar domínio e organizar links de atendimento para receber mais contatos.",
    ownerId: "seed-owner-3",
    ownerName: "Rafa Mendes",
    ownerImage: "/generated/avatar-3.png",
    image: "/generated/service-request.png",
    whatsapp: "5542999990003",
    tags: ["Remoto", "Site", "Domínio"],
    verified: true
  },
  {
    id: "4",
    mode: "OFFER",
    title: "Serviços gerais com agenda flexível",
    category: "Casa e manutenção",
    location: "Irati e região",
    priceLabel: "A partir de R$ 90",
    description:
      "Atendo pequenos reparos, organização e demandas rápidas. Envio orçamento direto pelo WhatsApp.",
    ownerId: "seed-owner-4",
    ownerName: "João Pereira",
    ownerImage: "/generated/avatar-4.png",
    image: "/generated/service-offer.png",
    whatsapp: "5542999990004",
    tags: ["Serviços gerais", "Agenda flexível", "Verificado"],
    verified: true
  },
  {
    id: "5",
    mode: "OFFER",
    title: "Apoio para eventos e recepção",
    category: "Eventos",
    location: "Região central",
    priceLabel: "R$ 120/hora",
    description:
      "Trabalho com recepção, organização de convidados e suporte operacional para eventos pequenos e médios.",
    ownerId: "seed-owner-5",
    ownerName: "Bruno Lima",
    ownerImage: "/generated/avatar-5.png",
    image: "/generated/service-offer.png",
    whatsapp: "5542999990005",
    tags: ["Eventos", "Recepção", "Noite"],
    verified: false
  },
  {
    id: "6",
    mode: "OFFER",
    title: "Consultoria rápida para presença online",
    category: "Tecnologia",
    location: "Online",
    priceLabel: "R$ 80",
    description:
      "Organizo perfil, bio, links e primeiras campanhas para negócios que querem receber mais contatos.",
    ownerId: "seed-owner-6",
    ownerName: "Diego Martins",
    ownerImage: "/generated/avatar-6.png",
    image: "/generated/service-offer.png",
    whatsapp: "5542999990006",
    tags: ["Online", "Marketing", "WhatsApp"],
    verified: true
  },
  {
    id: "7",
    mode: "REQUEST",
    title: "Procuro diarista para apartamento",
    category: "Limpeza e diarista",
    location: "Irati, PR",
    priceLabel: "R$ 160",
    description:
      "Preciso de limpeza completa em apartamento pequeno, de preferência na sexta-feira pela manhã.",
    ownerId: "seed-owner-7",
    ownerName: "Larissa Alves",
    ownerImage: "/generated/avatar-7.png",
    image: "/generated/service-request.png",
    whatsapp: "42999990007",
    tags: ["Limpeza", "Sexta-feira", "Apartamento"],
    verified: false
  },
  {
    id: "8",
    mode: "REQUEST",
    title: "Procuro fotógrafo para fotos profissionais",
    category: "Fotografia e vídeo",
    location: "Centro",
    priceLabel: "Até R$ 350",
    description:
      "Quero um ensaio simples para perfil profissional e materiais de divulgação nas redes sociais.",
    ownerId: "seed-owner-8",
    ownerName: "Nathalia Costa",
    ownerImage: "/generated/avatar-8.png",
    image: "/generated/service-request.png",
    whatsapp: "42999990008",
    tags: ["Fotografia", "Perfil", "Redes sociais"],
    verified: true
  },
  {
    id: "9",
    mode: "OFFER",
    title: "Diarista com referências e agenda semanal",
    category: "Limpeza e diarista",
    location: "Irati e região",
    priceLabel: "A partir de R$ 150",
    description:
      "Faço limpeza residencial, pós-obra leve e organização de ambientes, com opção de agenda semanal.",
    ownerId: "seed-owner-9",
    ownerName: "Sandra Moraes",
    ownerImage: "/generated/avatar-9.png",
    image: "/generated/service-offer.png",
    whatsapp: "42999990009",
    tags: ["Diarista", "Referências", "Semanal"],
    verified: true
  },
  {
    id: "10",
    mode: "OFFER",
    title: "Design para posts, cartões e identidade visual",
    category: "Design e marketing",
    location: "Remoto",
    priceLabel: "A partir de R$ 120",
    description:
      "Crio peças de divulgação, posts para Instagram, cartão digital e identidade visual para pequenos negócios.",
    ownerId: "seed-owner-10",
    ownerName: "Felipe Gomes",
    ownerImage: "/generated/avatar-10.png",
    image: "/generated/service-offer.png",
    whatsapp: "42999990010",
    tags: ["Design", "Marketing", "Remoto"],
    verified: false
  }
];

export const seedNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "Juninho quer falar com você",
    description: "Ele demonstrou interesse no seu anúncio de Eventos.",
    createdAt: "Agora",
    unread: true
  },
  {
    id: "n2",
    title: "Novo contato disponível",
    description: "Ronaldo quer conversar sobre seu anúncio de serviços gerais.",
    createdAt: "12 min",
    unread: true
  },
  {
    id: "n3",
    title: "Desbloqueie contatos",
    description: "Ative o plano Essencial para abrir conversas pelo WhatsApp.",
    createdAt: "Hoje",
    unread: false
  }
];
