import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.fn();
const userFindUnique = vi.fn();
const userUpdate = vi.fn();
const verificationDeleteMany = vi.fn();
const verificationCreate = vi.fn();
const prismaTransaction = vi.fn();
const sendEmailChangeEmail = vi.fn();
const sendSignupVerificationEmail = vi.fn();
const checkAuthRateLimit = vi.fn();

vi.mock("bcryptjs", () => ({
  compare: vi.fn(),
  hash: vi.fn()
}));

vi.mock("@/lib/auth", () => ({ auth }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: userFindUnique,
      update: userUpdate
    },
    verificationToken: {
      deleteMany: verificationDeleteMany,
      create: verificationCreate
    },
    $transaction: prismaTransaction
  }
}));
vi.mock("@/lib/email-verification", () => ({
  createEmailVerificationToken: () => ({ token: "plain-token", tokenHash: "hashed-token" }),
  emailVerificationTtlMs: 24 * 60 * 60 * 1000,
  getEmailChangeIdentifier: (userId: string, email: string) => `email-change:${userId}:${email}`,
  getEmailChangeUrl: (_userId: string, email: string, token: string) =>
    `https://xerecard.test/change?email=${email}&token=${token}`,
  getEmailVerificationIdentifier: (email: string) => `email-verification:${email}`,
  getEmailVerificationUrl: (email: string, token: string) =>
    `https://xerecard.test/verify?email=${email}&token=${token}`,
  hasEmailDeliveryConfig: () => true,
  sendEmailChangeEmail,
  sendSignupVerificationEmail
}));
vi.mock("@/lib/rate-limit", () => ({
  checkAuthRateLimit
}));

describe("account security routes", () => {
  beforeEach(() => {
    auth.mockReset();
    userFindUnique.mockReset();
    userUpdate.mockReset();
    verificationDeleteMany.mockReset();
    verificationCreate.mockReset();
    prismaTransaction.mockReset();
    sendEmailChangeEmail.mockReset();
    sendSignupVerificationEmail.mockReset();
    checkAuthRateLimit.mockReset();
    vi.mocked(compare).mockReset();

    auth.mockResolvedValue({ user: { id: "user-1" } });
    prismaTransaction.mockResolvedValue([]);
    checkAuthRateLimit.mockResolvedValue({ success: true });
  });

  it("changes password when the current password matches", async () => {
    userFindUnique.mockResolvedValue({ passwordHash: "hash" });
    vi.mocked(compare).mockResolvedValue(true as never);
    const { PATCH } = await import("@/app/api/account/password/route");

    const response = await PATCH(
      new Request("http://test.local/api/account/password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: "old-password",
          newPassword: "new-password"
        })
      })
    );

    expect(response.status).toBe(200);
    expect(userUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-1" }
      })
    );
  });

  it("starts email change after password confirmation", async () => {
    userFindUnique.mockResolvedValueOnce({
      email: "old@example.com",
      passwordHash: "hash"
    });
    userFindUnique.mockResolvedValueOnce(null);
    vi.mocked(compare).mockResolvedValue(true as never);
    sendEmailChangeEmail.mockResolvedValue(true);
    const { PATCH } = await import("@/app/api/account/email/route");

    const response = await PATCH(
      new Request("http://test.local/api/account/email", {
        method: "PATCH",
        body: JSON.stringify({
          newEmail: "new@example.com",
          password: "old-password"
        })
      })
    );

    expect(response.status).toBe(200);
    expect(verificationCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          identifier: "email-change:user-1:new@example.com",
          token: "hashed-token"
        })
      })
    );
    expect(sendEmailChangeEmail).toHaveBeenCalledWith(
      expect.objectContaining({ email: "new@example.com" })
    );
  });

  it("resends verification for pending email/password accounts", async () => {
    userFindUnique.mockResolvedValue({
      emailVerified: null,
      passwordHash: "hash"
    });
    sendSignupVerificationEmail.mockResolvedValue(true);
    const { POST } = await import("@/app/api/auth/resend-verification/route");

    const response = await POST(
      new Request("http://test.local/api/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: "user@example.com" })
      })
    );

    expect(response.status).toBe(200);
    expect(verificationCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          identifier: "email-verification:user@example.com",
          token: "hashed-token"
        })
      })
    );
    expect(sendSignupVerificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ email: "user@example.com" })
    );
  });
});
