import slugify from "slugify";

export function createSlug(text: string): string {
  if (!text) return "";

  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
}
