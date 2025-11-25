"use client";
import dynamicImport from "next/dynamic";

// Importação dinâmica para evitar SSG
const GroupDetail = dynamicImport(() => import("@/pages/GroupDetail"), {
  ssr: false,
});

export default function Page() {
  return <GroupDetail />;
}

