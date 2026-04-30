import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.fn();
const userFindUnique = vi.fn();
const findRawService = vi.fn();
const createNotification = vi.fn();

vi.mock("@/lib/auth", () => ({ auth }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: userFindUnique
    }
  }
}));
vi.mock("@/lib/marketplace-db", () => ({
  findRawService,
  createNotification
}));

describe("WhatsApp contact route", () => {
  beforeEach(() => {
    auth.mockReset();
    userFindUnique.mockReset();
    findRawService.mockReset();
    createNotification.mockReset();
  });

  it("denies users with expired Pix access", async () => {
    auth.mockResolvedValue({ user: { id: "user-1", name: "Ana" } });
    userFindUnique.mockResolvedValue({
      plan: "ESSENTIAL",
      planExpiresAt: new Date("2026-01-01"),
      stripeSubscriptionId: null,
      stripeSubscriptionStatus: null
    });
    const { POST } = await import("@/app/api/services/[id]/whatsapp/route");

    const response = await POST(new Request("http://test.local"), {
      params: Promise.resolve({ id: "service-1" })
    });

    expect(response.status).toBe(402);
    expect(findRawService).not.toHaveBeenCalled();
  });

  it("returns a WhatsApp URL for active subscribers", async () => {
    auth.mockResolvedValue({ user: { id: "user-1", name: "Ana" } });
    userFindUnique.mockResolvedValue({
      plan: "ESSENTIAL",
      planExpiresAt: null,
      stripeSubscriptionId: "sub_123",
      stripeSubscriptionStatus: "active"
    });
    findRawService.mockResolvedValue({
      id: "service-1",
      ownerId: "owner-1",
      title: "Serviço de design",
      whatsapp: "5511912345678"
    });
    const { POST } = await import("@/app/api/services/[id]/whatsapp/route");

    const response = await POST(new Request("http://test.local"), {
      params: Promise.resolve({ id: "service-1" })
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      ok: true,
      url: expect.stringContaining("https://wa.me/5511912345678")
    });
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientId: "owner-1",
        type: "SERVICE_INTEREST"
      })
    );
  });
});
