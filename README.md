# MediVault - Prototype for IIT Nagpur HACKATHON
## https://medivault-green.vercel.app

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

