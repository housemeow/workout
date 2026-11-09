"""Publish the user-confirmed HTML without rewriting its bytes."""
from pathlib import Path

root = Path(__file__).resolve().parent
site = root / 'public'
site.mkdir(exist_ok=True)
(site / 'hiit.html').write_bytes((root / 'src/hiit.html').read_bytes())
(site / 'index.html').write_text('<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./hiit.html"><title>HIIT 計時器</title></head><body><a href="./hiit.html">開啟 HIIT 計時器</a></body></html>\n', encoding='utf-8')
print('Built public/hiit.html from user-confirmed source')
