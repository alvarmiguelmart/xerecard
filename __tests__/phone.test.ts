import { describe, expect, it } from "vitest";
import { normalizeBrazilianWhatsApp } from "@/lib/phone";

describe("normalizeBrazilianWhatsApp", () => {
  it("normalizes formatted mobile numbers", () => {
    expect(normalizeBrazilianWhatsApp("(11) 91234-5678")).toBe("5511912345678");
    expect(normalizeBrazilianWhatsApp("+55 (42) 99999-0001")).toBe("5542999990001");
  });

  it("rejects landline-length numbers", () => {
    expect(normalizeBrazilianWhatsApp("11 1234-5678")).toBeNull();
  });

  it("returns null for invalid numbers", () => {
    expect(normalizeBrazilianWhatsApp("12345")).toBeNull();
    expect(normalizeBrazilianWhatsApp("00999999999")).toBeNull();
  });
});
