import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.fn();
const createService = vi.fn();
const deleteUpload = vi.fn();
const saveUpload = vi.fn();

vi.mock("@/lib/auth", () => ({ auth }));
vi.mock("@/lib/marketplace-db", () => ({
  createService,
  listServices: vi.fn(),
  DatabaseError: class DatabaseError extends Error {}
}));
vi.mock("@/lib/upload", () => ({ deleteUpload, saveUpload }));

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
    deleteUpload.mockReset();
    saveUpload.mockReset();
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

  it("removes uploaded image when service creation fails", async () => {
    auth.mockResolvedValue({ user: { id: "user-1" } });
    saveUpload.mockResolvedValue("/uploads/services/temp.png");
    createService.mockRejectedValue(new Error("database failed"));
    const formData = validFormData();
    formData.set("photos", new File(["image"], "service.png", { type: "image/png" }));
    const { POST } = await import("@/app/api/services/route");

    await expect(
      POST(new Request("http://test.local/api/services", {
        method: "POST",
        body: formData
      }))
    ).rejects.toThrow("database failed");

    expect(deleteUpload).toHaveBeenCalledWith("/uploads/services/temp.png");
  });
});
