"use client";

import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import ImageModal from "@/components/editor/ImageModal";
import Toolbar from "@/components/editor/Toolbar";
import BubbleToolbar from "@/components/editor/BubbleToolbar";
import FloatingToolbar from "@/components/editor/FloatingToolbar";
import SlashCommandMenu from "@/components/editor/SlashCommandMenu";
import CustomImageExtension from "@/components/editor/CustomImageExtension";
import GalleryExtension from "@/components/editor/GalleryExtension";
import { parseEditorContent, serializeEditorJson } from "@/components/editor/editor-utils";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const lowlight = createLowlight();
lowlight.register("xml", xml);
lowlight.register("html", xml);
lowlight.register("css", css);
lowlight.register("js", javascript);
lowlight.register("javascript", javascript);
lowlight.register("ts", typescript);
lowlight.register("typescript", typescript);
lowlight.register("json", json);

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [modalMode, setModalMode] = useState<"image" | "gallery">("image");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const initialContent = useMemo(() => parseEditorContent(value), [value]);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Start writing your story... Use / for quick commands.",
      }),
      Link.configure({
        autolink: true,
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent underline underline-offset-4",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CustomImageExtension,
      GalleryExtension,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] rounded-b-lg border-x border-b border-neutral-soft dark:border-slate-700 px-4 py-3 focus:outline-none prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:font-black prose-a:text-accent prose-pre:bg-slate-950 prose-pre:text-slate-100 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-neutral-soft [&_th]:p-2 [&_td]:border [&_td]:border-neutral-soft [&_td]:p-2 [&_ul[data-type='taskList']]:list-none [&_ul[data-type='taskList']]:pl-1",
      },
    },
    onCreate: ({ editor: activeEditor }) => {
      onChange(serializeEditorJson(activeEditor.getJSON()));
    },
    onUpdate: ({ editor: activeEditor }) => {
      onChange(serializeEditorJson(activeEditor.getJSON()));
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const incoming = value.trim();
    const current = serializeEditorJson(editor.getJSON());
    if (incoming && incoming === current) {
      return;
    }

    editor.commands.setContent(parseEditorContent(value), false);
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  function openImageModal(mode: "image" | "gallery") {
    setModalMode(mode);
    setIsImageModalOpen(true);
  }

  return (
    <div className="relative w-full">
      <Toolbar
        editor={editor}
        onOpenGalleryModal={() => openImageModal("gallery")}
        onOpenImageModal={() => openImageModal("image")}
      />

      <BubbleToolbar editor={editor} />
      <FloatingToolbar editor={editor} />
      <SlashCommandMenu
        editor={editor}
        onOpenGalleryModal={() => openImageModal("gallery")}
        onOpenImageModal={() => openImageModal("image")}
      />

      <EditorContent editor={editor} />

      <ImageModal
        isOpen={isImageModalOpen}
        mode={modalMode}
        onClose={() => setIsImageModalOpen(false)}
        onSubmit={({ urls, alt }) => {
          if (modalMode === "image") {
            const src = urls[0];
            if (!src) {
              return;
            }
            editor.chain().focus().setCustomImage({ src, alt, alignment: "center", width: 100 }).run();
            return;
          }

          editor
            .chain()
            .focus()
            .setGallery({
              columns: 2,
              images: urls.map((src) => ({ src, alt })),
            })
            .run();
        }}
      />
    </div>
  );
}
