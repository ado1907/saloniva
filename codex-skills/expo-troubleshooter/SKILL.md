---
name: expo-troubleshooter
description: Diagnose and fix Expo, npm, React Native Web, Metro bundler, localhost, dependency, SDK mismatch, and browser preview issues. Use when the app will not start, localhost refuses connection, bundling fails, Expo Go mismatches SDK, npm is missing, or web/mobile commands fail.
---

# Expo Troubleshooter

Use this skill when an Expo app does not open or does not bundle.

## First Checks

1. Confirm whether the server is running.
2. If the browser says `localhost refused to connect`, explain that the web server is closed and needs to be started.
3. If Metro shows a syntax error, fix the file and line shown first.
4. If Expo asks for missing web dependencies, install only the required compatible package.
5. If Expo Go reports an SDK mismatch, explain that web can still work and mobile requires matching SDK or a development build.

## Common Commands

- Start web: `npm run web`
- Install packages: `npm install`
- Install Expo-compatible package: `npx expo install <package>`
- Stop server: `Ctrl+C`
- Open local web: `http://localhost:8081`

## Fixing Approach

- Treat the terminal error as the source of truth.
- Fix the first bundling error before chasing later messages.
- Avoid `npm audit fix --force` unless the user explicitly accepts breaking changes.
- Prefer compatible Expo versions over latest versions.
- After a fix, ask the user to refresh the browser or restart the server only when necessary.

## User Guidance

- Keep instructions short and non-technical first.
- Ask for the latest red error block when more information is needed.
- Distinguish web preview issues from Android/iOS device issues.
