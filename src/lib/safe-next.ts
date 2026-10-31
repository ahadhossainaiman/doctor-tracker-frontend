/** Relative in-app path only. Blocks protocol-relative and external redirects. */
export function safeNext(value: string | null | undefined) {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return null;
  }
  if (value.startsWith("/login")) return null;
  return value;
}
