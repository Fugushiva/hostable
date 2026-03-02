import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as relations from './relations';

// On utilise le connection pooling de Neon (-pooler optionnel, mais géré automatiquement par '@neondatabase/serverless')
const sql = neon(process.env.DATABASE_URL!);

// On initialise Drizzle avec notre schéma pour bénéficier du typage
export const db = drizzle({ client: sql, schema: { ...schema, ...relations } });
