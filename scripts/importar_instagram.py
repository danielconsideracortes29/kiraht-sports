#!/usr/bin/env python3
"""
Atualiza a seção Instagram da Home com os arquivos enviados pela Kiraht.

Fonte (padrão): preview-astro/instagram-kiraht/  (ou passe outra pasta como argumento)
  - vídeo (.mp4/.mov): o primeiro em ordem de nome vira o vídeo em destaque;
  - fotos (.jpg/.jpeg/.png/.webp): entram no carrossel "Publicações recentes",
    na ordem dos nomes (Foto 1, Foto 2, … — ordem natural, 10 vem depois de 9).
Datas: DateTimeOriginal do EXIF quando existe; senão, a data de modificação do arquivo.

Saída: public/instagram/ (cópias com nomes seguros) e src/data/instagram.json.
Uso (a partir de preview-astro/):  python3 -I scripts/importar_instagram.py ["/caminho/da/pasta"]
Só biblioteca padrão; o pôster do vídeo é gerado com o qlmanage do macOS.
"""
import datetime as dt
import json
import re
import shutil
import subprocess
import sys
import tempfile
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "instagram-kiraht"
DST = ROOT / "public" / "instagram"
OUT = ROOT / "src" / "data" / "instagram.json"
IMG = {".jpg", ".jpeg", ".png", ".webp"}
VID = {".mp4", ".mov", ".m4v"}


def natural(s):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]


def safe(name):
    n = unicodedata.normalize("NFD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-zA-Z0-9.]+", "-", n).strip("-").lower()


def exif_date(p: Path):
    head = p.read_bytes()[:131072]
    m = re.search(rb"(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})", head)
    if m:
        try:
            return dt.datetime(*map(int, m.groups())).isoformat()
        except ValueError:
            pass
    return None


def file_date(p: Path):
    return dt.datetime.fromtimestamp(p.stat().st_mtime).replace(microsecond=0).isoformat()


def image_size(p: Path):
    r = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(p)], capture_output=True, text=True)
    w = re.search(r"pixelWidth: (\d+)", r.stdout)
    h = re.search(r"pixelHeight: (\d+)", r.stdout)
    return (int(w.group(1)), int(h.group(1))) if w and h else (None, None)


def poster_for(video: Path, out: Path):
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["qlmanage", "-t", "-s", "1080", "-o", tmp, str(video)], capture_output=True)
        pngs = list(Path(tmp).glob("*.png"))
        if not pngs:
            return None
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "82", str(pngs[0]), "--out", str(out)],
                       capture_output=True, check=True)
    return out


def main():
    if not SRC.is_dir():
        sys.exit(f"Pasta não encontrada: {SRC}")
    if DST.exists():
        shutil.rmtree(DST)
    DST.mkdir(parents=True)
    files = sorted((p for p in SRC.iterdir() if p.is_file() and not p.name.startswith(".")), key=lambda p: natural(p.name))
    videos = [p for p in files if p.suffix.lower() in VID]
    fotos = [p for p in files if p.suffix.lower() in IMG]

    video = None
    if videos:
        v = videos[0]
        name = safe(v.stem) + v.suffix.lower()
        shutil.copyfile(v, DST / name)
        poster = poster_for(v, DST / (safe(v.stem) + "-poster.jpg"))
        video = {"src": f"/instagram/{name}", "poster": f"/instagram/{poster.name}" if poster else None,
                 "data": file_date(v), "arquivo": v.name}

    posts = []
    for p in fotos:
        name = safe(p.stem) + (".jpg" if p.suffix.lower() == ".jpeg" else p.suffix.lower())
        shutil.copyfile(p, DST / name)
        w, h = image_size(DST / name)
        exif = exif_date(p)
        posts.append({"src": f"/instagram/{name}", "largura": w, "altura": h,
                      "data": exif or file_date(p), "origemData": "exif" if exif else "arquivo", "arquivo": p.name})

    OUT.write_text(json.dumps({"fonte": str(SRC.name), "video": video, "posts": posts}, ensure_ascii=False, indent=2) + "\n",
                   encoding="utf-8")
    print(f"vídeo: {video['arquivo'] if video else '—'} · fotos: {len(posts)}")
    for x in posts:
        print(f" - {x['arquivo']} · {x['data']} ({x['origemData']}) · {x['largura']}x{x['altura']}")


if __name__ == "__main__":
    main()
