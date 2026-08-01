"use client";

import { SessionProvider } from "next-auth/react";
import { ViewportHeightFix } from "@/components/ViewportHeightFix";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ViewportHeightFix />
      {children}
    </SessionProvider>
  );
}
