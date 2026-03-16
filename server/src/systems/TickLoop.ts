export class TickLoop {
  private tickRate: number;
  private tickInterval: NodeJS.Timeout | null = null;
  private lastTickTime = 0;
  private tickCallbacks: Array<() => void> = [];

  constructor(tickRate: number = 20) {
    this.tickRate = tickRate;
  }

  start(): void {
    if (this.tickInterval) return;

    this.lastTickTime = Date.now();
    this.tickInterval = setInterval(() => {
      const now = Date.now();
      this.lastTickTime = now;

      // Call all registered callbacks
      this.tickCallbacks.forEach(callback => callback());
    }, 1000 / this.tickRate);
  }

  stop(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  registerCallback(callback: () => void): void {
    this.tickCallbacks.push(callback);
  }

  getTickRate(): number {
    return this.tickRate;
  }

  getCurrentTickTime(): number {
    return this.lastTickTime;
  }
}