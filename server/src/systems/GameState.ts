import { PlayerState, InputState } from '../types/game';

export class GameState {
  private players: Map<string, PlayerState> = new Map();
  private nextPlayerId = 1;

  createPlayer(): PlayerState {
    const id = (this.nextPlayerId++).toString();
    const player: PlayerState = {
      id,
      position: { x: 0, y: 0, z: 0 },
      rotation: 0,
      health: 100
    };
    this.players.set(id, player);
    return player;
  }

  removePlayer(id: string): void {
    this.players.delete(id);
  }

  getPlayer(id: string): PlayerState | undefined {
    return this.players.get(id);
  }

  getAllPlayers(): PlayerState[] {
    return Array.from(this.players.values());
  }

  processInput(id: string, input: InputState, deltaTime: number): void {
    const player = this.players.get(id);
    if (!player) return;

    // Movement speed in units per second
    const speed = 5;
    // Rotation speed in radians per second
    const rotationSpeed = 3;

    // Calculate movement direction based on input
    let direction = { x: 0, y: 0, z: 0 };

    if (input.forward) direction.z -= 1;
    if (input.backward) direction.z += 1;
    if (input.left) direction.x -= 1;
    if (input.right) direction.x += 1;

    // Normalize diagonal movement
    const magnitude = Math.sqrt(direction.x ** 2 + direction.z ** 2);
    if (magnitude > 0) {
      direction.x /= magnitude;
      direction.z /= magnitude;
    }

    // Apply movement
    player.position.x += direction.x * speed * deltaTime;
    player.position.z += direction.z * speed * deltaTime;

    // Apply rotation from mouse input
    player.rotation += input.mouseX * rotationSpeed * deltaTime;

    // Keep player on the plane (y=0)
    player.position.y = 0;
  }
}
