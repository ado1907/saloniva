# Saloniva Build Guide

## 1. Requirements
- Node.js LTS or current stable Node installed
- npm installed
- Expo CLI through `npx expo`
- EAS CLI through `npx eas`
- Supabase project for cloud backend
- Apple Developer account for iOS builds
- Google Play Console account for Android release

## 2. Install
```bash
npm install
```

## 3. Environment
Create `.env` from `.env.example` and fill the public Supabase values:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
EXPO_PUBLIC_BACKEND_MODE=supabase
EXPO_PUBLIC_DEMO_SALON_ID=your-demo-salon-id
```

Never put `service_role` or `sb_secret` keys in the mobile app.

## 4. Local web preview
```bash
npm run web
```

If port 8081 is busy, Expo may ask for another port. Press `Y` and open the shown URL.

## 5. Type check
```bash
npm run typecheck
```

## 6. Android builds
Preview APK:

```bash
npm run build:android:apk
```

Production AAB:

```bash
npm run build:android:aab
```

## 7. iOS builds
Production iOS build:

```bash
npm run build:ios
```

Simulator build:

```bash
npm run build:ios:simulator
```

## 8. Supabase setup
1. Run `supabase/schema.sql` in the Supabase SQL editor.
2. Run `supabase/phase2-auth.sql` after the base schema.
3. In Authentication, configure email confirmation and redirect URLs.
4. Test two different salon accounts and confirm data separation.

## 9. Store preparation
- Publish privacy policy, terms, support and account deletion pages.
- Prepare screenshots for phone and tablet sizes.
- Confirm icon and splash assets.
- Test on real Android and iOS devices before submission.

## 10. Known production work
- Connect real payment provider.
- Finalize legal documents with a professional.
- Add crash analytics and monitoring.
- Prepare backup and incident response policy.