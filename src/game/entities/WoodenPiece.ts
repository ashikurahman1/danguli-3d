/**
 * WoodenPiece.ts
 *
 * Models the traditional "Guli" (small biconical wooden piece):
 * - Crafted as a solid tapered spindle using a lathe profile.
 * - Accurate proportions: ~12cm total length, ~3cm center diameter, tapered conical ends.
 * - Hardwood shader material with realistic roughness and specular bounce.
 */

import * as THREE from 'three';
import { GAME_CONFIG } from '../core/GameConfig';

export class WoodenPiece {
  public readonly mesh: THREE.Mesh;
  private readonly geometry: THREE.BufferGeometry;
  private readonly material: THREE.Material;

  constructor() {
    const { piece } = GAME_CONFIG.dimensions;
    const halfLen = piece.totalLength / 2;
    const bodyHalfLen = piece.totalLength * 0.25; // Middle cylindrical portion

    // Lathe profile creating a seamless, authentic biconical spindle
    const points: THREE.Vector2[] = [
      new THREE.Vector2(0, -halfLen), // Bottom tip center
      new THREE.Vector2(piece.tipRadius, -halfLen), // Bottom tip radius
      new THREE.Vector2(piece.midRadius, -bodyHalfLen), // Body shoulder
      new THREE.Vector2(piece.midRadius, bodyHalfLen), // Top body shoulder
      new THREE.Vector2(piece.tipRadius, halfLen), // Top tip radius
      new THREE.Vector2(0, halfLen), // Top tip center
    ];

    this.geometry = new THREE.LatheGeometry(points, 32);
    // Orient horizontally by default (along X-axis)
    this.geometry.rotateZ(Math.PI / 2);

    this.material = new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.woodPiece,
      roughness: 0.55,
      metalness: 0.08,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.resetToPit();
  }

  /**
   * Positions the Guli resting naturally across the pit with a slight angle
   * characteristic of the traditional setup (ready for the strike).
   */
  public resetToPit(tiltAngleRad = 0.35): void {
    const { pit } = GAME_CONFIG.dimensions;
    // Position one end elevated above the lip of the pit
    this.mesh.position.set(0, pit.depth * 0.3, 0);
    this.mesh.rotation.set(0, 0, tiltAngleRad);
  }

  public setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }

  public setRotation(x: number, y: number, z: number): void {
    this.mesh.rotation.set(x, y, z);
  }

  public setQuaternion(x: number, y: number, z: number, w: number): void {
    this.mesh.quaternion.set(x, y, z, w);
  }

  public dispose(scene?: THREE.Scene): void {
    if (scene) {
      scene.remove(this.mesh);
    }
    this.geometry.dispose();
    this.material.dispose();
  }
}
