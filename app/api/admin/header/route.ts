import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultHeader, defaultLogo } from "@/lib/cms/defaults";
import {
  LOGO_MAX_HEIGHT,
  LOGO_MIN_HEIGHT,
  LOGO_TEXT_MAX_SIZE,
  LOGO_TEXT_MIN_SIZE,
} from "@/lib/cms/header-mappers";
import { LOGO_VARIANTS } from "@/lib/cms/types";

const headerSchema = z.object({
  contactCtaText: z.string().min(1).max(60),
  contactCtaHref: z.string().min(1).max(200),
  showContactCta: z.boolean(),
  showSearch: z.boolean(),
  callTitle: z.string().max(60),
  showCall: z.boolean(),
  showSidebar: z.boolean(),
  sidebarAbout: z.string().max(600),
  sidebarContactTitle: z.string().max(60),
  sidebarNewsletterTitle: z.string().max(60),
  showSidebarNewsletter: z.boolean(),
  logoVariant: z.enum(LOGO_VARIANTS),
  logoImageUrl: z.string().max(500).default(""),
  logoDarkImageUrl: z.string().max(500).default(""),
  logoAlt: z.string().min(1).max(120),
  logoHref: z.string().min(1).max(200),
  logoMarkText: z.string().max(2).default(""),
  logoPrimaryText: z.string().max(40).default(""),
  logoSecondaryText: z.string().max(40).default(""),
  showLogoMark: z.boolean(),
  logoHeightDesktop: z.number().int().min(LOGO_MIN_HEIGHT).max(LOGO_MAX_HEIGHT),
  logoHeightMobile: z.number().int().min(LOGO_MIN_HEIGHT).max(LOGO_MAX_HEIGHT),
  logoTextSizePx: z.number().int().min(LOGO_TEXT_MIN_SIZE).max(LOGO_TEXT_MAX_SIZE),
});

function fallbackPayload() {
  return {
    contactCtaText: defaultHeader.contactCtaText,
    contactCtaHref: defaultHeader.contactCtaHref,
    showContactCta: defaultHeader.showContactCta,
    showSearch: defaultHeader.showSearch,
    callTitle: defaultHeader.callTitle,
    showCall: defaultHeader.showCall,
    showSidebar: defaultHeader.showSidebar,
    sidebarAbout: defaultHeader.sidebarAbout,
    sidebarContactTitle: defaultHeader.sidebarContactTitle,
    sidebarNewsletterTitle: defaultHeader.sidebarNewsletterTitle,
    showSidebarNewsletter: defaultHeader.showSidebarNewsletter,
    logoVariant: defaultLogo.variant,
    logoImageUrl: defaultLogo.imageUrl,
    logoDarkImageUrl: defaultLogo.darkImageUrl,
    logoAlt: defaultLogo.alt,
    logoHref: defaultLogo.href,
    logoMarkText: defaultLogo.markText,
    logoPrimaryText: defaultLogo.primaryText,
    logoSecondaryText: defaultLogo.secondaryText,
    showLogoMark: defaultLogo.showMark,
    logoHeightDesktop: defaultLogo.heightDesktop,
    logoHeightMobile: defaultLogo.heightMobile,
    logoTextSizePx: defaultLogo.textSizePx,
  };
}

export async function GET() {
  const header = await prisma.headerSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json({ header: header ?? fallbackPayload() });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = headerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const data = {
    contactCtaText: parsed.data.contactCtaText.trim(),
    contactCtaHref: parsed.data.contactCtaHref.trim(),
    showContactCta: parsed.data.showContactCta,
    showSearch: parsed.data.showSearch,
    callTitle: parsed.data.callTitle.trim(),
    showCall: parsed.data.showCall,
    showSidebar: parsed.data.showSidebar,
    sidebarAbout: parsed.data.sidebarAbout.trim(),
    sidebarContactTitle: parsed.data.sidebarContactTitle.trim(),
    sidebarNewsletterTitle: parsed.data.sidebarNewsletterTitle.trim(),
    showSidebarNewsletter: parsed.data.showSidebarNewsletter,
    logoVariant: parsed.data.logoVariant,
    logoImageUrl: parsed.data.logoImageUrl.trim(),
    logoDarkImageUrl: parsed.data.logoDarkImageUrl.trim(),
    logoAlt: parsed.data.logoAlt.trim(),
    logoHref: parsed.data.logoHref.trim(),
    logoMarkText: parsed.data.logoMarkText.trim(),
    logoPrimaryText: parsed.data.logoPrimaryText.trim(),
    logoSecondaryText: parsed.data.logoSecondaryText.trim(),
    showLogoMark: parsed.data.showLogoMark,
    logoHeightDesktop: parsed.data.logoHeightDesktop,
    logoHeightMobile: parsed.data.logoHeightMobile,
    logoTextSizePx: parsed.data.logoTextSizePx,
  };

  const header = await prisma.headerSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json({ header });
}
