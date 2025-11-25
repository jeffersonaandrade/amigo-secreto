"use client";
import dynamicImport from "next/dynamic";

// Importação dinâmica para evitar SSG
const Home = dynamicImport(() => import("@/pages/Home"), {
  ssr: false,
});

export default function Page() {
  return <Home />;
}

