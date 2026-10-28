import { isValidImageUrl } from "@/lib/images";
import type { Field } from "@/lib/content-config";

type Payload = Record<string, unknown>;

export type ParseResult = { data: Record<string, string | boolean> } | { error: string };

const MAX_TEXTAREA = 20000;
const MAX_TEXT = 500;

/**
 * Validates and normalises submitted values against a field list.
 * With `partial`, only the keys present in the payload are checked.
 */
export function parseFields(fields: Field[], payload: Payload, partial: boolean): ParseResult {
  const data: Record<string, string | boolean> = {};

  for (const field of fields) {
    const keys = field.bilingual ? [field.key, `${field.key}_so`] : [field.key];

    for (const key of keys) {
      const isTranslation = key !== field.key;
      if (partial && !(key in payload)) continue;

      if (field.type === "checkbox") {
        data[key] = payload[key] === true;
        continue;
      }

      const value = String(payload[key] ?? "").trim();
      const max = field.type === "textarea" ? MAX_TEXTAREA : MAX_TEXT;
      if (value.length > max) {
        return { error: `${field.label} is too long (max ${max} characters).` };
      }
      if (!value) {
        if (field.required && !isTranslation) {
          return { error: `${field.label} is required.` };
        }
        data[key] = "";
        continue;
      }

      if (field.type === "date") {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) {
          return { error: `${field.label} must be a valid date.` };
        }
      } else if (field.type === "url") {
        if (!/^https?:\/\/\S+$/i.test(value)) {
          return { error: `${field.label} must start with http:// or https://` };
        }
      } else if (field.type === "image") {
        if (!isValidImageUrl(value)) {
          return { error: `${field.label} must be an uploaded file or a URL starting with http(s)://` };
        }
      } else if (field.type === "file") {
        if (!isValidImageUrl(value)) {
          return { error: `${field.label} must be an uploaded file or a URL starting with http(s)://` };
        }
      } else if (field.type === "select") {
        if (!field.options?.some((option) => option.value === value)) {
          return { error: `${field.label} has an invalid value.` };
        }
      }

      data[key] = value;
    }
  }

  return { data };
}
