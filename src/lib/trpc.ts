import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers";
import { auth } from "./firebase";

export const trpc = createTRPCReact<AppRouter>();

// Helper to get Firebase ID token for requests
export async function getAuthToken(): Promise<string | null> {
  if (!auth) return null;
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

