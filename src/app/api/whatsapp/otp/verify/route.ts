import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRepository } from "@/server/db";
import { verifyOtpCode } from "@/server/password";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Belum masuk." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const phoneNumber = typeof body?.phoneNumber === "string" ? body.phoneNumber : "";
  const code = typeof body?.code === "string" ? body.code : "";
  if (!phoneNumber || !code) return NextResponse.json({ error: "Nomor dan kode wajib diisi." }, { status: 400 });

  const repo = getRepository();
  const otp = await repo.getLatestOtp(session.user.id, phoneNumber);
  if (!otp) return NextResponse.json({ error: "Belum ada kode OTP untuk nomor ini. Kirim ulang kode." }, { status: 404 });
  if (otp.verifiedAt) return NextResponse.json({ error: "Kode ini sudah dipakai. Kirim ulang kode." }, { status: 409 });
  if (new Date(otp.expiresAt).getTime() < Date.now()) {
    return NextResponse.json({ error: "Kode sudah kedaluwarsa. Kirim ulang kode." }, { status: 410 });
  }

  const valid = await verifyOtpCode(code, otp.codeHash);
  if (!valid) return NextResponse.json({ error: "Kode salah. Coba lagi." }, { status: 401 });

  await repo.markOtpVerified(otp.id);
  const user = await repo.setUserWhatsappVerified(session.user.id, phoneNumber);

  return NextResponse.json({ ok: true, whatsappVerifiedNumber: user.whatsappVerifiedNumber });
}
