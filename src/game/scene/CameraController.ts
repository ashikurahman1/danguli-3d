/**
 * CameraController.ts
 *
 * Smooth, responsive orbital camera for Danguli 3D:
 * - Orbit around the playing pit with pointer drag.
 * - Smooth lerp damping to eliminate harsh jumps.
 * - Distance zoom limits calibrated for player clarity.
 * - Proper event listener cleanup.
 */

import * as THREE from 'three';
import { GAME_CONFIG } from '../core/GameConfig';

export class CameraController {
  public readonly camera: THREE.PerspectiveCamera;
  private readonly target = new THREE.Vector3(0, 0.04, 0);

  // Spherical coordinates
  private spherical = new THREE.Spherical(1.5, Math.PI / 3.2, Math.PI / 4);
  private targetSpherical = new THREE.Spherical(1.5, Math.PI / 3.2, Math.PI / 4);

  private isDragging = false;
  private previousPointerX = 0;
  private previousPointerY = 0;

  private readonly domElement: HTMLElement;
  private readonly onPointerDownBound: (e: PointerEvent) => void;
  private readonly onPointerMoveBound: (e: PointerEvent) => void;
  private readonly onPointerUpBound: (e: PointerEvent) => void;
  private readonly onWheelBound: (e: WheelEvent) => void;

  constructor(domElement: HTMLElement, aspect: number) {
    this.domElement = domElement;
    const { graphics } = GAME_CONFIG;

    this.camera = new THREE.PerspectiveCamera(graphics.fov, aspect, graphics.near, graphics.far);

    this.onPointerDownBound = this.onPointerDown.bind(this);
    this.onPointerMoveBound = this.onPointerMove.bind(this);
    this.onPointerUpBound = this.onPointerUp.bind(this);
    this.onWheelBound = this.onWheel.bind(this);

    this.attachEventListeners();
    this.updateCameraPosition(true);
  }

  private attachEventListeners(): void {
    this.domElement.addEventListener('pointerdown', this.onPointerDownBound);
    window.addEventListener('pointermove', this.onPointerMoveBound);
    window.addEventListener('pointerup', this.onPointerUpBound);
    this.domElement.addEventListener('wheel', this.onWheelBound, { passive: true });
  }

  private onPointerDown(e: PointerEvent): void {
    // Only drag with primary pointer button
    if (e.button !== 0) return;
    this.isDragging = true;
    this.previousPointerX = e.clientX;
    this.previousPointerY = e.clientY;
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.previousPointerX;
    const deltaY = e.clientY - this.previousPointerY;
    this.previousPointerX = e.clientX;
    this.previousPointerY = e.clientY;

    const rotateSpeed = 0.005;
    this.targetSpherical.theta -= deltaX * rotateSpeed;
    this.targetSpherical.phi -= deltaY * rotateSpeed;

    // Constrain polar angle so camera doesn't go below ground or flip over top
    const minPhi = 0.2;
    const maxPhi = Math.PI / 2 - 0.06;
    this.targetSpherical.phi = Math.max(minPhi, Math.min(maxPhi, this.targetSpherical.phi));
  }

  private onPointerUp(): void {
    this.isDragging = false;
  }

  private onWheel(e: WheelEvent): void {
    const zoomSpeed = 0.0015;
    this.targetSpherical.radius += e.deltaY * zoomSpeed;

    const minRadius = 0.55;
    const maxRadius = 3.5;
    this.targetSpherical.radius = Math.max(
      minRadius,
      Math.min(maxRadius, this.targetSpherical.radius)
    );
  }

  public update(lerpFactor = 0.12): void {
    // Smooth lerp toward target spherical coordinates
    this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * lerpFactor;
    this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * lerpFactor;
    this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * lerpFactor;

    this.updateCameraPosition();
  }

  private updateCameraPosition(force = false): void {
    if (force) {
      this.spherical.copy(this.targetSpherical);
    }
    this.camera.position.setFromSpherical(this.spherical).add(this.target);
    this.camera.lookAt(this.target);
  }

  public setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  public resetView(): void {
    this.targetSpherical.set(1.5, Math.PI / 3.2, Math.PI / 4);
  }

  public dispose(): void {
    this.domElement.removeEventListener('pointerdown', this.onPointerDownBound);
    window.removeEventListener('pointermove', this.onPointerMoveBound);
    window.removeEventListener('pointerup', this.onPointerUpBound);
    this.domElement.removeEventListener('wheel', this.onWheelBound);
  }
}
