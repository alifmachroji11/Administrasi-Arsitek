import { LoginForm } from "./LoginForm";

// Server Component on purpose: checking env vars here (at request time, on
// the server) is deterministic — no client-side fetch to /api/auth/providers
// that can race, time out, or fail silently on a cold start.
export default function LoginPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return <LoginForm googleEnabled={googleEnabled} />;
}
