import { describe, expect, it } from "vitest";
import { mapService } from "@/lib/marketplace-db";

describe("mapService", () => {
  it("maps Prisma service records to marketplace services", () => {
    const mapped = mapService({
      id: "service-1",
      mode: "REQUEST",
      title: "Preciso de suporte",
      category: "Tecnologia",
      location: "Remoto",
      priceLabel: "R$ 120",
      description: "Ajuda para configurar um site.",
      whatsapp: "5511912345678",
      imageUrl: "/generated/service-request.png",
      published: true,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
      ownerId: "user-1",
      owner: {
        id: "user-1",
        name: "Ana",
        image: "/avatar.png"
      },
      _count: {
        likes: 3
      }
    });

    expect(mapped).toMatchObject({
      id: "service-1",
      mode: "REQUEST",
      ownerName: "Ana",
      ownerImage: "/avatar.png",
      likeCount: 3,
      image: "/generated/service-request.png",
      contentType: "Pedido"
    });
  });
});
