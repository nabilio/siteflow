import Link from "next/link";
import { requireStaff } from "@/lib/studio";
import { DOCS } from "@/lib/docs-data";
import { Doc, slugifyHeading } from "@/components/Doc";

export default async function InstallGuidePage() {
  await requireStaff();
  const md = DOCS["INSTALLATION-CHEZ-LE-CLIENT"];
  const toc = md.split("\n").filter((l) => l.startsWith("## ")).map((l) => l.slice(3));
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/studio/guide" className="text-xs text-slate-500 hover:underline">← Guide de l'admin</Link>
      <nav className="sf-card my-4">
        <div className="mb-2 text-xs font-semibold uppercase text-slate-500">Sommaire</div>
        <ol className="grid gap-1 text-sm sm:grid-cols-2">
          {toc.map((t) => <li key={t}><a href={`#${slugifyHeading(t)}`} className="text-indigo-600 hover:underline">{t}</a></li>)}
        </ol>
      </nav>
      <article className="sf-card !p-6 sm:!p-8"><Doc source={md} /></article>
    </main>
  );
}
