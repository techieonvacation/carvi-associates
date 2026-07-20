import { PrismaClient, Role } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import "dotenv/config";
import {
  defaultHeader,
  defaultHero,
  defaultNavItems,
  defaultSocialLinks,
  defaultTopbar,
} from "../lib/cms/defaults";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@carviassociates.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123456";
  const managerEmail = process.env.MANAGER_EMAIL ?? "manager@carviassociates.com";
  const managerPassword = process.env.MANAGER_PASSWORD ?? "Manager@123456";
  const adminHash = await bcrypt.hash(adminPassword, 12);
  const managerHash = await bcrypt.hash(managerPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminHash,
      name: "Site Admin",
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      name: "Site Admin",
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: managerEmail },
    update: {
      passwordHash: managerHash,
      name: "Content Manager",
      role: Role.MANAGER,
    },
    create: {
      email: managerEmail,
      passwordHash: managerHash,
      name: "Content Manager",
      role: Role.MANAGER,
    },
  });

  const navCount = await prisma.navItem.count();
  if (navCount === 0) {
    await prisma.navItem.createMany({
      data: defaultNavItems.map((item) => ({
        label: item.label,
        href: item.href,
        sortOrder: item.sortOrder,
        visible: item.visible,
      })),
    });
  }

  const socialCount = await prisma.socialLink.count();
  if (socialCount === 0) {
    await prisma.socialLink.createMany({
      data: defaultSocialLinks.map((item) => ({
        label: item.label,
        href: item.href,
        icon: item.icon,
        sortOrder: item.sortOrder,
        visible: item.visible,
      })),
    });
  }

  await prisma.topbarSettings.upsert({
    where: { id: "default" },
    update: defaultTopbar,
    create: { id: "default", ...defaultTopbar },
  });

  await prisma.heroSettings.upsert({
    where: { id: "default" },
    update: {
      ...defaultHero,
      activeUserImages: defaultHero.activeUserImages,
    },
    create: {
      id: "default",
      ...defaultHero,
      activeUserImages: defaultHero.activeUserImages,
    },
  });

  await prisma.headerSettings.upsert({
    where: { id: "default" },
    update: defaultHeader,
    create: { id: "default", ...defaultHeader },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
