# Turns the collected JSON into printable HTML pages (then pdf.mjs prints them).
#   python3 build.py book en|bg BOOK.json OUT.html   the whole history, one chapter per section, with maps
#   python3 build.py battles BATTLES.json OUT.html    chapters and their battles, from the game's data
#   python3 build.py pieces PIECES.json OUT.html      Hold the Line pieces to cut out
#   python3 build.py kingdom-bg OUT.html              chapter 1 in Bulgarian, with Key facts (the translation sample)
import json, html, re, sys, os
e = html.escape
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
TEMPLATE = os.path.join(ROOT, 'prototypes/age-of-kings/template.html')

def book(lang, src, out):
    b = json.load(open(src, encoding='utf-8'))
    css = '\n'.join(l for l in open(TEMPLATE, encoding='utf-8').read().splitlines() if l.startswith('.cmap') and 'zoom' not in l and 'cursor' not in l)
    T = {'en': dict(title='Ave Caesar: the history of Rome', sub='The history of Rome, from Romulus to the fall of the West', words='chapters · {w:,} words', contents='Contents', part='Part', ch='Chapter', battle='Battle',
                    note='Latin words are in <em>red italics</em>. Early Roman dates are the traditional ones; historians doubt many of them.', src='Based on Wikipedia'),
         'bg': dict(title='Ave Caesar: историята на Рим', sub='Историята на Рим – от Ромул до падането на Запада', words='глави · {w:,} думи', contents='Съдържание', part='Част', ch='Глава', battle='Битка',
                    note='Латинските думи са в <em>червен курсив</em>. Ранните римски дати са традиционните; историците се съмняват в много от тях.', src='Въз основа на Уикипедия')}[lang]
    toc = body = ''; era = None
    for i, c in enumerate(b, 1):
        if c['era'] != era:
            era = c['era']; toc += f"<li class='era'>{e(era)} <span>{e(c['eraPeriod'])}</span></li>"
            body += f"<div class='erapage'><small>{T['part']}</small><h1>{e(era)}</h1><p>{e(c['eraPeriod'])}</p></div>"
        toc += f"<li><a href='#ch{i}'>{i}. {e(c['title'])}</a> <span>{e(c['period'])}</span></li>"
        body += f"<article id='ch{i}'><small class='eyebrow'>{T['ch']} {i} · {e(c['era'])} · {e(c['period'])}</small><h2>{e(c['title'])}</h2>"
        if c['battle']: body += f"<p class='battle'>{T['battle']}: {e(c['battle'])}</p>"
        body += c['html'] + f"<p class='sources'>{T['src']}: {', '.join(e(s) for s in c['sources'])} (CC BY-SA 4.0)</p></article>"
    words = T['words'].format(w=sum(c['words'] for c in b)).replace(',', ' ' if lang == 'bg' else ',')
    doc = f"""<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><title>{T['title']}</title><style>
:root {{ --body: "Nunito", "Avenir Next", "Segoe UI", system-ui, sans-serif; }}
@page {{ size: A4; margin: 17mm 18mm 18mm; @bottom-center {{ content: counter(page); }} }}
body {{ font: 11pt/1.5 Georgia, 'Times New Roman', serif; color: #1f1a17; }}
.cover {{ height: 240mm; display: flex; flex-direction: column; justify-content: center; text-align: center; break-after: page; }}
.cover h1 {{ font-size: 34pt; color: #7a1f1a; margin: 0; }} .cover p {{ font-size: 13pt; color: #555; }}
.toc {{ break-after: page; }} .toc h2 {{ color: #7a1f1a; }} .toc ol {{ list-style: none; padding: 0; }}
.toc li {{ margin: 1.2mm 0; }} .toc li.era {{ margin-top: 4mm; font-weight: bold; color: #7a1f1a; }}
.toc a {{ color: inherit; text-decoration: none; }} .toc span {{ color: #777; font-size: 9.5pt; }}
.erapage {{ break-before: page; break-after: page; height: 230mm; display: flex; flex-direction: column; justify-content: center; text-align: center; }}
.erapage h1 {{ font-size: 30pt; color: #7a1f1a; margin: 2mm 0; }} .erapage small {{ letter-spacing: .2em; text-transform: uppercase; color: #777; }}
article {{ break-before: page; }}
.eyebrow {{ letter-spacing: .08em; text-transform: uppercase; color: #8e2b22; font-size: 8.5pt; }}
h2 {{ font-size: 20pt; margin: 1mm 0 2mm; line-height: 1.2; }}
.battle {{ color: #555; font-style: italic; margin: 0 0 4mm; }}
h3 {{ font-size: 13pt; color: #7a1f1a; margin: 6mm 0 1.5mm; break-after: avoid; }}
p {{ margin: 0 0 2.5mm; text-align: justify; hyphens: auto; orphans: 3; widows: 3; }}
em {{ color: #8e2b22; }}
.sources {{ font-size: 8.5pt; color: #777; margin-top: 6mm; text-align: left; }}
.ctable {{ width: 100%; border-collapse: collapse; margin: 2mm 0 4mm; font-size: 10pt; break-inside: avoid; }}
.ctable th, .ctable td {{ text-align: left; padding: 1.2mm 2mm; border-bottom: 1px solid #d9caa8; }}
.ctable th {{ font-size: 8.5pt; text-transform: uppercase; letter-spacing: .06em; color: #8e2b22; border-bottom: 2px solid #b9a77e; }}
.ctable td:first-child {{ font-weight: bold; }}
{css}
.cmap {{ break-inside: avoid; margin: 2mm 0 4mm; }} .cmap svg {{ max-height: 95mm; width: auto; max-width: 100%; margin: 0 auto; }}
.cmap .tap {{ display: none; }} .cmap figcaption {{ font-size: 9pt; text-align: left; }}
.world-key {{ display: flex; gap: 14px; font-size: 9pt; color: #5a4d40; margin: 1mm 0; }} .world-key i {{ display: inline-block; width: 10px; height: 8px; border-radius: 2px; margin-right: 4px; }}
.empire-end {{ break-inside: avoid; }}
</style></head><body>
<div class="cover"><h1>Ave Caesar</h1><p>{T['sub']}</p><p>{len(b)} {words}</p></div>
<div class="toc"><h2>{T['contents']}</h2><ol>{toc}</ol><p style="font-size:9pt;color:#666">{T['note']}</p></div>
{body}</body></html>"""
    open(out, 'w', encoding='utf-8').write(doc)

def battles(src, out):
    b = json.load(open(src, encoding='utf-8')); body = ''; era = None; built = 0
    for c in b:
        if c['era'] != era:
            body += ('</table>' if era else '') + f"<h2>{e(c['era'])} ({e(c['eraPeriod'])})</h2><table><tr><th></th><th>Chapter</th><th>Battle</th><th>In the game</th></tr>"
            era = c['era']
        if c['battle']:
            bt = f"<b>{e(c['battle']['name'])}</b> ({e(c['battle']['year'])})<br><span class='small'>Enemy: {e(c['battle']['enemy'])}</span>"
            g = c['game']
            if g:
                built += 1
                game = (f"<span class='small'>Field {e(g['field'])}" + (f" · new: <b>{e(g['newUnit'])}</b>" if g['newUnit'] else '') + f"</span><br>{e(g['twist'])}<br><span class='cards'>Cards: {e(', '.join(g['cards']))}</span>")
            else: game = "<i>Not built yet.</i>"
        else: bt, game = "<i>No battle</i>", ''
        body += f"<tr><td class='n'>{c['n']}</td><td class='ch'>{e(c['title'])}<br><span class='small'>{e(c['period'])}</span></td><td class='bt'>{bt}</td><td>{game}</td></tr>"
    doc = f"""<!doctype html><html><head><meta charset="utf-8"><title>Ave Caesar: chapters and battles</title><style>
@page {{ size: A4; margin: 13mm 12mm; }}
body {{ font: 9.5pt/1.35 Georgia, serif; color: #222; }}
h1 {{ font-size: 18pt; margin: 0 0 2mm; color: #7a1f1a; }} .sub {{ margin: 0 0 4mm; color: #555; }}
h2 {{ font-size: 12.5pt; margin: 6mm 0 2mm; color: #7a1f1a; border-bottom: 1.5px solid #7a1f1a; padding-bottom: 1mm; break-after: avoid; }}
table {{ width: 100%; border-collapse: collapse; }} tr {{ break-inside: avoid; }}
td, th {{ border: 1px solid #bbb; padding: 1.4mm 2mm; vertical-align: top; text-align: left; }} th {{ background: #f1e8dc; font-size: 8.5pt; }}
td.n {{ width: 6mm; text-align: center; color: #7a1f1a; font-weight: bold; }} td.ch {{ width: 42mm; }} td.bt {{ width: 40mm; }}
.small {{ font-size: 8.3pt; color: #555; }} .cards {{ font-size: 7.8pt; color: #666; }}
</style></head><body>
<h1>Ave Caesar: chapters and battles</h1>
<p class="sub">{len(b)} chapters · {built} battles built · generated from the game itself, so it always matches what you play</p>
{body}</table></body></html>"""
    open(out, 'w', encoding='utf-8').write(doc)

def pieces(src, out):
    d = json.load(open(src, encoding='utf-8')); L = d['levels']
    def table(kind, title):
        rows = ''.join(f"<tr><td><img src='{v['img']}'></td><td><b>{e(v['name'])}</b></td><td class='c'>{len(v['in'])}</td><td class='small'>{', '.join(str(i+1) for i in v['in'])}</td></tr>" for v in d[kind].values())
        return f"<h2>{title}</h2><table class='sum'><tr><th></th><th>Piece</th><th>Copies</th><th>Battles (numbers below)</th></tr>{rows}</table>"
    def cards(kind, title, cls):
        o = f"<h2 class='pb'>{title}</h2><div class='grid'>"
        for v in d[kind].values():
            for i in v['in']: o += f"<div class='card {cls}'><img src='{v['img']}'><b>{e(v['name'])}</b><span>{i+1}. {e(L[i]['name'])}</span></div>"
        return o + "</div>"
    bl = ''.join(f"<li><b>{l['n']}. {e(l['name'])}</b> ({e(l['year'])}): {len(l['units'])} Roman, {len(l['foes'])} enemy</li>" for l in L)
    nu = sum(len(v['in']) for v in d['units'].values()); nf = sum(len(v['in']) for v in d['foes'].values())
    doc = f"""<!doctype html><html><head><meta charset="utf-8"><title>Hold the Line: soldiers to cut out</title><style>
@page {{ size: A4; margin: 10mm; }}
body {{ font: 9.5pt/1.3 Georgia, serif; color: #222; }}
h1 {{ font-size: 17pt; color: #7a1f1a; margin: 0 0 2mm; }} h2 {{ font-size: 12.5pt; color: #7a1f1a; border-bottom: 1.5px solid #7a1f1a; margin: 5mm 0 2mm; }}
.pb {{ break-before: page; }}
ol.b {{ columns: 2; margin: 0; padding-left: 0; list-style: none; }} ol.b li {{ margin: 0.6mm 0; break-inside: avoid; }}
table.sum {{ width: 100%; border-collapse: collapse; }} table.sum tr {{ break-inside: avoid; }}
table.sum td, table.sum th {{ border: 1px solid #ccc; padding: 0.6mm 2mm; vertical-align: middle; text-align: left; }}
table.sum th {{ background: #f1e8dc; }} table.sum img {{ width: 11mm; height: 11mm; display: block; }}
td.c {{ text-align: center; font-weight: bold; font-size: 11pt; }} .small {{ font-size: 8.5pt; }}
.grid {{ display: grid; grid-template-columns: repeat(6, 31mm); gap: 0; }}
.card {{ height: 36mm; border: 1px dashed #999; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; padding: 1mm; break-inside: avoid; }}
.card img {{ width: 24mm; height: 24mm; }} .card b {{ font-size: 8pt; text-align: center; line-height: 1.1; }}
.card span {{ font-size: 6.5pt; color: #555; text-align: center; line-height: 1.1; margin-top: 0.5mm; }}
.card.foe {{ background: #eef2f7; }} .card.rome {{ background: #fbf3ea; }}
</style></head><body>
<h1>Hold the Line: soldiers to cut out</h1>
<p>{nu} Roman pieces ({len(d['units'])} kinds) and {nf} enemy pieces ({len(d['foes'])} kinds), one copy per battle each appears in. Every piece is labelled with its battle. Cards that place several soldiers at once (the cohort, the Legion) are one piece each. Equites (the last line at each lane's end) are not cards, so they are not included.</p>
<h2>The {len(L)} battles</h2><ol class='b'>{bl}</ol>
{table('units', 'Roman units (and gods): how many copies')}
<h2 class='pb' style='border:0;margin:0'></h2>
{table('foes', 'Enemies: how many copies')}
{cards('units', 'Cut-outs: Roman units (cream)', 'rome')}
{cards('foes', 'Cut-outs: enemies (blue)', 'foe')}
</body></html>"""
    open(out, 'w', encoding='utf-8').write(doc)

def kingdom_bg(out):
    R = os.path.join(ROOT, 'content/generated/Rome/Kingdom/')
    md = open(R + 'chapter.bg.md', encoding='utf-8').read().split('\n---\n')[0]
    inl = lambda t: re.sub(r'\*(.+?)\*', r'<em>\1</em>', e(t)); strip_id = lambda t: re.sub(r' \{#.*\}$', '', t)
    o = []
    for block in md.split('\n\n'):
        b = block.strip()
        if not b: continue
        o.append('<h1>' + inl(b[2:]) + '</h1>' if b.startswith('# ') else '<h3>' + inl(strip_id(b[3:])) + '</h3>' if b.startswith('## ') else '<p>' + inl(b) + '</p>')
    kf = json.load(open(R + 'keyfacts.bg.json', encoding='utf-8'))
    kfh = ('<h2 class="pb">Ключови факти</h2><h3>Хора</h3><ul>' + ''.join('<li><b>' + inl(p['name']) + '</b> – ' + inl(p['text']) + '</li>' for p in kf['people']) + '</ul><h3>Дати</h3><ul>'
           + ''.join('<li><b>' + inl(d['when']) + '</b> – ' + inl(d['text']) + '</li>' for d in kf['dates']) + '</ul><h3>Латински думи</h3><ul>' + ''.join('<li><em>' + inl(t['latin']) + '</em> – ' + inl(t['bulgarian']) + '</li>' for t in kf['terms']) + '</ul>')
    css = """@page { size: A4; margin: 18mm; }
body { font: 11.5pt/1.55 Georgia, 'Times New Roman', serif; color: #1f1a17; }
.top { letter-spacing: .08em; text-transform: uppercase; color: #8e2b22; font-size: 9pt; }
h1 { font-size: 22pt; margin: 1mm 0 4mm; } h2 { color: #7a1f1a; font-size: 16pt; } .pb { break-before: page; }
h3 { font-size: 13pt; color: #7a1f1a; margin: 6mm 0 1.5mm; break-after: avoid; }
p { margin: 0 0 2.6mm; text-align: justify; hyphens: auto; } em { color: #8e2b22; } li { margin: 1mm 0; }"""
    doc = '<!doctype html><html lang="bg"><head><meta charset="utf-8"><title>Римското царство</title><style>' + css + '</style></head><body>'
    doc += '<div class="top">Ave Caesar · глава 1 · 753–509 г. пр.н.е.</div>' + ''.join(o) + kfh + '</body></html>'
    open(out, 'w', encoding='utf-8').write(doc)

a = sys.argv
if a[1] == 'book': book(a[2], a[3], a[4])
elif a[1] == 'battles': battles(a[2], a[3])
elif a[1] == 'pieces': pieces(a[2], a[3])
elif a[1] == 'kingdom-bg': kingdom_bg(a[2])
