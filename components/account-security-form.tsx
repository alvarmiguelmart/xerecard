"use client";

import { KeyRound, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { readJsonResponse } from "@/lib/http";

export function AccountSecurityForm({ currentEmail }: { currentEmail?: string | null }) {
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  async function changeEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsEmailLoading(true);
    setEmailMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/account/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newEmail: String(formData.get("newEmail") ?? ""),
          password: String(formData.get("emailPassword") ?? "")
        })
      });
      const data = await readJsonResponse<{ message?: string; verifyUrl?: string }>(response);

      if (!response.ok) {
        throw new Error(data.message ?? "Não conseguimos iniciar a troca de email.");
      }

      setEmailMessage(
        data.verifyUrl
          ? `Confirme no link: ${data.verifyUrl}`
          : (data.message ?? "Confirme o novo email para concluir.")
      );
      event.currentTarget.reset();
    } catch (error) {
      setEmailMessage(
        error instanceof Error ? error.message : "Não conseguimos iniciar a troca de email."
      );
    } finally {
      setIsEmailLoading(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPasswordLoading(true);
    setPasswordMessage("");

    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      setPasswordMessage("As senhas não conferem.");
      setIsPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: String(formData.get("currentPassword") ?? ""),
          newPassword
        })
      });
      const data = await readJsonResponse<{ message?: string }>(response);

      if (!response.ok) {
        throw new Error(data.message ?? "Não conseguimos trocar sua senha.");
      }

      setPasswordMessage(data.message ?? "Senha alterada.");
      event.currentTarget.reset();
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : "Não conseguimos trocar sua senha.");
    } finally {
      setIsPasswordLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2 xl:items-start">
      <form className="grid gap-4" onSubmit={changeEmail}>
        <div className="flex items-center gap-2">
          <Mail size={18} aria-hidden="true" />
          <h4 className="text-base font-black text-ink">Trocar email</h4>
        </div>
        <p className="text-xs font-semibold text-ink/54">
          Email atual: {currentEmail ?? "não informado"}. O novo email precisa ser confirmado.
        </p>
        <input
          name="newEmail"
          type="email"
          className="field-control"
          placeholder="novo@email.com"
          maxLength={254}
          required
          disabled={isEmailLoading}
        />
        <input
          name="emailPassword"
          type="password"
          className="field-control"
          placeholder="Senha atual"
          minLength={8}
          maxLength={128}
          disabled={isEmailLoading}
        />
        <Button type="submit" variant="secondary" disabled={isEmailLoading}>
          {isEmailLoading ? "Enviando" : "Confirmar novo email"}
        </Button>
        <p className="min-h-5 text-sm font-semibold text-ink" role="status">
          {emailMessage}
        </p>
      </form>

      <form className="grid gap-4 border-t border-ink/10 pt-5 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0" onSubmit={changePassword}>
        <div className="flex items-center gap-2">
          <KeyRound size={18} aria-hidden="true" />
          <h4 className="text-base font-black text-ink">Trocar senha</h4>
        </div>
        <input
          name="currentPassword"
          type="password"
          className="field-control"
          placeholder="Senha atual"
          minLength={8}
          maxLength={128}
          required
          disabled={isPasswordLoading}
        />
        <input
          name="newPassword"
          type="password"
          className="field-control"
          placeholder="Nova senha"
          minLength={8}
          maxLength={128}
          required
          disabled={isPasswordLoading}
        />
        <input
          name="confirmPassword"
          type="password"
          className="field-control"
          placeholder="Confirmar nova senha"
          minLength={8}
          maxLength={128}
          required
          disabled={isPasswordLoading}
        />
        <Button type="submit" variant="secondary" disabled={isPasswordLoading}>
          {isPasswordLoading ? "Salvando" : "Alterar senha"}
        </Button>
        <p className="min-h-5 text-sm font-semibold text-ink" role="status">
          {passwordMessage}
        </p>
      </form>
    </div>
  );
}
