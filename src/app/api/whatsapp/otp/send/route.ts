import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRepository } from "@/server/db";
import { generateOtpCode, hashOtpCode } from "@/server/password";
import { getWhatsAppClient } from "@/server/whatsapp";

const OTP_TTL_MS = 5 * 60 * 1000;

function normalizePhone(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, "");
  if (digits.replace("+", "").length < 9) return null;
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
  if (digits.startsWith("62")) return `+${digits}`;
  return `+${digits}`;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const rawPhone = typeof body?.phoneNumber === "string" ? body.phoneNumber : "";
  const phoneNumber = normalizePhone(rawPhone);
  if (!phoneNumber) return NextResponse.json({ error: "Nomor WhatsApp tidak valid." }, { status: 400 });

  const repo = getRepository();
  const code = generateOtpCode();
  const codeHash = await hashOtpCode(code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  await repo.createOtp({ userId: session.user.id, phoneNumber, codeHash, expiresAt });

  const wa = getWhatsAppClient();
  const result = await wa.sendOtpTemplate(phoneNumber, code);

  return NextResponse.json({
    ok: result.ok,
    phoneNumber,
    expiresInSeconds: OTP_TTL_MS / 1000,
    // Only present when running against the mock WhatsApp client (no real
    // credentials configured) — lets the flow be tested end-to-end without
    // a live WABA. Never present once WHATSAPP_ACCESS_TOKEN is set.
    devOnlyCode: result.devOnlyCode,
  });
}
