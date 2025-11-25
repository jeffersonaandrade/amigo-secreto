"use client";
import dynamicImport from "next/dynamic";

// Importação dinâmica para evitar SSG
const CreateGroup = dynamicImport(() => import("@/pages/CreateGroup"), {
  ssr: false,
});

export default function Page() {
  return <CreateGroup />;
}

