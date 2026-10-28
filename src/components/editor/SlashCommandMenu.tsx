"use client";

import type { Editor } from "@tiptap/react";
import { useCallback, useEffect, useMemo, useState } from "react";

type SlashCommandMenuProps = {
  editor: Editor;
  onOpenImageModal: () => void;
  onOpenGalleryModal: () => void;
};

type SlashCommand = {
  title: string;
  keywords: string[];
  run: () => void;
};

type SlashState = {
  open: boolean;
  query: string;
  from: number;
  to: number;
  top: number;
  left: number;
};

const closedState: SlashState = {
  open: false,
  query: "",
  from: 0,
  to: 0,
  top: 0,
  left: 0,
};

export default function SlashCommandMenu({
  editor,
  onOpenImageModal,
  onOpenGalleryModal,
}: SlashCommandMenuProps) {
  const [slashState, setSlashState] = useState<SlashState>(closedState);
  const [activeIndex, setActiveIndex] = useState(0);

  const commands = useMemo<SlashCommand[]>(
    () => [
      { title: "Heading 1", keywords: ["h1", "title"], run: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
      { title: "Heading 2", keywords: ["h2", "subtitle"], run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
      { title: "Heading 3", keywords: ["h3"], run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
      { title: "Bullet list", keywords: ["ul", "list"], run: () => editor.chain().focus().toggleBulletList().run() },
      { title: "Ordered list", keywords: ["ol", "numbered"], run: () => editor.chain().focus().toggleOrderedList().run() },
      { title: "Task list", keywords: ["todo", "check"], run: () => editor.chain().focus().toggleTaskList().run() },
      { title: "Code block", keywords: ["code"], run: () => editor.chain().focus().toggleCodeBlock().run() },
      { title: "Quote", keywords: ["blockquote"], run: () => editor.chain().focus().toggleBlockquote().run() },
      { title: "Horizontal rule", keywords: ["divider", "line"], run: () => editor.chain().focus().setHorizontalRule().run() },
      {
        title: "Insert table",
        keywords: ["table"],
        run: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      },
      { title: "Insert image", keywords: ["photo", "media"], run: onOpenImageModal },
      { title: "Insert gallery", keywords: ["grid", "photos"], run: onOpenGalleryModal },
    ],
    [editor, onOpenGalleryModal, onOpenImageModal],
  );

  const filtered = useMemo(() => {
    const query = slashState.query.trim().toLowerCase();
    if (!query) {
      return commands;
    }

    return commands.filter((command) =>
      [command.title, ...command.keywords].some((value) => value.toLowerCase().includes(query)),
    );
  }, [commands, slashState.query]);

  const runCommand = useCallback(
    (command: SlashCommand | undefined) => {
      if (!command) {
        return;
      }

      editor.chain().focus().deleteRange({ from: slashState.from, to: slashState.to }).run();
      command.run();
      setSlashState(closedState);
    },
    [editor, slashState.from, slashState.to],
  );

  useEffect(() => {
    function updateSlashState() {
      const { state, view } = editor;
      const { selection } = state;

      if (!selection.empty) {
        setSlashState(closedState);
        return;
      }

      const { $from } = selection;
      if ($from.parent.type.name !== "paragraph") {
        setSlashState(closedState);
        return;
      }

      const beforeText = $from.parent.textBetween(0, $from.parentOffset, undefined, "\uFFFC");
      const match = /(?:^|\s)\/([a-zA-Z0-9-]*)$/.exec(beforeText);

      if (!match) {
        setSlashState(closedState);
        return;
      }

      const slashIndex = beforeText.lastIndexOf("/");
      const from = $from.start() + slashIndex;
      const to = $from.pos;
      const coords = view.coordsAtPos($from.pos);

      setSlashState((previous) => {
        const nextQuery = match[1] || "";
        if (!previous.open || previous.query !== nextQuery) {
          setActiveIndex(0);
        }

        return {
          open: true,
          query: nextQuery,
          from,
          to,
          top: coords.bottom + window.scrollY + 8,
          left: coords.left + window.scrollX,
        };
      });
    }

    updateSlashState();
    editor.on("update", updateSlashState);
    editor.on("selectionUpdate", updateSlashState);

    return () => {
      editor.off("update", updateSlashState);
      editor.off("selectionUpdate", updateSlashState);
    };
  }, [editor]);

  useEffect(() => {
    if (!slashState.open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!slashState.open || filtered.length === 0) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % filtered.length);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) => (current - 1 + filtered.length) % filtered.length);
      } else if (event.key === "Enter") {
        event.preventDefault();
        runCommand(filtered[activeIndex]);
      } else if (event.key === "Escape") {
        event.preventDefault();
        setSlashState(closedState);
      }
    }

    editor.view.dom.addEventListener("keydown", onKeyDown);
    return () => editor.view.dom.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, editor, filtered, runCommand, slashState.open]);

  if (!slashState.open || filtered.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed z-40 w-64 rounded-xl border border-neutral-soft dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-2xl"
      style={{ top: slashState.top, left: slashState.left }}
    >
      {filtered.map((command, index) => (
        <button
          className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm ${
            index === activeIndex
              ? "bg-accent/10 text-accent"
              : "hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          key={command.title}
          onClick={() => runCommand(command)}
          type="button"
        >
          {command.title}
        </button>
      ))}
    </div>
  );
}
