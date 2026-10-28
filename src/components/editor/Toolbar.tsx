"use client";

import type { Editor } from "@tiptap/react";
import { useState } from "react";

type ToolbarProps = {
  editor: Editor;
  onOpenImageModal: () => void;
  onOpenGalleryModal: () => void;
};

function ToolbarButton({
  active,
  onClick,
  label,
}: Readonly<{
  active?: boolean;
  onClick: () => void;
  label: string;
}>) {
  return (
    <button
      className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-accent bg-accent/10 text-accent"
          : "border-neutral-soft dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export default function Toolbar({ editor, onOpenImageModal, onOpenGalleryModal }: ToolbarProps) {
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  function applyLink() {
    const value = linkUrl.trim();
    if (!value) {
      editor.chain().focus().unsetLink().run();
      setLinkInputOpen(false);
      setLinkUrl("");
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: value }).run();
    setLinkInputOpen(false);
    setLinkUrl("");
  }

  return (
    <div className="rounded-t-lg border border-neutral-soft dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-2">
      <div className="flex flex-wrap items-center gap-2">
        <ToolbarButton
          active={editor.isActive("heading", { level: 1 })}
          label="H1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        />
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          label="H2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          label="H3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <ToolbarButton
          active={editor.isActive("bold")}
          label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          active={editor.isActive("italic")}
          label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          active={editor.isActive("underline")}
          label="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          active={editor.isActive("strike")}
          label="Strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <ToolbarButton
          active={editor.isActive("blockquote")}
          label="Quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          active={editor.isActive("codeBlock")}
          label="Code"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />
        <ToolbarButton
          active={editor.isActive("bulletList")}
          label="Bullet"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          active={editor.isActive("orderedList")}
          label="Ordered"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          active={editor.isActive("taskList")}
          label="Task"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        />
        <ToolbarButton label="Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
        <ToolbarButton
          active={editor.isActive("link")}
          label="Link"
          onClick={() => {
            setLinkInputOpen((current) => !current);
            const active = editor.getAttributes("link").href as string | undefined;
            setLinkUrl(active || "");
          }}
        />
        <ToolbarButton label="Image" onClick={onOpenImageModal} />
        <ToolbarButton label="Gallery" onClick={onOpenGalleryModal} />
        <ToolbarButton
          active={editor.isActive("table")}
          label="Table"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        />
        <ToolbarButton label="+Row" onClick={() => editor.chain().focus().addRowAfter().run()} />
        <ToolbarButton label="-Row" onClick={() => editor.chain().focus().deleteRow().run()} />
        <ToolbarButton label="+Col" onClick={() => editor.chain().focus().addColumnAfter().run()} />
        <ToolbarButton label="-Col" onClick={() => editor.chain().focus().deleteColumn().run()} />
        <ToolbarButton label="No Table" onClick={() => editor.chain().focus().deleteTable().run()} />
      </div>

      {linkInputOpen ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            className="h-9 min-w-60 flex-1 rounded-md border border-neutral-soft dark:border-slate-700 bg-transparent px-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="https://example.com"
            type="url"
            value={linkUrl}
          />
          <button
            className="h-9 rounded-md bg-accent px-3 text-xs font-semibold text-white"
            onClick={applyLink}
            type="button"
          >
            Apply
          </button>
          <button
            className="h-9 rounded-md border border-neutral-soft dark:border-slate-700 px-3 text-xs font-semibold"
            onClick={() => {
              editor.chain().focus().unsetLink().run();
              setLinkInputOpen(false);
              setLinkUrl("");
            }}
            type="button"
          >
            Unset
          </button>
        </div>
      ) : null}
    </div>
  );
}
