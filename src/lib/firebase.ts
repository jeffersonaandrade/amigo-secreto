import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Configuração com as chaves públicas
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 🔍 DEBUG: Isso vai mostrar no console do navegador se as chaves foram lidas
// Se aparecer "undefined", reinicie o servidor ou verifique o .env.local
if (typeof window !== "undefined") {
  console.log("[Firebase Config Check]", {
    apiKey: firebaseConfig.apiKey ? "OK ✅" : "MISSING ❌",
    projectId: firebaseConfig.projectId ? "OK ✅" : "MISSING ❌",
    authDomain: firebaseConfig.authDomain ? "OK ✅" : "MISSING ❌",
    appId: firebaseConfig.appId ? "OK ✅" : "MISSING ❌",
  });

  // Validação: Verifica se todas as chaves essenciais estão presentes
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);
  
  if (missingKeys.length > 0) {
    console.error("[Firebase Error] Chaves faltando:", missingKeys);
    console.error("[Firebase Error] Verifique se o arquivo .env.local está na raiz do projeto e reinicie o servidor!");
  }
}

// Singleton Pattern: Garante que o Firebase só inicie uma vez
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (typeof window !== "undefined") {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    console.log("[Firebase] Inicializado com sucesso ✅");
  } catch (error) {
    console.error("[Firebase Error] Falha ao inicializar:", error);
    throw new Error("Firebase não pôde ser inicializado. Verifique as variáveis de ambiente.");
  }
}

export { auth, db };
export default app;

