"use client";

import CoverImageField from "@/components/admin/CoverImageField";
import FileField from "@/components/admin/FileField";
import type { Field } from "@/lib/content-config";

type Value = string | boolean;

type FieldInputProps = {
  field: Field;
  values: Record<string, Value>;
  onChange: (key: string, value: Value) => void;
};

const inputClass =
  "h-12 w-full rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-4 focus:outline-none focus:ring-2 focus:ring-accent/50";
const areaClass =
  "min-h-[140px] w-full rounded-lg border border-neutral-soft dark:border-slate-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50";

function Control({
  field,
  name,
  value,
  placeholder,
  onChange,
}: {
  field: Field;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (key: string, value: Value) => void;
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        className={areaClass}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    );
  }
  if (field.type === "select") {
    return (
      <select className={inputClass} onChange={(event) => onChange(name, event.target.value)} value={value}>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      className={inputClass}
      onChange={(event) => onChange(name, event.target.value)}
      placeholder={placeholder}
      type={field.type === "date" ? "date" : "text"}
      value={value}
    />
  );
}

/** Renders one config-driven field (and its Somali twin when it is bilingual). */
export default function FieldInput({ field, values, onChange }: FieldInputProps) {
  if (field.type === "image") {
    return (
      <CoverImageField
        label={field.label}
        onChange={(url) => onChange(field.key, url)}
        value={String(values[field.key] ?? "")}
      />
    );
  }

  if (field.type === "file") {
    return (
      <FileField
        label={field.label}
        onChange={(url) => onChange(field.key, url)}
        required={field.required}
        value={String(values[field.key] ?? "")}
      />
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-start gap-3 rounded-lg border border-neutral-soft dark:border-slate-700 p-4">
        <input
          checked={values[field.key] === true}
          className="mt-1 h-4 w-4 rounded border-neutral-soft text-accent focus:ring-accent"
          onChange={(event) => onChange(field.key, event.target.checked)}
          type="checkbox"
        />
        <span>
          <span className="block text-sm font-semibold">{field.label}</span>
          {field.help ? <span className="block text-xs text-slate-500">{field.help}</span> : null}
        </span>
      </label>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold">
          {field.label}
          {field.required ? " *" : ""}
          {field.bilingual ? <span className="ml-2 text-xs font-bold text-accent">English</span> : null}
        </span>
        <Control
          field={field}
          name={field.key}
          onChange={onChange}
          placeholder={field.placeholder}
          value={String(values[field.key] ?? "")}
        />
        {field.help ? <span className="text-xs text-slate-500">{field.help}</span> : null}
      </label>

      {field.bilingual ? (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">
            {field.label}
            <span className="ml-2 text-xs font-bold text-sky-600">Somali (Af-Soomaali)</span>
          </span>
          <Control
            field={field}
            name={`${field.key}_so`}
            onChange={onChange}
            placeholder="Optional. Shown when a visitor selects Somali."
            value={String(values[`${field.key}_so`] ?? "")}
          />
        </label>
      ) : null}
    </div>
  );
}
