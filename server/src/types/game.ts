// Shared type definitions for client and server

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface PlayerState {
  id: string;
  position: Vector3;
  rotation: number; // Y-axis rotation in radians
  health: number;
}

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sequence?: number; // Optional for future use
}

export interface WorldState {
  players: PlayerState[];
  timestamp: number;
}

export type MessageType = 'input' | 'state' | 'connect' | 'disconnect' | 'error';

export interface Message {
  type: MessageType;
  data?: any;
}