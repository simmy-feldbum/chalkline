# Chalkline

A gamified calisthenics tracker. One self-contained web page (`index.html`) plus a tiny Node server (`server.js`) that serves it and stores one shared log. Built for the owner and a few friends; the owner is not a developer, so prefer doing a step for them over explaining how to do it, and give click-by-click directions when something has to happen in a browser.

## Current state (October 6, 2026)

- The app is feature-complete for now and was built in a Claude chat, then split into the files here. `npm test` passes.
- **Never deployed.** The goal is a Railway service at `chalkline.up.railway.app`. No Railway project for it existed when this was written.
- A GitHub repo named `chalkline` may already exist on the owner's account, possibly empty or holding older copies of these files. The files here are the newest; replace older ones.
- Git may not be installed on the owner's Windows computer.
- A second copy of the same `index.html` is published as a private page inside Claude (it uses Claude's storage instead of this server). It is updated from the Claude chat, not from this repo. Keep the storage modes below working so one file serves both.

## Commands

| Command | What it does |
|---|---|
| `npm start` | Run the server on `PORT` (default 8080). Open http://localhost:8080 |
| `npm run build` | Rebuild `index.html` from `src/` |
| `npm test` | Check `index.html` matches `src/`, check the exercise data, and run the server through storage, merge, key and restart tests |

No dependencies and no `npm install` needed. Node 18 or newer.

## Layout

```
index.html      built app, committed (Railway serves this; do not edit by hand)
build.js        concatenates src/ into index.html
server.js       static file + JSON document store, no dependencies
Dockerfile      copies server.js and index.html only
railway.json    Dockerfile build, /health check, restart policy
src/head.html   <head>, all CSS, the three root <div>s
src/data.js     exercises, drawings, explanations, ladders, starter projects
src/figure.js   stick figures, body map, watercolor washes, stars, icons
src/core.js     state, scoring, storage and sync, accounts
src/views.js    the eight tabs and their sections
src/ui.js       sheets (modals), actions, input handlers, start-up
test/           data.test.js, server.test.js
```

**After any change in `src/`, run `npm run build` and commit `index.html` too.** `npm test` fails if they are out of sync. The files are concatenated in the order above into one `<script>`, so later files can use anything from earlier ones and there are no imports.

## How the app works

No framework. `render()` rebuilds `#app` from template strings. Clicks are dispatched by `data-a="name"` to `A.name(dataset, el)` in `ui.js`; text inputs by `data-i="name"` to `I.name(value)`. Sheets are objects on `ui.modals`, drawn by `SHEET[type]`. Escape everything user-entered with `esc()`.

Tabs, in order: Home, Suggestions, Log, Projects, Plan, Points, Bests, Library. Each tab is a list of sections in `TABS`; the owner can move, hide and resize sections per tab (`S.layout`), so add new content as a section, not as fixed markup.

### Exercise data (`src/data.js`)

`E(id, name, group, unit, difficulty, use, mainMuscles, partialMuscles, usualSet, pose)` adds a move. `pose` is either a joint-angle object (a new drawing) or the id of an existing drawing to reuse.

- Groups: `push`, `pull`, `legs`, `core`, `stretch`. `G2` gives a move a second category only where it truly belongs to both.
- Difficulty: 0.5 to 6 in half steps. 6 is reserved for elite moves (planche push-up, 90-degree push-up, one-arm handstand, front lever pull-up) and shows as a gold sixth star. Keep the scale honest when adding moves: pull-up is 2, muscle-up 4, front lever 5.
- `REF[id]` is the "solid set" mark (reps or seconds that earn the move's full value). Defaults to the usual set. These were set by judgment and are the first thing to tune if points feel off.
- `DESC[id]` is the short how-to shown when a move is opened. Every move needs one.
- `CHAINS` are lead-up ladders used by "Make this a project" (offered at 3 stars and up). Every move of 3 stars or more must appear in at least one.
- `WARM` marks stretches suited to a warm-up.
- Muscle keys are in `MUSC`. The body map shows main muscles red and partial yellow, front view on the left and back on the right.

`npm test` enforces all of the above.

### Points (`src/core.js`)

- Value of a solid set: `10 * 2^(difficulty - 1)`, so it doubles per star.
- Base points for a set: `value * curve(n / ref)` where `curve(x) = x` up to 1 and `x^2.2` past it. Below the mark points rise evenly; past it they climb fast (a third more is close to double). This is what makes 20 squats ordinary and 20 pull-ups huge.
- Bonuses, added after logging and never shown beforehand (the owner asked for this): first time +50% (at least 3); freshness +5% per day past three days since the move was last done, capped at +50%; new best +50% and 10; clearing a project step 20 per star, plus 100 for the final step.
- A logged set stores its own points (`p`, breakdown `b`, flags `f`) and is never recomputed, so formula changes only affect new sets.
- A project step clears when a single set reaches its target. Steps clear independently, not in order.

### Suggestions and planning (`src/views.js`)

- "Close to hitting" ranks each project's first uncleared step by best/target.
- "Not done in a while" is any logged move untouched for 4 or more days.
- `warmupFor(move)` returns up to two matching stretches when the move's body area has not been trained for 4 or more days (`COLD`); shown as "Stretch first".
- Auto-fill picks, per body area: current project steps, then stale moves, then staples near the user's level; with the option on, it ends the day with stretches matched to the muscles used.

### Storage and sync (`src/core.js`)

State is `S = {custom, projects, plan, layout, log, ts, gone, wiped}`, cached in `localStorage`. It is synced as documents:

- `main`: custom exercises, projects, plan (last 21 days onward), layout. Last writer wins by its `at` timestamp.
- `log-YYYY-MM`: `{entries, gone, wiped, at}`. **Merged by set id, never overwritten**, so two devices logging at once both keep their sets. `gone` lists deleted set ids; `wiped` is the time of the last "erase everything" (sets with an older `t` are dropped). The server applies the same merge in `mergeLog`. Keep both sides in step.

`modeOf()` picks where documents go, in this order:

1. `server`: the page finds `GET api/info` returning `{app:"chalkline"}`. One shared log, no sign-in. This is the Railway mode.
2. `account` / `claude`: `window.claude` exists (the Claude-hosted copy). Uses Claude's document store, with optional name-and-password Chalkline accounts.
3. `device`: neither; `localStorage` only.

Settings has "Move your log" (export and import as text) for carrying a log between copies.

### Server (`server.js`)

| Route | Notes |
|---|---|
| `GET /health` | `ok`, used by Railway's health check |
| `GET /api/info` | `{app, needKey, persistent}`; never needs the key |
| `GET /api/docs` | all documents |
| `PUT /api/docs/:id` | replace a document; `log-*` documents are merged |

- Data is JSON files in `DATA_DIR`, else `$RAILWAY_VOLUME_MOUNT_PATH/chalkline`, else `./data`. Without a volume the log is lost on every redeploy, and the app shows a warning in Settings (`persistent: false`).
- If `CHALKLINE_KEY` is set, `/api/docs` needs it in the `x-chalkline-key` header. The page asks once per device and remembers it; `?key=...` on the address also sets it. Without the variable, anyone with the address can read and change the log. The owner chose no sign-in, so leave it unset unless asked.

## Design rules (from the owner)

- Pure black background, colorful accents that look painted, like watercolor. Washes are generated as inline SVG filters in `washSVG`; there are eight pigments in `PIG`. Color should feel hand-applied, never flat blocks or gradients.
- Simple and fairly sharp: 3px corners, or fully round (pills and circles). Nothing in between.
- Drawings are chalk-style stick figures generated from joint angles. No photos or realistic people.
- Must work on a phone and a computer. Below 960px there is a bottom tab bar; above it, a left sidebar.
- Copy: American spelling, sentence case, plain words, no all-caps labels. Buttons say what they do, and the confirmation uses the same word.
- Font: Archivo (Google Fonts), with width variation for display type.

## What has and has not been verified

Verified in a headless browser and by `npm test`: every tab, logging, editing a progression, arranging a tab, custom exercises, export and import, two devices syncing through the real server locally with and without a key, and data surviving a server restart.

Not verified: an actual Railway deploy (build, volume mount, domain), and the Claude-hosted accounts against Claude's live storage (tested against a stand-in only). Treat the first deploy as the real test and check `/api/info` reports `"persistent": true`.

## Railway target

- One service built from this repo with the Dockerfile.
- Variable `PORT=8080`.
- A volume attached to the service, mount path `/data`.
- Railway-provided domain renamed to `chalkline` if free (`chalkline.up.railway.app`), target port 8080.
- Railway's CLI and dashboard change often. Check `railway <command> --help` or the docs before relying on a flag.
