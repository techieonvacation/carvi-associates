import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultMarquee } from "@/lib/cms/defaults";
import { marqueeSettingsSchema } from "@/lib/cms/schemas";

type MarqueeSettingsRow = {
  ariaLabel: string;
  layout: string;
  isVisible: boolean;
  showBandOne: boolean;
  showBandTwo: boolean;
  bandOneBgColor: string;
  bandOneTextColor: string;
  bandTwoBgColor: string;
  bandTwoTextColor: string;
  bandOneDirection: string;
  bandTwoDirection: string;
  bandOneSpeedSeconds: number;
  bandTwoSpeedSeconds: number;
  bandOneSeparatorUrl: string;
  bandTwoSeparatorUrl: string;
  showSeparator: boolean;
  skewDegrees: number;
  fontSizePx: number;
  itemGapPx: number;
  bandPaddingPx: number;
  alternateOutline: boolean;
  pauseOnHover: boolean;
};

function toPayload(row: MarqueeSettingsRow) {
  return {
    ariaLabel: row.ariaLabel,
    layout: row.layout,
    isVisible: row.isVisible,
    showBandOne: row.showBandOne,
    showBandTwo: row.showBandTwo,
    bandOneBgColor: row.bandOneBgColor,
    bandOneTextColor: row.bandOneTextColor,
    bandTwoBgColor: row.bandTwoBgColor,
    bandTwoTextColor: row.bandTwoTextColor,
    bandOneDirection: row.bandOneDirection,
    bandTwoDirection: row.bandTwoDirection,
    bandOneSpeedSeconds: row.bandOneSpeedSeconds,
    bandTwoSpeedSeconds: row.bandTwoSpeedSeconds,
    bandOneSeparatorUrl: row.bandOneSeparatorUrl,
    bandTwoSeparatorUrl: row.bandTwoSeparatorUrl,
    showSeparator: row.showSeparator,
    skewDegrees: row.skewDegrees,
    fontSizePx: row.fontSizePx,
    itemGapPx: row.itemGapPx,
    bandPaddingPx: row.bandPaddingPx,
    alternateOutline: row.alternateOutline,
    pauseOnHover: row.pauseOnHover,
  };
}

export async function GET() {
  const settings = await prisma.marqueeSettings.findUnique({
    where: { id: "default" },
  });

  return NextResponse.json({
    marquee: toPayload(settings ?? defaultMarquee),
  });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const body = await request.json();
  const parsed = marqueeSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const data = {
    ariaLabel: parsed.data.ariaLabel.trim(),
    layout: parsed.data.layout,
    isVisible: parsed.data.isVisible,
    showBandOne: parsed.data.showBandOne,
    showBandTwo: parsed.data.showBandTwo,
    bandOneBgColor: parsed.data.bandOneBgColor.trim(),
    bandOneTextColor: parsed.data.bandOneTextColor.trim(),
    bandTwoBgColor: parsed.data.bandTwoBgColor.trim(),
    bandTwoTextColor: parsed.data.bandTwoTextColor.trim(),
    bandOneDirection: parsed.data.bandOneDirection,
    bandTwoDirection: parsed.data.bandTwoDirection,
    bandOneSpeedSeconds: parsed.data.bandOneSpeedSeconds,
    bandTwoSpeedSeconds: parsed.data.bandTwoSpeedSeconds,
    bandOneSeparatorUrl: parsed.data.bandOneSeparatorUrl.trim(),
    bandTwoSeparatorUrl: parsed.data.bandTwoSeparatorUrl.trim(),
    showSeparator: parsed.data.showSeparator,
    skewDegrees: parsed.data.skewDegrees,
    fontSizePx: parsed.data.fontSizePx,
    itemGapPx: parsed.data.itemGapPx,
    bandPaddingPx: parsed.data.bandPaddingPx,
    alternateOutline: parsed.data.alternateOutline,
    pauseOnHover: parsed.data.pauseOnHover,
  };

  const settings = await prisma.marqueeSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  return NextResponse.json({ marquee: toPayload(settings) });
}
