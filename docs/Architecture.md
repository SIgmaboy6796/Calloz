# 3D Web FPS – Final Architecture

## Objective
Create a small-scale, server-authoritative 3D FPS in the browser that prioritizes movement feel and clean graphics, within zero budget constraints.

---

## Client

**Framework:** Three.js

**Responsibilities:**
- Render 3D scene
- Capture player input (movement, firing)
- Interpolation of server snapshots for smooth movement
- Display UI (health, ammo, score)
- Apply post-processing and lighting effects for perceived visual quality
- Maintain low polygon count and optimized assets for performance

**Assets:**
- Use stylized GLTF/GLB models from Sketchfab or other sources
- Keep consistent art style
- Environment: simple map, basic skybox, limited props

**Visual Enhancements:**
- Directional and hemisphere lighting
- Tone mapping and sRGB encoding
- Bloom and subtle post-processing effects

---

## Server

**Framework:** Node.js + ws WebSocket library

**Responsibilities:**
- Maintain authoritative player state (position, rotation, health)
- Fixed tick loop (20–30 ticks/sec)
- Process player input packets (forward, backward, left, right, jump, fire)
- Validate hits using raycast (for hitscan) and apply damage
- Broadcast world state snapshots to all clients
- Enforce server authority; clients only send inputs, never positions

**Hosting:**
- Start locally for development
- Deploy to Render.com free tier once stable
- Consider Cloudflare Tunnel or ngrok for public testing if needed

---

## Networking Model

- Server-authoritative
- Clients send input objects with sequence numbers
- Server updates state per tick
- Server broadcasts compact snapshots of world state
- Simple delta compression to minimize bandwidth
- Interpolation on clients to smooth movement
- Avoid P2P; no client-side physics authority

**Packet Structure Example:**

Client → Server:
```json
{
  "input": {"forward": true, "left": false, "fire": false},
  "sequence": 102
}
```

Server → Client:
```json
{
  "players": [
    {"id":1, "position":{"x":0,"y":0,"z":0}, "rotationY":90, "health":100},
    {"id":2, "position":{"x":5,"y":0,"z":5}, "rotationY":180, "health":100}
  ]
}
```

---

## Game Mechanics Priority

1. Movement feel (identity focus)
2. Multiplayer synchronization (server authoritative)
3. Hitscan weapons (start with one, add second weapon later)
4. Respawn system
5. Basic score tracking
6. Visual polish (lighting, post-processing, assets)

**Do NOT add at this stage:**
- Physics engines (Cannon.js / Ammo.js)
- Destruction / ragdolls
- Multiple gamemodes beyond 1v1 or 2v2
- Large player counts (>4 for early phases)

---

## Phase-based Implementation Order

1. **Phase 0** – Clean foundation, local WebSocket connection
2. **Phase 1** – Authoritative movement
3. **Phase 2** – Interpolation & stability
4. **Phase 3** – Shooting system (hitscan)
5. **Phase 4** – Health, death, respawn
6. **Phase 5** – Second weapon, projectile type
7. **Phase 6** – Scaling & deployment on Render / static hosting
8. **Phase 7 (Optional)** – Cosmetic improvements, post-processing, map polish, limited environmental props

---

## Risk Management

- Keep scope locked: no feature creep
- Fix core movement/networking before adding graphics or weapons
- Limit player count until networking is stable
- Optimize snapshot size and tick rate to avoid lag
- Graphics are enhancements; they do not fix poor movement or desync issues

---

## Summary
This architecture maximizes:
- Movement feel and smoothness
- Multiplayer stability under zero-cost hosting
- Browser-based deployment
- Perceived graphics quality without overcomplicating the system

Focus on building a tight, polished, playable vertical slice before expanding features.

