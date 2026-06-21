// Mock Prisma client for build compatibility
// Replace with real Prisma client after fixing schema

const mockPrisma = {
  user: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => ({}),
    update: async () => ({}),
  },
  account: {
    findUnique: async () => null,
  },
  session: {
    findUnique: async () => null,
    create: async () => ({}),
  },
  verificationToken: {
    findUnique: async () => null,
  },
  $connect: async () => {},
  $disconnect: async () => {},
};

export const prisma = (globalThis as any).prisma || mockPrisma;

if (process.env.NODE_ENV !== "production") {
  (globalThis as any).prisma = prisma;
}
