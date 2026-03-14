import { WebSocketServer } from 'ws';

const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server started on port ${PORT}`);

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send a welcome message
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to 3D Web FPS server' }));

  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    
    // Echo back for now - will be replaced with proper game logic in later phases
    ws.send(JSON.stringify({ type: 'echo', data: message.toString() }));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});