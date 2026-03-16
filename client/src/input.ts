import { InputState } from './types/game';

export class InputManager {
  private inputState: InputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false
  };
  private callbacks: Array<(input: InputState) => void> = [];

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Keyboard events
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // Prevent default behavior for game keys
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    });
  }

  private handleKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.inputState.forward = true;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.inputState.backward = true;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.inputState.left = true;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.inputState.right = true;
        break;
      case ' ':
        this.inputState.jump = true;
        break;
    }
    this.notifyCallbacks();
  }

  private handleKeyUp(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.inputState.forward = false;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.inputState.backward = false;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.inputState.left = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.inputState.right = false;
        break;
      case ' ':
        this.inputState.jump = false;
        break;
    }
    this.notifyCallbacks();
  }

  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => callback(this.inputState));
  }

  registerCallback(callback: (input: InputState) => void): void {
    this.callbacks.push(callback);
  }

  getInputState(): InputState {
    return { ...this.inputState };
  }
}