# Wedding Invitation — Local Setup

This folder contains the complete wedding invitation website and all image, video, and audio assets required to run it locally.

## Requirements

- Node.js 18 or newer
- pnpm 9 or newer, or npm

## Run locally

```bash
pnpm install
pnpm dev
```

Then open the local URL printed by Vite, usually `http://localhost:3000/`.

You can also use npm:

```bash
npm install
npm run dev
```

## Build for production

```bash
pnpm build
pnpm start
```

## Change the invitation details

Open:

```text
client/src/pages/Home.tsx
```

Edit the `INVITATION` object near the top of the file. It contains the bride and groom names, parents, places, venue, map URL, date, and time.

All media is bundled locally under:

```text
client/public/assets/
```

The project does not depend on Manus storage or an external backend.
