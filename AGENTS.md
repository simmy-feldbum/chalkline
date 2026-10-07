# Shipping changes

The owner wants every change live without asking. After any change to this repo, do all of these steps in order, without waiting to be told:

1. If anything in `src/` changed, run `npm run build`.
2. Run `npm test`. If it fails, fix it. Never push a failing build.
3. Commit everything, including `index.html`, with a short message that says what changed.
4. Push to `main` on GitHub (`simmy-feldbum/chalkline`). Railway builds and deploys automatically from `main`. Don't also run `railway up`; GitHub is the one source of what is live.
5. Wait for the deploy, then check the live site at https://chalkline.up.railway.app:
   - `/health` returns `ok`
   - `/api/info` shows `"persistent": true`
   - the page loads and shows the change
6. If the deploy fails, read the Railway build and deploy logs, fix the cause, and push again. Tell the owner in a sentence or two what went wrong.
7. Tell the owner the change is live, in plain words.

Still ask first before anything that could lose the shared workout log: deleting or detaching the `/data` volume, changing how `log-*` documents merge, or setting `CHALKLINE_KEY`.

On the owner's Windows computer, Git is at `C:\Program Files\Git\cmd` and Node at `C:\Program Files\nodejs`. If a shell can't find them, add those folders to `PATH` for that command.
