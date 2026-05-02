# Campus Notification Platform

A full-stack notification system built for a campus environment where students stay updated on Placements, Results, and Events — in real time, with smart priority ordering.

---

## What this does

Ever missed an important placement drive because it got buried under event notifications? This app fixes that.

It pulls in all campus notifications and lets you:
- See everything in one place
- Filter by type (Placement, Result, Event)
- View a **Priority Inbox** that always surfaces the most important notifications first
- Track which notifications you've already seen

New notifications are highlighted in blue. Once you click them, they're marked as read.

---

## Priority Logic

Not all notifications are equal. The app ranks them by:

1. **Type weight** — Placements matter most, then Results, then Events
2. **Recency** — newer notifications rank higher within the same type

This means a fresh Placement alert will always appear above an older Event, even if the Event came in recently.

---

## Project Structure
ra2311047010187/
├── logging_middleware/        # Reusable logging package
│   └── index.ts               # Log(stack, level, package, message)
│
├── notification_app_fe/       # Next.js frontend
│   ├── app/
│   │   ├── page.tsx           # Main UI — All Notifications + Priority Inbox
│   │   ├── layout.tsx         # App shell
│   │   ├── registry.tsx       # MUI SSR fix
│   │   └── api/
│   │       ├── notifications/ # Proxy route for notifications API
│   │       └── logs/          # Proxy route for logging API
│   └── lib/
│       ├── api.ts             # Fetch notifications, priority scoring
│       └── logger.ts          # Log function wrapper
│
├── notification_app_be/       # Backend (placeholder)
└── Notification_System_Design.md  # Architecture + Stage 1 write-up

---

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **UI**: Material UI
- **Logging**: Custom middleware that sends structured logs to the evaluation server
- **API**: REST — fetches live notifications from the campus backend

---

## Running locally

```bash
cd notification_app_fe
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Logging

Every meaningful action in the app is logged — page loads, API failures, filter changes, notification views. Logs are sent to the evaluation server with this structure:
Log(stack, level, package, message)

Example:
```typescript
Log("frontend", "info", "page", "Fetched 10 notifications successfully")
Log("frontend", "error", "page", "Failed to fetch notifications from API")
```
