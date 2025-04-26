// db.js
import {neon} from '@neondatabase/serverless'
// Neon automatically handles pooling and connection reuse

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

//const sql = neon(`postgresql://neondb_owner:npg_jQzOurV9of0F@ep-withered-breeze-a4rh87h0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`)

export const sql = neon(process.env.DATABASE_URL);


export { sql };
