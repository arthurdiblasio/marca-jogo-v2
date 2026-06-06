import { prisma } from "@/lib/prisma";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    });
  },

  findByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: {
        googleId,
      },
      include: {
        profile: true,
      },
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
      },
    });
  },

  create(data: { email: string; passwordHash: string; fullName: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,

        profile: {
          create: {
            fullName: data.fullName,
          },
        },
      },

      include: {
        profile: true,
      },
    });
  },

  createGoogleUser(data: {
    googleId: string;
    email: string;
    fullName: string;
  }) {
    return prisma.user.create({
      data: {
        googleId: data.googleId,
        email: data.email,

        profile: {
          create: {
            fullName: data.fullName,
          },
        },
      },

      include: {
        profile: true,
      },
    });
  },

  updateGoogleId(userId: string, googleId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        googleId,
      },

      include: {
        profile: true,
      },
    });
  },
};
