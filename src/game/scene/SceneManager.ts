/**
 * SceneManager.ts
 *
 * Coordinates Three.js rendering, lighting, camera, environment, and entities.
 * Handles lifecycle, resize observations, and resource disposal.
 */

import * as THREE from 'three';
import { GAME_CONFIG } from '../core/GameConfig';
import { LightingManager } from './Lighting';
import { Environment } from './Environment';
import { CameraController } from './CameraController';
import { WoodenPiece } from '../entities/WoodenPiece';
import { StrikingStick } from '../entities/StrikingStick';

export interface SceneManagerOptions {
  container: HTMLElement;
  onFpsUpdate?: (fps: number) => void;
}

export class SceneManager {
  private readonly container: HTMLElement;
  private readonly scene: THREE.Scene;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly cameraController: CameraController;
  private readonly lighting: LightingManager;
  private readonly environment: Environment;

  public readonly woodenPiece: WoodenPiece;
  public readonly strikingStick: StrikingStick;

  private isRunning = false;
  private animationFrameId: number | null = null;
  private lastTime = 0;
  private frameCount = 0;
  private fpsAccumulator = 0;
  private readonly onFpsUpdate?: (fps: number) => void;
  private readonly resizeObserver: ResizeObserver;

  constructor(options: SceneManagerOptions) {
    this.container = options.container;
    this.onFpsUpdate = options.onFpsUpdate;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // Cap device pixel ratio for performance on high-DPI screens
    const dpr = Math.min(window.devicePixelRatio || 1, GAME_CONFIG.graphics.maxPixelRatio);
    this.renderer.setPixelRatio(dpr);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height);
    this.container.appendChild(this.renderer.domElement);

    // 3. Camera
    this.cameraController = new CameraController(this.container, width / height);

    // 4. Lighting & Environment
    this.lighting = new LightingManager(this.scene);
    this.environment = new Environment(this.scene);

    // 5. Game Entities
    this.woodenPiece = new WoodenPiece();
    this.scene.add(this.woodenPiece.mesh);

    this.strikingStick = new StrikingStick();
    this.scene.add(this.strikingStick.group);

    // 6. Resize handling
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.container);

    // Start render loop
    this.start();
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick(this.lastTime);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private tick = (currentTime: number): void => {
    if (!this.isRunning) return;

    const delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // FPS calculation
    this.frameCount++;
    this.fpsAccumulator += delta;
    if (this.fpsAccumulator >= 0.5) {
      const currentFps = Math.round(this.frameCount / this.fpsAccumulator);
      this.onFpsUpdate?.(currentFps);
      this.frameCount = 0;
      this.fpsAccumulator = 0;
    }

    // Gentle decorative idle float for the stick in ready stance
    const time = currentTime * 0.001;
    this.strikingStick.setPosition(
      -0.25 + Math.sin(time * 1.5) * 0.006,
      0.22 + Math.cos(time * 2.0) * 0.004,
      0.15 + Math.sin(time * 1.0) * 0.004
    );

    // Update camera damping
    this.cameraController.update();
    this.lighting.update();

    // Render frame
    this.renderer.render(this.scene, this.cameraController.camera);

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private handleResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.cameraController.setAspect(width / height);
    this.renderer.setSize(width, height);
  }

  public resetCamera(): void {
    this.cameraController.resetView();
  }

  public dispose(): void {
    this.stop();
    this.resizeObserver.disconnect();

    this.cameraController.dispose();
    this.lighting.dispose(this.scene);
    this.environment.dispose(this.scene);
    this.woodenPiece.dispose(this.scene);
    this.strikingStick.dispose(this.scene);

    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
