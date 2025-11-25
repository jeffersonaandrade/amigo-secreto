export const ENV = {
  isProduction: process.env.NODE_ENV === "production",
  firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
};
