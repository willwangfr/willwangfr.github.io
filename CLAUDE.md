# William Wang's personal site

Static site, no build step, published by GitHub Pages from `main` of
[willwangfr/willwangfr.github.io](https://github.com/willwangfr/willwangfr.github.io) at https://willwangfr.github.io.
Pushing to `main` publishes, so only push when William asks for it in the conversation. The structure is modeled on
[codyh.xyz](https://codyh.xyz) (Cody Hergenroeder's site).

## Before touching content

This repo is public. The content rules, including what must never go on the site, live outside it in
`~/Documents/personal-website-notes/SITE_RULES.md`. Read that file before adding or rewording anything, and never
copy anything from that folder into this repo.

## The contract: content.js

`content.js` is the only content source and the one thing a redesign must keep working with. Its schema is
documented at the top of the file and in README.md. Everything else (`index.html`, `rfs.html`, `app.js`, `field.js`,
`styles.css`) is presentation and can be rewritten wholesale. If a redesign needs a new field, add it to the schema
comment and to `scripts/check-content.mjs`, and keep old fields working.

## Invariants no redesign may break

- **Voice.** Casual, lowercase-friendly, contractions, plus signs. No em dashes, no hype words, no rule-of-three
  rhetoric, no crafted punchline endings. New prose should go through the humanizer skill.
- **Claims.** No "first"/"only"/"nobody has built" statements without a real search. Every link verified.
- **Honest credit.** The generative art toys are credited as built with Claude; Lenia is Bert Chan's model.
- **Behavior.** Deep links (`#/item-id` opens an item), the join board (built from every item with an `invite` plus
  `calls`), keyboard access with focus trap and restore, `prefers-reduced-motion`, light and dark palettes that pass
  WCAG AA for small text, no horizontal scroll at 320px, tap-to-open working on touch devices, and no network requests
  beyond Google Fonts (plus the Tabler icon stylesheet inside `toys/lenia.html`).

## Verify every change

1. `node scripts/check-content.mjs --links` must pass. It loads the private blocklist automatically when present.
2. Preview with the `personal-website` entry in `~/Documents/.claude/launch.json` (port 8791).
3. Screenshot light, dark, and mobile. The preview tab is usually hidden, which suspends `requestAnimationFrame`,
   so drive the canvas with `window.__field.tick(300)` before screenshotting.
4. Open a drawer by click and by `#/id`, press Escape, and confirm focus returns.

## Redesigning with a stronger model

The current look is a lab-notebook page: graph paper, Instrument Serif + Hanken Grotesk + IBM Plex Mono, and an
ECG-red accent. The field view draws every item as a dot clustered by kind in a flow field. A redesign can replace
all of that. A good brief: keep content.js, the private rules, and the invariants above, pick a new signature
interaction that isn't Cody's cube, and verify with the steps above.
