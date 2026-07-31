import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRepository } from "@/server/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const repo = getRepository();
  const user = await repo.getUserById(session.user.id);
  if (!user) return NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 404 });

  return NextResponse.json({
    name: user.name,
    email: user.email,
    whatsappVerifiedNumber: user.whatsappVerifiedNumber,
  });
}
