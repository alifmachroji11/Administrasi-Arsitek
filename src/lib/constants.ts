// Public prototype constant — safe to bundle client-side. Not the source
// of truth for the real bot number in production (see NEXT_PUBLIC_WHATSAPP_
// BOT_DISPLAY_NUMBER / src/server/whatsapp.ts's getBotDisplayNumber()).
export const BOT_DISPLAY_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_BOT_DISPLAY_NUMBER ?? "+62 812-3456-7890";
