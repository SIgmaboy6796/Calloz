import { Message, WorldState, InputState } from './types/game';

export class NetworkClient {
  private ws: WebSocket | null = null;
  private playerId: string | null = null;
  private connectCallbacks: Array<(id: string) => void> = [];
  private stateCallbacks: Array<(state: WorldState) => void> = [];
  private errorCallbacks: Array<(error: string) => void> = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private serverUrl: string = 'ws://localhost:3001') {
    this.connect();
  }

  private connect(): void {
    this.ws = new WebSocket(this.serverUrl);

    this.ws.onopen = () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('Disconnected from server');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    } else {
      this.errorCallbacks.forEach(cb => cb('Failed to reconnect to server'));
    }
  }

  private handleMessage(message: Message): void {
    switch (message.type) {
      case 'connect':
        this.playerId = message.data.id;
        console.log('Connected with player ID:', this.playerId);
        this.connectCallbacks.forEach(cb => cb(this.playerId!));
        break;
      case 'state':
        this.stateCallbacks.forEach(cb => cb(message.data as WorldState));
        break;
      case 'error':
        this.errorCallbacks.forEach(cb => cb(message.data));
        break;
      case 'disconnect':
        console.log('Server disconnected');
        break;
    }
  }

  sendInput(input: InputState): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'input',
        data: input
      }));
    }
  }

  onConnect(callback: (id: string) => void): void {
    this.connectCallbacks.push(callback);
  }

  onState(callback: (state: WorldState) => void): void {
    this.stateCallbacks.push(callback);
  }

  onError(callback: (error: string) => void): void {
    this.errorCallbacks.push(callback);
  }

  getPlayerId(): string | null {
    return this.playerId;
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}