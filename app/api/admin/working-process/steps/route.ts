import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { defaultWorkingProcessSteps } from "@/lib/cms/defaults";
import { workingProcessStepsPayloadSchema } from "@/lib/cms/schemas";
import { mapWorkingProcessStep } from "@/lib/cms/queries";

export async function GET() {
  const steps = await prisma.workingProcessStep.findMany({
    where: { deletedAt: null },
    orderBy: { displayOrder: "asc" },
  });

  if (!steps.length) {
    return NextResponse.json({
      steps: defaultWorkingProcessSteps.map((step, index) => ({
        id: `fallback-${index}`,
        ...step,
      })),
    });
  }

  return NextResponse.json({ steps: steps.map(mapWorkingProcessStep) });
}

export async function PUT(request: Request) {
  const { user, response } = await requireSession();
  if (response || !user) return response;

  const parsed = workingProcessStepsPayloadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const steps = await prisma.$transaction(async (tx) => {
    const existing = await tx.workingProcessStep.findMany({
      where: { deletedAt: null },
      select: { id: true },
    });
    const keepIds = new Set(
      parsed.data.steps.map((s) => s.id).filter((id): id is string => Boolean(id)),
    );
    const toTrash = existing.filter((row) => !keepIds.has(row.id)).map((row) => row.id);
    if (toTrash.length) {
      await tx.workingProcessStep.updateMany({
        where: { id: { in: toTrash } },
        data: { deletedAt: new Date(), isVisible: false },
      });
    }

    const saved = [];
    for (const [index, step] of parsed.data.steps.entries()) {
      const data = {
        stepLabel: step.stepLabel.trim(),
        title: step.title.trim(),
        text: step.text.trim(),
        imageUrl: step.imageUrl.trim(),
        imageAlt: step.imageAlt.trim() || step.title.trim(),
        href: step.href.trim() || "#",
        displayOrder: index,
        isVisible: step.isVisible,
        isActive: step.isActive,
        deletedAt: null,
      };

      if (step.id && !step.id.startsWith("fallback-") && !step.id.startsWith("new-")) {
        saved.push(await tx.workingProcessStep.update({ where: { id: step.id }, data }));
      } else {
        saved.push(await tx.workingProcessStep.create({ data }));
      }
    }

    return saved.sort((a, b) => a.displayOrder - b.displayOrder);
  });

  return NextResponse.json({ steps: steps.map(mapWorkingProcessStep) });
}
