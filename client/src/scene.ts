import { Vector3 } from './types/game';
import * as THREE from 'three';

export class GameScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private plane: THREE.Mesh;
  public players: Map<string, THREE.Mesh> = new Map();
  private localPlayerId: string | null = null;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Initial camera position (will be updated to follow player)
    this.camera.position.set(0, 1.6, 0); // Eye level for first-person

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create green plane
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x228B22, // Forest green
      side: THREE.DoubleSide
    });
    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.plane.rotation.x = -Math.PI / 2;
    this.plane.receiveShadow = true;
    this.scene.add(this.plane);

    // Add orientation objects
    this.addOrientationObjects();

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Handle window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  setLocalPlayer(id: string): void {
    this.localPlayerId = id;
  }

  addPlayer(id: string, position: Vector3): void {
    const geometry = new THREE.BoxGeometry(0.8, 3.5, 0.8);
    // Translate geometry so bottom is at origin (position will be at feet)
    geometry.translate(0, 1.75, 0);
    const material = new THREE.MeshStandardMaterial({ color: this.getPlayerColor(id) });
    const player = new THREE.Mesh(geometry, material);
    player.position.set(position.x, position.y, position.z);
    player.castShadow = true;
    // Hide local player mesh to avoid seeing own body in first-person
    if (id === this.localPlayerId) {
      player.visible = false;
    }
    this.scene.add(player);
    this.players.set(id, player);

    // If this is the local player, update camera immediately
    if (id === this.localPlayerId) {
      this.updateCamera();
    }
  }

  updatePlayer(id: string, position: Vector3, rotation: number): void {
    const player = this.players.get(id);
    if (player) {
      player.position.set(position.x, position.y, position.z);
      player.rotation.y = rotation;

      // If this is the local player, update camera to follow
      if (id === this.localPlayerId) {
        this.updateCamera();
      }
    }
  }

  removePlayer(id: string): void {
    const player = this.players.get(id);
    if (player) {
      this.scene.remove(player);
      this.players.delete(id);
    }
  }

  private updateCamera(inputState?: { mouseX: number; mouseY: number }): void {
    if (!this.localPlayerId) return;

    const localPlayer = this.players.get(this.localPlayerId);
    if (!localPlayer) return;

    // First-person camera: position at player's eye level
    this.camera.position.set(
      localPlayer.position.x,
      localPlayer.position.y + 3.2, // Eye level (player height is 3.5, bottom at y=0, eyes at ~3.2)
      localPlayer.position.z
    );

    
    // Camera rotation follows player's rotation (server-controlled)
    this.camera.rotation.y = localPlayer.rotation.y;

    // Apply pitch (vertical look) - limit to prevent flipping
    if (inputState) {
      this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, inputState.mouseY));
    }
  }

  private addOrientationObjects(): void {
    // Add trees
    const treePositions = [
      { x: 10, z: 10 }, { x: -15, z: 5 }, { x: 20, z: -10 },
      { x: -5, z: -20 }, { x: 12, z: 15 }, { x: -18, z: -8 }
    ];

    treePositions.forEach(pos => {
      // Tree trunk (brown cylinder)
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(pos.x, 1.5, pos.z);
      trunk.castShadow = true;
      this.scene.add(trunk);

      // Tree foliage (green cone)
      const foliageGeometry = new THREE.ConeGeometry(1.5, 2, 8);
      const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.set(pos.x, 3.5, pos.z);
      foliage.castShadow = true;
      this.scene.add(foliage);
    });

    // Add rocks
    const rockPositions = [
      { x: -10, z: 15 }, { x: 25, z: 5 }, { x: -20, z: -15 }
    ];

    rockPositions.forEach(pos => {
      const rockGeometry = new THREE.DodecahedronGeometry(1.5);
      const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      rock.position.set(pos.x, 0.75, pos.z);
      rock.castShadow = true;
      this.scene.add(rock);
    });

    // Add monoliths (orientation markers)
    const monolithPositions = [
      { x: 30, z: 30, color: 0xFF0000 }, { x: -30, z: -30, color: 0x0000FF },
      { x: 30, z: -30, color: 0xFFFF00 }, { x: -30, z: 30, color: 0xFF00FF }
    ];

    monolithPositions.forEach(pos => {
      const monolithGeometry = new THREE.BoxGeometry(2, 8, 2);
      const monolithMaterial = new THREE.MeshStandardMaterial({ color: pos.color });
      const monolith = new THREE.Mesh(monolithGeometry, monolithMaterial);
      monolith.position.set(pos.x, 4, pos.z);
      monolith.castShadow = true;
      this.scene.add(monolith);
    });
  }

  update(inputState?: { mouseX: number; mouseY: number }): void {
    // Always update camera to follow local player in first-person
    this.updateCamera(inputState);
    this.renderer.render(this.scene, this.camera);
  }

  getPlayerColor(id: string): number {
    // Simple deterministic color generator based on player ID
    const colors = [
      0xFF0000, // Red
      0x0000FF, // Blue
      0xFFFF00, // Yellow
      0xFFA500, // Orange
      0x800080, // Purple
      0xFFC0CB, // Pink
      0xA0522D, // Brown
      0x00FF00, // Green
      0x00FFFF, // Cyan
      0xF0E68C  // Khaki
    ];
    const hash = this.hashString(id);
    return colors[hash % colors.length];
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getDOMElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }
}