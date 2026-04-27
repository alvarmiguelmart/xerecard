import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { DatabaseError, listNotifications } from "@/lib/marketplace-db";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Entre para ver notificações." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const requestedTake = Number(searchParams.get("take") ?? 20);
  const take = Number.isInteger(requestedTake)
    ? Math.min(Math.max(requestedTake, 1), 50)
    : 20;

  try {
    return NextResponse.json(
      await listNotifications({ userId: session.user.id, cursor, take })
    );
  } catch (error) {
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { message: "Notificações temporariamente indisponíveis." },
        { status: 503 }
      );
    }

    throw error;
  }
}
