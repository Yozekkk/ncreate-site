/** Match create_ncreate_forum_topic's ASCII slug contract for every title language. */
export function slugify(value: string) {
  const base = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "topic";
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}
