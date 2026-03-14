# 3D Web FPS (Server-Authoritative) – Development Roadmap

## Core Constraints
- Browser-based (Three.js client)
- Node.js authoritative server
- WebSocket networking
- Hosted on Render (free tier) once stable
- No physics engine initially
- 20 tick rate target
- Start with 2 players → scale to 4 → optionally 10

---

# Phase 0 – Clean Foundation (Week 0)

## Goal
Create a minimal, stable architecture before adding gameplay.

## Tasks
- Create separate folders:
  - `/client`
  - `/server`
- Setup TypeScript for both
- Install `ws` in server
- Setup simple Vite (or equivalent) build for client
- Confirm client can connect to server locally

## Success Criteria
- Client connects
- Server logs connection
- Server can broadcast test message

---

# Phase 1 – Authoritative Movement (Week 1)

## Goal
Two players move in shared 3D space with server authority.

## Server Responsibilities
- Maintain player state:
  - position (x,y,z)
  - rotation (y-axis)
- Fixed tick loop (20 ticks/sec)
- Process input packets
- Broadcast world snapshots

## Client Responsibilities
- Capture input
- Send input to server
- Render based only on server snapshots

## DO NOT
- Do not send positions from client
- Do not allow client authority
- Do not add weapons yet

## Success Criteria
- Two browser windows
- Movement synchronized
- No major desync

---

# Phase 2 – Interpolation & Stability (Week 2)

## Goal
Make movement smooth and reduce jitter.

## Tasks
- Add client-side interpolation
- Add basic delta compression for snapshots
- Track ping (simple RTT measurement)

## Success Criteria
- Movement appears smooth under small latency
- No teleporting under normal conditions

---

# Phase 3 – Shooting System (Week 3)

## Goal
Add first weapon (hitscan).

## Implementation
- Client sends "fire" input
- Server performs raycast
- Server validates hit
- Server applies damage
- Server broadcasts hit event

## Keep It Simple
- Use bounding boxes
- No physics engine
- No bullet rigidbodies

## Success Criteria
- Players can damage each other
- Damage is server authoritative

---

# Phase 4 – Health, Death, Respawn (Week 4)

## Goal
Make the game loop playable.

## Tasks
- Health system
- Death state
- Respawn timer
- Basic scoreboard

## Success Criteria
- Playable 1v1 match

---

# Phase 5 – Second Weapon (Week 5)

## Add
- Slow projectile weapon
- Server-simulated projectile (simple position update)
- Explosion radius damage

## Still Avoid
- Full physics engine
- Complex collision systems

---

# Phase 6 – Scaling & Deployment (Week 6)

## Goal
Deploy stable build to Render.

## Tasks
- Optimize snapshot size
- Remove unnecessary fields
- Stress test with 4 players
- Deploy server to Render
- Deploy client to static hosting (Cloudflare Pages / similar)

## Success Criteria
- 4 players stable online
- Acceptable latency

---

# Phase 7 – Expansion (Optional)

Only after stable multiplayer:

- Add 10-player testing
- Add team deathmatch mode
- Improve map design
- Add basic animations
- Add basic sound

---

# Architecture Rules (Non-Negotiable)

1. Server is always authoritative
2. Client sends inputs, not positions
3. Add one system at a time
4. Never add physics engine until core loop is stable
5. Do not increase player count before stability

---

# Definition of "Playable MVP"

- 1 map
- 2 weapons
- 4 players
- Stable movement
- Server-side hit validation
- Respawn system

Nothing more.

---

# Risk Management

If multiplayer breaks:
- Stop adding features
- Fix architecture
- Reduce scope

If performance drops:
- Reduce tick rate
- Reduce snapshot frequency
- Simplify state payload

---

# Long-Term Path

After MVP is stable:
- Improve netcode (prediction + reconciliation)
- Add cosmetic polish
- Consider selective destructible props (state swap only)

Full physics-based destruction is NOT an early milestone.

