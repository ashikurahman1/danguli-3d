/**
 * StrikingStick.ts
 *
 * Models the traditional "Danda" (long wooden striking stick):
 * - Authentically turned hardwood stick (~65cm long, ~3.5cm diameter).
 * - Smooth rounded grip base, slight taper, and sturdy striking head.
 * - Stance orientation and animation helpers.
 */

import * as THREE from 'three';
import { GAME_CONFIG } from '../core/GameConfig';

export class StrikingStick {
  public readonly group: THREE.Group;
  public readonly mesh: THREE.Mesh;
  private readonly geometry: THREE.BufferGeometry;
  private readonly material: THREE.Material;

  constructor() {
    this.group = new THREE.Group();
    const { stick } = GAME_CONFIG.dimensions;
    const halfLen = stick.length / 2;

    // Lathe profile for a sculpted wooden danda
    const points: THREE.Vector2[] = [
      new THREE.Vector2(0, -halfLen), // Rounded handle pommel
      new THREE.Vector2(stick.radius * 0.9, -halfLen + 0.015),
      new THREE.Vector2(stick.radius * 0.85, -halfLen * 0.6), // Handle grip area
      new THREE.Vector2(stick.radius * 0.95, -halfLen * 0.2), // Transition shoulder
      new THREE.Vector2(stick.radius, halfLen * 0.7), // Striking shaft
      new THREE.Vector2(stick.radius * 0.9, halfLen - 0.01), // Striking head taper
      new THREE.Vector2(0, halfLen), // Rounded tip
    ];

    this.geometry = new THREE.LatheGeometry(points, 32);

    this.material = new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.woodStick,
      roughness: 0.6,
      metalness: 0.06,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.group.add(this.mesh);

    this.setReadyStance();
  }

  /**
   * Sets the stick into an observational / ready stance poised near the pit.
   */
  public setReadyStance(): void {
    // Stick angled down toward the guli resting near the pit
    this.group.position.set(-0.25, 0.22, 0.15);
    this.group.rotation.set(0.4, -0.6, -0.8);
  }

  public setPosition(x: number, y: number, z: number): void {
    this.group.position.set(x, y, z);
  }

  public setRotation(x: number, y: number, z: number): void {
    this.group.rotation.set(x, y, z);
  }

  public dispose(scene?: THREE.Scene): void {
    if (scene) {
      scene.remove(this.group);
    }
    this.geometry.dispose();
    this.material.dispose();
  }
}
