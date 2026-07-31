import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRepository } from "@/server/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const repo = getRepository();
  const user = await repo.getUserById(session.user.id);

  if (!user) {
    // The mock repository is in-memory (see src/server/mock-repository.ts) —
    // on Vercel a fresh serverless instance means a fresh empty store, so an
    // account created on a now-recycled instance won't be found here even
    // though the session JWT is still valid. Fall back to what the JWT
    // itself carries (name/email are set at sign-in) rather than treating
    // this as a hard error — the account "still exists" as far as the user
    // is concerned. WhatsApp status genuinely can't be recovered this way,
    // so it's reported as disconnected. Real fix is a persistent DB
    // (DATABASE_URL — see README); this is a graceful-degradation patch,
    // not a substitute for it.
    if (session.user.email) {
      return NextResponse.json({
        name: session.user.name ?? session.user.email,
        email: session.user.email,
        whatsappVerifiedNumber: null,
      });
    }
    return NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({
    name: user.name,
    email: user.email,
    whatsappVerifiedNumber: user.whatsappVerifiedNumber,
  });
}
