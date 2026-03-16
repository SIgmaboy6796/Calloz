import { Vector3 } from './types/game';
import * as THREE from 'three';

export class GameScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private plane: THREE.Mesh;
  public players: Map<string, THREE.Mesh> = new Map();

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 20);
    this.camera.lookAt(0, 0, 0);

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

  addPlayer(id: string, position: Vector3): void {
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshStandardMaterial({ color: this.getPlayerColor(id) });
    const player = new THREE.Mesh(geometry, material);
    player.position.set(position.x, position.y, position.z);
    player.castShadow = true;
    this.scene.add(player);
    this.players.set(id, player);
  }

  updatePlayer(id: string, position: Vector3, rotation: number): void {
    const player = this.players.get(id);
    if (player) {
      player.position.set(position.x, position.y, position.z);
      player.rotation.y = rotation;
    }
  }

  removePlayer(id: string): void {
    const player = this.players.get(id);
    if (player) {
      this.scene.remove(player);
      this.players.delete(id);
    }
  }

  update(): void {
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