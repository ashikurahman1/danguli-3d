import { describe, it, expect, beforeEach } from 'vitest';
import { GameStateManager } from './GameState';

describe('GameStateManager', () => {
  let manager: GameStateManager;

  beforeEach(() => {
    manager = new GameStateManager('ready');
  });

  it('initializes with the correct initial phase', () => {
    expect(manager.getPhase()).toBe('ready');
    const snapshot = manager.getSnapshot();
    expect(snapshot.phase).toBe('ready');
    expect(snapshot.score).toBe(0);
    expect(snapshot.currentTurn).toBe(1);
    expect(snapshot.totalTurns).toBe(5);
  });

  it('allows valid sequential state transitions', () => {
    expect(manager.transitionTo('aiming')).toBe(true);
    expect(manager.getPhase()).toBe('aiming');

    expect(manager.transitionTo('charging')).toBe(true);
    expect(manager.getPhase()).toBe('charging');

    expect(manager.transitionTo('striking')).toBe(true);
    expect(manager.getPhase()).toBe('striking');

    expect(manager.transitionTo('inFlight')).toBe(true);
    expect(manager.getPhase()).toBe('inFlight');

    expect(manager.transitionTo('resolving')).toBe(true);
    expect(manager.getPhase()).toBe('resolving');

    expect(manager.transitionTo('turnComplete')).toBe(true);
    expect(manager.getPhase()).toBe('turnComplete');
  });

  it('rejects invalid state transitions to prevent game corruption', () => {
    // Attempting to jump directly from 'ready' to 'inFlight' must fail
    expect(manager.transitionTo('inFlight')).toBe(false);
    expect(manager.getPhase()).toBe('ready');

    // Attempting to jump from 'ready' to 'striking' must fail
    expect(manager.transitionTo('striking')).toBe(false);
    expect(manager.getPhase()).toBe('ready');
  });

  it('handles pause and resume cleanly restoring the previous phase', () => {
    manager.transitionTo('aiming');
    expect(manager.getPhase()).toBe('aiming');

    expect(manager.pause()).toBe(true);
    expect(manager.getPhase()).toBe('paused');

    expect(manager.resume()).toBe(true);
    expect(manager.getPhase()).toBe('aiming');
  });

  it('correctly tracks scoring and turn advances', () => {
    manager.recordTurnScore({
      turnIndex: 1,
      distanceMeters: 14.5,
      points: 145,
      quality: 'good',
    });

    const snapshot = manager.getSnapshot();
    expect(snapshot.score).toBe(145);
    expect(snapshot.lastTurnResult?.distanceMeters).toBe(14.5);

    // Advance turn
    expect(manager.nextTurn()).toBe(true);
    expect(manager.getSnapshot().currentTurn).toBe(2);
    expect(manager.getSnapshot().phase).toBe('ready');
  });

  it('triggers gameOver when max turns are reached', () => {
    // Fast forward to turn 5
    for (let i = 1; i < 5; i++) {
      manager.nextTurn();
    }
    expect(manager.getSnapshot().currentTurn).toBe(5);

    // Next turn after turn 5 triggers gameOver
    const advanced = manager.nextTurn();
    expect(advanced).toBe(false);
    expect(manager.getPhase()).toBe('gameOver');
  });

  it('notifies subscribers on state updates and allows clean unsubscribe', () => {
    const states: string[] = [];
    const unsubscribe = manager.subscribe((snapshot) => {
      states.push(snapshot.phase);
    });

    manager.transitionTo('aiming');
    manager.transitionTo('charging');

    unsubscribe();
    manager.transitionTo('striking');

    // Should include initial ('ready'), 'aiming', 'charging' - but NOT 'striking'
    expect(states).toEqual(['ready', 'aiming', 'charging']);
  });
});
