/** Accepts remote images and files uploaded through the dashboard. */
export function isValidImageUrl(value: string): boolean {
  return /^https?:\/\//i.test(value) || /^\/uploads\/[\w.-]+$/.test(value);
}
