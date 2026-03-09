import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 3306),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.book.createMany({
    data: [
      {
        isbn: "9782070360533",
        title: "Mécanique quantique",
        author: "Cohen-Tannoudji",
        year: 2020,
        category: "Physique",
        available: true,
      },
      {
        isbn: "9780138170000",
        title: "Introduction à Next.js",
        author: "John Doe",
        year: 2024,
        category: "Informatique",
        available: true,
      },
      {
        isbn: "9782100485410",
        title: "Analyse fonctionnelle",
        author: "H. Brezis",
        year: 2019,
        category: "Mathématiques",
        available: true,
      },
      {
        isbn: "9780198810503",
        title: "Chimie organique",
        author: "Clayden",
        year: 2022,
        category: "Chimie",
        available: true,
      },
      {
        isbn: "9780321573513",
        title: "Algorithms",
        author: "Robert Sedgewick",
        year: 2018,
        category: "Informatique",
        available: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed terminé avec succès.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Erreur pendant le seed :", error);
    await prisma.$disconnect();
    process.exit(1);
  });