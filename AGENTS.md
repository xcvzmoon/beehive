This project is based on [Nitro v3](https://nitro.build), [h3](https://h3.dev/), and [Rolldown](https://rolldown.rs/).

Refer to `node_modules/nitro/dist/docs/README.md` when working on server (your knowledge about Nitro v3 is likely outdated!).

## Project Structure

`server/` contains server-side code with supported subdirs (create as needed): `api/` (/api prefixed handlers), `routes/` (non-prefixed route handlers), `middleware/`, `plugins/`, `utils/`, `assets/`, and `tasks/`. `public/` holds static assets (copied, not bundled). Config files: `nitro.config.ts` (serverDir, routeRules, preset, etc.), `tsconfig.json`.

## Conventions

- Path alias `~/*` (tsconfig), use explicit `.ts` extensions

## Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Always use Vite+ commands in agent sessions. Do not run `pnpm`, `npm`, `yarn`, or `bun` directly for install/dev/build/test/lint/script tasks. Use these equivalents instead:

- install dependencies: `vp install`
- dev server: `vp dev`
- production build: `vp build`
- format/lint/type check: `vp check`
- tests: `vp test`
- package scripts: `vpr <script>`

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Coding Style/Instructions

- Prefer type-only imports with `import type`.
- Prefer `function` keyword over `const` in declaring functions.
- Never run database-related scripts `db:*`

## Editing Guidance

- Make the smallest correct change.
- Do not polish unrelated code.
- Do not remove correct comments or documentation.
- Do not rename broad parts of the codebase unless required.
- Do not expand a change into a repo-wide refactor unless necessary.
- Prefer leaving correct existing code in place.
- When touching production-sensitive code, prioritize reliability over clever abstractions.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vpr <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.
