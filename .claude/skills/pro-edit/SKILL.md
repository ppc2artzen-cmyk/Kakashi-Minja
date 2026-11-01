---
name: pro-edit
description: Pro Edit - video editing styles and tools - motion B-roll from a talking-head video, high-energy / default / engaging product explainers, object separation, and measured sound effects. Use when the user asks for a video editing style, B-roll, motion graphics, an explainer or promo, or sound effects.
---

# Pro Edit

Source: https://github.com/Barty-Bart/motion-graphics (MIT, see LICENSE).

Read the sub-skill that matches the job, then follow it:

| Job | Read |
|---|---|
| Motion-graphic B-roll timed to a speaker's words | `motion-broll/SKILL.md` |
| 12-20 s hype promo, kinetic type | `explainer-high-energy/SKILL.md` |
| Clean 45-90 s product demo | `explainer-default/SKILL.md` |
| 10-30 s one-take story explainer | `explainer-engaging/SKILL.md` |
| Cut a person/product out of the background | `object-separation/SKILL.md` |
| Sound effects on the beat | `sound-effects/SKILL.md` |

Repo rules:
- Final renders go through GitHub Actions (Actions tab -> Render Remotion video).
- `object-separation` needs a GPU/local Python and does not run on the standard Actions runner; skip it unless the user sets that up.
- `motion-broll` and `sound-effects` need ffmpeg and Python; check the Actions workflow installs them before relying on them.
- Never commit API keys or client videos to a public repo.
