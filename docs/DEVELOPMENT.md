# Development Guidelines

## Project Overview

This is a browser-based, server-authoritative 3D FPS game built with Three.js and Node.js.

## Architecture

- **Client**: Three.js for 3D rendering, Vite for build tooling
- **Server**: Node.js with WebSocket for real-time communication
- **Communication**: JSON-based message passing over WebSockets

## Development Workflow

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Setup

1. Install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

2. Start development servers:
   ```bash
   # Terminal 1: Client
   cd client && npm run dev
   
   # Terminal 2: Server
   cd server && npm run dev
   ```

### Code Structure

#### Client (`/client/src/`)
- `main.ts`: Application entry point
- `components/`: Reusable UI components
- `utils/`: Helper functions
- `types/`: TypeScript type definitions

#### Server (`/server/src/`)
- `index.ts`: Server entry point
- `handlers/`: WebSocket message handlers
- `types/`: TypeScript type definitions
- `utils/`: Server utilities

## Communication Protocol

All client-server communication uses JSON messages with a `type` field:

```typescript
interface Message {
  type: string;
  [key: string]: any;
}
```

### Client to Server Messages
- `input`: Player movement and actions
- `connect`: Initial connection setup

### Server to Client Messages
- `state`: World state updates
- `event`: Game events (hits, deaths, etc.)
- `error`: Error messages

## Performance Guidelines

- Target 60 FPS on client
- Server tick rate: 20-30 ticks/sec
- Keep network messages small (< 1KB)
- Use object pooling for frequently created objects

## Testing

- Unit tests for utility functions
- Integration tests for client-server communication
- Manual testing for gameplay mechanics

## Deployment

- Development: Local development servers
- Production: Deploy server to Render.com, client to static hosting

## Debugging

- Use browser dev tools for client-side debugging
- Server logs for server-side issues
- Network tab to inspect WebSocket messages
- Performance profiling for optimization