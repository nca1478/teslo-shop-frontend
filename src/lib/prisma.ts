//  Evitando múltiples instancias de Prisma Client
//  https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help

import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "production" ? ["error"] : [],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
