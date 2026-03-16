import { WebSocketServer, WebSocket } from 'ws';
import { Message, WorldState, InputState } from './types/game';
import { GameState } from './systems/GameState';
import { TickLoop } from './systems/TickLoop';

const PORT = parseInt(process.env.PORT || '3001', 10);

class GameServer {
  private wss: WebSocketServer;
  private gameState: GameState;
  private tickLoop: TickLoop;
  private clients: Map<WebSocket, string> = new Map(); // Maps WebSocket to player ID

  constructor() {
    this.wss = new WebSocketServer({ port: PORT });
    this.gameState = new GameState();
    this.tickLoop = new TickLoop(20); // 20 ticks per second

    this.setupWebSocket();
    this.setupTickLoop();

    console.log(`Game server running on port ${PORT}`);
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');

      // Create a new player
      const player = this.gameState.createPlayer();
      this.clients.set(ws, player.id);

      // Send initial connection confirmation with player ID
      this.send(ws, {
        type: 'connect',
        data: { id: player.id }
      });

      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        try {
          const message: Message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Failed to parse message:', error);
          this.send(ws, { type: 'error', data: 'Invalid message format' });
        }
      });

      // Handle disconnection
      ws.on('close', () => {
        const playerId = this.clients.get(ws);
        if (playerId) {
          this.gameState.removePlayer(playerId);
          this.clients.delete(ws);
          console.log(`Player ${playerId} disconnected`);
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  private setupTickLoop(): void {
    this.tickLoop.registerCallback(() => {
      this.tick();
    });
    this.tickLoop.start();
  }

  private tick(): void {
    // This is where server-side physics and game logic would run
    // For now, we just broadcast the current world state

    const worldState: WorldState = {
      players: this.gameState.getAllPlayers(),
      timestamp: this.tickLoop.getCurrentTickTime()
    };

    this.broadcast({
      type: 'state',
      data: worldState
    });
  }

  private handleMessage(ws: WebSocket, message: Message): void {
    const playerId = this.clients.get(ws);
    if (!playerId) return;

    switch (message.type) {
      case 'input':
        const input = message.data as InputState;
        // Process input with a fixed delta time (1/20 second)
        this.gameState.processInput(playerId, input, 1 / this.tickLoop.getTickRate());
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private send(ws: WebSocket, message: Message): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private broadcast(message: Message): void {
    const data = JSON.stringify(message);
    this.clients.forEach((_, ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  }
}

new GameServer();