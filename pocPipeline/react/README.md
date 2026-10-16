# pocPipeline frontend

## Setup

Create `react/.env` with these keys. It is gitignored.

```
VITE_C3_ENV=<env name>
VITE_C3_APP=<app name>
VITE_C3_URL=<cluster url>
VITE_C3_AUTH_TOKEN=<auth token>
```

Install dependencies and activate the Kendo license. `telerik-license.txt` goes in `react/` and is gitignored.

```sh
npm install
npx kendo-ui-license activate
```

## Scripts

```sh
npm run dev    # local dev server on http://localhost:8000, proxied to the app in .env
npm run build  # builds into ../ui/content, which c3 sync deploys
npm run lint
```

## Deploy

Run `npm run build`, then from the repo root:

```sh
c3 sync . -s https://c3azcs.c3.ai/tkisl2/dev --no-tty
```

## Seed

After editing a seed file:

```sh
c3 seed -a pocpipeline -s https://c3azcs.c3.ai/tkisl2/pocpipeline
```
