#!/usr/bin/env python3
"""
Importa elenco-2026-27/elenco.xlsx para src/data/elenco.json e copia as fotos para public/fotos/.

- Usa só a biblioteca padrão do Python (o .xlsx é um zip de XML).
- Quando a planilha omite a extensão, procura o arquivo pelo nome na pasta de fotos.
  Nenhum arquivo ou mais de um arquivo com o mesmo nome entram em "avisos".
- Duas fotos são capturas de tela de um avatar redondo; elas são recortadas no círculo
  com o `sips` do macOS (os originais em elenco-2026-27/fotos não mudam).

Uso (a partir de preview-astro/):  python3 -I scripts/importar_elenco.py
"""
import json
import shutil
import subprocess
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# A pasta pode estar como "Elenco-2026-27" ou "elenco-2026-27" (Linux diferencia maiúsculas)
ELENCO = next((p for p in ROOT.iterdir() if p.is_dir() and p.name.lower() == "elenco-2026-27"), ROOT / "elenco-2026-27")
XLSX = ELENCO / "elenco.xlsx"
FOTOS_SRC = next((p for p in ELENCO.iterdir() if p.is_dir() and p.name.lower() == "fotos"), ELENCO / "fotos") if ELENCO.is_dir() else ELENCO / "fotos"
FOTOS_DST = ROOT / "public" / "fotos"
OUT = ROOT / "src" / "data" / "elenco.json"

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
COLS = {"A": "nome", "B": "rosto", "C": "acao", "D": "instagram", "E": "highlight"}

# Recorte (altura, largura, offset_y, offset_x) para as capturas de avatar redondo
CROPS = {"IMG_3797": (780, 780, 129, 213), "IMG_3814": (780, 780, 195, 213)}


def read_rows():
    z = zipfile.ZipFile(XLSX)
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NS):
            shared.append("".join(t.text or "" for t in si.iter(f"{{{NS['m']}}}t")))
    sheet = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
    rows = []
    for row in sheet.iter(f"{{{NS['m']}}}row"):
        rec = {}
        for c in row.findall("m:c", NS):
            col = "".join(ch for ch in c.get("r") if ch.isalpha())
            v = c.find("m:v", NS)
            if c.get("t") == "s" and v is not None:
                val = shared[int(v.text)]
            elif c.get("t") == "inlineStr":
                val = "".join(t.text or "" for t in c.iter(f"{{{NS['m']}}}t"))
            else:
                val = v.text if v is not None else ""
            if col in COLS:
                rec[COLS[col]] = (val or "").strip()
        rows.append(rec)
    return rows[1:]  # sem o cabeçalho


def resolve(name, avisos, who, campo):
    if not name:
        return None
    files = [p for p in FOTOS_SRC.iterdir() if p.is_file() and not p.name.startswith(".")]
    if "." in name:
        hits = [p for p in files if p.name.lower() == name.lower()]
    else:
        hits = [p for p in files if p.stem.lower() == name.lower()]
    if not hits:
        avisos.append(f"{who}: arquivo '{name}' ({campo}) não encontrado na pasta de fotos")
        return None
    if len(hits) > 1:
        avisos.append(f"{who}: '{name}' ({campo}) é ambíguo: {', '.join(sorted(h.name for h in hits))}")
        return None
    src = hits[0]
    dst_name = src.stem + "." + src.suffix.lower().lstrip(".").replace("jpeg", "jpg")
    dst = FOTOS_DST / dst_name
    if src.stem in CROPS:
        h, w, oy, ox = CROPS[src.stem]
        subprocess.run(["sips", "-c", str(h), str(w), "--cropOffset", str(oy), str(ox), str(src), "--out", str(dst)],
                       check=True, capture_output=True)
    else:
        shutil.copyfile(src, dst)
    return "/fotos/" + dst_name


def main():
    FOTOS_DST.mkdir(parents=True, exist_ok=True)
    avisos = []
    out = []
    for r in read_rows():
        nome = r.get("nome", "")
        if not nome:
            continue
        ig = (r.get("instagram") or "").strip().lstrip("@").lower() or None  # Excel capitalizou a 1ª letra
        out.append({
            "nome": nome,
            "rosto": resolve(r.get("rosto"), avisos, nome, "rosto"),
            "acao": resolve(r.get("acao"), avisos, nome, "ação"),
            "instagram": ig,
            "highlight": r.get("highlight") or None,
        })
    usados = {Path(x[k]).stem.lower() for x in out for k in ("rosto", "acao") if x[k]}
    sobras = sorted(p.name for p in FOTOS_SRC.iterdir()
                    if p.is_file() and not p.name.startswith(".") and p.stem.lower() not in usados)
    for s in sobras:
        avisos.append(f"Arquivo sem uso na planilha: {s}")
    OUT.write_text(json.dumps({"fonte": "elenco-2026-27/elenco.xlsx", "linhas": out, "avisos": avisos},
                              ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(out)} linhas, {len(avisos)} avisos")
    for a in avisos:
        print(" -", a)


if __name__ == "__main__":
    sys.exit(main())
