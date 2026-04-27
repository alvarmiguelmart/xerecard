import { beforeEach, describe, expect, it, vi } from "vitest";

const findUnique = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique,
      update: vi.fn()
    }
  }
}));

describe("auth callbacks", () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it("hydrates JWT fields from the database user", async () => {
    findUnique.mockResolvedValue({
      id: "user-1",
      role: "PROFESSIONAL",
      plan: "ESSENTIAL",
      image: "/avatar.png",
      name: "Ana"
    });
    const { jwtCallback } = await import("@/lib/auth-callbacks");

    const token = await jwtCallback({
      token: { email: "ana@example.com" },
      user: undefined
    });

    expect(token).toMatchObject({
      id: "user-1",
      role: "PROFESSIONAL",
      plan: "ESSENTIAL",
      picture: "/avatar.png",
      name: "Ana"
    });
  });

  it("hydrates session fields with safe defaults", async () => {
    const { sessionCallback } = await import("@/lib/auth-callbacks");
    const session = await sessionCallback({
      session: {
        user: {
          id: "",
          role: "CLIENT",
          plan: "FREE"
        },
        expires: new Date().toISOString()
      },
      token: { id: "user-1", role: "UNKNOWN", plan: "UNKNOWN" } as never
    });

    expect(session.user).toMatchObject({
      id: "user-1",
      role: "CLIENT",
      plan: "FREE"
    });
  });
});
