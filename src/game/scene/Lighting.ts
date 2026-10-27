/**
 * Lighting.ts
 *
 * Configures natural outdoor lighting for the South Asian village pitch.
 * Includes directional sunlight with tuned soft shadows and warm hemisphere fill.
 */

import * as THREE from 'three';
import { GAME_CONFIG } from '../core/GameConfig';

export class LightingManager {
  public readonly ambientLight: THREE.AmbientLight;
  public readonly sunLight: THREE.DirectionalLight;
  public readonly hemisphereLight: THREE.HemisphereLight;

  constructor(scene: THREE.Scene) {
    const { graphics } = GAME_CONFIG;

    // Warm hemisphere light: golden sky from above, warm earth bounce from below
    this.hemisphereLight = new THREE.HemisphereLight(
      graphics.ambientLightColor,
      0x543c26, // Warm dark earth bounce
      graphics.ambientLightIntensity
    );
    scene.add(this.hemisphereLight);

    // Subtle ambient light
    this.ambientLight = new THREE.AmbientLight(graphics.ambientLightColor, 0.2);
    scene.add(this.ambientLight);

    // Directional sunlight casting crisp but soft contact shadows
    this.sunLight = new THREE.DirectionalLight(
      graphics.sunLightColor,
      graphics.sunLightIntensity
    );
    this.sunLight.position.set(
      graphics.sunPosition[0],
      graphics.sunPosition[1],
      graphics.sunPosition[2]
    );

    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = graphics.shadowMapSize;
    this.sunLight.shadow.mapSize.height = graphics.shadowMapSize;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 40;

    // Tight shadow frustum focused on the playing area (pit and striking radius)
    const shadowDistance = 3.5;
    this.sunLight.shadow.camera.left = -shadowDistance;
    this.sunLight.shadow.camera.right = shadowDistance;
    this.sunLight.shadow.camera.top = shadowDistance;
    this.sunLight.shadow.camera.bottom = -shadowDistance;
    this.sunLight.shadow.bias = -0.0005;
    this.sunLight.shadow.normalBias = 0.02;

    scene.add(this.sunLight);
    scene.add(this.sunLight.target);
  }

  public update(): void {
    // Light animations or time-of-day changes can be hooked here
  }

  public dispose(scene: THREE.Scene): void {
    scene.remove(this.ambientLight);
    scene.remove(this.sunLight);
    scene.remove(this.sunLight.target);
    scene.remove(this.hemisphereLight);

    this.sunLight.shadow.map?.dispose();
    this.ambientLight.dispose();
    this.sunLight.dispose();
    this.hemisphereLight.dispose();
  }
}
