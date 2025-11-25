"use client";
import dynamicImport from "next/dynamic";

// Importação dinâmica para evitar SSG
const AllResults = dynamicImport(() => import("@/pages/AllResults"), {
  ssr: false,
});

export default function Page() {
  return <AllResults />;
}

