"use client";

import { mergeAttributes } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";
import { useRef, type MouseEvent as ReactMouseEvent } from "react";

export type CustomImageAlignment = "left" | "center" | "right";

export type CustomImageAttrs = {
  src: string;
  alt?: string;
  alignment?: CustomImageAlignment;
  width?: number;
  height?: number | null;
  display?: "block" | "inline";
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customImage: {
      setCustomImage: (attrs: CustomImageAttrs) => ReturnType;
    };
  }
}

function ImageNodeView(props: NodeViewProps) {
  const { node, selected, updateAttributes, deleteNode } = props;
  const dragState = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(
    null,
  );

  const width = Number(node.attrs.width) || 100;
  const alignment = (node.attrs.alignment as CustomImageAlignment) || "center";
  const height = node.attrs.height ? Number(node.attrs.height) : null;
  const display = (node.attrs.display as "block" | "inline") || "block";

  function onResizeStart(event: ReactMouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const imageElement = (event.currentTarget as HTMLElement | null)?.closest("[data-type='custom-image-shell']")?.querySelector("img");
    const startHeight = imageElement instanceof HTMLImageElement ? imageElement.clientHeight : 320;
    dragState.current = { startX: event.clientX, startY: event.clientY, startWidth: width, startHeight };

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!dragState.current) {
        return;
      }

      const delta = moveEvent.clientX - dragState.current.startX;
      const containerWidth =
        (moveEvent.target as HTMLElement | null)?.closest("[data-type='custom-image-wrapper']")?.clientWidth ||
        600;
      const deltaPercent = (delta / containerWidth) * 100;
      const nextWidth = Math.max(20, Math.min(100, Math.round(dragState.current.startWidth + deltaPercent)));
      const deltaY = moveEvent.clientY - dragState.current.startY;
      const nextHeight = Math.max(120, Math.min(1200, Math.round(dragState.current.startHeight + deltaY)));
      updateAttributes({ width: nextWidth, height: nextHeight });
    };

    const onMouseUp = () => {
      dragState.current = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  const alignmentClass =
    display === "inline"
      ? "inline-block align-top mr-2"
      : alignment === "left"
        ? "mr-auto"
        : alignment === "right"
          ? "ml-auto"
          : "mx-auto";

  return (
    <NodeViewWrapper className={display === "inline" ? "my-2 inline-block align-top" : "my-4 block"} data-type="custom-image-wrapper">
      <div className={`relative ${alignmentClass}`} data-type="custom-image-shell" style={{ width: `${width}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={node.attrs.alt || ""}
          className={`h-auto max-w-full rounded-xl border ${selected ? "border-accent" : "border-neutral-soft dark:border-slate-700"}`}
          src={node.attrs.src}
          style={height ? { height: `${height}px`, objectFit: "cover", width: "100%" } : { width: "100%" }}
        />

        {selected ? (
          <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-neutral-soft dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
            <button
              className="rounded-md border border-neutral-soft dark:border-slate-700 px-2 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => updateAttributes({ alignment: "left" })}
              type="button"
            >
              Left
            </button>
            <button
              className="rounded-md border border-neutral-soft dark:border-slate-700 px-2 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => updateAttributes({ alignment: "center" })}
              type="button"
            >
              Center
            </button>
            <button
              className="rounded-md border border-neutral-soft dark:border-slate-700 px-2 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => updateAttributes({ alignment: "right" })}
              type="button"
            >
              Right
            </button>
            <button
              className="rounded-md border border-neutral-soft dark:border-slate-700 px-2 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => updateAttributes({ display: "inline", alignment: "left" })}
              type="button"
            >
              Inline Row
            </button>
            <button
              className="rounded-md border border-neutral-soft dark:border-slate-700 px-2 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => updateAttributes({ display: "block" })}
              type="button"
            >
              Block
            </button>
            <button
              className="rounded-md border border-neutral-soft dark:border-slate-700 px-2 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => updateAttributes({ width: 100 })}
              type="button"
            >
              100%
            </button>
            <button
              className="rounded-md border border-neutral-soft dark:border-slate-700 px-2 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => updateAttributes({ width: 50, display: "inline", alignment: "left" })}
              type="button"
            >
              50%
            </button>
            <button
              className="rounded-md border border-neutral-soft dark:border-slate-700 px-2 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => updateAttributes({ width: 33, display: "inline", alignment: "left" })}
              type="button"
            >
              33%
            </button>
            <input
              className="h-8 min-w-52 rounded-md border border-neutral-soft dark:border-slate-700 bg-transparent px-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
              onChange={(event) => updateAttributes({ alt: event.target.value })}
              placeholder="Alt text"
              type="text"
              value={node.attrs.alt || ""}
            />
            <button
              className="rounded-md border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
              onClick={deleteNode}
              type="button"
            >
              Remove
            </button>
            <button
              className="rounded-md border border-neutral-soft dark:border-slate-700 px-2 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => updateAttributes({ height: null })}
              type="button"
            >
              Auto Height
            </button>
          </div>
        ) : null}

        <button
          aria-label="Resize image width and height"
          className={`absolute bottom-2 right-2 h-5 w-5 cursor-nwse-resize rounded-full border-2 border-white bg-accent ${selected ? "block" : "hidden"}`}
          onMouseDown={onResizeStart}
          type="button"
        />
      </div>
    </NodeViewWrapper>
  );
}

const CustomImageExtension = Image.extend({
  name: "customImage",

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: "",
      },
      alignment: {
        default: "center",
        parseHTML: (element: HTMLElement) => {
          const value = element.getAttribute("data-alignment");
          return value === "left" || value === "right" || value === "center" ? value : "center";
        },
      },
      width: {
        default: 100,
        parseHTML: (element: HTMLElement) => {
          const value = Number(element.getAttribute("data-width"));
          return Number.isFinite(value) ? value : 100;
        },
      },
      height: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const value = Number(element.getAttribute("data-height"));
          return Number.isFinite(value) ? value : null;
        },
      },
      display: {
        default: "block",
        parseHTML: (element: HTMLElement) => {
          const value = element.getAttribute("data-display");
          return value === "inline" ? "inline" : "block";
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(HTMLAttributes, {
        "data-type": "custom-image",
        "data-alignment": HTMLAttributes.alignment,
        "data-width": HTMLAttributes.width,
        "data-height": HTMLAttributes.height,
        "data-display": HTMLAttributes.display,
        style: `width:${HTMLAttributes.width || 100}%;height:${HTMLAttributes.height ? `${HTMLAttributes.height}px` : "auto"};display:block;`,
      }),
    ];
  },

  addCommands() {
    return {
      setCustomImage:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              src: attrs.src,
              alt: attrs.alt ?? "",
              alignment: attrs.alignment ?? "center",
              width: attrs.width ?? 100,
              height: attrs.height ?? null,
              display: attrs.display ?? "block",
            },
          }),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

export default CustomImageExtension;
