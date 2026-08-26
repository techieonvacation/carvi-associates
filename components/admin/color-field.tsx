"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ColorFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  className?: string;
};

export function ColorField({
  label,
  value,
  onChange,
  description,
  className,
}: ColorFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label} swatch`}
          className="size-9 shrink-0 cursor-pointer rounded-xl border border-input bg-transparent p-1"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="#006654"
          spellCheck={false}
        />
      </div>
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
