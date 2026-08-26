import { PrismaClient, Role } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import "dotenv/config";
import {
  defaultAbout,
  defaultBookAppointment,
  defaultContact,
  defaultFeatures,
  defaultHeader,
  defaultHero,
  defaultMarquee,
  defaultMarqueeItems,
  defaultNavItems,
  defaultPartnerMarqueeLabel,
  defaultPartners,
  defaultServices,
  defaultServicesSection,
  defaultSocialLinks,
  defaultTopbar,
  defaultTeam,
  defaultTeamMembers,
  defaultWhyChoose,
  defaultWhyChooseItems,
  defaultWorkingProcess,
  defaultWorkingProcessSteps,
  defaultFooter,
  defaultFooterLinks,
  defaultFooterRecentPosts,
  defaultFooterSocials,
} from "../lib/cms/defaults";
import {
  defaultBlogAuthors,
  defaultBlogCategories,
  defaultBlogPosts,
  defaultBlogSection,
  defaultBlogTags,
} from "../lib/cms/blog-defaults";
import { estimateReadingMinutes } from "../lib/cms/blog-sanitize";

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
      data: {
        id: "default",
        contactCtaText: defaultHeader.contactCtaText,
        contactCtaHref: defaultHeader.contactCtaHref,
        logoVariant: defaultHeader.logo.variant,
        logoImageUrl: defaultHeader.logo.imageUrl,
        logoDarkImageUrl: defaultHeader.logo.darkImageUrl,
        logoAlt: defaultHeader.logo.alt,
        logoHref: defaultHeader.logo.href,
        logoMarkText: defaultHeader.logo.markText,
        logoPrimaryText: defaultHeader.logo.primaryText,
        logoSecondaryText: defaultHeader.logo.secondaryText,
        showLogoMark: defaultHeader.logo.showMark,
        logoHeightDesktop: defaultHeader.logo.heightDesktop,
        logoHeightMobile: defaultHeader.logo.heightMobile,
      },
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

  const existingTeam = await prisma.teamSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingTeam) {
    await prisma.teamSettings.create({
      data: {
        id: "default",
        tagline: defaultTeam.tagline,
        titleLine1: defaultTeam.title[0],
        titleLine2: defaultTeam.title[1],
        taglineBg: defaultTeam.taglineBg,
        isVisible: defaultTeam.isVisible,
        seoTitle: defaultTeam.seoTitle,
        seoDescription: defaultTeam.seoDescription,
        seoKeywords: defaultTeam.seoKeywords,
        canonicalUrl: defaultTeam.canonicalUrl,
        ogImageUrl: defaultTeam.ogImageUrl,
        twitterImageUrl: defaultTeam.twitterImageUrl,
        noIndex: defaultTeam.noIndex,
      },
    });
  }

  const teamCount = await prisma.teamMember.count();
  if (teamCount === 0) {
    await prisma.teamMember.createMany({
      data: defaultTeamMembers.map((member) => ({
        name: member.name,
        role: member.role,
        imageUrl: member.imageUrl,
        imageAlt: member.imageAlt,
        href: member.href,
        socials: member.socials,
        displayOrder: member.displayOrder,
        isVisible: member.isVisible,
        isActive: member.isActive,
      })),
    });
  }

  const existingMarquee = await prisma.marqueeSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingMarquee) {
    await prisma.marqueeSettings.create({
      data: {
        id: "default",
        ariaLabel: defaultMarquee.ariaLabel,
        layout: defaultMarquee.layout,
        isVisible: defaultMarquee.isVisible,
        showBandOne: defaultMarquee.showBandOne,
        showBandTwo: defaultMarquee.showBandTwo,
        bandOneBgColor: defaultMarquee.bandOneBgColor,
        bandOneTextColor: defaultMarquee.bandOneTextColor,
        bandTwoBgColor: defaultMarquee.bandTwoBgColor,
        bandTwoTextColor: defaultMarquee.bandTwoTextColor,
        bandOneDirection: defaultMarquee.bandOneDirection,
        bandTwoDirection: defaultMarquee.bandTwoDirection,
        bandOneSpeedSeconds: defaultMarquee.bandOneSpeedSeconds,
        bandTwoSpeedSeconds: defaultMarquee.bandTwoSpeedSeconds,
        bandOneSeparatorUrl: defaultMarquee.bandOneSeparatorUrl,
        bandTwoSeparatorUrl: defaultMarquee.bandTwoSeparatorUrl,
        showSeparator: defaultMarquee.showSeparator,
        skewDegrees: defaultMarquee.skewDegrees,
        fontSizePx: defaultMarquee.fontSizePx,
        itemGapPx: defaultMarquee.itemGapPx,
        bandPaddingPx: defaultMarquee.bandPaddingPx,
        alternateOutline: defaultMarquee.alternateOutline,
        pauseOnHover: defaultMarquee.pauseOnHover,
      },
    });
  }

  const marqueeItemCount = await prisma.marqueeItem.count();
  if (marqueeItemCount === 0) {
    await prisma.marqueeItem.createMany({
      data: defaultMarqueeItems.map((item) => ({
        kind: item.kind,
        band: item.band,
        text: item.text,
        imageUrl: item.imageUrl,
        imageAlt: item.imageAlt,
        imageWidth: item.imageWidth,
        imageHeight: item.imageHeight,
        href: item.href,
        outlined: item.outlined,
        displayOrder: item.displayOrder,
        isVisible: item.isVisible,
        isActive: item.isActive,
      })),
    });
  }

  const existingContact = await prisma.contactSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingContact) {
    await prisma.contactSettings.create({
      data: {
        id: "default",
        tagline: defaultContact.tagline,
        titleLine1: defaultContact.title[0],
        titleLine2: defaultContact.title[1],
        taglineBg: defaultContact.taglineBg,
        phoneTitle: defaultContact.phoneTitle,
        emailTitle: defaultContact.emailTitle,
        locationTitle: defaultContact.locationTitle,
        nameLabel: defaultContact.nameLabel,
        companyLabel: defaultContact.companyLabel,
        emailLabel: defaultContact.emailLabel,
        mobileLabel: defaultContact.mobileLabel,
        locationLabel: defaultContact.locationLabel,
        messageLabel: defaultContact.messageLabel,
        submitLabel: defaultContact.submitLabel,
        isVisible: defaultContact.isVisible,
      },
    });
  }

  const existingWorkingProcess = await prisma.workingProcessSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingWorkingProcess) {
    await prisma.workingProcessSettings.create({
      data: {
        id: "default",
        tagline: defaultWorkingProcess.tagline,
        titleLine1: defaultWorkingProcess.title[0],
        titleLine2: defaultWorkingProcess.title[1],
        taglineBg: defaultWorkingProcess.taglineBg,
        isVisible: defaultWorkingProcess.isVisible,
        seoTitle: defaultWorkingProcess.seoTitle,
        seoDescription: defaultWorkingProcess.seoDescription,
        seoKeywords: defaultWorkingProcess.seoKeywords,
        canonicalUrl: defaultWorkingProcess.canonicalUrl,
        ogImageUrl: defaultWorkingProcess.ogImageUrl,
        twitterImageUrl: defaultWorkingProcess.twitterImageUrl,
        noIndex: defaultWorkingProcess.noIndex,
      },
    });
  }

  const workingProcessCount = await prisma.workingProcessStep.count();
  if (workingProcessCount === 0) {
    await prisma.workingProcessStep.createMany({
      data: defaultWorkingProcessSteps.map((step) => ({
        stepLabel: step.stepLabel,
        title: step.title,
        text: step.text,
        imageUrl: step.imageUrl,
        imageAlt: step.imageAlt,
        href: step.href,
        displayOrder: step.displayOrder,
        isVisible: step.isVisible,
        isActive: step.isActive,
      })),
    });
  }

  const existingFooter = await prisma.footerSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingFooter) {
    await prisma.footerSettings.create({
      data: {
        id: "default",
        about: defaultFooter.about,
        backgroundImageUrl: defaultFooter.backgroundImageUrl,
        watermarkText: defaultFooter.watermarkText,
        showWatermark: defaultFooter.showWatermark,
        copyrightText: defaultFooter.copyrightText,
        linksTitle: defaultFooter.linksTitle,
        exploreTitle: defaultFooter.exploreTitle,
        blogTitle: defaultFooter.blogTitle,
        showAbout: defaultFooter.showAbout,
        showSocials: defaultFooter.showSocials,
        showLinks: defaultFooter.showLinks,
        showExplore: defaultFooter.showExplore,
        showRecentBlog: defaultFooter.showRecentBlog,
        showBottomBar: defaultFooter.showBottomBar,
        useSiteSocials: defaultFooter.useSiteSocials,
        logoTone: defaultFooter.logoTone,
        isVisible: defaultFooter.isVisible,
        seoTitle: defaultFooter.seoTitle,
        seoDescription: defaultFooter.seoDescription,
        seoKeywords: defaultFooter.seoKeywords,
        canonicalUrl: defaultFooter.canonicalUrl,
        ogImageUrl: defaultFooter.ogImageUrl,
        twitterImageUrl: defaultFooter.twitterImageUrl,
        noIndex: defaultFooter.noIndex,
      },
    });
  }

  const footerLinkCount = await prisma.footerLink.count();
  if (footerLinkCount === 0) {
    await prisma.footerLink.createMany({
      data: defaultFooterLinks.map((link) => ({
        label: link.label,
        href: link.href,
        column: link.column,
        displayOrder: link.displayOrder,
        isVisible: link.isVisible,
        isActive: link.isActive,
      })),
    });
  }

  const footerPostCount = await prisma.footerRecentPost.count();
  if (footerPostCount === 0) {
    await prisma.footerRecentPost.createMany({
      data: defaultFooterRecentPosts.map((post) => ({
        title: post.title,
        dateLabel: post.dateLabel,
        imageUrl: post.imageUrl,
        imageAlt: post.imageAlt,
        href: post.href,
        displayOrder: post.displayOrder,
        isVisible: post.isVisible,
        isActive: post.isActive,
      })),
    });
  }

  const footerSocialCount = await prisma.footerSocialLink.count();
  if (footerSocialCount === 0) {
    await prisma.footerSocialLink.createMany({
      data: defaultFooterSocials.map((social) => ({
        label: social.label,
        href: social.href,
        icon: social.icon,
        displayOrder: social.displayOrder,
        isVisible: social.isVisible,
        isActive: social.isActive,
      })),
    });
  }

  await seedBlog();
}

/**
 * Blog seed. Every step is guarded on "does this already exist" and keyed by
 * slug, so re-running the seed never duplicates or overwrites content an editor
 * has since changed in the CMS.
 */
async function seedBlog() {
  const existingBlogSection = await prisma.blogSectionSettings.findUnique({
    where: { id: "default" },
  });
  if (!existingBlogSection) {
    await prisma.blogSectionSettings.create({
      data: {
        id: "default",
        tagline: defaultBlogSection.tagline,
        titleLine1: defaultBlogSection.title[0],
        titleLine2: defaultBlogSection.title[1],
        taglineBg: defaultBlogSection.taglineBg,
        homeLimit: defaultBlogSection.homeLimit,
        homeCtaText: defaultBlogSection.homeCtaText,
        homeCtaHref: defaultBlogSection.homeCtaHref,
        showHomeCta: defaultBlogSection.showHomeCta,
        isVisible: defaultBlogSection.isVisible,
        archiveTagline: defaultBlogSection.archiveTagline,
        archiveTitleLine1: defaultBlogSection.archiveTitle[0],
        archiveTitleLine2: defaultBlogSection.archiveTitle[1],
        archiveIntro: defaultBlogSection.archiveIntro,
        archiveHeroImage: defaultBlogSection.archiveHeroImage,
        archiveHeroOverlay: defaultBlogSection.archiveHeroOverlay,
        archiveHeroHeight: defaultBlogSection.archiveHeroHeight,
        archiveHeroAlign: defaultBlogSection.archiveHeroAlign,
        archiveShowCrumbs: defaultBlogSection.archiveShowCrumbs,
        postsPerPage: defaultBlogSection.postsPerPage,
        showSidebar: defaultBlogSection.showSidebar,
        showSearch: defaultBlogSection.showSearch,
        showCategories: defaultBlogSection.showCategories,
        showTags: defaultBlogSection.showTags,
        allowComments: defaultBlogSection.allowComments,
        moderateComments: defaultBlogSection.moderateComments,
        disclaimer: defaultBlogSection.disclaimer,
        seoTitle: defaultBlogSection.seoTitle,
        seoDescription: defaultBlogSection.seoDescription,
        seoKeywords: defaultBlogSection.seoKeywords,
      },
    });
  }

  for (const category of defaultBlogCategories) {
    const exists = await prisma.blogCategory.findUnique({ where: { slug: category.slug } });
    if (exists) continue;
    await prisma.blogCategory.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        accentColor: category.accentColor,
        displayOrder: category.displayOrder,
        isFeatured: category.isFeatured,
        seoDescription: category.seoDescription,
      },
    });
  }

  for (const tag of defaultBlogTags) {
    const exists = await prisma.blogTag.findUnique({ where: { slug: tag.slug } });
    if (exists) continue;
    await prisma.blogTag.create({
      data: { name: tag.name, slug: tag.slug, description: tag.description },
    });
  }

  for (const author of defaultBlogAuthors) {
    const exists = await prisma.blogAuthor.findUnique({ where: { slug: author.slug } });
    if (exists) continue;
    await prisma.blogAuthor.create({
      data: {
        name: author.name,
        slug: author.slug,
        role: author.role,
        credentials: author.credentials,
        bio: author.bio,
        avatarUrl: author.avatarUrl,
        linkedinUrl: author.linkedinUrl,
        displayOrder: author.displayOrder,
      },
    });
  }

  const [categories, tags, authors] = await Promise.all([
    prisma.blogCategory.findMany({ select: { id: true, slug: true } }),
    prisma.blogTag.findMany({ select: { id: true, slug: true } }),
    prisma.blogAuthor.findMany({ select: { id: true, slug: true } }),
  ]);
  const categoryBySlug = new Map(categories.map((row) => [row.slug, row.id]));
  const tagBySlug = new Map(tags.map((row) => [row.slug, row.id]));
  const authorBySlug = new Map(authors.map((row) => [row.slug, row.id]));

  for (const [index, post] of defaultBlogPosts.entries()) {
    const exists = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (exists) continue;

    const publishedAt = new Date();
    publishedAt.setDate(publishedAt.getDate() - post.publishedDaysAgo);

    const created = await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        subtitle: post.subtitle,
        excerpt: post.excerpt,
        contentHtml: post.contentHtml,
        keyTakeaways: post.keyTakeaways,
        faqs: post.faqs,
        sources: post.sources,
        coverImageUrl: post.coverImageUrl,
        coverImageAlt: post.coverImageAlt,
        contentType: post.contentType,
        status: "PUBLISHED",
        categoryId: categoryBySlug.get(post.categorySlug) ?? null,
        authorId: authorBySlug.get(post.authorSlug) ?? null,
        readingMinutes: estimateReadingMinutes(post.contentHtml, post.excerpt),
        displayOrder: index,
        isFeatured: post.isFeatured,
        isPinned: post.isPinned,
        isVisible: true,
        isActive: true,
        publishedAt,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        seoKeywords: post.seoKeywords,
      },
    });

    const tagIds = post.tagSlugs
      .map((slug) => tagBySlug.get(slug))
      .filter((id): id is string => Boolean(id));

    if (tagIds.length) {
      await prisma.blogPostTag.createMany({
        data: tagIds.map((tagId) => ({ postId: created.id, tagId })),
        skipDuplicates: true,
      });
    }
  }

  // A "Blog" entry in the primary nav, added only if the menu has no blog link.
  const blogNavExists = await prisma.navItem.findFirst({
    where: { href: { startsWith: "/blog" } },
  });
  if (!blogNavExists) {
    const maxOrder = await prisma.navItem.aggregate({ _max: { sortOrder: true } });
    await prisma.navItem.create({
      data: {
        label: "Blog",
        href: "/blog",
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
        visible: true,
      },
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
