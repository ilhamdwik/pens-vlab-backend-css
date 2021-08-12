import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

async function main() {
  // user related

  const userAdmin = await prisma.users.create({
    data: {
      email: "admin@pens.ac.id",
    },
  });

  await prisma.user_to_role.create({
    data: {
      user_id: userAdmin.id,
      role_id: "adm",
    },
  });

  const hash2 = await bcrypt.hash("admin123", 12);

  await prisma.admins.create({
    data: {
      name: "Admin",
      pswd: hash2,
      user_id: userAdmin.id,
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
