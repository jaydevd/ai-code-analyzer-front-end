# AI Codebase Analyzer

A React-based frontend for AI-driven code analysis. Connect GitHub repositories, scan/index codebases, and ask questions about your code via an AI chat interface. Includes a full admin panel for system oversight.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Styling:** TailwindCSS v4
- **Routing:** React Router v7
- **State:** Redux Toolkit + redux-persist
- **Server State:** TanStack React Query
- **HTTP Client:** Axios (with JWT auto-refresh & request queuing)
- **Icons:** lucide-react, react-icons
- **Charts:** Recharts (admin dashboard)

## Features

- **Authentication** — Email/password, Google OAuth, GitHub OAuth with JWT token management
- **Dashboard** — Quick actions, recent repositories, repo cards with status badges
- **AI Chat** — Streaming responses via SSE, repository & branch context, message history management
- **Repository Management** — Branch scanning, scan history with commit links, search
- **Admin Panel** — Analytics dashboard, scan/user/repo management, system logs
- **Dark Theme** — Glassmorphism UI with glow effects

## Getting Started

### Prerequisites

- Node.js 18+
- A running backend API (defaults to `http://localhost:8000`)

### Setup

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env to point VITE_API_URL at your backend
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |
| `VITE_GITHUB_BASE_URL` | GitHub base URL for repo links | `https://github.com` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | — |

## Project Structure

```
src/
├── app/          # Redux store & global slices
├── auth/         # Authentication pages, API, hooks, guards
├── components/   # Shared UI components
├── features/     # Feature modules (admin, dashboard, landing-page, user)
├── lib/          # Axios client with JWT interceptors
├── types/        # TypeScript interfaces
├── App.tsx       # Root component
├── AppRoutes.tsx # Route definitions
└── main.tsx      # Entry point
```

## Deployment

The project includes a `vercel.json` for SPA deployment on Vercel. The build output in `dist/` can be served by any static file server with all routes rewired to `index.html`.

## API Documentation

See [`api_docs/api-reference.md`](api_docs/api-reference.md) for the full backend API reference and [`api_docs/frontend-oauth-implementation.md`](api_docs/frontend-oauth-implementation.md) for OAuth flow details.
