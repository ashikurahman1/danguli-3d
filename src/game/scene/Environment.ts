/**
 * Environment.ts
 *
 * Models the South Asian rural outdoor playing ground:
 * - Natural dry compacted earth with subtle soil height variations.
 * - The traditional "Garti" (shallow trench/pit in the dirt).
 * - Boundary circle mark inscribed in white lime dust/chalk.
 * - Scattered dry ground stones/pebbles for natural depth.
 * - Golden afternoon atmospheric fog.
 */

import * as THREE from 'three';
import { GAME_CONFIG } from '../core/GameConfig';

export class Environment {
  public readonly group: THREE.Group;
  private readonly disposables: { dispose(): void }[] = [];

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    // Setup atmospheric fog
    const { graphics } = GAME_CONFIG;
    scene.fog = new THREE.Fog(graphics.fogColor, graphics.fogNear, graphics.fogFar);
    scene.background = new THREE.Color(graphics.fogColor);

    this.createGround();
    this.createPit();
    this.createBoundaryRing();
    this.createPebbles();
  }

  /**
   * Compacted dry earth ground with subtle vertex micro-variations.
   */
  private createGround(): void {
    const size = 50;
    const segments = 100;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    // Add subtle micro-elevation to break computer-flatness
    const pos = geometry.attributes.position;
    if (pos) {
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const distFromCenter = Math.sqrt(x * x + z * z);

        // Keep center playing pit area smooth, add gentle undulations further out
        if (distFromCenter > 0.6) {
          const wave =
            Math.sin(x * 0.4) * Math.cos(z * 0.4) * 0.04 + Math.sin(x * 1.5 + z * 1.2) * 0.015;
          pos.setY(i, wave);
        }
      }
      geometry.computeVertexNormals();
    }

    const material = new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.ground,
      roughness: 0.92,
      metalness: 0.05,
      flatShading: false,
    });

    const groundMesh = new THREE.Mesh(geometry, material);
    groundMesh.receiveShadow = true;
    this.group.add(groundMesh);

    this.disposables.push(geometry, material);
  }

  /**
   * The Garti (shallow dirt pit where the guli piece is positioned).
   */
  private createPit(): void {
    const { pit } = GAME_CONFIG.dimensions;

    // A shallow oval depression carved into the earth
    const pitGeo = new THREE.CylinderGeometry(pit.width * 0.8, pit.width * 0.5, pit.depth, 24);
    pitGeo.scale(pit.length / pit.width, 1, 1);

    const pitMat = new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.pitDark,
      roughness: 0.95,
      metalness: 0.02,
    });

    const pitMesh = new THREE.Mesh(pitGeo, pitMat);
    pitMesh.position.set(0, -pit.depth * 0.48, 0);
    pitMesh.receiveShadow = true;
    this.group.add(pitMesh);

    this.disposables.push(pitGeo, pitMat);
  }

  /**
   * Traditional chalk/lime powder ring marking the striker's circle.
   */
  private createBoundaryRing(): void {
    const ringRadius = 1.2;
    const ringGeo = new THREE.RingGeometry(ringRadius, ringRadius + 0.035, 64);
    ringGeo.rotateX(-Math.PI / 2);

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xeadbc8,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 0.003; // Slightly above ground to prevent z-fighting
    this.group.add(ringMesh);

    this.disposables.push(ringGeo, ringMat);
  }

  /**
   * Scattered small pebbles and dirt clumps for realistic South Asian ground detail.
   */
  private createPebbles(): void {
    const pebbleCount = 35;
    const pebbleGeo = new THREE.DodecahedronGeometry(0.015, 1);
    const pebbleMat = new THREE.MeshStandardMaterial({
      color: 0x77553b,
      roughness: 0.85,
      metalness: 0.1,
    });

    const instancedMesh = new THREE.InstancedMesh(pebbleGeo, pebbleMat, pebbleCount);
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;

    const dummy = new THREE.Object3D();
    const random = (min: number, max: number) => min + Math.random() * (max - min);

    let placed = 0;
    for (let i = 0; i < pebbleCount; i++) {
      const angle = random(0, Math.PI * 2);
      const radius = random(0.5, 4.0);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = random(0.5, 1.8);

      dummy.position.set(x, 0.008 * scale, z);
      dummy.rotation.set(random(0, Math.PI), random(0, Math.PI), random(0, Math.PI));
      dummy.scale.set(scale, scale * 0.7, scale);
      dummy.updateMatrix();

      instancedMesh.setMatrixAt(placed++, dummy.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    this.group.add(instancedMesh);

    this.disposables.push(pebbleGeo, pebbleMat, instancedMesh);
  }

  public dispose(scene: THREE.Scene): void {
    scene.remove(this.group);
    for (const item of this.disposables) {
      item.dispose();
    }
    this.disposables.length = 0;
  }
}
