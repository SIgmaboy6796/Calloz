# 3D Web FPS

A browser-based, server-authoritative 3D first-person shooter built with Three.js and Node.js.

## Architecture

This project follows a clean separation between client and server:

- **Client**: Browser-based 3D rendering using Three.js
- **Server**: Node.js authoritative server using WebSocket for real-time communication

## Project Structure

```
3d-web-fps/
├── client/           # Browser-based 3D client
│   ├── src/
│   │   ├── main.ts
│   │   ├── components/
│   │   ├── utils/
│   │   └── types/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .gitignore
├── server/           # Node.js authoritative server
│   ├── src/
│   │   ├── index.ts
│   │   ├── handlers/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
├── docs/            # Documentation
│   ├── README.md
│   ├── ARCHITECTURE.md
│   └── DEVELOPMENT.md
├── .gitignore
├── .editorconfig
└── package.json
```

## Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 3d-web-fps
   ```

2. Install dependencies for both client and server:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

## Development

### Running the Client
```bash
cd client
npm run dev
```
The client will be available at `http://localhost:5173`

### Running the Server
```bash
cd server
npm run dev
```
The server will start on port 8080

### Running Both Simultaneously
For development, you'll need to run both client and server in separate terminals:

1. Terminal 1 (Client): `cd client && npm run dev`
2. Terminal 2 (Server): `cd server && npm run dev`

## Project Phases

### Phase 0 - Foundation (Current)
- Basic project structure
- TypeScript configuration
- Client-server communication
- Basic Three.js setup

### Phase 1 - Authoritative Movement
- Server-authoritative player state
- Fixed tick rate (20 ticks/sec)
- Basic movement controls
- Client-side input prediction

### Phase 2 - Game Mechanics
- Hit detection (hitscan)
- Health and damage system
- Basic weapons
- Score tracking

### Phase 3 - Polish
- Enhanced graphics
- Sound effects
- UI improvements
- Performance optimization

## Technologies

- **Client**: Three.js, Vite, TypeScript
- **Server**: Node.js, ws (WebSocket), TypeScript
- **Communication**: WebSocket for real-time data exchange

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.