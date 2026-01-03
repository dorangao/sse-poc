# Next.js SSE Proof of Concept

A Proof of Concept demonstrating Server-Sent Events (SSE) in a Next.js application, featuring a **Dual Stream Architecture**.

## Features

- **Dual Stream Architecture**:
  1.  **Data Stream** (`/api/sse`): Simulates a standard data feed (clock/counters).
  2.  **Notification Stream** (`/api/notifications`): Handles system presence (active users, join/leave events).
- **Client-Side**: React component consuming both streams simultaneously.
- **Configuration**: Adjusted `next.config.ts` to disable compression (crucial for local SSE development).

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open the app**:
   Visit [http://localhost:3000](http://localhost:3000).

## How it works

### Data Stream
- **Endpoint**: `/api/sse`
- **Behavior**: Sends a "Hello" handshake and then streams a simple JSON object with a message and timestamp.
- **Client Handling**: Updates the "Server Events" list.

### Notification Stream
- **Endpoint**: `/api/notifications`
- **Behavior**: Tracks connected clients in-memory. Broadcasts `user-connected` and `user-disconnected` events to all clients.
- **Client Handling**: Updates the "Active Clients" count and adds "User joined/left" logs to the Notifications list.

## Troubleshooting
If you don't see events:
- Ensure `compress: false` is set in `next.config.ts` (Next.js/Turbopack gzip buffering breaks SSE).
- Check standard output for server logs ("SSE client connected").
