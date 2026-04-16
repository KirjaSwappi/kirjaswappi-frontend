[![Release Pipeline](https://github.com/kirjaswappi/kirjaswappi-frontend/actions/workflows/release.yml/badge.svg)](https://github.com/kirjaswappi/kirjaswappi-frontend/actions/workflows/release.yml) [![Netlify Status](https://api.netlify.com/api/v1/badges/01648706-95ce-47a4-965e-364ea53b5317/deploy-status)](https://app.netlify.com/sites/kirjaswappi/deploys)

# KirjaSwappi Frontend

Web UI for [KirjaSwappi](https://kirjaswappi.fi) — a book exchange platform. Built with React 18 and TypeScript.

## Tech Stack

- React 18 + TypeScript 5.9
- Vite 7.3
- Redux Toolkit + RTK Query
- Tailwind CSS
- Vitest + React Testing Library

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.sample` to `.env` and fill in the values.

## Scripts

| Command            | Description                      |
| ------------------ | -------------------------------- |
| `npm run dev`      | Start dev server                 |
| `npm run build`    | Type check + production build    |
| `npm run test`     | Run tests with coverage          |
| `npm run spotless` | Lint + format (ESLint + Prettier)|

## Project Structure

```text
src/
├── components/    # Reusable UI components
├── pages/         # Feature pages
├── redux/         # Store, API slices, feature slices
├── hooks/         # Custom React hooks
├── routes/        # Routing config
├── locales/       # i18n translations (en, fi, sv)
├── utility/       # Helper functions
└── __tests__/     # Tests
```

## Links

- **Production:** <https://kirjaswappi.fi>
- **Canary:** <https://canary.kirjaswappi.fi>
- **API Docs:** [Swagger UI](https://api.kirjaswappi.fi/swagger-ui/index.html)

© 2025 KirjaSwappi. All rights reserved.
