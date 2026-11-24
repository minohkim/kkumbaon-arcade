#!/usr/bin/env python3
"""위키미디어 커먼즈에서 퍼블릭 도메인 판화를 받아 assets/art/<key>.jpg 로 저장한다.
GitHub Actions(.github/workflows/fetch-art.yml)에서 실행된다. 이미 받은 파일은 건너뛴다.
라이선스가 퍼블릭 도메인이 아니면 저장하지 않고 실패 처리한다."""
import io, json, pathlib, sys, urllib.parse, urllib.request
from PIL import Image

API = "https://commons.wikimedia.org/w/api.php"
UA = "KkumbaonArcade/0.1 (https://github.com/minohkim/kkumbaon-arcade)"
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "art"
MAX_W = 1280

def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60).read()

def main():
    manifest = json.loads((OUT / "manifest.json").read_text(encoding="utf-8"))
    credits, failed = [], []
    for a in manifest["art"]:
        dest = OUT / f"{a['key']}.jpg"
        q = urllib.parse.urlencode({"action": "query", "prop": "imageinfo", "iiprop": "url|extmetadata",
                                    "iiurlwidth": MAX_W, "titles": "File:" + a["file"], "format": "json"})
        page = next(iter(json.loads(get(f"{API}?{q}"))["query"]["pages"].values()))
        if "imageinfo" not in page:
            failed.append(a["key"] + " (파일 없음)"); continue
        ii = page["imageinfo"][0]
        lic = ii["extmetadata"].get("LicenseShortName", {}).get("value", "")
        if "public domain" not in lic.lower() and not lic.lower().startswith("pd"):
            failed.append(f"{a['key']} (라이선스: {lic})"); continue
        credits.append(f"| {a['title']} | {a['ref']} | 귀스타브 도레 (1866) | {lic} | {ii['descriptionurl']} |")
        if dest.exists():
            continue
        img = Image.open(io.BytesIO(get(ii.get("thumburl") or ii["url"]))).convert("RGB")
        if img.width > MAX_W:
            img = img.resize((MAX_W, round(img.height * MAX_W / img.width)), Image.LANCZOS)
        img.save(dest, "JPEG", quality=82, optimize=True, progressive=True)
        print("saved", dest.name, img.size)
    (ROOT / "CREDITS.md").write_text(
        "# 그림 출처\n\n모든 판화는 위키미디어 커먼즈의 퍼블릭 도메인 자료입니다. `tools/fetch_art.py`가 자동으로 갱신합니다.\n\n"
        "| 그림 | 본문 | 작가 | 라이선스 | 원본 |\n|---|---|---|---|---|\n" + "\n".join(credits) + "\n", encoding="utf-8")
    if failed:
        print("실패:", *failed, sep="\n  "); sys.exit(1)

if __name__ == "__main__":
    main()
