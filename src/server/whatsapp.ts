/**
 * WhatsApp send layer — interface first, so the OTP flow and future
 * "laporan siap" notifications don't care which provider is behind them.
 *
 * Two implementations:
 *  - MockWhatsAppClient (active by default): doesn't call any real API.
 *    Returns the OTP code in the response so the flow is actually
 *    testable end-to-end without Meta credentials — never do this with a
 *    real provider, it's strictly a local/dev affordance.
 *  - CloudApiWhatsAppClient: real WhatsApp Business Platform (Cloud API)
 *    call, per Bagian 5 of the product brief. Activates automatically once
 *    WHATSAPP_ACCESS_TOKEN + WHATSAPP_PHONE_NUMBER_ID are set. Untested
 *    against a live WABA — no sandbox credentials available in this
 *    build — so treat as a structurally-correct starting point, verify
 *    against Meta's docs before relying on it in production.
 */
export interface OtpSendResult {
  ok: boolean;
  providerMessageId?: string;
  /** Only ever populated by the mock provider — see class doc above. */
  devOnlyCode?: string;
}

export interface WhatsAppClient {
  sendOtpTemplate(toPhoneE164: string, code: string): Promise<OtpSendResult>;
  sendTextMessage(toPhoneE164: string, text: string): Promise<{ ok: boolean }>;
}

class MockWhatsAppClient implements WhatsAppClient {
  async sendOtpTemplate(toPhoneE164: string, code: string): Promise<OtpSendResult> {
    console.info(`[whatsapp:mock] OTP for ${toPhoneE164}: ${code}`);
    return { ok: true, providerMessageId: `mock_${Date.now()}`, devOnlyCode: code };
  }

  async sendTextMessage(toPhoneE164: string, text: string): Promise<{ ok: boolean }> {
    console.info(`[whatsapp:mock] -> ${toPhoneE164}: ${text}`);
    return { ok: true };
  }
}

class CloudApiWhatsAppClient implements WhatsAppClient {
  constructor(
    private readonly accessToken: string,
    private readonly phoneNumberId: string,
    /** Meta-approved template name for OTP delivery — must exist on the WABA. */
    private readonly otpTemplateName = process.env.WHATSAPP_OTP_TEMPLATE_NAME ?? "notula_otp",
  ) {}

  private endpoint() {
    return `https://graph.facebook.com/v20.0/${this.phoneNumberId}/messages`;
  }

  private async post(body: unknown) {
    const res = await fetch(this.endpoint(), {
      method: "POST",
      headers: { Authorization: `Bearer ${this.accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`WhatsApp Cloud API error ${res.status}: ${detail}`);
    }
    return res.json() as Promise<{ messages?: Array<{ id: string }> }>;
  }

  async sendOtpTemplate(toPhoneE164: string, code: string): Promise<OtpSendResult> {
    const data = await this.post({
      messaging_product: "whatsapp",
      to: toPhoneE164.replace(/\D/g, ""),
      type: "template",
      template: {
        name: this.otpTemplateName,
        language: { code: "id" },
        components: [{ type: "body", parameters: [{ type: "text", text: code }] }],
      },
    });
    return { ok: true, providerMessageId: data.messages?.[0]?.id };
  }

  async sendTextMessage(toPhoneE164: string, text: string): Promise<{ ok: boolean }> {
    await this.post({
      messaging_product: "whatsapp",
      to: toPhoneE164.replace(/\D/g, ""),
      type: "text",
      text: { body: text },
    });
    return { ok: true };
  }
}

export function getWhatsAppClient(): WhatsAppClient {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (token && phoneNumberId) return new CloudApiWhatsAppClient(token, phoneNumberId);
  return new MockWhatsAppClient();
}

/** The bot's own number, shown in onboarding — a single shared number, not per-user. */
export function getBotDisplayNumber(): string {
  return process.env.WHATSAPP_BOT_DISPLAY_NUMBER ?? "+62 812-3456-7890";
}
