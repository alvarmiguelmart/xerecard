import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ unreadCount: 0 }, { status: 401 });
  }

  const unreadCount = await prisma.notification.count({
    where: { recipientId: session.user.id, readAt: null }
  });

  return NextResponse.json({ unreadCount });
}

