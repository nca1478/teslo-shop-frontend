//  Evitando múltiples instancias de Prisma Client
//  https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help

import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5433/teslo-shop?schema=public";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: ["query"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
