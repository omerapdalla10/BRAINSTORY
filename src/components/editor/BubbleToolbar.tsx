"use client";

import { BubbleMenu, type Editor } from "@tiptap/react";
import { useState } from "react";

type BubbleToolbarProps = {
  editor: Editor;
};

function Action({
  active,
  label,
  onClick,
}: Readonly<{ active?: boolean; label: string; onClick: () => void }>) {
  return (
    <button
      className={`rounded-md px-2 py-1 text-xs font-semibold ${
        active ? "bg-accent/20 text-accent" : "hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export default function BubbleToolbar({ editor }: BubbleToolbarProps) {
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: activeEditor }) => activeEditor.state.selection.empty === false}
      tippyOptions={{ duration: 100, placement: "top", offset: [0, 8] }}
    >
      <div className="flex items-center gap-1 rounded-lg border border-neutral-soft dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-xl">
        <Action active={editor.isActive("bold")} label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} />
        <Action
          active={editor.isActive("italic")}
          label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <Action
          active={editor.isActive("underline")}
          label="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <Action
          active={editor.isActive("strike")}
          label="Strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <Action
          active={editor.isActive("link")}
          label="Link"
          onClick={() => {
            const activeHref = editor.getAttributes("link").href as string | undefined;
            setLinkValue(activeHref || "");
            setLinkInputOpen((current) => !current);
          }}
        />
        {linkInputOpen ? (
          <div className="flex items-center gap-1">
            <input
              className="h-7 w-44 rounded-md border border-neutral-soft bg-transparent px-2 text-xs focus:outline-none"
              onChange={(event) => setLinkValue(event.target.value)}
              placeholder="https://example.com"
              type="url"
              value={linkValue}
            />
            <button
              className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-white"
              onClick={() => {
                const href = linkValue.trim();
                if (!href) {
                  editor.chain().focus().unsetLink().run();
                } else {
                  editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
                }
                setLinkInputOpen(false);
              }}
              type="button"
            >
              Save
            </button>
          </div>
        ) : null}
      </div>
    </BubbleMenu>
  );
}
