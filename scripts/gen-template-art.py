#!/usr/bin/env python3
"""
Génère les visuels ORIGINAUX des modèles de sites (illustrations vectorielles SVG) dans public/tpl/<modele>/.
Aucune photo, aucun contenu emprunté : tout est dessiné ici. Relancer : python3 scripts/gen-template-art.py
"""
import os, math, random

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "tpl")

PAL = {
    "distribution": dict(dark="#0B1B33", primary="#0B4F8A", accent="#F59E0B", tint="#E6F0FA", mid="#5B9BD5"),
    "restaurant":   dict(dark="#1C1210", primary="#C2410C", accent="#D4A017", tint="#FBEFE3", mid="#E58A4F"),
    "clinique":     dict(dark="#0B2A33", primary="#0E9F8E", accent="#38BDF8", tint="#E3F6F3", mid="#5CC9BB"),
    "immobilier":   dict(dark="#0F1B2D", primary="#1E3A5F", accent="#C8A24A", tint="#E8EDF4", mid="#6B8CB5"),
    "cabinet":      dict(dark="#1A1218", primary="#7A1F3D", accent="#B8860B", tint="#F6E8ED", mid="#B35A78"),
    "btp":          dict(dark="#1F2937", primary="#EA580C", accent="#FACC15", tint="#FDEBDD", mid="#F59A5C"),
    "beaute":       dict(dark="#3A1F2B", primary="#BE5A83", accent="#E9B872", tint="#FBEAF0", mid="#E39AB8"),
    "services":     dict(dark="#0F172A", primary="#4F46E5", accent="#06B6D4", tint="#E8E7FD", mid="#8F8AF0"),
}


def svg(w, h, body, defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice">'
            f'<defs>{defs}<filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000" flood-opacity=".28"/></filter>'
            f'<filter id="sh2" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000" flood-opacity=".22"/></filter></defs>{body}</svg>')


def lg(i, c1, c2, x1=0, y1=0, x2=1, y2=1):
    return f'<linearGradient id="{i}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient>'


def rg(i, c, o1=0.5, o2=0):
    return f'<radialGradient id="{i}"><stop offset="0" stop-color="{c}" stop-opacity="{o1}"/><stop offset="1" stop-color="{c}" stop-opacity="{o2}"/></radialGradient>'


def dots(x, y, cols, rows, gap, r, color, op=0.25):
    return "".join(f'<circle cx="{x+i*gap}" cy="{y+j*gap}" r="{r}" fill="{color}" opacity="{op}"/>' for i in range(cols) for j in range(rows))


def rrect(x, y, w, h, r, fill, extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" {extra}/>'


def lines(x, y, widths, gap, color, h=10, op=1):
    return "".join(rrect(x, y + i * gap, w, h, h / 2, color, f'opacity="{op}"') for i, w in enumerate(widths))


# ------------------------------------------------------------------ pictogrammes (boîte 200x200)
def icon(name, c, a):
    """c = couleur principale du pictogramme, a = couleur d'accent."""
    I = {
        "pipe": f'<rect x="20" y="78" width="120" height="44" rx="6" fill="{c}"/><rect x="12" y="68" width="18" height="64" rx="5" fill="{a}"/><rect x="130" y="68" width="18" height="64" rx="5" fill="{a}"/><path d="M140 100 h24 a22 22 0 0 1 22 22 v50" fill="none" stroke="{c}" stroke-width="44" stroke-linecap="butt"/><rect x="164" y="160" width="44" height="14" rx="5" fill="{a}"/>',
        "box": f'<path d="M100 22 L172 58 L172 140 L100 176 L28 140 L28 58 Z" fill="{c}"/><path d="M100 22 L172 58 L100 94 L28 58 Z" fill="{a}"/><path d="M100 94 V176" stroke="#fff" stroke-opacity=".5" stroke-width="5"/><rect x="62" y="86" width="26" height="12" rx="3" transform="rotate(26 62 86)" fill="#fff" opacity=".55"/>',
        "cog": f'<circle cx="100" cy="100" r="52" fill="{c}"/>' + "".join(f'<rect x="88" y="14" width="24" height="34" rx="5" fill="{c}" transform="rotate({k*45} 100 100)"/>' for k in range(8)) + f'<circle cx="100" cy="100" r="22" fill="{a}"/>',
        "plate": f'<circle cx="100" cy="100" r="78" fill="{c}" opacity=".95"/><circle cx="100" cy="100" r="58" fill="none" stroke="{a}" stroke-width="5"/><circle cx="88" cy="94" r="20" fill="{a}"/><circle cx="116" cy="112" r="14" fill="#fff" opacity=".8"/><circle cx="104" cy="80" r="8" fill="#fff" opacity=".7"/>',
        "cup": f'<path d="M34 70 h112 v52 a46 46 0 0 1 -46 46 h-20 a46 46 0 0 1 -46 -46 Z" fill="{c}"/><path d="M146 84 h12 a24 24 0 0 1 0 48 h-18" fill="none" stroke="{c}" stroke-width="12"/><path d="M70 46 q8 -14 0 -26 M100 46 q8 -14 0 -26 M130 46 q8 -14 0 -26" fill="none" stroke="{a}" stroke-width="7" stroke-linecap="round"/><rect x="26" y="176" width="136" height="9" rx="4.5" fill="{a}"/>',
        "cloche": f'<path d="M26 138 a74 74 0 0 1 148 0 Z" fill="{c}"/><rect x="16" y="138" width="168" height="16" rx="8" fill="{a}"/><circle cx="100" cy="56" r="11" fill="{a}"/><path d="M52 112 a50 50 0 0 1 30 -36" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="7" stroke-linecap="round"/>',
        "leaf": f'<path d="M30 170 C26 80 86 28 176 24 C180 112 128 168 38 172 Z" fill="{c}"/><path d="M36 168 C80 120 118 86 160 44" fill="none" stroke="{a}" stroke-width="6" stroke-linecap="round"/>',
        "cross": f'<rect x="66" y="22" width="68" height="156" rx="18" fill="{c}"/><rect x="22" y="66" width="156" height="68" rx="18" fill="{c}"/><circle cx="100" cy="100" r="20" fill="{a}"/>',
        "heart": f'<path d="M100 176 C40 130 22 98 22 70 C22 44 42 28 64 28 C82 28 94 38 100 50 C106 38 118 28 136 28 C158 28 178 44 178 70 C178 98 160 130 100 176 Z" fill="{c}"/><path d="M40 100 h30 l12 -26 l22 56 l14 -30 h42" fill="none" stroke="{a}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>',
        "tooth": f'<path d="M62 24 C40 24 26 40 28 66 C30 92 44 104 48 134 C50 158 56 178 70 178 C84 178 84 142 100 142 C116 142 116 178 130 178 C144 178 150 158 152 134 C156 104 170 92 172 66 C174 40 160 24 138 24 C124 24 112 32 100 32 C88 32 76 24 62 24 Z" fill="{c}"/><path d="M62 52 q10 -8 22 -4" fill="none" stroke="{a}" stroke-width="7" stroke-linecap="round"/>',
        "pill": f'<g transform="rotate(-40 100 100)"><rect x="22" y="62" width="156" height="76" rx="38" fill="{c}"/><path d="M100 62 h40 a38 38 0 0 1 0 76 h-40 Z" fill="{a}"/></g>',
        "house": f'<path d="M100 20 L186 96 H164 V170 H36 V96 H14 Z" fill="{c}"/><rect x="82" y="112" width="38" height="58" rx="5" fill="{a}"/><rect x="48" y="104" width="24" height="24" rx="3" fill="#fff" opacity=".7"/><rect x="128" y="104" width="24" height="24" rx="3" fill="#fff" opacity=".7"/>',
        "building": f'<rect x="44" y="20" width="112" height="160" rx="6" fill="{c}"/>' + "".join(f'<rect x="{62+i*30}" y="{40+j*28}" width="18" height="16" rx="3" fill="{a if (i+j)%3==0 else "#fff"}" opacity="{1 if (i+j)%3==0 else .6}"/>' for i in range(3) for j in range(4)) + f'<rect x="84" y="150" width="32" height="30" rx="3" fill="{a}"/>',
        "key": f'<circle cx="64" cy="100" r="40" fill="{c}"/><circle cx="64" cy="100" r="16" fill="{a}"/><rect x="96" y="90" width="92" height="20" rx="6" fill="{c}"/><rect x="146" y="108" width="14" height="30" rx="4" fill="{c}"/><rect x="168" y="108" width="14" height="22" rx="4" fill="{c}"/>',
        "helmet": f'<path d="M28 132 C28 74 62 40 100 40 C138 40 172 74 172 132 Z" fill="{c}"/><rect x="14" y="132" width="172" height="20" rx="10" fill="{a}"/><rect x="88" y="26" width="24" height="46" rx="8" fill="{a}"/>',
        "crane": f'<rect x="56" y="30" width="14" height="150" fill="{c}"/>' + "".join(f'<path d="M56 {40+i*30} L70 {70+i*30} M70 {40+i*30} L56 {70+i*30}" stroke="{c}" stroke-width="5"/>' for i in range(5)) + f'<rect x="20" y="28" width="164" height="14" fill="{a}"/><rect x="150" y="42" width="5" height="60" fill="{c}"/><rect x="132" y="100" width="42" height="22" rx="3" fill="{a}"/><rect x="38" y="176" width="64" height="12" rx="3" fill="{c}"/>',
        "bricks": "".join(f'<rect x="{x}" y="{y}" width="52" height="26" rx="3" fill="{c if (i+j)%2 else a}"/>' for j,y in enumerate(range(30,160,32)) for i,x in enumerate(range((10 if j%2 else -16), 200, 56))),
        "scales": f'<rect x="94" y="26" width="12" height="130" rx="4" fill="{c}"/><rect x="52" y="154" width="96" height="16" rx="8" fill="{c}"/><rect x="34" y="40" width="132" height="10" rx="5" fill="{c}"/><path d="M40 50 L16 112 H64 Z M160 50 L136 112 H184 Z" fill="none" stroke="{c}" stroke-width="5" stroke-linejoin="round"/><path d="M12 112 a28 22 0 0 0 56 0 Z M132 112 a28 22 0 0 0 56 0 Z" fill="{a}"/>',
        "column": f'<rect x="22" y="26" width="156" height="22" rx="5" fill="{c}"/>' + "".join(f'<rect x="{x}" y="54" width="22" height="100" rx="4" fill="{a if x==89 else c}"/>' for x in (38,89,140)) + f'<rect x="14" y="156" width="172" height="20" rx="5" fill="{c}"/>',
        "doc": f'<path d="M48 22 H122 L158 58 V178 H48 Z" fill="{c}"/><path d="M122 22 V58 H158" fill="{a}"/>' + lines(66, 84, [74, 74, 50, 74], 22, a, 9, .9),
        "briefcase": f'<rect x="20" y="62" width="160" height="108" rx="14" fill="{c}"/><path d="M72 62 V46 a8 8 0 0 1 8 -8 h40 a8 8 0 0 1 8 8 V62" fill="none" stroke="{c}" stroke-width="12"/><rect x="20" y="104" width="160" height="10" fill="{a}"/><rect x="88" y="96" width="24" height="28" rx="5" fill="{a}"/>',
        "flower": "".join(f'<ellipse cx="100" cy="52" rx="24" ry="40" fill="{c}" transform="rotate({k*60} 100 100)" opacity=".92"/>' for k in range(6)) + f'<circle cx="100" cy="100" r="22" fill="{a}"/>',
        "drop": f'<path d="M100 22 C100 22 40 96 40 126 a60 60 0 0 0 120 0 C160 96 100 22 100 22 Z" fill="{c}"/><path d="M70 130 a32 32 0 0 0 26 30" fill="none" stroke="{a}" stroke-width="8" stroke-linecap="round"/>',
        "mirror": f'<ellipse cx="100" cy="82" rx="58" ry="66" fill="{a}"/><ellipse cx="100" cy="82" rx="46" ry="54" fill="{c}" opacity=".9"/><path d="M70 60 q12 -14 30 -16" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="7" stroke-linecap="round"/><rect x="90" y="148" width="20" height="38" rx="8" fill="{a}"/>',
        "scissors": f'<circle cx="52" cy="152" r="24" fill="none" stroke="{c}" stroke-width="12"/><circle cx="148" cy="152" r="24" fill="none" stroke="{c}" stroke-width="12"/><path d="M62 132 L150 24 M138 132 L50 24" stroke="{a}" stroke-width="12" stroke-linecap="round"/>',
        "chart": f'<rect x="26" y="108" width="34" height="68" rx="6" fill="{c}"/><rect x="82" y="72" width="34" height="104" rx="6" fill="{a}"/><rect x="138" y="36" width="34" height="140" rx="6" fill="{c}"/><path d="M26 76 L82 46 L116 60 L172 18" fill="none" stroke="{a}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>',
        "code": f'<path d="M72 54 L26 100 L72 146 M128 54 L174 100 L128 146" fill="none" stroke="{c}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="M114 38 L86 162" stroke="{a}" stroke-width="14" stroke-linecap="round"/>',
        "megaphone": f'<path d="M30 80 H78 L160 30 V170 L78 120 H30 Z" fill="{c}"/><rect x="40" y="120" width="30" height="50" rx="8" fill="{a}"/><path d="M174 64 q14 36 0 72" fill="none" stroke="{a}" stroke-width="9" stroke-linecap="round"/>',
        "shield": f'<path d="M100 20 L172 46 V102 C172 144 140 170 100 184 C60 170 28 144 28 102 V46 Z" fill="{c}"/><path d="M66 100 L92 126 L138 74" fill="none" stroke="{a}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>',
        "truck": f'<rect x="14" y="64" width="104" height="76" rx="8" fill="{c}"/><path d="M118 88 H152 L184 116 V140 H118 Z" fill="{a}"/><circle cx="56" cy="148" r="20" fill="{c}" stroke="#fff" stroke-width="7"/><circle cx="148" cy="148" r="20" fill="{c}" stroke="#fff" stroke-width="7"/>',
        "wrench": f'<path d="M150 30 a40 40 0 0 0 -50 52 L26 156 a16 16 0 0 0 22 22 L122 104 a40 40 0 0 0 52 -50 l-26 26 -26 -8 -8 -26 Z" fill="{c}"/><circle cx="40" cy="166" r="6" fill="{a}"/>',
        "star": f'<path d="M100 20 L123 76 L184 80 L137 119 L152 178 L100 146 L48 178 L63 119 L16 80 L77 76 Z" fill="{c}"/><circle cx="100" cy="104" r="16" fill="{a}"/>',
    }
    return I[name]


def place(name, cx, cy, size, c, a, rot=0):
    s = size / 200
    return f'<g transform="translate({cx-size/2} {cy-size/2}) scale({s}) rotate({rot} 100 100)">{icon(name, c, a)}</g>'


# ------------------------------------------------------------------ scènes héros (1200x900)
def scene_background(P, uid):
    d = lg(f"bg{uid}", P["dark"], P["primary"], 0, 0, 1, 1) + rg(f"g1{uid}", P["accent"], .55) + rg(f"g2{uid}", P["mid"], .5)
    b = f'<rect width="1200" height="900" fill="url(#bg{uid})"/>'
    b += f'<circle cx="1010" cy="130" r="340" fill="url(#g1{uid})"/><circle cx="140" cy="820" r="380" fill="url(#g2{uid})"/>'
    b += dots(60, 60, 9, 6, 34, 3, "#fff", .18)
    return d, b


def card(x, y, w, h, fill="#fff", r=26, sh="sh"):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" filter="url(#{sh})"/>'


def hero_distribution(P):
    d, b = scene_background(P, "d")
    # étagères d'entrepôt
    b += card(110, 190, 700, 520, "#F4F8FC", 28)
    for k in range(3):
        y = 250 + k * 150
        b += rrect(140, y + 108, 640, 14, 7, P["primary"])
        for i in range(6):
            col = [P["accent"], P["mid"], P["primary"], "#CBD5E1"][(i + k) % 4]
            bw = 70 + ((i * 17 + k * 11) % 30)
            b += f'<g transform="translate({160+i*104} {y+108-78})"><rect width="{bw}" height="78" rx="6" fill="{col}"/><rect x="0" y="0" width="{bw}" height="14" rx="6" fill="#fff" opacity=".28"/><rect x="{bw/2-9}" y="30" width="18" height="26" rx="3" fill="#fff" opacity=".6"/></g>'
        b += rrect(140, y - 10, 12, 128, 4, P["primary"]) + rrect(768, y - 10, 12, 128, 4, P["primary"])
    # faisceau de tubes au premier plan
    for j in range(3):
        for i in range(5 - j):
            cx = 640 + i * 78 + j * 39 + 60
            cy = 760 - j * 68
            b += f'<circle cx="{cx}" cy="{cy}" r="38" fill="{P["accent"] if (i+j)%3==0 else "#fff"}" filter="url(#sh2)"/><circle cx="{cx}" cy="{cy}" r="24" fill="{P["dark"]}" opacity=".9"/><circle cx="{cx}" cy="{cy}" r="30" fill="none" stroke="{P["mid"]}" stroke-width="3" opacity=".6"/>'
    # carte statut
    b += card(740, 120, 330, 150, "#fff", 24) + place("truck", 810, 195, 90, P["primary"], P["accent"]) + lines(870, 160, [150, 110], 28, "#CBD5E1", 14) + rrect(870, 220, 70, 22, 11, P["accent"])
    b += card(70, 640, 280, 130, "#fff", 24) + place("cog", 135, 705, 80, P["primary"], P["accent"]) + lines(190, 672, [110, 80], 28, "#CBD5E1", 14)
    return svg(1200, 900, b, d)


def hero_restaurant(P):
    d, b = scene_background(P, "r")
    d += rg("steam", "#fff", .35)
    # table de bois (bandes)
    for i in range(7):
        b += f'<rect x="0" y="{560+i*48}" width="1200" height="46" fill="{P["dark"]}" opacity="{.22+(i%2)*.1}"/>'
    # grande assiette vue de dessus
    b += f'<circle cx="610" cy="470" r="330" fill="#000" opacity=".25" filter="url(#sh)"/><circle cx="610" cy="450" r="320" fill="#F8F1E7"/><circle cx="610" cy="450" r="250" fill="none" stroke="{P["accent"]}" stroke-width="6" opacity=".8"/><circle cx="610" cy="450" r="210" fill="#fff"/>'
    # plat : riz/tajine stylisé
    b += f'<circle cx="610" cy="450" r="150" fill="{P["primary"]}"/>' + "".join(f'<circle cx="{610+110*math.cos(k*math.pi/4)}" cy="{450+110*math.sin(k*math.pi/4)}" r="{26-(k%3)*3}" fill="{[P["accent"],"#F4D58D","#8A9A5B","#C2410C"][k%4]}"/>' for k in range(8))
    b += f'<circle cx="610" cy="450" r="60" fill="{P["accent"]}"/><circle cx="590" cy="440" r="22" fill="#F4D58D"/><circle cx="640" cy="470" r="16" fill="#fff" opacity=".8"/>'
    # couverts
    b += f'<g transform="translate(180 250) rotate(-8)"><rect x="0" y="0" width="30" height="400" rx="15" fill="#E8DCC8"/><rect x="-8" y="-6" width="46" height="120" rx="23" fill="#E8DCC8"/></g>'
    b += f'<g transform="translate(990 230) rotate(8)"><rect x="0" y="0" width="30" height="420" rx="15" fill="#E8DCC8"/><path d="M-6 0 h14 v110 h-14 Z M10 0 h12 v110 h-12 Z M24 0 h14 v110 h-14 Z" fill="#E8DCC8"/></g>'
    # feuilles + carte horaires
    b += place("leaf", 300, 700, 170, "#6B8E4E", "#A3C586", 20) + place("leaf", 940, 720, 150, "#6B8E4E", "#A3C586", -35)
    b += card(780, 110, 330, 130, "#fff", 24) + place("cup", 860, 175, 90, P["primary"], P["accent"]) + lines(930, 140, [140, 90], 30, "#D6CBB8", 14)
    # lanternes
    for x in (90, 1110):
        b += f'<rect x="{x-3}" y="0" width="6" height="110" fill="{P["accent"]}" opacity=".7"/><path d="M{x-34} 110 h68 l-10 80 h-48 Z" fill="{P["accent"]}"/><circle cx="{x}" cy="150" r="60" fill="url(#g1r)" opacity=".7"/>'
    return svg(1200, 900, b, d)


def hero_clinique(P):
    d, b = scene_background(P, "c")
    # bâtiment clinique
    b += card(220, 230, 520, 520, "#F3FBFA", 30)
    b += rrect(220, 230, 520, 90, 30, P["primary"]) + f'<rect x="220" y="290" width="520" height="30" fill="{P["primary"]}"/>'
    b += place("cross", 480, 275, 76, "#fff", P["accent"])
    for r_ in range(3):
        for c_ in range(4):
            b += rrect(262 + c_ * 112, 350 + r_ * 110, 80, 80, 14, "#fff", f'stroke="{P["mid"]}" stroke-width="3"') + rrect(274 + c_ * 112, 362 + r_ * 110, 56, 56, 10, P["tint"])
    b += rrect(420, 660, 120, 90, 14, P["primary"]) + rrect(432, 672, 44, 78, 8, "#fff", 'opacity=".85"') + rrect(484, 672, 44, 78, 8, "#fff", 'opacity=".85"')
    # plantes
    b += place("leaf", 190, 720, 190, "#2FA58F", "#7FD6C2", 10) + place("leaf", 760, 740, 170, "#2FA58F", "#7FD6C2", -30)
    # cartes flottantes
    b += card(700, 150, 360, 200, "#fff", 26) + place("heart", 780, 250, 110, P["primary"], P["accent"]) + lines(850, 205, [160, 110, 130], 34, "#D5E4E1", 14)
    b += card(760, 500, 330, 190, "#fff", 26) + f'<path d="M790 612 h46 l24 -50 l38 100 l28 -62 h90" fill="none" stroke="{P["primary"]}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' + lines(790, 530, [120], 24, "#D5E4E1", 14) + rrect(790, 660, 90, 18, 9, P["accent"])
    b += card(70, 440, 200, 120, "#fff", 22) + place("pill", 130, 500, 70, P["primary"], P["accent"]) + lines(170, 480, [70, 50], 26, "#D5E4E1", 12)
    return svg(1200, 900, b, d)


def hero_immobilier(P):
    d, b = scene_background(P, "i")
    # skyline
    xs = [(60, 140, 360), (210, 120, 460), (340, 160, 300), (520, 130, 520), (660, 170, 380), (850, 120, 440), (990, 150, 330)]
    for i, (x, w, h) in enumerate(xs):
        col = [P["mid"], P["primary"], "#fff", P["accent"]][i % 4]
        b += f'<rect x="{x}" y="{780-h}" width="{w}" height="{h}" rx="8" fill="{col}" opacity="{.55 if col=="#fff" else .85}"/>'
        for r_ in range(int(h // 54)):
            for c_ in range(max(1, int(w // 40))):
                lit = (r_ * 7 + c_ * 3 + i) % 4 == 0
                b += f'<rect x="{x+14+c_*38}" y="{780-h+16+r_*54}" width="20" height="28" rx="4" fill="{P["accent"] if lit else "#fff"}" opacity="{.95 if lit else .28}"/>'
    # maison au premier plan
    b += f'<rect x="0" y="780" width="1200" height="120" fill="{P["dark"]}" opacity=".5"/>'
    b += place("house", 600, 640, 420, "#fff", P["accent"])
    b += card(70, 130, 330, 170, "#fff", 24) + place("key", 150, 215, 100, P["primary"], P["accent"]) + lines(220, 180, [140, 100, 110], 30, "#D5DCE6", 14)
    b += card(820, 140, 320, 150, "#fff", 24) + f'<text x="850" y="215" font-family="Georgia,serif" font-size="54" font-weight="700" fill="{P["primary"]}">1 250 000</text><text x="852" y="258" font-family="Arial,sans-serif" font-size="24" fill="#64748B">DH · Villa 4 pièces</text>'
    return svg(1200, 900, b, d)


def hero_cabinet(P):
    d, b = scene_background(P, "a")
    # façade à colonnes
    b += f'<path d="M180 330 L600 150 L1020 330 Z" fill="#fff" filter="url(#sh)"/><rect x="180" y="330" width="840" height="34" fill="#F3E9EC"/>'
    for i in range(6):
        x = 220 + i * 140
        b += f'<rect x="{x}" y="364" width="64" height="330" rx="6" fill="#fff"/><rect x="{x-8}" y="364" width="80" height="22" rx="5" fill="#F3E9EC"/><rect x="{x-8}" y="672" width="80" height="22" rx="5" fill="#F3E9EC"/>'
    b += rrect(150, 694, 900, 40, 8, "#F3E9EC") + rrect(120, 734, 960, 40, 8, "#fff", 'opacity=".9"')
    b += f'<circle cx="600" cy="278" r="46" fill="{P["accent"]}"/>' + place("scales", 600, 278, 64, "#fff", "#fff")
    b += card(60, 120, 300, 150, "#fff", 22) + place("doc", 130, 195, 90, P["primary"], P["accent"]) + lines(190, 160, [120, 90, 105], 28, "#E3D3D9", 13)
    b += card(850, 760, 300, 110, "#fff", 22) + f'<text x="880" y="822" font-family="Georgia,serif" font-size="40" font-weight="700" fill="{P["primary"]}">Droit · Conseil</text>'
    return svg(1200, 900, b, d)


def hero_btp(P):
    d, b = scene_background(P, "b")
    b += f'<rect x="0" y="760" width="1200" height="140" fill="{P["dark"]}" opacity=".6"/>'
    # bâtiment en construction
    for lv in range(5):
        y = 700 - lv * 100
        b += rrect(300, y, 480, 16, 4, "#fff", 'opacity=".9"')
        for k in range(6):
            b += rrect(300 + k * 92, y - 84, 12, 84, 3, P["accent"] if lv % 2 == 0 else "#CBD5E1")
        for k in range(5):
            b += f'<path d="M{300+k*92} {y-84} L{312+(k+1)*92} {y}" stroke="#fff" stroke-width="3" opacity=".35"/>'
    b += rrect(300, 200, 480, 16, 4, "#fff", 'opacity=".9"')
    # grue
    b += f'<rect x="900" y="110" width="22" height="650" fill="{P["accent"]}"/>' + "".join(f'<path d="M900 {130+i*60} L922 {190+i*60} M922 {130+i*60} L900 {190+i*60}" stroke="{P["accent"]}" stroke-width="6"/>' for i in range(10))
    b += rrect(520, 100, 600, 22, 4, P["accent"]) + f'<path d="M900 100 L700 100 L911 40 L1120 100 Z" fill="{P["accent"]}" opacity=".0"/>'
    b += rrect(1080, 122, 28, 120, 6, P["accent"]) + rrect(540, 122, 6, 190, 2, "#fff") + rrect(500, 312, 86, 46, 6, "#fff") + rrect(900, 70, 50, 40, 6, "#fff")
    b += card(70, 130, 320, 150, "#fff", 22) + place("helmet", 150, 205, 100, P["primary"], P["accent"]) + lines(220, 170, [120, 90, 100], 30, "#E5D5C8", 13)
    b += card(80, 640, 280, 110, "#fff", 22) + place("crane", 140, 695, 70, P["primary"], P["accent"]) + lines(190, 670, [110, 70], 28, "#E5D5C8", 13)
    return svg(1200, 900, b, d)


def hero_beaute(P):
    d, b = scene_background(P, "e")
    # arche
    b += f'<path d="M260 780 V430 a340 340 0 0 1 680 0 V780 Z" fill="#fff" opacity=".16"/><path d="M330 780 V440 a270 270 0 0 1 540 0 V780 Z" fill="#FBEAF0"/>'
    # feuillages
    b += place("leaf", 210, 640, 330, "#8CB89A", "#C6E0CE", 8) + place("leaf", 980, 620, 300, "#8CB89A", "#C6E0CE", -28) + place("leaf", 260, 300, 190, "#B3D4BC", "#DCEEDF", -50)
    # fleur centrale
    b += place("flower", 600, 440, 330, P["primary"], P["accent"])
    # bougie + flacon
    b += rrect(870, 640, 110, 120, 18, "#fff", 'filter="url(#sh2)"') + rrect(880, 650, 90, 20, 10, P["accent"]) + f'<path d="M925 600 q-16 -22 0 -44 q16 22 0 44 Z" fill="{P["accent"]}"/><rect x="922" y="600" width="6" height="40" fill="{P["dark"]}"/>'
    b += rrect(230, 650, 70, 120, 20, "#fff", 'filter="url(#sh2)"') + rrect(248, 620, 34, 38, 8, P["accent"])
    b += card(780, 130, 320, 140, "#fff", 24) + place("mirror", 850, 200, 100, P["primary"], P["accent"]) + lines(920, 165, [130, 90], 30, "#EBD3DC", 13)
    return svg(1200, 900, b, d)


def hero_services(P):
    d, b = scene_background(P, "s")
    # fenêtre dashboard
    b += card(130, 170, 760, 520, "#fff", 28) + rrect(130, 170, 760, 56, 28, "#F1F5F9") + f'<rect x="130" y="200" width="760" height="26" fill="#F1F5F9"/>'
    for i, col in enumerate(["#F87171", "#FBBF24", "#34D399"]):
        b += f'<circle cx="{168+i*28}" cy="198" r="8" fill="{col}"/>'
    b += rrect(160, 250, 190, 410, 14, "#F8FAFC") + lines(180, 276, [120, 100, 130, 90, 110], 44, "#CBD5E1", 14)
    b += rrect(180, 276, 120, 14, 7, P["primary"])
    # graphique
    b += f'<g transform="translate(380 260)">' + "".join(rrect(i * 72, 250 - h, 46, h, 10, P["primary"] if i % 2 == 0 else P["accent"]) for i, h in enumerate([90, 150, 120, 200, 170, 230])) + f'<path d="M0 150 L70 110 L140 128 L220 60 L290 80 L400 10" fill="none" stroke="{P["dark"]}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/></g>'
    b += card(380, 540, 140, 100, P["tint"], 16, "sh2") + card(540, 540, 140, 100, P["tint"], 16, "sh2") + card(700, 540, 150, 100, P["tint"], 16, "sh2")
    # cartes flottantes
    b += card(760, 100, 330, 150, "#fff", 24) + place("shield", 840, 175, 96, P["primary"], P["accent"]) + lines(910, 140, [140, 100, 120], 30, "#CBD5E1", 14)
    b += card(780, 610, 340, 170, "#fff", 24) + place("megaphone", 860, 695, 96, P["primary"], P["accent"]) + f'<text x="930" y="690" font-family="Arial,sans-serif" font-size="44" font-weight="800" fill="{P["dark"]}">+248%</text><text x="932" y="728" font-family="Arial,sans-serif" font-size="22" fill="#64748B">de visites</text>'
    b += card(60, 700, 250, 110, "#fff", 22) + place("code", 125, 755, 70, P["primary"], P["accent"]) + lines(170, 730, [90, 60], 28, "#CBD5E1", 13)
    return svg(1200, 900, b, d)


HEROES = dict(distribution=hero_distribution, restaurant=hero_restaurant, clinique=hero_clinique, immobilier=hero_immobilier,
              cabinet=hero_cabinet, btp=hero_btp, beaute=hero_beaute, services=hero_services)


# ------------------------------------------------------------------ tuiles (800x600) : illustrations thématiques
def tile(P, name, ico, variant=0, label=None):
    """Tuile illustrée : fond dégradé + motif + pictogramme dans une carte. variant change couleurs/motif."""
    bgs = [(P["primary"], P["dark"]), (P["accent"], P["primary"]), (P["mid"], P["primary"]), (P["dark"], P["primary"]), (P["tint"], P["mid"]), (P["primary"], P["accent"])]
    c1, c2 = bgs[variant % len(bgs)]
    light = variant % len(bgs) == 4
    icc, ica = (P["primary"], P["accent"]) if light else ("#fff", P["accent"] if variant % 6 not in (1, 5) else P["dark"])
    d = lg("t", c1, c2) + rg("tg", "#fff", .35)
    b = f'<rect width="800" height="600" fill="url(#t)"/>'
    pat = variant % 3
    if pat == 0:
        b += dots(30, 30, 22, 16, 36, 3, "#fff", .14 if not light else .3)
    elif pat == 1:
        b += "".join(f'<circle cx="{700-i*40}" cy="{60+i*30}" r="{150-i*18}" fill="none" stroke="#fff" stroke-width="2" opacity=".16"/>' for i in range(6))
    else:
        b += "".join(f'<path d="M-20 {80+i*90} q200 -70 420 0 t440 0" fill="none" stroke="#fff" stroke-width="3" opacity=".15"/>' for i in range(7))
    b += f'<circle cx="400" cy="300" r="260" fill="url(#tg)"/>'
    b += f'<circle cx="400" cy="300" r="150" fill="#fff" opacity="{.22 if not light else .55}"/>'
    b += place(ico, 400, 300, 220, icc, ica, 0)
    b += place(ico, 120, 480, 90, icc, ica, -12).replace('<g ', '<g opacity=".28" ')
    b += place(ico, 690, 130, 70, icc, ica, 14).replace('<g ', '<g opacity=".28" ')
    return svg(800, 600, b, d)


# définitions des visuels par modèle : (nom_fichier, pictogramme, variante)
TILES = {
    "distribution": [("p1", "pipe", 0), ("p2", "pipe", 1), ("p3", "cog", 2), ("p4", "box", 0), ("p5", "wrench", 3), ("p6", "truck", 4),
                     ("a1", "truck", 2), ("a2", "box", 3), ("g1", "box", 0), ("g2", "pipe", 2), ("g3", "truck", 1), ("g4", "cog", 3), ("g5", "wrench", 0), ("g6", "pipe", 5)],
    "restaurant":   [("p1", "plate", 0), ("p2", "cloche", 1), ("p3", "cup", 2), ("p4", "leaf", 0), ("p5", "plate", 3), ("p6", "cup", 5),
                     ("a1", "cloche", 1), ("a2", "leaf", 3), ("g1", "plate", 0), ("g2", "cup", 2), ("g3", "cloche", 1), ("g4", "leaf", 3), ("g5", "plate", 5), ("g6", "cup", 0)],
    "clinique":     [("p1", "heart", 0), ("p2", "tooth", 1), ("p3", "cross", 2), ("p4", "pill", 0), ("p5", "heart", 3), ("p6", "shield", 5),
                     ("a1", "heart", 2), ("a2", "cross", 3), ("g1", "cross", 0), ("g2", "heart", 2), ("g3", "tooth", 1), ("g4", "pill", 3), ("g5", "shield", 4), ("g6", "leaf", 0)],
    "immobilier":   [("p1", "house", 0), ("p2", "building", 1), ("p3", "house", 2), ("p4", "key", 3), ("p5", "building", 0), ("p6", "house", 5),
                     ("a1", "key", 2), ("a2", "building", 3), ("g1", "house", 0), ("g2", "building", 2), ("g3", "key", 1), ("g4", "house", 3), ("g5", "building", 4), ("g6", "house", 5)],
    "cabinet":      [("p1", "scales", 0), ("p2", "doc", 1), ("p3", "briefcase", 2), ("p4", "column", 3), ("p5", "shield", 0), ("p6", "scales", 5),
                     ("a1", "column", 2), ("a2", "doc", 3), ("g1", "scales", 0), ("g2", "doc", 2), ("g3", "briefcase", 1), ("g4", "column", 3), ("g5", "shield", 4), ("g6", "scales", 5)],
    "btp":          [("p1", "helmet", 0), ("p2", "crane", 1), ("p3", "bricks", 2), ("p4", "wrench", 3), ("p5", "house", 0), ("p6", "building", 5),
                     ("a1", "crane", 2), ("a2", "bricks", 3), ("g1", "building", 0), ("g2", "crane", 2), ("g3", "house", 1), ("g4", "bricks", 3), ("g5", "helmet", 4), ("g6", "wrench", 5)],
    "beaute":       [("p1", "flower", 0), ("p2", "mirror", 1), ("p3", "scissors", 2), ("p4", "drop", 3), ("p5", "leaf", 0), ("p6", "flower", 5),
                     ("a1", "mirror", 2), ("a2", "flower", 3), ("g1", "flower", 0), ("g2", "mirror", 2), ("g3", "drop", 1), ("g4", "scissors", 3), ("g5", "leaf", 4), ("g6", "flower", 5)],
    "services":     [("p1", "chart", 0), ("p2", "code", 1), ("p3", "megaphone", 2), ("p4", "shield", 3), ("p5", "briefcase", 0), ("p6", "star", 5),
                     ("a1", "chart", 2), ("a2", "megaphone", 3), ("g1", "chart", 0), ("g2", "code", 2), ("g3", "megaphone", 1), ("g4", "shield", 3), ("g5", "briefcase", 4), ("g6", "star", 5)],
}


def main():
    for tid, P in PAL.items():
        d = os.path.join(OUT, tid)
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "hero.svg"), "w").write(HEROES[tid](P))
        for name, ico, var in TILES[tid]:
            open(os.path.join(d, f"{name}.svg"), "w").write(tile(P, tid, ico, var))
    print("✔ visuels générés dans", os.path.abspath(OUT))


if __name__ == "__main__":
    main()
