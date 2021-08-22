import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

const adminData = {
  email: "admin@pens.ac.id",
  password: "password",
  name: "Admin",
};

async function main() {
  // user related

  const hash2 = await bcrypt.hash(adminData.password, 12);

  await prisma.admins.create({
    data: {
      name: adminData.name,
      pswd: hash2,
      email: adminData.email,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
