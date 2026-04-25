import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listNotifications } from "@/lib/marketplace-db";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Entre para ver notificações." }, { status: 401 });
  }

  return NextResponse.json({ notifications: await listNotifications(session.user.id) });
}
