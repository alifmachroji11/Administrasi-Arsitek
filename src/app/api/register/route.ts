import { NextResponse } from "next/server";
import { getRepository } from "@/server/db";
import { hashPassword } from "@/server/password";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Kata sandi minimal 8 karakter." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Nama wajib diisi." }, { status: 400 });
  }

  const repo = getRepository();
  const existing = await repo.getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Email ini sudah terdaftar." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await repo.createUser({ email, passwordHash, name });

  return NextResponse.json({ id: user.id, email: user.email, name: user.name });
}
