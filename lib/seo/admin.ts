import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { requireSession } from "@/lib/api-auth";
import { seoBulkSchema, seoReorderSchema } from "@/lib/seo/schemas";

export type CrudDelegate = {
  findMany: (args: unknown) => Promise<unknown[]>;
  findUnique: (args: unknown) => Promise<unknown>;
  create: (args: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
  updateMany: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
  deleteMany: (args: unknown) => Promise<unknown>;
  aggregate: (args: unknown) => Promise<{ _max: { displayOrder: number | null } }>;
};

export type CrudResource<TInput, TItem> = {
  delegate: CrudDelegate;
  schema: ZodType<TInput>;
  map: (row: Record<string, unknown>) => TItem;
  toCreateData: (input: TInput, displayOrder: number) => Record<string, unknown>;
  toUpdateData: (input: TInput, current: Record<string, unknown>) => Record<string, unknown>;
  duplicate?: (row: Record<string, unknown>, displayOrder: number) => Record<string, unknown>;
  supportsVisibility?: boolean;
  afterMutate?: () => void;
  collectionKey: string;
  itemKey: string;
};

function invalid(message = "Invalid payload") {
  return NextResponse.json({ error: message }, { status: 400 });
}

function notFound(message = "Record not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

async function nextDisplayOrder(delegate: CrudDelegate): Promise<number> {
  const result = await delegate.aggregate({
    where: { deletedAt: null },
    _max: { displayOrder: true },
  });
  return (result._max.displayOrder ?? -1) + 1;
}

export function createCrudHandlers<TInput, TItem>(resource: CrudResource<TInput, TItem>) {
  const { delegate, schema, map, collectionKey, itemKey } = resource;
  const notifyMutation = () => resource.afterMutate?.();

  async function list(request: Request) {
    const { user, response } = await requireSession();
    if (response || !user) return response;

    const { searchParams } = new URL(request.url);
    const trash = searchParams.get("trash") === "true";

    const rows = await delegate.findMany({
      where: { deletedAt: trash ? { not: null } : null },
      orderBy: trash ? { deletedAt: "desc" } : { displayOrder: "asc" },
    });

    return NextResponse.json({
      [collectionKey]: rows.map((row) => map(row as Record<string, unknown>)),
    });
  }

  async function create(request: Request) {
    const { user, response } = await requireSession();
    if (response || !user) return response;

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return invalid();

    const displayOrder = await nextDisplayOrder(delegate);
    try {
      const row = await delegate.create({
        data: resource.toCreateData(parsed.data, displayOrder),
      });
      notifyMutation();
      return NextResponse.json({ [itemKey]: map(row as Record<string, unknown>) }, { status: 201 });
    } catch {
      return invalid("Could not create record. A unique field may already exist.");
    }
  }

  async function update(request: Request, context: { params: Promise<{ id: string }> }) {
    const { user, response } = await requireSession();
    if (response || !user) return response;

    const { id } = await context.params;
    const existing = (await delegate.findUnique({ where: { id } })) as Record<
      string,
      unknown
    > | null;
    if (!existing) return notFound();

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return invalid();

    try {
      const row = await delegate.update({
        where: { id },
        data: resource.toUpdateData(parsed.data, existing),
      });
      notifyMutation();
      return NextResponse.json({ [itemKey]: map(row as Record<string, unknown>) });
    } catch {
      return invalid("Could not update record. A unique field may already exist.");
    }
  }

  async function remove(request: Request, context: { params: Promise<{ id: string }> }) {
    const { user, response } = await requireSession();
    if (response || !user) return response;

    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const hard = searchParams.get("hard") === "true";

    const existing = (await delegate.findUnique({ where: { id } })) as Record<
      string,
      unknown
    > | null;
    if (!existing) return notFound();

    if (hard) {
      if (!existing.deletedAt) {
        return invalid("Move to trash before permanent delete");
      }
      await delegate.delete({ where: { id } });
      notifyMutation();
      return NextResponse.json({ ok: true });
    }

    const row = await delegate.update({
      where: { id },
      data: resource.supportsVisibility
        ? { deletedAt: new Date(), isActive: false, isVisible: false }
        : { deletedAt: new Date(), isActive: false },
    });

    notifyMutation();
    return NextResponse.json({ [itemKey]: map(row as Record<string, unknown>) });
  }

  async function reorder(request: Request) {
    const { user, response } = await requireSession();
    if (response || !user) return response;

    const body = await request.json();
    const parsed = seoReorderSchema.safeParse(body);
    if (!parsed.success) return invalid();

    await Promise.all(
      parsed.data.orderedIds.map((id, index) =>
        delegate.updateMany({ where: { id, deletedAt: null }, data: { displayOrder: index } }),
      ),
    );

    const rows = await delegate.findMany({
      where: { deletedAt: null },
      orderBy: { displayOrder: "asc" },
    });

    notifyMutation();
    return NextResponse.json({
      [collectionKey]: rows.map((row) => map(row as Record<string, unknown>)),
    });
  }

  async function bulk(request: Request) {
    const { user, response } = await requireSession();
    if (response || !user) return response;

    const body = await request.json();
    const parsed = seoBulkSchema.safeParse(body);
    if (!parsed.success) return invalid();

    const { ids, action } = parsed.data;

    if (action === "hard-delete") {
      await delegate.deleteMany({ where: { id: { in: ids }, deletedAt: { not: null } } });
      notifyMutation();
      return NextResponse.json({ ok: true });
    }

    if (action === "duplicate") {
      if (!resource.duplicate) return invalid("Duplicate is not supported for this resource");
      const sources = (await delegate.findMany({
        where: { id: { in: ids }, deletedAt: null },
        orderBy: { displayOrder: "asc" },
      })) as Array<Record<string, unknown>>;

      let order = await nextDisplayOrder(delegate);
      const created: TItem[] = [];

      for (const source of sources) {
        const row = await delegate.create({ data: resource.duplicate(source, order) });
        created.push(map(row as Record<string, unknown>));
        order += 1;
      }

      notifyMutation();
      return NextResponse.json({ [collectionKey]: created });
    }

    const data =
      action === "activate"
        ? { isActive: true, deletedAt: null }
        : action === "deactivate"
          ? { isActive: false }
          : action === "show"
            ? { isVisible: true, deletedAt: null }
            : action === "hide"
              ? { isVisible: false }
              : action === "soft-delete"
                ? { deletedAt: new Date(), isActive: false }
                : action === "restore"
                  ? { deletedAt: null, isActive: true }
                  : null;

    if (!data) return invalid("Unsupported action");
    if ((action === "show" || action === "hide") && !resource.supportsVisibility) {
      return invalid("Visibility is not supported for this resource");
    }

    await delegate.updateMany({ where: { id: { in: ids } }, data });

    const rows = await delegate.findMany({
      where: { id: { in: ids } },
      orderBy: { displayOrder: "asc" },
    });

    notifyMutation();
    return NextResponse.json({
      [collectionKey]: rows.map((row) => map(row as Record<string, unknown>)),
    });
  }

  return { list, create, update, remove, reorder, bulk };
}
