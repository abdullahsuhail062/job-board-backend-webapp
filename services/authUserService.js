// services/userService.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function createUser({ username, email, password, avatar = null }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: username,
      email: email,
      password: hashedPassword,
      avatar: avatar || null, // <-- Add avatar field
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


export async function updateUserProfileData(userId, { username, avatar }) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: username,  // ✅ Use the correct Prisma field name
      avatar: avatar
    },
    select: { id: true, name: true, avatar: true },
  });

  return updatedUser;
}


