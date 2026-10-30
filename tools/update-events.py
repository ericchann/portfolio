# Rebuild photos/manifest.js from the images in photos/events.
# Keeps the order already in manifest.js (e.g. from edit mode); new images are appended in file-name order.
# Run from the site folder:  python3 tools/update-events.py
import json, pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
files = sorted(p.name for p in (root / "photos" / "events").iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"})
mf = root / "photos" / "manifest.js"
try:
    old = json.loads(re.search(r"\{.*\}", mf.read_text(), re.S).group(0))["events"]
except Exception:
    old = []
files = [f for f in old if f in files] + [f for f in files if f not in old]
mf.write_text("window.PHOTOS=" + json.dumps({"events": files}, indent=1) + ";\n")
print(len(files), "event photos listed")
