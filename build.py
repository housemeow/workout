from pathlib import Path
p = Path(__file__).resolve().parent
html = '<!doctype html>\n<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>HIIT 20 分鐘計時器 — 重建版</title><style>\n'
html += (p/'src/style.css').read_text() + '\n</style></head><body>\n' + (p/'src/body.html').read_text()
html += '\n<script>\n' + (p/'src/core.js').read_text() + '\n' + (p/'src/app.js').read_text() + '\n</script></body></html>\n'
(p/'HIIT_20min_rebuilt.html').write_text(html)
print('Built HIIT_20min_rebuilt.html')
