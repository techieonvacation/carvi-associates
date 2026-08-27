"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type BulkAction =
  | "activate"
  | "deactivate"
  | "show"
  | "hide"
  | "soft-delete"
  | "restore"
  | "hard-delete"
  | "duplicate";

type CollectionOptions = {
  resource: string;
  collectionKey: string;
  itemKey: string;
  label: string;
};

export function useSeoCollection<TItem extends { id: string }, TInput>({
  resource,
  collectionKey,
  itemKey,
  label,
}: CollectionOptions) {
  const [items, setItems] = useState<TItem[]>([]);
  const [trashed, setTrashed] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const endpoint = `/api/admin/seo/${resource}`;

  const load = useCallback(async () => {
    try {
      const [activeRes, trashRes] = await Promise.all([
        fetch(endpoint),
        fetch(`${endpoint}?trash=true`),
      ]);
      const activeData = await activeRes.json();
      const trashData = await trashRes.json();
      startTransition(() => {
        setItems(activeData[collectionKey] ?? []);
        setTrashed(trashData[collectionKey] ?? []);
        setLoading(false);
      });
    } catch {
      toast.error(`Failed to load ${label}`);
      startTransition(() => setLoading(false));
    }
  }, [collectionKey, endpoint, label]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(
    async (input: TInput) => {
      setSaving(true);
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Create failed");
        setItems((current) => [...current, data[itemKey]]);
        toast.success(`${label} created`);
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Create failed");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [endpoint, itemKey, label],
  );

  const update = useCallback(
    async (id: string, input: TInput) => {
      setSaving(true);
      try {
        const response = await fetch(`${endpoint}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Save failed");
        setItems((current) =>
          current.map((item) => (item.id === id ? (data[itemKey] as TItem) : item)),
        );
        toast.success(`${label} updated`);
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Save failed");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [endpoint, itemKey, label],
  );

  const remove = useCallback(
    async (id: string, hard = false) => {
      setSaving(true);
      try {
        const response = await fetch(`${endpoint}/${id}${hard ? "?hard=true" : ""}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Delete failed");
        await load();
        toast.success(hard ? `${label} deleted permanently` : `${label} moved to trash`);
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Delete failed");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [endpoint, label, load],
  );

  const bulk = useCallback(
    async (ids: string[], action: BulkAction) => {
      if (!ids.length) {
        toast.error("Select at least one row");
        return false;
      }
      setSaving(true);
      try {
        const response = await fetch(`${endpoint}/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids, action }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Bulk action failed");
        await load();
        toast.success(`${ids.length} ${label.toLowerCase()} updated`);
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Bulk action failed");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [endpoint, label, load],
  );

  const reorder = useCallback(
    async (orderedIds: string[]) => {
      setSaving(true);
      try {
        const response = await fetch(`${endpoint}/reorder`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderedIds }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Reorder failed");
        setItems(data[collectionKey] ?? []);
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Reorder failed");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [collectionKey, endpoint],
  );

  return { items, trashed, loading, saving, load, create, update, remove, bulk, reorder, setItems };
}
