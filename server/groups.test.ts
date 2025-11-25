import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: String(userId),
    email: `user${userId}@example.com`,
    name: `Test User ${userId}`,
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("groups", () => {
  it("should create a new group", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const group = await caller.groups.create({
      name: "Amigo Secreto da Família",
      description: "Natal 2024",
      suggestedValue: "R$ 50,00",
      revealDate: new Date("2024-12-25"),
    });

    expect(group).toBeDefined();
    expect(group.name).toBe("Amigo Secreto da Família");
    expect(group.description).toBe("Natal 2024");
    expect(group.suggestedValue).toBe("R$ 50,00");
    expect(group.creatorId).toBe(1);
    expect(group.isDrawn).toBe(0);
    expect(group.inviteCode).toBeDefined();
    expect(group.inviteCode.length).toBeGreaterThan(0);
  });

  it("should list groups created by user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create two groups
    await caller.groups.create({
      name: "Grupo 1",
    });
    await caller.groups.create({
      name: "Grupo 2",
    });

    const groups = await caller.groups.list();

    expect(groups).toBeDefined();
    expect(groups.length).toBeGreaterThanOrEqual(2);
    expect(groups.every(g => g.creatorId === 1)).toBe(true);
  });

  it("should get group by id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const created = await caller.groups.create({
      name: "Test Group",
    });

    const group = await caller.groups.getById({ id: created.id });

    expect(group).toBeDefined();
    expect(group.id).toBe(created.id);
    expect(group.name).toBe("Test Group");
  });

  it("should not allow non-creator to access group", async () => {
    const { ctx: ctx1 } = createAuthContext(1);
    const caller1 = appRouter.createCaller(ctx1);

    const group = await caller1.groups.create({
      name: "Private Group",
    });

    const { ctx: ctx2 } = createAuthContext(2);
    const caller2 = appRouter.createCaller(ctx2);

    await expect(
      caller2.groups.getById({ id: group.id })
    ).rejects.toThrow("FORBIDDEN");
  });

  it("should update group", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const group = await caller.groups.create({
      name: "Original Name",
    });

    await caller.groups.update({
      id: group.id,
      name: "Updated Name",
      suggestedValue: "R$ 100,00",
    });

    const updated = await caller.groups.getById({ id: group.id });

    expect(updated.name).toBe("Updated Name");
    expect(updated.suggestedValue).toBe("R$ 100,00");
  });

  it("should delete group", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const group = await caller.groups.create({
      name: "To Delete",
    });

    await caller.groups.delete({ id: group.id });

    await expect(
      caller.groups.getById({ id: group.id })
    ).rejects.toThrow("NOT_FOUND");
  });
});
