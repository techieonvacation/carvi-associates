"use client";

import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

type SaveButtonProps = {
  loading?: boolean;
  disabled?: boolean;
  label?: string;
};

export function SaveButton({
  loading = false,
  disabled = false,
  label = "Save changes",
}: SaveButtonProps) {
  return (
    <Button type="submit" disabled={disabled || loading} className="min-w-36 gap-2">
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
      {loading ? "Saving..." : label}
    </Button>
  );
}
