# HKL Movie Archive

A personal archive of favourite movies and series, with ratings, analytics and curated best picks.

Built with Next.js (App Router), React, Tailwind CSS v4, Recharts and Lucide icons. Deployed on Vercel.

## Pages

| Route | Description |
| --- | --- |
| `/` | Searchable, sortable table of every title. Filter by genre, era, my rating and IMDb rating. |
| `/dashboard` | Analytics: genre distribution, era breakdown, rating trends and my rating vs IMDb. Click a chart to filter the others. |
| `/bestpicks` | Poster collections such as All-Time Favorites, Visual Elite and Underrated. |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
```

## Project structure

```
app/
  page.tsx            Archive table
  dashboard/page.tsx  Analytics charts
  bestpicks/page.tsx  Best picks collections
  layout.tsx          Fonts and metadata
  globals.css         Design tokens (colors, base styles)
components/
  SiteHeader.tsx      Top navigation
lib/
  data.ts             Movie data (static)
  collections.ts      Best picks, defined by movie ID
  theme.ts            Genre colors and rating styles
```

## Editing the data

All content is static TypeScript, so there is no database or runtime file access.

- **Add or update a movie:** edit the `mockMovies` array in `lib/data.ts`. Each entry has `id`, `title`, `year`, `director`, `genre`, `myRating`, `imdbRating` and an optional `poster`.
- **Posters:** use an `https://image.tmdb.org/t/p/...` URL. Other hosts must be added to `images.remotePatterns` in `next.config.ts`.
- **Best picks:** edit the ID lists in `lib/collections.ts`. IDs that do not exist in `data.ts` are silently skipped, so keep them in sync if you change an ID.
- **New genre:** add it to `GENRES` in `lib/data.ts` and to `GENRE_COLORS` in `lib/theme.ts`.

## Deployment

The project deploys to Vercel with the default Next.js settings. Pushing to `main` triggers a new deployment. No environment variables are required.
