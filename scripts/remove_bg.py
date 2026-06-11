#!/usr/bin/env python3
"""Quita el fondo blanco de los elementos Leonardo via flood-fill desde los bordes.
Preserva blancos/brillos internos del objeto (solo borra el blanco conectado al borde).
Genera PNG con alpha suavizado en assets/elements/*.png"""
import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

THRESH = 235        # qué tan claro debe ser un pixel para considerarse "fondo"
SOFT = 18           # rango de suavizado del borde del alpha

def process(path: Path):
    img = Image.open(path).convert("RGB")
    a = np.asarray(img).astype(np.int16)
    h, w, _ = a.shape
    # brillo mínimo por canal: blanco puro tiene min alto
    brightness = a.min(axis=2)
    # fondo = blanco casi puro, o gris neutro claro (sombras suaves del estudio)
    sat = a.max(axis=2) - a.min(axis=2)
    bg_candidate = (brightness >= THRESH) | ((sat < 22) & (brightness >= 150))

    # flood fill desde todos los pixeles de borde que son candidatos
    bg = np.zeros((h, w), dtype=bool)
    dq = deque()
    for x in range(w):
        for y in (0, h - 1):
            if bg_candidate[y, x] and not bg[y, x]:
                bg[y, x] = True; dq.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if bg_candidate[y, x] and not bg[y, x]:
                bg[y, x] = True; dq.append((y, x))
    while dq:
        y, x = dq.popleft()
        for ny, nx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1)):
            if 0 <= ny < h and 0 <= nx < w and bg_candidate[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True
                dq.append((ny, nx))

    # alpha: fondo=0; en zona de transición suaviza según brillo
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    # suaviza bordes: pixeles no-fondo pero muy claros y vecinos del fondo
    edge_zone = (~bg) & (brightness >= THRESH - SOFT)
    fade = (255 * (THRESH - brightness[edge_zone]) / SOFT).clip(0, 255)
    alpha[edge_zone] = fade.astype(np.uint8)

    out = Image.fromarray(np.dstack([np.asarray(img), alpha]), "RGBA")
    # leve blur del canal alpha para anti-alias
    r, g, b, al = out.split()
    al = al.filter(ImageFilter.GaussianBlur(1.1))
    out = Image.merge("RGBA", (r, g, b, al))
    dest = path.with_suffix(".png")
    out.save(dest)
    print(f"{path.name} -> {dest.name}  ({dest.stat().st_size//1024} KB)")

if __name__ == "__main__":
    folder = Path(sys.argv[1] if len(sys.argv) > 1 else "assets/elements")
    for p in sorted(folder.glob("*.jpg")):
        process(p)
