import { LandingPage } from "./LandingPage";

// Public marketing page — authenticated visitors are redirected to
// /projects by src/proxy.ts before this ever renders for them.
export default function RootPage() {
  return <LandingPage />;
}
