# Contributing to Danguli 3D

Thank you for your interest in contributing to **Danguli 3D**! We are committed to building an open, welcoming, and high-quality game preserving traditional heritage through modern web technology.

## 1. Development Prerequisites

- **Node.js**: v20+ or v24+ (see `.nvmrc`)
- **Package Manager**: `pnpm` (v10+ or v11+)
- **Git**

## 2. Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/danguli-3d.git
   cd danguli-3d
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start development server:

   ```bash
   pnpm dev
   ```

4. Run tests:

   ```bash
   pnpm test
   ```

5. Run linting and formatting check:

   ```bash
   pnpm lint
   pnpm format:check
   ```

6. Verify production build:
   ```bash
   pnpm build
   ```

## 3. Commit Message Guidelines

We follow Conventional Commits:

- `feat(scope): add new feature`
- `fix(scope): resolve bug`
- `test(scope): add or improve tests`
- `docs(scope): update documentation`
- `chore(scope): build tools, dependencies, or maintenance`

## 4. Pull Request Requirements

Before opening a PR, ensure:

- `pnpm test` passes without failures.
- `pnpm lint` and `pnpm format:check` pass.
- `pnpm build` completes with exit code 0.
- All new 3D assets or geometries have licenses documented in `docs/ASSETS.md`.
- No memory leaks or unmanaged event listeners are introduced.
