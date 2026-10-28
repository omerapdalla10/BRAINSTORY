"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
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
import CustomImageExtension from "@/components/editor/CustomImageExtension";
import GalleryExtension from "@/components/editor/GalleryExtension";
import { parseEditorContent } from "@/components/editor/editor-utils";

type RichTextViewerProps = {
  value: string;
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

export default function RichTextViewer({ value }: RichTextViewerProps) {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        autolink: true,
        openOnClick: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CustomImageExtension,
      GalleryExtension,
    ],
    content: parseEditorContent(value),
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none dark:prose-invert prose-headings:font-black prose-a:text-accent prose-pre:bg-slate-950 prose-pre:text-slate-100 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-neutral-soft [&_th]:p-2 [&_td]:border [&_td]:border-neutral-soft [&_td]:p-2",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
