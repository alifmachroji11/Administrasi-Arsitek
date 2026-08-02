import { LandingPage } from "./LandingPage";

// Public marketing page — authenticated visitors are redirected to
// /projects by src/proxy.ts before this ever renders for them.
// Server Component on purpose: checking env vars here (at request time, on
// the server) is deterministic — see src/app/login/page.tsx for the same
// pattern.
export default function RootPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return <LandingPage googleEnabled={googleEnabled} />;
}
