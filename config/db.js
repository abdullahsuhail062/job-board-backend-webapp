import neon from '@neondatabase/serverless'
import  prisma, { PrismaClient }  from '@prisma/client'

const sql = neon(process.env.DATABASE_URL)
const prisma = new PrismaClient()
export {prisma} 
export {sql}