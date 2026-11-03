import React from "react";

/** Rendu d'un document Markdown simplifié (titres, listes, tableaux, code, citations). Contenu interne uniquement. */
function inline(s: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const rx = /`([^`]+)`|\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = rx.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const k = `${key}-${i++}`;
    if (m[1] !== undefined) out.push(<code key={k} className="rounded bg-slate-100 px-1 py-0.5 text-[0.85em] text-slate-800">{m[1]}</code>);
    else if (m[2] !== undefined) out.push(<strong key={k}>{inline(m[2], k)}</strong>);
    else if (m[3] !== undefined) out.push(<em key={k}>{m[3]}</em>);
    else out.push(<a key={k} href={m[5]} target={m[5].startsWith("http") ? "_blank" : undefined} className="text-indigo-600 underline">{m[4]}</a>);
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

export function slugifyHeading(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function Doc({ source }: { source: string }) {
  const lines = source.replace(/\r/g, "").split("\n");
  const els: React.ReactNode[] = [];
  let i = 0, n = 0;
  const key = () => `b${n++}`;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
      i++;
      els.push(<pre key={key()} className="my-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100">{buf.join("\n")}</pre>);
      continue;
    }
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      const text = h[2];
      if (h[1].length === 1) els.push(<h1 key={key()} className="text-2xl font-bold">{text}</h1>);
      else if (h[1].length === 2) els.push(<h2 key={key()} id={slugifyHeading(text)} className="mt-10 scroll-mt-20 border-b border-slate-200 pb-2 text-xl font-bold">{text}</h2>);
      else els.push(<h3 key={key()} className="mt-5 text-base font-semibold">{text}</h3>);
      i++; continue;
    }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(lines[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
        i++;
      }
      const [head, , ...body] = rows;
      els.push(
        <div key={key()} className="my-3 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead><tr>{head.map((c, j) => <th key={j} className="border-b-2 border-slate-300 bg-slate-50 px-3 py-2 font-semibold">{inline(c, `th${j}`)}</th>)}</tr></thead>
            <tbody>{body.map((r, a) => <tr key={a}>{r.map((c, j) => <td key={j} className="border-b border-slate-200 px-3 py-2 align-top">{inline(c, `td${a}${j}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) buf.push(lines[i++].replace(/^>\s?/, ""));
      els.push(<blockquote key={key()} className="my-3 rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900">{inline(buf.join(" "), "q")}</blockquote>);
      continue;
    }
    const ol = line.match(/^(\d+)\.\s+(.*)$/);
    if (ol) {
      const items: React.ReactNode[][] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\d+)\.\s+(.*)$/);
        if (m) { items.push([...inline(m[2], `o${items.length}`)]); i++; continue; }
        // suite d'un élément : lignes indentées (texte ou bloc de code)
        if (/^\s{3,}\S/.test(lines[i]) || (lines[i].startsWith("   ```"))) {
          if (/^\s+```/.test(lines[i])) {
            const buf: string[] = [];
            i++;
            while (i < lines.length && !/^\s+```/.test(lines[i])) buf.push(lines[i++].replace(/^ {3}/, ""));
            i++;
            items[items.length - 1].push(<pre key={`c${i}`} className="my-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100">{buf.join("\n")}</pre>);
          } else {
            items[items.length - 1].push(<span key={`t${i}`}> {inline(lines[i].trim(), `t${i}`)}</span>);
            i++;
          }
          continue;
        }
        break;
      }
      els.push(<ol key={key()} className="my-3 list-decimal space-y-2 pl-6 text-sm leading-relaxed text-slate-700">{items.map((it, j) => <li key={j}>{it}</li>)}</ol>);
      continue;
    }
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) items.push(lines[i++].replace(/^[-*]\s+/, ""));
      els.push(
        <ul key={key()} className="my-3 space-y-1.5 pl-1 text-sm leading-relaxed text-slate-700">
          {items.map((t, j) => {
            const cb = t.match(/^\[( |x)\]\s+(.*)$/);
            return <li key={j} className="flex gap-2"><span className="text-slate-400">{cb ? "☐" : "•"}</span><span>{inline(cb ? cb[2] : t, `u${j}`)}</span></li>;
          })}
        </ul>,
      );
      continue;
    }
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|```|\||>|\d+\.\s|[-*]\s)/.test(lines[i])) buf.push(lines[i++]);
    els.push(<p key={key()} className="my-3 text-sm leading-relaxed text-slate-700">{inline(buf.join(" "), `p${n}`)}</p>);
  }
  return <>{els}</>;
}
