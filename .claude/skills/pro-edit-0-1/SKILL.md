---
name: pro-edit-0-1
description: Pro Edit 0.1 - motion-design toolkit for Remotion videos. Taste rules (timing, easing, typography, color), procedural sound design, a render-and-review self-check loop, and web simulations. Use when creating, polishing or checking any Remotion video in this repo.
---

# Pro Edit 0.1

Source: https://github.com/whaleyxbt/claude-motion (MIT, see LICENSE).

Read the sub-skill that matches the job, then follow it:

| Job | Read |
|---|---|
| Animation, timing, easing, type, color | `motion-design/SKILL.md` |
| Check a render before calling it done | `review-loop/SKILL.md` |
| Sound effects, music, loudness | `sound-design/SKILL.md` |
| Simulation or 3D style video | `web-sims/SKILL.md` |

Tooling referenced by those skills (`sfx/`, `sims/`, `scripts/`, `src/` reference components) lives inside this folder.
Paths in the sub-skills assume the toolkit root is this folder, not the repo root.

Repo rules:
- Render only through GitHub Actions (Actions tab -> Render Remotion video). Do not rely on local installs.
- New compositions go in `src/compositions/` and must be registered in `src/Root.tsx`.
- Never commit API keys or client videos to a public repo.
