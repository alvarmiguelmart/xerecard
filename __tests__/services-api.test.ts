import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.fn();
const createService = vi.fn();

vi.mock("@/lib/auth", () => ({ auth }));
vi.mock("@/lib/marketplace-db", () => ({
  createService,
  listServices: vi.fn(),
  DatabaseError: class DatabaseError extends Error {}
}));
vi.mock("@/lib/upload", () => ({ saveUpload: vi.fn() }));

function validFormData() {
  const formData = new FormData();
  formData.set("mode", "REQUEST");
  formData.set("title", "Preciso de suporte");
  formData.set("category", "Tecnologia");
  formData.set("location", "Remoto");
  formData.set("priceLabel", "R$ 120");
  formData.set("description", "Preciso de ajuda para configurar um site simples.");
  formData.set("whatsapp", "(11) 91234-5678");
  return formData;
}

describe("services API", () => {
  beforeEach(() => {
    auth.mockReset();
    createService.mockReset();
  });

  it("POST /api/services with valid data returns 201", async () => {
    auth.mockResolvedValue({ user: { id: "user-1" } });
    createService.mockResolvedValue({ id: "service-1" });
    const { POST } = await import("@/app/api/services/route");

    const response = await POST(new Request("http://test.local/api/services", {
      method: "POST",
      body: validFormData()
    }));

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({
      ok: true,
      service: { id: "service-1" }
    });
  });

  it("POST /api/services with invalid data returns 400", async () => {
    auth.mockResolvedValue({ user: { id: "user-1" } });
    const formData = validFormData();
    formData.delete("title");
    const { POST } = await import("@/app/api/services/route");

    const response = await POST(new Request("http://test.local/api/services", {
      method: "POST",
      body: formData
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toHaveProperty("errors");
  });

  it("POST /api/services without authentication returns 401", async () => {
    auth.mockResolvedValue(null);
    const { POST } = await import("@/app/api/services/route");

    const response = await POST(new Request("http://test.local/api/services", {
      method: "POST",
      body: validFormData()
    }));

    expect(response.status).toBe(401);
  });
});
