import { title } from "process";

export const genSlug = (title: string) => {
    const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]\s-/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

    const randomChars = Math.random().toString(36).slice(2);
    const uniqueSlug = `${slug}-${randomChars}`;

    return uniqueSlug;
}