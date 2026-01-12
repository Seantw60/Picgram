import { neonConfig } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Configure Neon to use WebSocket in Node.js
neonConfig.webSocketConstructor = ws;

// Create connection pool
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// Create adapter
const adapter = new PrismaNeon(pool);

// Create and export Prisma Client instance
export const prisma = new PrismaClient({ adapter });