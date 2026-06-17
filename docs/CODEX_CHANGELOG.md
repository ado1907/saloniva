# Codex Changelog

## 2026-05-20 - Store-ready MVP polish

### Changed
- Premium color system refreshed for a more luxury salon product feel.
- Shared `ActionButton`, `ScreenIntro` and `SummaryCard` components were polished with stronger hierarchy, tactile press feedback and premium card treatment.
- App metadata moved to `1.0.0` production-ready MVP baseline.
- Expo SDK compatibility was cleaned by aligning `react-native`, `@expo/vector-icons` and `@react-native-async-storage/async-storage` with Expo SDK 52 expectations.
- EAS build profiles added for Android APK, Android AAB, iOS production and iOS simulator builds.
- Premium plan screen rebuilt with Free, Pro and Business plans.
- README reorganized as a buyer/developer handoff document.
- Store listing drafts added in Turkish and English.
- Privacy policy draft added.
- Release checklist added.
- Build guide added.

### Files changed
- `README.md`
- `app.json`
- `eas.json`
- `package.json`
- `package-lock.json`
- `src/components/ActionButton.tsx`
- `src/components/ScreenIntro.tsx`
- `src/components/SummaryCard.tsx`
- `src/theme/colors.ts`
- `src/config/productConfig.ts`
- `src/screens/BillingScreen.tsx`
- `STORE_LISTING_TR.md`
- `STORE_LISTING_EN.md`
- `PRIVACY_POLICY_DRAFT.md`
- `RELEASE_CHECKLIST.md`
- `BUILD_GUIDE.md`
- `CODEX_CHANGELOG.md`

### Commands run
- `npm.cmd install --package-lock-only --ignore-scripts`
- `npx.cmd expo install --check`
- `npx.cmd expo install @expo/vector-icons@~14.0.4 @react-native-async-storage/async-storage@1.23.1 react-native@0.76.9`
- `npm.cmd run typecheck`
- `npm.cmd audit --audit-level=moderate`
- `npm.cmd audit fix`
- `npm.cmd run doctor`
- `Invoke-WebRequest http://localhost:8081`
- `git diff --check`

### Validation
- `npm run typecheck` passed.
- `npx expo install --check` passed after dependency alignment.
- `npm run doctor` passed with 17/17 checks.
- Local web preview responded with HTTP 200 on `http://localhost:8081`.
- `git diff --check` passed; only Windows LF-to-CRLF warnings were reported.

### Security scan note
- `npm audit fix` applied the safe non-breaking fix available through npm.
- Remaining `npm audit` findings are transitive Expo SDK 52 build/CLI-chain dependencies: `@xmldom/xmldom`, `postcss` and `tar` through Expo tooling.
- npm suggests `--force`, but that would upgrade Expo to SDK 55 and is a breaking framework migration. This was intentionally not applied in this MVP pass.
- Recommended production path: schedule an Expo SDK upgrade pass, then rerun `npm audit`, device QA and EAS builds.

### Remaining production risks
- Real App Store / Google Play screenshots still need to be captured on target devices.
- Privacy policy and terms need legal review before public release.
- Real subscription payment provider is planned but not fully connected.
- Final iOS and Android builds require Apple Developer and Google Play credentials.
- Real device QA is still required before publishing to stores.