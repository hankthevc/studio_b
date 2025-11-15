#!/usr/bin/env python3
import argparse, json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]  # repo root
APPS = ROOT / "apps"
SHARED = ROOT / "shared"

def read_ideas():
    y = ROOT / "ideas.yaml"
    if not y.exists():
        return {}
    try:
        import yaml
    except ImportError:
        return {}
    # Open the YAML file and load its contents
    with y.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or []
    # Expecting a list of entries with "slug"
    return {item["slug"]: item for item in data if isinstance(item, dict) and "slug" in item}


def w(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text(content, encoding="utf-8")

def build(slug: str):
    ideas = read_ideas()
    idea = ideas.get(slug, {"name": slug.title(), "category": "travel", "idea": "TBD", "monetization": "free"})
    name = idea.get("name", slug.title())
    category = idea.get("category", "misc")
    app_dir = APPS / category / slug
    app_dir.mkdir(parents=True, exist_ok=True)

    # Shared stubs
    w(SHARED / "llmClient.js", """export async function callLLM(op, payload) {
  // Stub only. Wire to your backend/host app, not from client directly.
  return { ok: true, op, payload, note: "stubbed response" };
}
""")
    w(SHARED / "ui.js", """export function el(tag, attrs={}, ...children){
  const e=document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k, v));
  children.forEach(c=>e.append(c.nodeType?c:document.createTextNode(c)));
  return e;
}
""")
    w(SHARED / "styles.css", """*{box-sizing:border-box}body{margin:0;font:16px system-ui,-apple-system,Segoe UI,Roboto}
.container{max-width:800px;margin:0 auto;padding:16px}
button{padding:10px 14px;border:0;border-radius:8px;cursor:pointer}
input,select,textarea{width:100%;padding:10px;border:1px solid #ddd;border-radius:8px}
.card{background:#fff;border:1px solid #eee;border-radius:12px;padding:12px;margin:8px 0}
""")

    # App files
    w(app_dir / "index.html", f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>{name}</title>
    <link rel="stylesheet" href="../../../../shared/styles.css"/>
    <link rel="stylesheet" href="./styles.css"/>
  </head>
  <body>
    <div class="container" id="app"></div>
    <script type="module">
      import {{ initMiniApp }} from "./app.js";
      initMiniApp(document.getElementById("app"));
    </script>
  </body>
</html>
""")

    w(app_dir / "styles.css", """.toolbar{display:flex;gap:8px;margin-bottom:12px} .results{margin-top:12px}
""")

    w(app_dir / "app.js", f"""import {{ el }} from "../../../../shared/ui.js";
import {{ callLLM }} from "../../../../shared/llmClient.js";

export function initMiniApp(root){{
  const where = el("input", {{ placeholder:"Where to?" }});
  const days = el("input", {{ placeholder:"Days", type:"number", value:"3", min:"1" }});
  const go   = el("button", {{}}, "Plan");
  const out  = el("div", {{ class:"results" }});

  go.addEventListener("click", async () => {{
    out.textContent = "Planning…";
    const r = await callLLM("PLAN_TRIP", {{ destination: where.value, days: Number(days.value) || 3 }});
    out.textContent = JSON.stringify(r, null, 2);
  }});

  root.append(
    el("div", {{ class:"toolbar" }}, where, days, go),
    el("div", {{ class:"card" }}, "Trip plan will appear below."),
    out
  );
}}
""")

    w(app_dir / "logic.js", """// If you later move LLM/system logic client-side, put helpers here.
""")

    w(app_dir / "README.md", f"""# {name}

Quick, mobile-first mini-app.

## What it does
Plans a lightweight itinerary.

## Who it's for
Anyone who wants a fast suggestion without fuss.

## Monetization
{idea.get("monetization","free")}

## Run locally
python3 -m http.server 8080 -d apps/{category}/{slug}
# Then open http://localhost:8080
""")

    w(app_dir / "SPEC.md", f"""# SPEC — {name}

## Problem
People want a quick, good-enough trip plan without long forms.

## Target user
Time-strapped travelers.

## User stories
- As a user, I enter destination + days → I get a 3–5 item/day plan.
- I can regenerate with small tweaks (budget/activity emphasis).
- I can copy/share my plan.

## MVP checklist
- [ ] Single-screen input (destination, days)
- [ ] Display itinerary JSON/text
- [ ] Regenerate button
- [ ] Basic error states
- [ ] README + apple.json

## Monetization
{idea.get("monetization","free")}
""")

    w(app_dir / "UX_NOTES.md", """# UX Notes
Flow: Open → Enter destination+days → Press Plan → See results → Regenerate.

Wireframe (mobile):
[ Destination ][ Days ][ Plan ]
-------------------------------
|   Card: Plan results        |
|   (scroll)                  |
-------------------------------
""")

    w(app_dir / "apple.json", json.dumps({
        "displayName": name,
        "subtitle": "Quick itinerary suggestion",
        "category": idea.get("category","travel"),
        "ageRating": "4+",
        "iapModel": "free",
        "priceTier": "0",
        "keywords": ["travel","planner","itinerary"]
    }, indent=2))

    print(f"Scaffolded apps/{category}/{slug} and ensured shared/ stubs exist.")

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--slug", default="tripspark")
    args = p.parse_args()
    build(args.slug)
