import { makeBlock, type Block } from "../blocks";
import type { TemplatePage } from "../templates";

export const tplImg = (id: string, name: string) => `/tpl/${id}/${name}.svg`;

export const contactPage = (extra: Block[] = [], intro?: string): TemplatePage => ({
  slug: "contact",
  title: "Contact",
  blocks: [...extra, makeBlock("contact", intro ? { intro } : {})],
});

