# KirjaSwappi Frontend

[![Release Pipeline](https://github.com/KirjaSwappi/kirjaswappi-frontend/actions/workflows/release.yml/badge.svg)](https://github.com/KirjaSwappi/kirjaswappi-frontend/actions/workflows/release.yml)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?logo=vercel)](https://kirjaswappi.fi)

React web app for [KirjaSwappi](https://kirjaswappi.fi) — a Finnish book exchange platform where users list books, negotiate swaps, and communicate in real time.

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Language | TypeScript 5.9 |
| Framework | React 18 |
| Build tool | Vite 7 |
| State management | Redux Toolkit + RTK Query |
| Styling | Tailwind CSS |
| Real-time | WebSocket (STOMP) |
| i18n | i18next (English, Finnish, Swedish) |
| Testing | Vitest + React Testing Library |

## Getting Started

**Prerequisites:** Node.js 20+

```bash
git clone https://github.com/KirjaSwappi/kirjaswappi-frontend.git
cd kirjaswappi-frontend
npm install

# Configure environment
cp .env.sample .env
# Fill in VITE_API_URL and VITE_WS_URL

npm run dev
```

## Commands

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Type check + production build |
| `npm run test` | Run tests with coverage |
| `npm run spotless` | Lint + format (ESLint + Prettier) |

## Project Structure

```text
src/
├── components/    # Reusable UI components
├── pages/         # Feature pages (books, auth, messages, profile…)
├── redux/
│   ├── api/       # RTK Query API slices
│   └── feature/   # Redux Toolkit feature slices
├── hooks/         # Custom React hooks (WebSocket, etc.)
├── contexts/      # React contexts
├── routes/        # Routing configuration
├── locales/       # i18n translation files (en, fi, sv)
├── utility/       # Helper functions
└── __tests__/     # Tests
```

## Related Repositories

| Repo | Description |
| ---- | ----------- |
| [kirjaswappi-backend](https://github.com/KirjaSwappi/kirjaswappi-backend) | Java Spring Boot API |
| [kirjaswappi-notification](https://github.com/KirjaSwappi/kirjaswappi-notification) | Go notification service |
| [kirjaswappi-infra](https://github.com/KirjaSwappi/kirjaswappi-infra) | Infrastructure & deployment |

## Links

- **Web app:** <https://kirjaswappi.fi>
- **API Docs:** [Swagger UI](https://api.kirjaswappi.fi/swagger-ui/index.html)

---

© 2024–2026 KirjaSwappi. All rights reserved. See [LICENSE](LICENSE) for terms.
