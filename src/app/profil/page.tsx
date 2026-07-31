"use client";

import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { ProfilPlaceholder } from "@/screens/ProfilPlaceholder";

export default function ProfilPage() {
  const router = useRouter();
  return (
    <div className="flex h-dvh flex-col overflow-hidden" style={{ background: "var(--color-paper)" }}>
      <ProfilPlaceholder />
      <BottomNav
        active="profil"
        onProyek={() => router.push("/projects")}
        onCari={() => router.push("/search")}
        onProfil={() => router.push("/profil")}
      />
    </div>
  );
}
