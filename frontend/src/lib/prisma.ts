// Mock Prisma client for build compatibility
// Replace with real Prisma client after fixing schema

export interface MockUser {
  id: string;
  name: string | null;
  email: string | null;
  password: string | null;
}

export interface MockPrismaClient {
  user: {
    findUnique: (args?: { where?: { email?: string } }) => Promise<MockUser | null>;
    findMany: () => Promise<MockUser[]>;
    create: (args?: { data?: Partial<MockUser> }) => Promise<MockUser>;
    update: (args?: unknown) => Promise<MockUser>;
  };
  account: {
    findUnique: (args?: unknown) => Promise<null>;
  };
  session: {
    findUnique: (args?: unknown) => Promise<null>;
    create: (args?: unknown) => Promise<Record<string, never>>;
  };
  verificationToken: {
    findUnique: (args?: unknown) => Promise<null>;
  };
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
}

const mockPrisma: MockPrismaClient = {
  user: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => ({ id: "", name: null, email: null, password: null }),
    update: async () => ({ id: "", name: null, email: null, password: null }),
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

const globalForPrisma = globalThis as unknown as { prisma?: MockPrismaClient };

export const prisma: MockPrismaClient = globalForPrisma.prisma || mockPrisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
