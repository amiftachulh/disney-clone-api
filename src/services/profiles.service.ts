import prisma from "../config/prisma";

export async function getProfileById(id: string, accountId: string) {
  return prisma.profile.findUnique({
    where: {
      id,
      account: { id: accountId },
    },
  });
}
