import { describe, it, expect } from 'vitest';
import { GAME_CONFIG } from './GameConfig';

describe('GAME_CONFIG', () => {
  it('defines valid positive physical dimensions for the game entities', () => {
    const { piece, stick, pit } = GAME_CONFIG.dimensions;

    // Piece specifications
    expect(piece.totalLength).toBeGreaterThan(0.05);
    expect(piece.totalLength).toBeLessThan(0.3);
    expect(piece.midRadius).toBeGreaterThan(piece.tipRadius);
    expect(piece.massKg).toBeGreaterThan(0.01);

    // Stick specifications
    expect(stick.length).toBeGreaterThan(piece.totalLength * 2);
    expect(stick.radius).toBeGreaterThan(0.01);
    expect(stick.massKg).toBeGreaterThan(0.1);

    // Pit specifications
    expect(pit.length).toBeGreaterThan(piece.totalLength);
    expect(pit.depth).toBeGreaterThan(0.01);
  });

  it('contains valid graphics and lighting parameters', () => {
    const { graphics } = GAME_CONFIG;

    expect(graphics.maxPixelRatio).toBeGreaterThanOrEqual(1.0);
    expect(graphics.fov).toBeGreaterThan(20);
    expect(graphics.fov).toBeLessThan(90);
    expect(graphics.near).toBeLessThan(graphics.far);
    expect(graphics.sunPosition).toHaveLength(3);
  });
});
