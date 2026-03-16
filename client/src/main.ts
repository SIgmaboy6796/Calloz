import { GameScene } from './scene';
import { InputManager } from './input';
import { NetworkClient } from './network';
import { InputState } from './types/game';

// Initialize game systems
const scene = new GameScene();
const inputManager = new InputManager();
const networkClient = new NetworkClient();

// Add the renderer to the DOM
document.getElementById('app')?.appendChild(scene.getDOMElement());

// Track local player state
let localPlayerId: string | null = null;
let localPlayerPosition = { x: 0, y: 0, z: 0 };
let localPlayerRotation = 0;

// Handle network events
networkClient.onConnect((playerId) => {
  localPlayerId = playerId;
  console.log('Local player ID:', localPlayerId);
  
  // Add local player to scene
  scene.addPlayer(localPlayerId, localPlayerPosition);
});

networkClient.onState((worldState) => {
  // Update all players in the scene
  worldState.players.forEach(player => {
    if (player.id === localPlayerId) {
      // Update local player position (for interpolation/prediction later)
      localPlayerPosition = player.position;
      localPlayerRotation = player.rotation;
    } else {
      // Update remote players
      if (scene.players.has(player.id)) {
        scene.updatePlayer(player.id, player.position, player.rotation);
      } else {
        // Add new remote player
        scene.addPlayer(player.id, player.position);
      }
    }
  });
  
  // Remove players that are no longer in the world state
  scene.players.forEach((_, id) => {
    if (!worldState.players.some(p => p.id === id)) {
      scene.removePlayer(id);
    }
  });
});

networkClient.onError((error) => {
  console.error('Network error:', error);
});

// Handle input
inputManager.registerCallback((inputState: InputState) => {
  // Send input to server
  networkClient.sendInput(inputState);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update scene
  scene.update();
}

animate();

console.log('3D Web FPS Client initialized with authoritative movement');