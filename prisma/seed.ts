import { PrismaClient, Role } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import "dotenv/config";
import {
  defaultAbout,
  defaultBookAppointment,
  defaultFeatures,
  defaultHeader,
  defaultHero,
  defaultNavItems,
  defaultPartnerMarqueeLabel,
  defaultPartners,
  defaultServices,
  defaultServicesSection,
  defaultSocialLinks,
  defaultTopbar,
  defaultWhyChoose,
  defaultWhyChooseItems,
} from "../lib/cms/defaults";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

function isEmptyJsonArray(value: unknown): boolean {
  return Array.isArray(value) && value.length === 0;
}

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

  const existingTopbar = await prisma.topbarSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingTopbar) {
    await prisma.topbarSettings.create({
      data: { id: "default", ...defaultTopbar },
    });
  }

  const existingHero = await prisma.heroSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingHero) {
    await prisma.heroSettings.create({
      data: {
        id: "default",
        ...defaultHero,
        activeUserImages: defaultHero.activeUserImages,
        stats: defaultHero.stats,
        trust: defaultHero.trust,
      },
    });
  } else {
    // Non-destructive backfill for newly CMS-managed fields only.
    await prisma.heroSettings.update({
      where: { id: "default" },
      data: {
        ...(isEmptyJsonArray(existingHero.stats) ? { stats: defaultHero.stats } : {}),
        ...(isEmptyJsonArray(existingHero.trust) ? { trust: defaultHero.trust } : {}),
        ...(!existingHero.description ? { description: defaultHero.description } : {}),
        ...(!existingHero.secondaryCtaText
          ? { secondaryCtaText: defaultHero.secondaryCtaText }
          : {}),
      },
    });
  }

  const existingHeader = await prisma.headerSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingHeader) {
    await prisma.headerSettings.create({
      data: { id: "default", ...defaultHeader },
    });
  }

  const existingPartnerSettings = await prisma.partnerMarqueeSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingPartnerSettings) {
    await prisma.partnerMarqueeSettings.create({
      data: {
        id: "default",
        label: defaultPartnerMarqueeLabel,
      },
    });
  }

  const partnerCount = await prisma.partner.count();
  if (partnerCount === 0) {
    await prisma.partner.createMany({
      data: defaultPartners.map((partner) => ({
        name: partner.name,
        tagline: partner.tagline,
        logoUrl: partner.logoUrl,
        variant: partner.variant,
        sortOrder: partner.sortOrder,
        visible: partner.visible,
      })),
    });
  }

  const featureCount = await prisma.feature.count();
  if (featureCount === 0) {
    await prisma.feature.createMany({
      data: defaultFeatures.map((feature) => ({
        icon: feature.icon,
        title: feature.title,
        text: feature.text,
        href: feature.href,
        sortOrder: feature.sortOrder,
        visible: feature.visible,
      })),
    });
  }

  const existingAbout = await prisma.aboutSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingAbout) {
    await prisma.aboutSettings.create({
      data: {
        id: "default",
        tagline: defaultAbout.tagline,
        titleLine1: defaultAbout.title[0],
        titleLine2: defaultAbout.title[1],
        text: defaultAbout.text,
        experienceValue: defaultAbout.experience.value,
        experienceLabel: defaultAbout.experience.label,
        collageOneUrl: defaultAbout.images.collageOne,
        collageTwoUrl: defaultAbout.images.collageTwo,
        collageOneAlt: defaultAbout.collageOneAlt,
        collageTwoAlt: defaultAbout.collageTwoAlt,
        defaultTabId: defaultAbout.defaultTabId,
        taglineBg: defaultAbout.taglineBg,
        tabs: defaultAbout.tabs,
        checklist: defaultAbout.checklist,
      },
    });
  } else {
    await prisma.aboutSettings.update({
      where: { id: "default" },
      data: {
        ...(isEmptyJsonArray(existingAbout.tabs) ? { tabs: defaultAbout.tabs } : {}),
        ...(isEmptyJsonArray(existingAbout.checklist)
          ? { checklist: defaultAbout.checklist }
          : {}),
      },
    });
  }

  const existingServicesSection = await prisma.servicesSectionSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingServicesSection) {
    await prisma.servicesSectionSettings.create({
      data: {
        id: "default",
        tagline: defaultServicesSection.tagline,
        titleLine1: defaultServicesSection.title[0],
        titleLine2: defaultServicesSection.title[1],
        cardTagline: defaultServicesSection.cardTagline,
        taglineBg: defaultServicesSection.taglineBg,
        isVisible: defaultServicesSection.isVisible,
        seoTitle: defaultServicesSection.seoTitle,
        seoDescription: defaultServicesSection.seoDescription,
        seoKeywords: defaultServicesSection.seoKeywords,
        canonicalUrl: defaultServicesSection.canonicalUrl,
        ogImageUrl: defaultServicesSection.ogImageUrl,
        twitterImageUrl: defaultServicesSection.twitterImageUrl,
        noIndex: defaultServicesSection.noIndex,
      },
    });
  }

  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: defaultServices.map((service) => ({
        titleLine1: service.titleLine1,
        titleLine2: service.titleLine2,
        shortTitle: service.shortTitle,
        subtitle: service.subtitle,
        description: service.description,
        slug: service.slug,
        icon: service.icon,
        iconType: service.iconType,
        imageUrl: service.imageUrl,
        imageAlt: service.imageAlt,
        hoverImageUrl: service.hoverImageUrl,
        badge: service.badge,
        category: service.category,
        serviceType: service.serviceType,
        accentColor: service.accentColor,
        ctaText: service.ctaText,
        ctaHref: service.ctaHref,
        displayOrder: service.displayOrder,
        isFeatured: service.isFeatured,
        isPopular: service.isPopular,
        isActive: service.isActive,
        isVisible: service.isVisible,
        publishedAt: new Date(),
        seoTitle: service.seoTitle,
        seoDescription: service.seoDescription,
        seoKeywords: service.seoKeywords,
        canonicalUrl: service.canonicalUrl,
        ogImageUrl: service.ogImageUrl,
        noIndex: service.noIndex,
      })),
    });
  }

  const existingBookAppointment = await prisma.bookAppointmentSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingBookAppointment) {
    await prisma.bookAppointmentSettings.create({
      data: {
        id: "default",
        tagline: defaultBookAppointment.tagline,
        titleLine1: defaultBookAppointment.title[0],
        titleLine2: defaultBookAppointment.title[1],
        description: defaultBookAppointment.description,
        primaryButtonText: defaultBookAppointment.primaryButtonText,
        primaryButtonHref: defaultBookAppointment.primaryButtonHref,
        secondaryButtonText: defaultBookAppointment.secondaryButtonText,
        secondaryButtonHref: defaultBookAppointment.secondaryButtonHref,
        backgroundImageUrl: defaultBookAppointment.backgroundImageUrl,
        backgroundImageAlt: defaultBookAppointment.backgroundImageAlt,
        taglineBg: defaultBookAppointment.taglineBg,
        isVisible: defaultBookAppointment.isVisible,
        seoTitle: defaultBookAppointment.seoTitle,
        seoDescription: defaultBookAppointment.seoDescription,
        seoKeywords: defaultBookAppointment.seoKeywords,
        canonicalUrl: defaultBookAppointment.canonicalUrl,
        ogImageUrl: defaultBookAppointment.ogImageUrl,
        twitterImageUrl: defaultBookAppointment.twitterImageUrl,
        noIndex: defaultBookAppointment.noIndex,
      },
    });
  }

  const existingWhyChoose = await prisma.whyChooseSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingWhyChoose) {
    await prisma.whyChooseSettings.create({
      data: {
        id: "default",
        tagline: defaultWhyChoose.tagline,
        titleLine1: defaultWhyChoose.title[0],
        titleLine2: defaultWhyChoose.title[1],
        description: defaultWhyChoose.description,
        taglineBg: defaultWhyChoose.taglineBg,
        imageUrl: defaultWhyChoose.imageUrl,
        imageAlt: defaultWhyChoose.imageAlt,
        shapeImageUrl: defaultWhyChoose.shapeImageUrl,
        isVisible: defaultWhyChoose.isVisible,
        seoTitle: defaultWhyChoose.seoTitle,
        seoDescription: defaultWhyChoose.seoDescription,
        seoKeywords: defaultWhyChoose.seoKeywords,
        canonicalUrl: defaultWhyChoose.canonicalUrl,
        ogImageUrl: defaultWhyChoose.ogImageUrl,
        twitterImageUrl: defaultWhyChoose.twitterImageUrl,
        noIndex: defaultWhyChoose.noIndex,
      },
    });
  }

  const whyChooseCount = await prisma.whyChooseItem.count();
  if (whyChooseCount === 0) {
    await prisma.whyChooseItem.createMany({
      data: defaultWhyChooseItems.map((item) => ({
        icon: item.icon,
        title: item.title,
        text: item.text,
        href: item.href,
        displayOrder: item.displayOrder,
        isVisible: item.isVisible,
        isActive: item.isActive,
      })),
    });
  }
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
