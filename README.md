# Next.js SSE Proof of Concept

A simple Proof of Concept demonstrating Server-Sent Events (SSE) in a Next.js application.

## Features

- **Server-Side**: API route (`/api/sse`) streaming events using `text/event-stream`.
- **Client-Side**: React component consuming events via `EventSource`.
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

The server sends a "Hello" message upon connection and then streams a JSON object with a timestamp every 5 seconds. The client listens for these messages and updates the list in real-time.
