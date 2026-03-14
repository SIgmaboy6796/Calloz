import * as THREE from 'three';

// Basic Three.js setup - will be expanded in later phases
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app')?.appendChild(renderer.domElement);

camera.position.z = 5;

// WebSocket connection
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('WebSocket connection established');
  // Send a test message to the server
  ws.send(JSON.stringify({ type: 'test', message: 'Hello from client!' }));
};

ws.onmessage = (event) => {
  console.log('Received from server:', event.data);
  const data = JSON.parse(event.data);
  // Handle different message types
  if (data.type === 'welcome') {
    console.log('Welcome message from server:', data.message);
  } else if (data.type === 'echo') {
    console.log('Echo from server:', data.data);
  }
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// Simple animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

console.log('3D Web FPS Client initialized');