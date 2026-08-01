"use client";

import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { ProfilContent } from "./ProfilContent";
import { navigateWithTransition } from "@/lib/viewTransition";

export default function ProfilPage() {
  const router = useRouter();
  return (
    <div className="page-transition flex h-dvh flex-col overflow-hidden" style={{ background: "var(--color-paper)" }}>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ProfilContent />
      </div>
      <BottomNav
        active="profil"
        onProyek={() => navigateWithTransition(router, "/projects")}
        onCari={() => navigateWithTransition(router, "/search")}
        onProfil={() => navigateWithTransition(router, "/profil")}
      />
    </div>
  );
}
