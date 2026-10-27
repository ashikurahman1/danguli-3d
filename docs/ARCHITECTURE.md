# Architecture — Danguli 3D

## 1. Architectural Principles

Danguli 3D is designed with strict separation of concerns to ensure predictability, testability, and high maintainability:

1. **Domain / Gameplay Rules**:
   - Written in pure TypeScript with zero dependencies on Three.js, React, or browser DOM APIs.
   - Fully testable in headless unit test runners (Vitest / Node.js).
   - Manages state machine (`loading`, `ready`, `aiming`, `charging`, `striking`, `inFlight`, `resolving`, `turnComplete`, `paused`, `gameOver`, `error`).
   - Owns scoring calculations, turn progression, and rules validation.

2. **Physics Engine (`@dimforge/rapier3d-compat`)**:
   - Runs fixed-timestep physics simulation with frame-time accumulation.
   - Simulates rigid body dynamics: mass, restitution, friction, aerodynamic drag, and collision impulses.
   - Detects rest state and collision events without coupling to render frame rates.

3. **Rendering Layer (`Three.js`)**:
   - Owns 3D scene graph, materials, shaders, shadows, lighting, and camera presentation.
   - Reads simulation states and interpolates visual transforms.
   - Does _not_ decide game scores or game state transitions.
   - Strictly manages resource lifecycle and GPU memory disposal.

4. **Input Management**:
   - Translates raw pointer (mouse/touch) and keyboard events into high-level semantic intent (`aim(angle)`, `charge(power)`, `strike()`).
   - Prevents accidental mobile browser scroll gestures during active play.

5. **User Interface (`React`)**:
   - Displays HUD, game mode options, instructions, scores, and accessibility settings.
   - Interfaces with the game via observable subscriptions and clean commands.

6. **Application Composition**:
   - Wires up subsystems at startup and cleans them up cleanly at shutdown.

---

## 2. Component Diagram

```
+--------------------------------------------------------+
|                      React UI Layer                    |
|           (App.tsx, HUD Overlays, Modals)              |
+---------------------------+----------------------------+
                            | Subscribes to snapshot
                            v
+--------------------------------------------------------+
|                Domain & State Engine                   |
|       (GameStateManager, ScoringRules, TurnManager)    |
+---------------------------+----------------------------+
                            | Commands & State
                            v
+---------------------------+----------------------------+
|             Scene / Simulation Coordinator             |
|                  (SceneManager.ts)                     |
+-------------+---------------------------+--------------+
              |                           |
              v                           v
+---------------------------+ +--------------------------+
|      Three.js Engine      | |     Rapier3D Physics     |
| (Lighting, Environment,   | | (RigidBodies, Colliders, |
|  WoodenPiece, Stick, Cam) | |  Timestep Accumulator)   |
+---------------------------+ +--------------------------+
```

---

## 3. Scale and Coordinate Conventions

- **Units**: SI Standard (1 unit = 1 meter).
- **Coordinate System**:
  - `+Y`: Up (vertical).
  - `X / Z`: Horizontal ground plane.
  - `(0, 0, 0)`: Center of the traditional ground pit (_Garti_).
- **Physical Specifications**:
  - Guli (Piece): ~12 cm length, 3 cm diameter, ~45 grams mass.
  - Danda (Stick): ~65 cm length, 3.5 cm diameter, ~380 grams mass.
  - Pit: ~16 cm length, 6 cm width, 2.5 cm depth.

---

## 4. Resource Disposal & Memory Safety

- All Three.js geometries, materials, textures, and shadow render targets must implement explicit `dispose()` methods.
- The `SceneManager` disconnects `ResizeObserver` instances and cancels `requestAnimationFrame` upon unmount.
- Subscriptions to `GameStateManager` return an unsubscribe callback invoked during React cleanup.
