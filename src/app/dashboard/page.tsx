"use client";
import dynamicImport from "next/dynamic";

// Importação dinâmica para evitar SSG
const Dashboard = dynamicImport(() => import("@/pages/Dashboard"), {
  ssr: false,
});

export default function Page() {
  return <Dashboard />;
}

