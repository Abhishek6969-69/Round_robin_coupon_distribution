import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
    },
  });

  // Seed Coupons
  const couponData = [
    { code: "DISCOUNT10" },
    { code: "SAVE20" },
    { code: "OFFER30" },
    { code: "DEAL40" },
    { code: "PROMO50" },
  ];

  for (const data of couponData) {
    await prisma.coupon.upsert({
      where: { code: data.code },
      update: {},
      create: data,
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((error) => {
    console.error("Error seeding data:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
