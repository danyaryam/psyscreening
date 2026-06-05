import { prisma } from "../lib/prisma.js";

export async function createAdminLog(adminId, action, entity, description) {
  return prisma.adminLog.create({
    data: {
      adminId,
      action,
      entity,
      description,
    },
  });
}
