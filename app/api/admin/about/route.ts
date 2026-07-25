import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { aboutSchema } from "@/lib/cms/schemas";
import { defaultAbout } from "@/lib/cms/defaults";

function toAdminPayload(about: {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  text: string;
  experienceValue: string;
  experienceLabel: string;
  collageOneUrl: string;
  collageTwoUrl: string;
  collageOneAlt: string;
  collageTwoAlt: string;
  defaultTabId: string | null;
  taglineBg: string;
  tabs: unknown;
  checklist: unknown;
}) {
  return {
    tagline: about.tagline,
    titleLine1: about.titleLine1,
    titleLine2: about.titleLine2,
    text: about.text,
    experienceValue: about.experienceValue,
    experienceLabel: about.experienceLabel,
    collageOneUrl: about.collageOneUrl,
    collageTwoUrl: about.collageTwoUrl,
    collageOneAlt: about.collageOneAlt,
    collageTwoAlt: about.collageTwoAlt,
    defaultTabId: about.defaultTabId,
    taglineBg: about.taglineBg,
    tabs: about.tabs,
    checklist: about.checklist,
  };
}

export async function GET() {
  const about = await prisma.aboutSettings.findUnique({ where: { id: "default" } });

  if (!about) {
    return NextResponse.json({
      about: {
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
  }

  return NextResponse.json({ about: toAdminPayload(about) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = aboutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const tabIds = new Set(parsed.data.tabs.map((tab) => tab.id));
  if (tabIds.size !== parsed.data.tabs.length) {
    return NextResponse.json({ error: "Tab ids must be unique" }, { status: 400 });
  }

  const defaultTabId =
    parsed.data.defaultTabId && tabIds.has(parsed.data.defaultTabId)
      ? parsed.data.defaultTabId
      : (parsed.data.tabs[1]?.id ?? parsed.data.tabs[0]?.id ?? null);

  const about = await prisma.aboutSettings.upsert({
    where: { id: "default" },
    update: {
      tagline: parsed.data.tagline,
      titleLine1: parsed.data.titleLine1,
      titleLine2: parsed.data.titleLine2,
      text: parsed.data.text,
      experienceValue: parsed.data.experienceValue,
      experienceLabel: parsed.data.experienceLabel,
      collageOneUrl: parsed.data.collageOneUrl,
      collageTwoUrl: parsed.data.collageTwoUrl,
      collageOneAlt: parsed.data.collageOneAlt,
      collageTwoAlt: parsed.data.collageTwoAlt,
      defaultTabId,
      taglineBg: parsed.data.taglineBg,
      tabs: parsed.data.tabs,
      checklist: parsed.data.checklist,
    },
    create: {
      id: "default",
      tagline: parsed.data.tagline,
      titleLine1: parsed.data.titleLine1,
      titleLine2: parsed.data.titleLine2,
      text: parsed.data.text,
      experienceValue: parsed.data.experienceValue,
      experienceLabel: parsed.data.experienceLabel,
      collageOneUrl: parsed.data.collageOneUrl,
      collageTwoUrl: parsed.data.collageTwoUrl,
      collageOneAlt: parsed.data.collageOneAlt,
      collageTwoAlt: parsed.data.collageTwoAlt,
      defaultTabId,
      taglineBg: parsed.data.taglineBg,
      tabs: parsed.data.tabs,
      checklist: parsed.data.checklist,
    },
  });

  return NextResponse.json({ about: toAdminPayload(about) });
}
