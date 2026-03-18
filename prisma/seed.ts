import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "admin@juryflow.local" },
    update: {},
    create: {
      email: "admin@juryflow.local",
      name: "Admin Organisateur",
      role: "organizer",
    },
  });
  console.log("Seed: organisateur créé", user.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
