#!/usr/bin/env python3
"""Generate mini-app scaffolds from docs/new-apps.yaml."""
from __future__ import annotations

import argparse
import copy
import json
from pathlib import Path
import sys
import textwrap

try:
    import yaml
except ImportError as exc:  # pragma: no cover
    raise SystemExit("PyYAML is required. pip install pyyaml") from exc

REPO_ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = REPO_ROOT / "docs" / "new-apps.yaml"
IDEAS_PATH = REPO_ROOT / "ideas.yaml"


def load_yaml(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        data = yaml.safe_load(handle) or []
    if isinstance(data, dict) and "apps" in data:
        return data["apps"]
    return data


def load_ideas() -> dict[str, dict]:
    with IDEAS_PATH.open("r", encoding="utf-8") as handle:
        items = yaml.safe_load(handle) or []
    return {item["slug"]: item for item in items}


def to_js(value, indent=0):
    space = "  " * indent
    if isinstance(value, str):
        return json.dumps(value)
    if isinstance(value, bool):
        return "true" if value else "false"
    if value is None:
        return "null"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, list):
        if not value:
            return "[]"
        inner = ",\n".join(f"{space}  {to_js(item, indent + 1)}" for item in value)
        return "[\n" + inner + f"\n{space}]"
    if isinstance(value, dict):
        if not value:
            return "{}"
        items = []
        for key, val in value.items():
            items.append(f"{space}  {key}: {to_js(val, indent + 1)}")
        return "{\n" + ",\n".join(items) + f"\n{space}}}"
    raise TypeError(f"Unsupported type for JS serialization: {type(value)!r}")


def write_file(path: Path, content: str, force: bool):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and not force:
        return
    path.write_text(content.rstrip("\n") + "\n", encoding="utf-8")


def render_readme(ctx):
    readme = ctx["readme"]
    flow_lines = "\n".join(f"- {step}" for step in readme.get("flow", []))
    free_lines = "\n".join(f"- {item}" for item in readme.get("free", []))
    pro_lines = "\n".join(f"- {item}" for item in readme.get("pro", []))
    qa_lines = "\n".join(f"- [ ] {item}" for item in readme.get("qa", []))
    events = "\n".join(
        f"- `{event['name']}` – {event['trigger']}"
        for event in readme.get("events", [])
    )
    screenshot_path = f"../../docs/screenshots/{ctx['slug']}.svg"
    run_cmd = f"python3 -m http.server 8080 -d apps/{ctx['category']}/{ctx['slug']}"
    return f"""# {ctx['name']}

{ctx['tagline']}

## What it does
{readme['what']}

## Flow
{flow_lines}

## Free vs Pro
**Free**
{free_lines}

**Pro**
{pro_lines}

## Screenshot or Loom
![{ctx['name']} screenshot]({screenshot_path})

## Who it's for
{readme['target']}

## Monetization
{readme['monetization']}

## Run locally
```
{run_cmd}
```

## QA checklist (Phase 2)
{qa_lines}

## Monetization instrumentation
{events}

## Embed & Host Enablement
See `EMBED.md` for HTML snippet, analytics wiring, theming knobs, and rollout checklist.
"""


def render_spec(ctx):
    flow = ctx["readme"].get("flow", [])
    stories = "\n".join(
        f"- As a user, I want to {step.lower()}" for step in flow
    )
    mvp = "\n".join(
        [
            "- [ ] Deterministic logic hooked into shared plan builder",
            "- [ ] Shared app shell layout + branded tokens",
            "- [ ] README, EMBED, UX notes, and apple metadata updated",
        ]
    )
    return f"""# {ctx['name']} SPEC

## Problem
{ctx['idea']}

## Target user
{ctx['readme']['target']}

## User stories
{stories}

## MVP checklist
{mvp}
"""


def render_ux_notes(ctx):
    flow = "\n".join(f"- {step}" for step in ctx["readme"].get("flow", []))
    return f"""# {ctx['name']} UX Notes

## Hero & Hook
- Eyebrow: {ctx['hero']['eyebrow']}
- Title + tagline mirror README copy.

## Form
- Fields: {', '.join(field['label'] for field in ctx['form']['fields'])}
- Helper text: {ctx['form']['helper']}

## Flow summary
{flow}

## States
- Placeholder: {ctx['placeholder']}
- Loading: Shared shell loader.
- Error: Shared toast copy.

## Copy highlights
- Upsell banner: {ctx['upsell']['title']} / {ctx['upsell']['copy']}
- Share row label: {ctx['share']['label']}
"""


def render_embed(ctx):
    slug = ctx["slug"]
    events_table = "\n".join(
        f"| `{event['name']}` | `{event['detail']}` | {event['trigger']} |"
        for event in ctx["readme"].get("events", [])
    )
    return f"""# {ctx['name']} Embed Kit

## Quick start
```html
<link rel=\"stylesheet\" href=\"/shared/styles.css\" />
<link rel=\"stylesheet\" href=\"/shared/app-shell.css\" />
<link rel=\"stylesheet\" href=\"/apps/{ctx['category']}/{slug}/styles.css\" />
<div id=\"{slug}-root\"></div>
<script type=\"module\">
  import {{ mount }} from "/apps/{ctx['category']}/{slug}/app.js";
  mount(document.getElementById("{slug}-root"));
</script>
```

## Custom events
| Event | Detail | Trigger |
| --- | --- | --- |
{events_table}

Listen to these `window` events and pipe into your analytics/billing bridges. See `partner-kit/analytics/contracts.md` for examples.

## Theming & QA
- Override CSS variables before loading app styles.
- Use `docs/qa/{slug}/report.md` to log host QA runs.
- Upsell banner appears after `freePlanLimit` generations; simulate Pro by toggling `state.isSubscribed` in host wrapper.
"""


def render_index(ctx):
    return f"""<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
    <title>{ctx['name']}</title>
    <link rel=\"stylesheet\" href=\"../../../shared/styles.css\" />
    <link rel=\"stylesheet\" href=\"../../../shared/app-shell.css\" />
    <link rel=\"stylesheet\" href=\"./styles.css\" />
  </head>
  <body>
    <div id=\"app\"></div>
    <script type=\"module\" src=\"./app.js\"></script>
  </body>
</html>
"""


def render_styles(ctx):
    theme = ctx.get("theme", {})
    primary = theme.get("primary", "#111322")
    primary_ink = theme.get("primaryInk", "#ffffff")
    hero = theme.get("heroGradient", "linear-gradient(135deg, #edf2ff, #f8f4ff)")
    surface = theme.get("surface", "#f6f7fb")
    return f""":root {{
  --primary: {primary};
  --primary-ink: {primary_ink};
  --hero-surface: {hero};
  --surface: {surface};
}}

body {{
  background: var(--surface);
}}
"""


def render_app_js(ctx):
    return f"""import {{ mountMiniApp }} from "../../../shared/bootstrapMiniApp.js";
import {{ appConfig }} from "./config.js";
import {{ generatePlan }} from "./logic.js";

export function mount(target = "app") {{
  mountMiniApp({{
    config: appConfig,
    generatePlan,
    target
  }});
}}

if (document.readyState === "loading") {{
  document.addEventListener("DOMContentLoaded", () => mount());
}} else {{
  mount();
}}
"""


def render_logic_js(ctx):
    return """import { buildPlan } from "../../../shared/planBuilder.js";
import { appConfig } from "./config.js";

export function generatePlan(values) {
  return buildPlan(appConfig.plan, values);
}
"""


def render_config(ctx):
    config = {
        "slug": ctx["slug"],
        "hero": ctx["hero"],
        "form": ctx["form"],
        "placeholder": ctx["placeholder"],
        "freePlanLimit": ctx.get("freePlanLimit", 1),
        "share": ctx.get("share", {"label": "Shareable link", "cta": "Copy link"}),
        "upsell": ctx.get("upsell", {}),
    }
    plan_config = copy.deepcopy(ctx["plan"])
    plan_config.setdefault("fields", ctx["form"].get("fields", []))
    config["plan"] = plan_config
    return "const appConfig = " + to_js(config, 0) + ";\n\nexport { appConfig };\n"


def render_apple(ctx):
    apple = ctx.get("apple", {})
    payload = {
        "title": ctx["name"],
        "subtitle": apple.get("subtitle", ctx["tagline"]),
        "description": apple.get("description", ctx["tagline"]),
        "keywords": apple.get("keywords", []),
        "primaryCategory": apple.get("primaryCategory", ctx["category"])
    }
    return json.dumps(payload, indent=2) + "\n"


def main():
    parser = argparse.ArgumentParser(description="Generate mini-app files from YAML config")
    parser.add_argument("--slug", action="append", dest="slugs", help="Limit generation to specific slug(s)")
    parser.add_argument("--force", action="store_true", help="Overwrite existing files")
    args = parser.parse_args()

    configs = load_yaml(CONFIG_PATH)
    ideas = load_ideas()
    slugs = set(args.slugs or [])

    for entry in configs:
        slug = entry["slug"]
        if slugs and slug not in slugs:
            continue
        idea = ideas.get(slug)
        if not idea:
            print(f"Skipping {slug}: missing from ideas.yaml", file=sys.stderr)
            continue
        ctx = {
            **entry,
            "idea": idea.get("idea", ""),
            "monetization": idea.get("monetization", ""),
        }
        category = ctx["category"]
        app_root = REPO_ROOT / "apps" / category / slug
        write_file(app_root / "README.md", render_readme(ctx), args.force)
        write_file(app_root / "SPEC.md", render_spec(ctx), args.force)
        write_file(app_root / "UX_NOTES.md", render_ux_notes(ctx), args.force)
        write_file(app_root / "EMBED.md", render_embed(ctx), args.force)
        write_file(app_root / "index.html", render_index(ctx), args.force)
        write_file(app_root / "styles.css", render_styles(ctx), args.force)
        write_file(app_root / "app.js", render_app_js(ctx), args.force)
        write_file(app_root / "logic.js", render_logic_js(ctx), args.force)
        write_file(app_root / "config.js", render_config(ctx), args.force)
        write_file(app_root / "apple.json", render_apple(ctx), args.force)


if __name__ == "__main__":
    main()
