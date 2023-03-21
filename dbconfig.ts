import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbSetup = async () => {
  try {
    await prisma.$connect();
    console.log("Conectado no banco");
  } catch (error) {
    console.error(error);
  }
};

export { prisma, dbSetup };
