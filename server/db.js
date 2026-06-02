import { prisma } from "./prisma.js";

export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
  };
}

export async function findUserByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  return prisma.user.findUnique({ where: { email: normalized } });
}

export async function findUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser({ email, passwordHash, name, initialState = {} }) {
  const normalized = String(email || "").trim().toLowerCase();
  try {
    return await prisma.user.create({
      data: {
        email: normalized,
        passwordHash,
        name: String(name || "").trim() || "სტუდენტი",
        appState: {
          create: { payload: initialState },
        },
      },
    });
  } catch (e) {
    if (e.code === "P2002") {
      const err = new Error("EMAIL_EXISTS");
      err.code = "EMAIL_EXISTS";
      throw err;
    }
    throw e;
  }
}

export async function updateUserName(id, name) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name: String(name || "").trim() },
    });
    return publicUser(user);
  } catch (e) {
    if (e.code === "P2025") return null;
    throw e;
  }
}

export async function getUserState(userId) {
  const row = await prisma.userAppState.findUnique({
    where: { userId },
  });
  if (!row?.payload || typeof row.payload !== "object") return null;
  return row.payload;
}

export async function saveUserState(userId, state) {
  await prisma.userAppState.upsert({
    where: { userId },
    create: { userId, payload: state },
    update: { payload: state },
  });
  return true;
}
