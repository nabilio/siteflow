/** Mini-convertisseur texte → HTML (titres, listes, gras, italique, liens). Sûr : le HTML saisi est échappé. */
export function mdToHtml(src: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (s: string) =>
    esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|\s)\*(.+?)\*(?=\s|$|[.,;:!?])/g, "$1<em>$2</em>")
      .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g, '<a href="$2">$1</a>');
  const lines = (src || "").replace(/\r/g, "").split("\n");
  const out: string[] = [];
  let para: string[] = [];
  let inList = false;
  const flush = () => {
    if (para.length) out.push(`<p>${para.map(inline).join("<br/>")}</p>`);
    para = [];
  };
  const closeList = () => {
    if (inList) out.push("</ul>");
    inList = false;
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flush(); closeList(); continue; }
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) { flush(); closeList(); const lvl = h[1].length + 1; out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`); continue; }
    const li = line.match(/^[-*•]\s+(.*)$/);
    if (li) { flush(); if (!inList) { out.push("<ul>"); inList = true; } out.push(`<li>${inline(li[1])}</li>`); continue; }
    closeList();
    para.push(line);
  }
  flush();
  closeList();
  return out.join("\n");
}
