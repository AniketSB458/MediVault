# MediVault

MediVault is a healthcare-record organization prototype. Its React interface includes a dashboard for medical records, document upload and review, health timelines and insights, reminders, family records, emergency access, summaries, duplicate checks, and sharing.

> **Prototype notice:** This project is not a medical device or a compliant health-record service. Do not use real patient information. The browser app currently uses sample records and stores uploaded files and extracted details locally in the browser; it does not sync them to the API. The API is a separate starter implementation, and several integrations are placeholders.

## Features

- Responsive React dashboard with light and dark themes.
- Browser-side PDF text extraction and OCR for PDF, JPEG, and PNG documents, with a 20 MB file limit.
- SHA-256 duplicate detection and local record storage (IndexedDB for files; local storage for record details).
- Express API starter with MongoDB models and endpoints for account registration/login, family profiles, lab observations, medication reminders, emergency access, and audit events.
- `.env.example` lists the API configuration options, including optional AI integration settings.

The interface includes views for additional workflows such as AI chat, secure sharing, and doctor summaries. Some of these are currently demo or placeholder experiences; review the API responses and implementation before relying on them.

## Requirements

- Node.js 20.19+ (or 22.12+) and npm.
- MongoDB, if you want to run the API with database-backed routes.

## Getting started

Install dependencies:

```bash
npm install
```

Start the web app:

```bash
npm run dev
```

Vite prints the local URL when the development server starts.

### API server

Copy `.env.example` to `.env` and set values for your local environment. At minimum, configure a strong random `JWT_SECRET` and a reachable `MONGODB_URI` before using authenticated API routes.

```bash
cp .env.example .env
npm run server
```

The API listens on `http://127.0.0.1:8787` by default. Check `GET /api/health` to see its status. The API server and web app are not currently wired together in the UI.

Available environment variables:

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default: `8787`) |
| `CLIENT_ORIGIN` | Allowed browser origin for CORS (default: `http://127.0.0.1:5173`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign API authentication tokens |
| `OPENAI_API_KEY` | Optional AI provider credential; the AI route is currently a placeholder |
| `VECTOR_STORE_URL` | Optional vector-store configuration |
| `RAG_INDEX_ID` | Optional retrieval index configuration |

## Development commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run server` | Start the Express API server |
| `npm run build` | Type-check and create a production web build in `dist/` |
| `npm run preview` | Preview the production web build |
| `npm run lint` | Run Oxlint |

## API routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | API and MongoDB status |
| `POST` | `/api/auth/register` | Register an account |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/records/upload` | Validate and accept uploaded files (currently does not persist them) |
| `GET`, `POST` | `/api/family` | Read or create family profiles |
| `GET`, `POST` | `/api/labs` | Read verified lab observations or submit an observation for review |
| `GET`, `POST` | `/api/reminders` | Read or create patient-confirmed medication reminders |
| `POST` | `/api/emergency` | Create a consent-based temporary emergency-access token |
| `POST` | `/api/emergency/revoke` | Revoke emergency access |
| `GET` | `/api/emergency/public/:token` | Read approved fields through an active emergency token |
| `POST` | `/api/ai/chat` | Placeholder; returns setup requirements |
| `POST` | `/api/summaries/metadata` | Placeholder for summary generation |

Most routes require a bearer token from the registration or login response. Configure the API only for local development until its authentication, storage, privacy, and deployment behavior have been thoroughly reviewed.
