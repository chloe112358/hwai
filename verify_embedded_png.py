import base64
import re

with open("submission.html", "r", encoding="utf-8") as f:
    html = f.read()

m = re.search(r'const\s+BEAVER_SRC\s*=\s*"(data:image/png;base64,[^"]+)";', html)
if not m:
    raise SystemExit("BEAVER_SRC not found")

data_uri = m.group(1)
raw = base64.b64decode(data_uri.split(",", 1)[1])
print("bytes:", len(raw))
print("png_signature:", raw[:8])
print("is_png:", raw.startswith(b"\x89PNG\r\n\x1a\n"))

with open("beaver.b64", "r", encoding="utf-8") as f:
    b64_file = f.read().strip()

embedded_b64 = data_uri.split(",", 1)[1]
print("matches_beaver_b64:", embedded_b64 == b64_file)
