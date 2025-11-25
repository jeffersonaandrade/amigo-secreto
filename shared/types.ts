// Tipos compartilhados para Firestore

export type User = {
  id: string;
  email: string | null;
  name: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
};

export type InsertUser = {
  email: string | null;
  name: string | null;
  role?: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
  lastSignedIn?: Date;
};

export type Group = {
  id: string;
  name: string;
  description: string | null;
  creatorId: string;
  suggestedValue: string | null;
  revealDate: Date | null;
  isDrawn: boolean;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertGroup = {
  name: string;
  description?: string | null;
  creatorId: string;
  suggestedValue?: string | null;
  revealDate?: Date | null;
  isDrawn?: boolean;
  inviteCode: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Participant = {
  id: string;
  groupId: string;
  name: string;
  email: string | null;
  phone: string | null;
  wishlist: string | null;
  accessToken: string;
  createdAt: Date;
};

export type InsertParticipant = {
  groupId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  wishlist?: string | null;
  accessToken: string;
  createdAt?: Date;
};

export type Draw = {
  id: string;
  groupId: string;
  giverId: string;
  receiverId: string;
  createdAt: Date;
};

export type InsertDraw = {
  groupId: string;
  giverId: string;
  receiverId: string;
  createdAt?: Date;
};
