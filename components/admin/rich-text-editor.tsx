"use client";

import { useCallback, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import { TableKit } from "@tiptap/extension-table/kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Columns3,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Rows3,
  Strikethrough,
  Table as TableIcon,
  Trash2,
  Underline as UnderlineIcon,
  Undo2,
  MonitorPlay,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import "./css/rich-text-editor.css";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

type ToolButton = {
  icon: typeof Bold;
  label: string;
  action: () => void;
  isActive?: boolean;
  disabled?: boolean;
};

function ToolbarButton({ icon: Icon, label, action, isActive, disabled }: ToolButton) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            disabled={disabled}
            aria-label={label}
            aria-pressed={isActive}
            onClick={action}
            className={cn("size-8 rounded-md", isActive && "bg-primary/25 text-foreground")}
          />
        }
      >
        <Icon className="size-4" />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function ImageUploadButton({ editor }: { editor: Editor }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Upload failed");
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <ToolbarButton
        icon={uploading ? Loader2 : ImagePlus}
        label={uploading ? "Uploading" : "Insert image"}
        disabled={uploading}
        action={() => fileRef.current?.click()}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.target.value = "";
        }}
      />
    </>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = useCallback(() => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    const url = window.prompt("YouTube URL");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url, width: 800, height: 450 });
  }, [editor]);

  const groups: ToolButton[][] = [
    [
      {
        icon: Undo2,
        label: "Undo",
        action: () => editor.chain().focus().undo().run(),
        disabled: !editor.can().undo(),
      },
      {
        icon: Redo2,
        label: "Redo",
        action: () => editor.chain().focus().redo().run(),
        disabled: !editor.can().redo(),
      },
    ],
    [
      {
        icon: Pilcrow,
        label: "Paragraph",
        action: () => editor.chain().focus().setParagraph().run(),
        isActive: editor.isActive("paragraph"),
      },
      {
        icon: Heading2,
        label: "Heading 2",
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: editor.isActive("heading", { level: 2 }),
      },
      {
        icon: Heading3,
        label: "Heading 3",
        action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: editor.isActive("heading", { level: 3 }),
      },
      {
        icon: Heading4,
        label: "Heading 4",
        action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
        isActive: editor.isActive("heading", { level: 4 }),
      },
    ],
    [
      {
        icon: Bold,
        label: "Bold",
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: editor.isActive("bold"),
      },
      {
        icon: Italic,
        label: "Italic",
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: editor.isActive("italic"),
      },
      {
        icon: UnderlineIcon,
        label: "Underline",
        action: () => editor.chain().focus().toggleUnderline().run(),
        isActive: editor.isActive("underline"),
      },
      {
        icon: Strikethrough,
        label: "Strikethrough",
        action: () => editor.chain().focus().toggleStrike().run(),
        isActive: editor.isActive("strike"),
      },
      {
        icon: Code,
        label: "Inline code",
        action: () => editor.chain().focus().toggleCode().run(),
        isActive: editor.isActive("code"),
      },
    ],
    [
      {
        icon: List,
        label: "Bullet list",
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActive: editor.isActive("bulletList"),
      },
      {
        icon: ListOrdered,
        label: "Numbered list",
        action: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: editor.isActive("orderedList"),
      },
      {
        icon: Quote,
        label: "Quote",
        action: () => editor.chain().focus().toggleBlockquote().run(),
        isActive: editor.isActive("blockquote"),
      },
      {
        icon: Minus,
        label: "Divider",
        action: () => editor.chain().focus().setHorizontalRule().run(),
      },
    ],
    [
      {
        icon: AlignLeft,
        label: "Align left",
        action: () => editor.chain().focus().setTextAlign("left").run(),
        isActive: editor.isActive({ textAlign: "left" }),
      },
      {
        icon: AlignCenter,
        label: "Align centre",
        action: () => editor.chain().focus().setTextAlign("center").run(),
        isActive: editor.isActive({ textAlign: "center" }),
      },
      {
        icon: AlignRight,
        label: "Align right",
        action: () => editor.chain().focus().setTextAlign("right").run(),
        isActive: editor.isActive({ textAlign: "right" }),
      },
      {
        icon: AlignJustify,
        label: "Justify",
        action: () => editor.chain().focus().setTextAlign("justify").run(),
        isActive: editor.isActive({ textAlign: "justify" }),
      },
    ],
    [
      { icon: Link2, label: "Add link", action: setLink, isActive: editor.isActive("link") },
      {
        icon: Link2Off,
        label: "Remove link",
        action: () => editor.chain().focus().unsetLink().run(),
        disabled: !editor.isActive("link"),
      },
      { icon: MonitorPlay, label: "Embed YouTube video", action: addYoutube },
    ],
    [
      {
        icon: TableIcon,
        label: "Insert table",
        action: () =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      },
      {
        icon: Rows3,
        label: "Add row below",
        action: () => editor.chain().focus().addRowAfter().run(),
        disabled: !editor.can().addRowAfter(),
      },
      {
        icon: Columns3,
        label: "Add column after",
        action: () => editor.chain().focus().addColumnAfter().run(),
        disabled: !editor.can().addColumnAfter(),
      },
      {
        icon: Trash2,
        label: "Delete table",
        action: () => editor.chain().focus().deleteTable().run(),
        disabled: !editor.can().deleteTable(),
      },
    ],
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border/70 bg-muted/30 p-2">
      {groups.map((group, index) => (
        <div key={index} className="flex items-center gap-0.5">
          {index > 0 ? <Separator orientation="vertical" className="mx-1 h-6" /> : null}
          {group.map((button) => (
            <ToolbarButton key={button.label} {...button} />
          ))}
          {index === 5 ? <ImageUploadButton editor={editor} /> : null}
        </div>
      ))}

    </div>
  );
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } },
      }),
      Placeholder.configure({ placeholder: placeholder ?? "Write the article…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
      Youtube.configure({ nocookie: true, modestBranding: true }),
      TableKit.configure({ table: { resizable: true } }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "rte__content focus:outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  if (!editor) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-border/70">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="rte overflow-hidden rounded-xl border border-border/70 bg-card">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="flex items-center justify-between border-t border-border/70 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
        <span>{editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} words</span>
        <span>Ctrl/Cmd + B, I, U · Markdown shortcuts supported</span>
      </div>
    </div>
  );
}
