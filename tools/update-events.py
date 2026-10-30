# Rebuild photos/manifest.js from the images in photos/events (sorted by file name).
# Run from the site folder:  python3 tools/update-events.py
import json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
files = sorted(p.name for p in (root / "photos" / "events").iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"})
(root / "photos" / "manifest.js").write_text("window.PHOTOS=" + json.dumps({"events": files}, indent=1) + ";\n")
print(len(files), "event photos listed")
