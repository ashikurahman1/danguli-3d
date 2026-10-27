/**
 * GameConfig.ts
 *
 * Central immutable configurations for Danguli 3D.
 * Simulation units are SI standard (1 unit = 1 meter, kilograms, seconds).
 */

export const GAME_CONFIG = {
  version: '0.1.0',
  title: 'Danguli 3D',

  /** Scale and Physical Specifications */
  dimensions: {
    /** The small biconical wooden piece (Guli / Gully) */
    piece: {
      totalLength: 0.12, // 12 cm
      midRadius: 0.015, // 3 cm diameter at center
      tipRadius: 0.003, // Tapered tips
      massKg: 0.045, // ~45 grams hardwood
    },
    /** The striking wooden stick (Danda) */
    stick: {
      length: 0.65, // 65 cm
      radius: 0.0175, // 3.5 cm diameter
      massKg: 0.38, // ~380 grams
    },
    /** The ground pit (Garti) in the dirt where guli rests */
    pit: {
      length: 0.16, // 16 cm
      width: 0.06, // 6 cm
      depth: 0.025, // 2.5 cm deep
    },
  },

  /** Graphics and Lighting Settings */
  graphics: {
    maxPixelRatio: 2.0,
    shadowMapSize: 2048,
    fov: 48,
    near: 0.05,
    far: 200,
    ambientLightColor: 0xffedd8,
    ambientLightIntensity: 0.65,
    sunLightColor: 0xfff4e0,
    sunLightIntensity: 1.8,
    sunPosition: [12, 18, 14] as const,
    fogColor: 0xd9ba9b,
    fogNear: 25,
    fogFar: 90,
  },

  /** Material Colors (Warm South Asian Clay / Earth / Hardwood) */
  palette: {
    ground: 0x826244,
    groundSubtle: 0x937050,
    pitDark: 0x543c26,
    woodStick: 0xb5824c,
    woodPiece: 0xc49058,
    woodGrainHighlight: 0xd8ab73,
    skyBackdrop: 0xecd7be,
  },
} as const;

export type GameConfig = typeof GAME_CONFIG;
