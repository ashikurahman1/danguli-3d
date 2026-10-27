/**
 * GameState.ts
 *
 * Explicit game state machine and types for Danguli 3D.
 * Pure TypeScript domain model independent of rendering or physics.
 */

export type GamePhase =
  | 'loading'
  | 'ready'
  | 'aiming'
  | 'charging'
  | 'striking'
  | 'inFlight'
  | 'resolving'
  | 'turnComplete'
  | 'paused'
  | 'gameOver'
  | 'error';

export interface ScoreRecord {
  turnIndex: number;
  distanceMeters: number;
  points: number;
  quality: 'miss' | 'fair' | 'good' | 'masterful';
}

export interface GameStatusSnapshot {
  phase: GamePhase;
  previousPhase?: GamePhase;
  currentTurn: number;
  totalTurns: number;
  score: number;
  lastTurnResult: ScoreRecord | null;
  errorMessage?: string;
}

/**
 * Valid state transitions mapping to prevent invalid jumps.
 */
export const VALID_TRANSITIONS: Record<GamePhase, readonly GamePhase[]> = {
  loading: ['ready', 'error'],
  ready: ['aiming', 'paused', 'gameOver', 'error'],
  aiming: ['charging', 'ready', 'paused', 'error'],
  charging: ['striking', 'aiming', 'paused', 'error'],
  striking: ['inFlight', 'resolving', 'error'],
  inFlight: ['resolving', 'error'],
  resolving: ['turnComplete', 'error'],
  turnComplete: ['ready', 'gameOver', 'error'],
  paused: ['ready', 'aiming', 'charging', 'striking', 'inFlight', 'resolving'],
  gameOver: ['ready', 'loading'],
  error: ['loading', 'ready'],
} as const;

export class GameStateManager {
  private phase: GamePhase = 'loading';
  private previousPhase?: GamePhase;
  private currentTurn = 1;
  private totalTurns = 5;
  private score = 0;
  private lastTurnResult: ScoreRecord | null = null;
  private errorMessage?: string;
  private readonly listeners = new Set<(snapshot: GameStatusSnapshot) => void>();

  constructor(initialPhase: GamePhase = 'loading') {
    this.phase = initialPhase;
  }

  public getPhase(): GamePhase {
    return this.phase;
  }

  public getSnapshot(): GameStatusSnapshot {
    return {
      phase: this.phase,
      previousPhase: this.previousPhase,
      currentTurn: this.currentTurn,
      totalTurns: this.totalTurns,
      score: this.score,
      lastTurnResult: this.lastTurnResult,
      errorMessage: this.errorMessage,
    };
  }

  public canTransitionTo(nextPhase: GamePhase): boolean {
    if (this.phase === nextPhase) return true;
    const allowed = VALID_TRANSITIONS[this.phase];
    return allowed.includes(nextPhase);
  }

  public transitionTo(nextPhase: GamePhase, errorMessage?: string): boolean {
    if (this.phase === nextPhase) {
      return true;
    }

    if (!this.canTransitionTo(nextPhase)) {
      console.warn(`[GameState] Invalid state transition: ${this.phase} -> ${nextPhase}`);
      return false;
    }

    this.previousPhase = this.phase;
    this.phase = nextPhase;
    this.errorMessage = errorMessage;
    this.notify();
    return true;
  }

  public pause(): boolean {
    if (this.phase === 'paused' || this.phase === 'gameOver' || this.phase === 'loading') {
      return false;
    }
    this.previousPhase = this.phase;
    this.phase = 'paused';
    this.notify();
    return true;
  }

  public resume(): boolean {
    if (this.phase !== 'paused' || !this.previousPhase) {
      return false;
    }
    this.phase = this.previousPhase;
    this.previousPhase = 'paused';
    this.notify();
    return true;
  }

  public recordTurnScore(record: ScoreRecord): void {
    this.lastTurnResult = record;
    this.score += record.points;
    this.notify();
  }

  public nextTurn(): boolean {
    if (this.currentTurn >= this.totalTurns) {
      this.transitionTo('gameOver');
      return false;
    }
    this.currentTurn += 1;
    this.lastTurnResult = null;
    this.transitionTo('ready');
    return true;
  }

  public reset(): void {
    this.phase = 'ready';
    this.previousPhase = undefined;
    this.currentTurn = 1;
    this.score = 0;
    this.lastTurnResult = null;
    this.errorMessage = undefined;
    this.notify();
  }

  public subscribe(listener: (snapshot: GameStatusSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }
}
