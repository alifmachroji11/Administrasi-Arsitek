import { RegisterForm } from "./RegisterForm";

// Server Component on purpose — see src/app/login/page.tsx for why.
export default function RegisterPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return <RegisterForm googleEnabled={googleEnabled} />;
}
