"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="secondary"
      icon={<LogOut size={17} aria-hidden="true" />}
      onClick={logout}
    >
      Sair
    </Button>
  );
}

