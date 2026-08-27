"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Pair = { first: string; second: string };

type PairListFieldProps = {
  label: string;
  values: Pair[];
  onChange: (values: Pair[]) => void;
  firstPlaceholder: string;
  secondPlaceholder: string;
  hint?: string;
  addLabel?: string;
};

export function PairListField({
  label,
  values,
  onChange,
  firstPlaceholder,
  secondPlaceholder,
  hint,
  addLabel = "Add entry",
}: PairListFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={value.first}
              placeholder={firstPlaceholder}
              className="max-w-[220px]"
              onChange={(event) => {
                const next = [...values];
                next[index] = { ...next[index], first: event.target.value };
                onChange(next);
              }}
            />
            <Input
              value={value.second}
              placeholder={secondPlaceholder}
              onChange={(event) => {
                const next = [...values];
                next[index] = { ...next[index], second: event.target.value };
                onChange(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-destructive"
              onClick={() => onChange(values.filter((_, rowIndex) => rowIndex !== index))}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...values, { first: "", second: "" }])}
      >
        <Plus className="size-4" />
        {addLabel}
      </Button>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
