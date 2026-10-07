# Chalkline

A gamified calisthenics tracker: projects with step-by-step progressions, points that reward harder moves and bigger sets, a 179-move library with stretches, suggestions, and a 14-day planner.

It runs on its own small server and keeps **one shared log with no sign-in**. Any phone or computer that opens the address sees and updates the same log.

## Run it

    npm start

Then open http://localhost:8080. Needs Node 18 or newer; there is nothing to install. The log is kept in a `data` folder next to the files.

## Change it

Edit the files in `src/`, then:

    npm run build
    npm test

`index.html` is the built app and is committed, so the host only needs `server.js` and `index.html`. See `CLAUDE.md` for how the app is put together.

## Put it on Railway

1. Create a service from this GitHub repo. It builds with the Dockerfile.
2. Add the variable `PORT` = `8080`.
3. Attach a volume to the service with mount path `/data`. Without it, the log is erased on every redeploy.
4. Generate a domain for port 8080 and rename it.

After that, every push to the repo redeploys and the log stays on the volume.

## Optional lock

Set a variable `CHALKLINE_KEY` to any phrase. Each device then asks for the phrase once and remembers it. Without it, anyone who has the address can see and change the log.
