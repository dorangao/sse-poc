# AI Agent Guide for SSE Project

This document provides context for AI agents working on this codebase.

## Project Structure
- **Framework**: Next.js 14+ (Pages Router)
- **Language**: TypeScript
- **Styling**: Inline styles / Start CSS (kept simple for PoC)

## Key Components

### Server-Side (API Routes)
- `pages/api/sse.ts`: 
  - **Purpose**: Simple data streaming. 
  - **Mechanism**: `setInterval` sending periodic events.
  - **Connection**: One-way, long-lived HTTP.

- `pages/api/notifications.ts`:
  - **Purpose**: Real-time user presence and system notifications.
  - **Mechanism**: In-memory `clients` array. Broadcasts events on connection/disconnection.
  - **Events**: `user-connected`, `user-disconnected`.

### Client-Side
- `pages/index.tsx`:
  - **Purpose**: Main UI.
  - **Mechanism**: Establishes **two** `EventSource` connections (one per endpoint).
  - **State**: Tracks `events` (from SSE), `notifications` (from Notifications), and `activeCount`.

## Best Practices
1. **Compression**: Always verify `compress: false` in `next.config.ts` when debugging SSE issues. Browsers buffer gzipped streams.
2. **Connection Usage**: Browsers have a limit (~6) on concurrent connections per domain. With dual streams per tab, this limit is reached quickly (3 tabs).
3. **Ghost Connections**: Hard reloads or unclosed tabs can leave "ghost" clients in the in-memory array until the server detects socket close.

## Development Tasks
- [x] Basic SSE implementation
- [x] Notification system
- [x] Dual stream refactor
