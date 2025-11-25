"use client";
import dynamicImport from "next/dynamic";

// Importação dinâmica para evitar SSG
const ParticipantResult = dynamicImport(() => import("@/pages/ParticipantResult"), {
  ssr: false,
});

export default function Page() {
  return <ParticipantResult />;
}

