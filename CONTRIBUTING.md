# Contributing to Vertex Market

## Coding Standards
1. Use functional components and React Hooks exclusively.
2. Adhere to ESLint and Prettier rules setup in the project.
3. Keep components small, focused, and re-usable.

## Folder Structure
- **Components:** Place shared UI in `src/components/common`. Feature-specific UI goes into `src/components/[FeatureName]`.
- **Pages:** Top-level route components go into `src/pages`.

## Pull Requests
1. Create a feature branch from `main`.
2. Ensure `npm run build` and `npm run test` pass.
3. Write clear commit messages.
