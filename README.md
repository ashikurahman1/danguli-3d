# Danguli 3D (ডাংগুলি)

[![CI](https://github.com/your-username/danguli-3d/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/danguli-3d/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r174-black.svg)](https://threejs.org/)

An open-source, browser-based 3D game inspired by the traditional South Asian outdoor game of **Danguli** (ডাংগুলি, also known as _Gilli-Danda_ in Hindi/Urdu, _Dabanguli_ in Odia, and _Kitti-Pullu_ in Tamil).

The game is played with two handcrafted wooden implements: a short biconical wooden piece (**Guli**) and a longer striking stick (**Danda**). The player rests the Guli over or inside a small earthen pit (**Garti**), taps one of its tapered tips to pop it airborne, and strikes it forward across the field for distance.

---

## 📸 Milestone 1 Status & Preview

- **Phase**: Milestone 1 (Project Foundation & 3D Scene Architecture)
- **Status**: Complete & Verified
- **Features Active**:
  - Procedural authentic lathe geometry for both the biconical **Guli** and the turned **Danda** stick.
  - Natural South Asian rural ground environment: compacted dry earth with micro-elevation, the central **Garti** (pit), striker boundary ring, and scattered natural pebbles.
  - Directional sunlight with PCF soft contact shadows, warm golden hemisphere fill, and atmospheric distance haze.
  - Smooth orbital camera controller with drag rotation, zoom limits, and smooth damping.
  - Strict TypeScript domain state machine (`GameStateManager`) with transition validation and subscriptions.
  - Glassmorphic HUD overlay displaying current phase, turn counter, score, and real-time FPS meter.
  - Zero console errors, fully responsive design, and strict memory/resource cleanup.

---

## 🛠️ Technology Stack

- **Language**: TypeScript (Strict mode enabled)
- **3D Engine**: [Three.js](https://threejs.org/) (r174)
- **Application UI**: [React](https://react.dev/) (v19)
- **Physics Engine**: [`@dimforge/rapier3d-compat`](https://rapier.rs/)
- **State Engine**: Pure TypeScript domain state machine + [Zustand](https://github.com/pmndrs/zustand)
- **Build System**: [Vite](https://vitejs.dev/) (v6)
- **Unit Testing**: [Vitest](https://vitest.dev/) (v3) + Testing Library
- **Code Quality**: ESLint 9 (Flat Config) + Prettier
- **Package Manager**: `pnpm` (v11)

---

## 🚀 Quick Start

### Prerequisites

- Node.js `v20+` or `v24+`
- `pnpm` installed globally: `npm install -g pnpm`

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/your-username/danguli-3d.git
cd danguli-3d

# Install dependencies with lockfile
pnpm install

# Start local development server (http://localhost:3000)
pnpm dev
```

### Verification & Testing

```bash
# Run unit and integration tests
pnpm test

# Check TypeScript and build production bundle
pnpm build

# Run linter
pnpm lint

# Check code formatting
pnpm format:check

# Format files
pnpm format
```

---

## 🎮 Controls (Milestone 1)

- **Left Mouse Click + Drag**: Orbit camera around the pitch.
- **Scroll Wheel**: Smooth zoom in/out.
- **Reset View Button**: Re-centers camera to default striking angle.
- **About Danguli Button**: Opens traditional rules and project status overview.

---

## 🗺️ Project Roadmap

- [x] **Milestone 1 — Project Foundation & 3D Scene**:
  - Tooling, TypeScript strict mode, Three.js scene architecture, procedural models, lighting, ground pit, camera, and basic HUD.
- [ ] **Milestone 2 — Playable Physics Prototype**:
  - Rapier 3D rigid bodies, authentic physical collision parameters, strike impulse mechanics, trajectory, landing detection, and repeated turn resets.
- [ ] **Milestone 3 — Complete Core Game Loop**:
  - Full game state flow, traditional scoring rules, strike timing/power charge meter, turn progression, and interactive tutorial.
- [ ] **Milestone 4 — Visual & Audio Polish**:
  - Ground particle dust effects upon impact, authentic wood-strike audio, motion reduction accessibility setting, and performance profiling.
- [ ] **Milestone 5 — Open-Source Readiness**:
  - Full automated Playwright E2E suite, cross-browser verification, mobile touch gestures, and release deployment.

---

## 📜 Documentation & Contributing

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Asset Attributions & Licenses](docs/ASSETS.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)

---

## ⚖️ License

Distributed under the [MIT License](LICENSE). Built with respect for South Asian cultural heritage.
