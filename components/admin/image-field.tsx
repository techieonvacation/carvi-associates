"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function ImageField({ label, value, onChange, className }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed");
      }
      onChange(data.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Label>{label}</Label>
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" className="gap-2">
            <Link2 className="size-4" />
            URL
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="size-4" />
            Upload
          </TabsTrigger>
        </TabsList>
        <TabsContent value="url" className="space-y-3">
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://res.cloudinary.com/..."
          />
        </TabsContent>
        <TabsContent value="upload" className="space-y-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleUpload(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading to Cloudinary...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Choose image from device
              </>
            )}
          </Button>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </TabsContent>
      </Tabs>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border bg-muted/30">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
