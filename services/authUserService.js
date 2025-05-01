// services/userService.js
import { PrismaClient } from '@prisma/client';

import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
export const hashedPassword=0;

export async function createUser({ username, email, password }) {
  hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name: username,
      email,
      password: hashedPassword,
    },
  });
  return user;
}

export async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserByUsername(username) {
  return prisma.user.findUnique({ where: { username: username } });
}

