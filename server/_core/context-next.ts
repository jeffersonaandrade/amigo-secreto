import type { User } from "@shared/types";

export type TrpcContext = {
  user: User | null;
  headers: Record<string, string>;
  userId: string | null; // Firebase UID
};

/**
 * Verifica o token Firebase usando a API REST (sem Admin SDK)
 */
async function verifyIdToken(idToken: string, projectId: string): Promise<{ uid: string; email?: string } | null> {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.users && data.users.length > 0) {
      const user = data.users[0];
      return {
        uid: user.localId || user.uid,
        email: user.email,
      };
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("[Auth] Token verification failed:", error);
    }
    return null;
  }
}

export async function createContextNext(headers: Record<string, string>): Promise<TrpcContext> {
  let userId: string | null = null;
  let user: User | null = null;

  try {
    // Get the Firebase ID token from Authorization header
    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        headers,
        user: null,
        userId: null,
      };
    }

    const idToken = authHeader.substring(7);
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";
    
    // Verify the ID token using REST API (no Admin SDK needed)
    const decodedToken = await verifyIdToken(idToken, projectId);
    
    if (decodedToken) {
      userId = decodedToken.uid;
      // User data will be fetched from Firestore by the client or via Firestore Rules
      // For now, we just pass the userId and let Firestore Rules handle authorization
      // User data structure - will be fetched from Firestore by client if needed
      user = {
        id: userId,
        email: decodedToken.email || null,
        name: null,
        role: "user", // Default role, can be updated in Firestore
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    if (process.env.NODE_ENV === 'development') {
      console.warn("[Auth] Failed to authenticate:", error);
    }
    user = null;
    userId = null;
  }

  return {
    headers,
    user,
    userId,
  };
}
