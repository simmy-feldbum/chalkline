I'm handing you a finished project called Chalkline, a calisthenics tracker web app. It was built in a Claude chat and has never been deployed. I want it live on Railway at chalkline.up.railway.app, backed by a GitHub repo named `chalkline`, so that from now on I can ask you for changes and they go live when you push.

Start by reading CLAUDE.md in this folder. It explains how the app is built, the design rules, and what has and hasn't been tested. Then run `npm test` to confirm everything works here before touching anything else.

Some things about my setup that matter:

- I'm not a developer. Do each step yourself wherever you can. When something has to be done by me (signing in, clicking in a dashboard), tell me exactly what to click and wait for me.
- I'm on Windows and may not have Git installed. Check first. If a tool is missing, tell me the one thing to install rather than working around it in a fragile way.
- I may already have a GitHub repo named `chalkline`. It could be empty or hold older copies of these files. The files in this folder are the newest and should replace older ones. Check what's there and tell me before overwriting anything that isn't an older copy of this project.
- My Railway account may be different from the account other tools on this computer are signed in to. Show me which account you're signed in to before creating anything.

What done looks like:

1. This folder is in my `chalkline` GitHub repo (private unless I say otherwise), with a sensible first commit.
2. A Railway service builds from that repo with the Dockerfile, has `PORT=8080`, and has a volume mounted at `/data` so the workout log survives redeploys.
3. The service has a Railway domain named `chalkline` if that name is free. If it's taken, show me close alternatives and let me pick.
4. You've checked the live site: `/health` returns `ok`, `/api/info` shows `"persistent": true`, and the page loads.
5. You tell me the address, and how I'd ask you for a change later.

Don't set a `CHALKLINE_KEY` and don't add any sign-in. I chose an open site with one shared log. Do tell me once, plainly, that anyone with the address can see and change the log, and how I'd lock it later if I change my mind.

Railway's CLI and dashboard change often, so check `--help` or the current docs before relying on a command. If you can't reach GitHub or Railway from where you're running, do everything you can, then stop and give me the remaining steps as clicks I can follow in the browser.

If the deploy fails, read the build and deploy logs and fix the cause. Tell me what went wrong in a sentence or two.
