# personal-website

Plain HTML/CSS/JS, no framework and no build step. Live at https://willwangfr.github.io.

## Editing

Everything on the page comes from `content.js`. Add a project, idea, paper or event by adding an object to `items`,
save, refresh.

| field | used for |
| --- | --- |
| `kind` | `build`, `company`, `idea`, `research`, or `event`; sets the section and the dot color in the field |
| `group` | sub-heading inside a section; must match an id in `groups` |
| `featured` | shows as a card instead of a row, and as a bigger dot |
| `invite`, `inviteWho`, `inviteUrl` | makes the item show up in **join in**, with an "i'm in" button (email by default, or `inviteUrl` for a form or event page) |
| `date` (`YYYY-MM-DD`), `recurring`, `when`, `place`, `rsvp` | events; past dates drop to "past" automatically |
| `why` | ideas only; the second paragraph under the problem |
| `embed` | a local `toys/*.html` page shown live inside the item's panel |

Every item gets a deep link: `willwangfr.github.io/#/item-id` opens its panel directly.

`calls` holds invitations that aren't tied to one item (for example, "students who want to do research").

## Preview locally

```bash
python3 -m http.server 8791
```

Then open http://localhost:8791.

## Publish

GitHub Pages serves the `main` branch. Check, then push:

```bash
node scripts/check-content.mjs --links
```

```bash
git add -A && git commit -m "update site" && git push
```

The live site updates within a minute or two.

## Checks

`scripts/check-content.mjs` fails on broken schema, dead links, and voice-rule violations, plus anything on the
owner's private blocklist when that file is present. `CLAUDE.md` has the rules for anyone (or any model) redesigning
the site.

## Files

- `content.js` is the only file you normally touch
- `rfs.html` is the standalone startup-ideas page, like codyh.xyz/rfs.html; it reads the same content.js
- `app.js` renders sections, the join board, and the detail panel
- `field.js` draws the flow-field view (canvas, pauses when off-screen, static under reduced motion)
- `styles.css` holds the light and dark palettes as CSS variables at the top
- `toys/` holds the generative art pieces, built with Claude
