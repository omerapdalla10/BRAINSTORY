"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";
import { useRef, useState } from "react";
import { isHttpUrl } from "@/components/editor/editor-utils";
import { uploadImageFiles } from "@/components/editor/upload-images";

type GalleryImage = { src: string; alt: string };

type GalleryColumns = 2 | 3 | 4;

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    gallery: {
      setGallery: (attrs: { images: GalleryImage[]; columns?: GalleryColumns }) => ReturnType;
    };
  }
}

function GalleryNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const [urlInput, setUrlInput] = useState("");
  const [altInput, setAltInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const images = (node.attrs.images as GalleryImage[]) || [];
  const columns = (node.attrs.columns as GalleryColumns) || 2;

  function addImage() {
    const value = urlInput.trim();
    if (!isHttpUrl(value)) {
      setError("Image URL must start with http:// or https:// (or use Upload).");
      return;
    }

    updateAttributes({
      images: [...images, { src: value, alt: altInput.trim() }],
    });
    setUrlInput("");
    setAltInput("");
    setError(null);
  }

  async function uploadFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const urls = await uploadImageFiles(files);
      updateAttributes({ images: [...images, ...urls.map((src) => ({ src, alt: "" }))] });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    updateAttributes({
      images: images.filter((_, currentIndex) => currentIndex !== index),
    });
  }

  function updateAlt(index: number, value: string) {
    updateAttributes({
      images: images.map((image, currentIndex) =>
        currentIndex === index ? { ...image, alt: value } : image,
      ),
    });
  }

  function onDrop(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) {
      return;
    }

    const next = [...images];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    updateAttributes({ images: next });
  }

  const gridClass = columns === 2 ? "grid-cols-2" : columns === 3 ? "grid-cols-3" : "grid-cols-4";

  return (
    <NodeViewWrapper className={`my-4 rounded-xl border p-3 ${selected ? "border-accent" : "border-neutral-soft dark:border-slate-700"}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Gallery</span>
        {[2, 3, 4].map((count) => (
          <button
            className={`rounded-md border px-2 py-1 text-xs font-semibold ${columns === count ? "border-accent text-accent" : "border-neutral-soft dark:border-slate-700"}`}
            key={count}
            onClick={() => updateAttributes({ columns: count })}
            type="button"
          >
            {count} Col
          </button>
        ))}
        <button
          className="rounded-md border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
          onClick={deleteNode}
          type="button"
        >
          Remove Gallery
        </button>
      </div>

      {error ? (
        <p className="mb-3 rounded-md bg-rose-100 px-2 py-1 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      ) : null}

      <div className="mb-3 flex flex-wrap gap-2">
        <input
          className="h-9 min-w-60 flex-1 rounded-md border border-neutral-soft dark:border-slate-700 bg-transparent px-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
          onChange={(event) => setUrlInput(event.target.value)}
          placeholder="https://example.com/image.jpg"
          type="url"
          value={urlInput}
        />
        <input
          className="h-9 min-w-40 flex-1 rounded-md border border-neutral-soft dark:border-slate-700 bg-transparent px-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
          onChange={(event) => setAltInput(event.target.value)}
          placeholder="Alt text"
          type="text"
          value={altInput}
        />
        <button
          className="h-9 rounded-md bg-accent px-3 text-xs font-semibold text-white hover:brightness-105"
          onClick={addImage}
          type="button"
        >
          Add
        </button>
        <input
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          multiple
          onChange={(event) => uploadFiles(event.target.files)}
          type="file"
        />
        <button
          className="h-9 rounded-md bg-primary px-3 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-60"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div className={`grid gap-3 ${gridClass}`}>
        {images.map((image, index) => (
          <div
            className="rounded-lg border border-neutral-soft dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2"
            draggable
            key={`${image.src}-${index}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const fromIndex = Number(event.dataTransfer.getData("text/plain"));
              if (Number.isNaN(fromIndex)) {
                return;
              }
              onDrop(fromIndex, index);
            }}
            onDragStart={(event) => {
              event.dataTransfer.setData("text/plain", String(index));
              event.dataTransfer.effectAllowed = "move";
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={image.alt || ""} className="mb-2 h-auto w-full rounded-md object-cover" src={image.src} />
            <input
              className="mb-2 h-8 w-full rounded-md border border-neutral-soft dark:border-slate-700 bg-transparent px-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
              onChange={(event) => updateAlt(index, event.target.value)}
              placeholder="Alt text"
              type="text"
              value={image.alt || ""}
            />
            <button
              className="w-full rounded-md border border-rose-300 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
              onClick={() => removeImage(index)}
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  );
}

const GalleryExtension = Node.create({
  name: "gallery",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: (element: HTMLElement) => {
          const value = element.getAttribute("data-images");
          if (!value) {
            return [];
          }
          try {
            const parsed = JSON.parse(value) as GalleryImage[];
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        },
      },
      columns: {
        default: 2,
        parseHTML: (element: HTMLElement) => {
          const value = Number(element.getAttribute("data-columns"));
          if (value === 2 || value === 3 || value === 4) {
            return value;
          }
          return 2;
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='gallery']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "gallery",
        "data-images": JSON.stringify(HTMLAttributes.images || []),
        "data-columns": HTMLAttributes.columns || 2,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setGallery:
        ({ images, columns = 2 }) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              images,
              columns,
            },
          }),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(GalleryNodeView);
  },
});

export default GalleryExtension;
