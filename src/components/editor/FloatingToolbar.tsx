"use client";

import { FloatingMenu, type Editor } from "@tiptap/react";

type FloatingToolbarProps = {
  editor: Editor;
};

function Action({ label, onClick }: Readonly<{ label: string; onClick: () => void }>) {
  return (
    <button
      className="rounded-md px-2 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export default function FloatingToolbar({ editor }: FloatingToolbarProps) {
  return (
    <FloatingMenu
      editor={editor}
      shouldShow={({ state }) => {
        const { $from, empty } = state.selection;
        return empty && $from.parent.type.name === "paragraph" && $from.parent.textContent.length === 0;
      }}
      tippyOptions={{ duration: 100, placement: "right-start" }}
    >
      <div className="flex items-center gap-1 rounded-lg border border-neutral-soft dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-xl">
        <Action label="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <Action label="Bullet" onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <Action label="Task" onClick={() => editor.chain().focus().toggleTaskList().run()} />
        <Action label="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} />
      </div>
    </FloatingMenu>
  );
}
