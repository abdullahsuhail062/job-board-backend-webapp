// services/userService.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function createUser({ username, email, password }) {
  const hashed = await hashPassword(password); // ✅ hash inside the function
  const user = await prisma.user.create({
    data: {
      name: username,
      email,
      password: hashed,
    },
  });
  return user;
}

export async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserByUsername(username) {
  return prisma.user.findUnique({ where: { name: username } });
}
