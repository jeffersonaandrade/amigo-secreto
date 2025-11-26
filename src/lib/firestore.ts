/**
 * Firestore operations using Client SDK
 * All database operations are done directly from the client
 */
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  limit,
  orderBy,
  type Firestore,
  type Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  User,
  InsertUser,
  Group,
  InsertGroup,
  Participant,
  InsertParticipant,
  Draw,
  InsertDraw,
} from "@shared/types";
import { nanoid } from "nanoid";

// Helper to ensure db is initialized
function getDb() {
  if (!db) {
    throw new Error("Firestore não está inicializado. Verifique as variáveis de ambiente NEXT_PUBLIC_FIREBASE_*");
  }
  return db;
}

// Helper to convert Firestore Timestamp to Date
function toDate(value: any): Date {
  if (!value) return new Date();
  if (value.toDate) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "string") return new Date(value);
  if (value.seconds) return new Date(value.seconds * 1000);
  return new Date();
}

// ========== USUÁRIOS ==========

export async function upsertUser(userData: InsertUser & { email: string; id: string }): Promise<void> {
  const userRef = doc(getDb(), "users", userData.id);
  const userDoc = await getDoc(userRef);
  
  const now = new Date();
  const user: Partial<User> = {
    email: userData.email,
    name: userData.name ?? null,
    role: userData.role ?? "user",
    updatedAt: now,
    lastSignedIn: userData.lastSignedIn ?? now,
  };

  if (!userDoc.exists()) {
    user.createdAt = now;
  }

  await setDoc(userRef, user, { merge: true });
}

export async function getUserById(id: string): Promise<User | null> {
  const userRef = doc(getDb(), "users", id);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    return null;
  }

  const data = userDoc.data();
  return {
    id: userDoc.id,
    email: data.email ?? null,
    name: data.name ?? null,
    role: data.role ?? "user",
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    lastSignedIn: toDate(data.lastSignedIn),
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const q = query(
    collection(getDb(), "users"),
    where("email", "==", email),
    limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const userDoc = snapshot.docs[0];
  const data = userDoc.data();
  return {
    id: userDoc.id,
    email: data.email ?? null,
    name: data.name ?? null,
    role: data.role ?? "user",
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    lastSignedIn: toDate(data.lastSignedIn),
  };
}

// ========== GRUPOS ==========

export async function createGroup(group: InsertGroup & { id?: string }): Promise<Group> {
  const id = group.id || nanoid();
  const now = new Date();
  const groupData: Group = {
    id,
    createdAt: now,
    updatedAt: now,
    isDrawn: false,
    name: group.name,
    description: group.description ?? null,
    creatorId: group.creatorId,
    suggestedValue: group.suggestedValue ?? null,
    revealDate: group.revealDate ?? null,
    inviteCode: group.inviteCode,
  };
  
  const groupRef = doc(getDb(), "groups", id);
  await setDoc(groupRef, groupData);
  
  return groupData;
}

export async function getGroupById(id: string): Promise<Group | null> {
  const groupRef = doc(getDb(), "groups", id);
  const groupDoc = await getDoc(groupRef);
  
  if (!groupDoc.exists()) {
    return null;
  }

  const data = groupDoc.data();
  return {
    id: groupDoc.id,
    name: data.name,
    description: data.description ?? null,
    creatorId: data.creatorId,
    suggestedValue: data.suggestedValue ?? null,
    revealDate: data.revealDate ? toDate(data.revealDate) : null,
    isDrawn: data.isDrawn ?? false,
    inviteCode: data.inviteCode,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function getGroupByInviteCode(inviteCode: string): Promise<Group | null> {
  const q = query(
    collection(getDb(), "groups"),
    where("inviteCode", "==", inviteCode),
    limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const groupDoc = snapshot.docs[0];
  const data = groupDoc.data();
  return {
    id: groupDoc.id,
    name: data.name,
    description: data.description ?? null,
    creatorId: data.creatorId,
    suggestedValue: data.suggestedValue ?? null,
    revealDate: data.revealDate ? toDate(data.revealDate) : null,
    isDrawn: data.isDrawn ?? false,
    inviteCode: data.inviteCode,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function getGroupsByCreator(creatorId: string): Promise<Group[]> {
  try {
    // Primeiro, busca sem orderBy para evitar necessidade de índice composto
    const q = query(
      collection(getDb(), "groups"),
      where("creatorId", "==", creatorId)
    );
    const snapshot = await getDocs(q);

    // Ordena manualmente após buscar (mais simples e não requer índice)
    const groups = snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description ?? null,
          creatorId: data.creatorId,
          suggestedValue: data.suggestedValue ?? null,
          revealDate: data.revealDate ? toDate(data.revealDate) : null,
          isDrawn: data.isDrawn ?? false,
          inviteCode: data.inviteCode,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Ordena por data decrescente

    return groups;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error("[Firestore] Erro ao buscar grupos:", error);
      console.error("[Firestore] Código do erro:", error.code);
      console.error("[Firestore] Mensagem:", error.message);
    }
    
    // Se o erro for de índice faltando, tenta sem orderBy
    if (error.code === "failed-precondition" || error.message?.includes("index")) {
      const q = query(
        collection(getDb(), "groups"),
        where("creatorId", "==", creatorId)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description ?? null,
          creatorId: data.creatorId,
          suggestedValue: data.suggestedValue ?? null,
          revealDate: data.revealDate ? toDate(data.revealDate) : null,
          isDrawn: data.isDrawn ?? false,
          inviteCode: data.inviteCode,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
        };
      });
    }
    
    throw error;
  }
}

export async function updateGroup(id: string, updates: Partial<InsertGroup>): Promise<void> {
  const groupRef = doc(getDb(), "groups", id);
  await updateDoc(groupRef, {
    ...updates,
    updatedAt: new Date(),
  });
}

export async function deleteGroup(id: string): Promise<void> {
  const groupRef = doc(getDb(), "groups", id);
  await deleteDoc(groupRef);
}

// ========== PARTICIPANTES ==========

export async function createParticipant(participant: InsertParticipant & { id?: string }): Promise<Participant> {
  const id = participant.id || nanoid();
  const now = new Date();
  const participantData: Participant = {
    id,
    createdAt: now,
    groupId: participant.groupId,
    name: participant.name,
    email: participant.email ?? null,
    phone: participant.phone ?? null,
    wishlist: participant.wishlist ?? null,
    accessToken: participant.accessToken,
  };
  
  const participantRef = doc(getDb(), "participants", id);
  await setDoc(participantRef, participantData);
  
  return participantData;
}

export async function getParticipantsByGroup(groupId: string): Promise<Participant[]> {
  const q = query(
    collection(getDb(), "participants"),
    where("groupId", "==", groupId)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      groupId: data.groupId,
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      wishlist: data.wishlist ?? null,
      accessToken: data.accessToken,
      createdAt: toDate(data.createdAt),
    };
  });
}

export async function getParticipantByToken(accessToken: string): Promise<Participant | null> {
  const q = query(
    collection(getDb(), "participants"),
    where("accessToken", "==", accessToken),
    limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const participantDoc = snapshot.docs[0];
  const data = participantDoc.data();
  return {
    id: participantDoc.id,
    groupId: data.groupId,
    name: data.name,
    email: data.email ?? null,
    phone: data.phone ?? null,
    wishlist: data.wishlist ?? null,
    accessToken: data.accessToken,
    createdAt: toDate(data.createdAt),
  };
}

export async function deleteParticipant(id: string): Promise<void> {
  const participantRef = doc(getDb(), "participants", id);
  await deleteDoc(participantRef);
}

// ========== SORTEIOS ==========

export async function createDraw(draw: InsertDraw & { id?: string }): Promise<Draw> {
  const id = draw.id || nanoid();
  const now = new Date();
  const drawData: Draw = {
    id,
    createdAt: now,
    ...draw,
  };
  
  const drawRef = doc(getDb(), "draws", id);
  await setDoc(drawRef, drawData);
  
  return drawData;
}

export async function getDrawsByGroup(groupId: string): Promise<Draw[]> {
  const q = query(
    collection(getDb(), "draws"),
    where("groupId", "==", groupId)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      groupId: data.groupId,
      giverId: data.giverId,
      receiverId: data.receiverId,
      createdAt: toDate(data.createdAt),
    };
  });
}

export async function getDrawForGiver(groupId: string, giverId: string): Promise<Draw | null> {
  const q = query(
    collection(getDb(), "draws"),
    where("groupId", "==", groupId),
    where("giverId", "==", giverId),
    limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const drawDoc = snapshot.docs[0];
  const data = drawDoc.data();
  return {
    id: drawDoc.id,
    groupId: data.groupId,
    giverId: data.giverId,
    receiverId: data.receiverId,
    createdAt: toDate(data.createdAt),
  };
}

export async function deleteDrawsByGroup(groupId: string): Promise<void> {
  const q = query(
    collection(getDb(), "draws"),
    where("groupId", "==", groupId)
  );
  const snapshot = await getDocs(q);

  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}

