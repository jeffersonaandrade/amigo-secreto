"use client";
import dynamicImport from "next/dynamic";

// Importação dinâmica para evitar SSG
const Login = dynamicImport(() => import("@/pages/Login"), {
  ssr: false,
});

export default function Page() {
  return <Login />;
}

