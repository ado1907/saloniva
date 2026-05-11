---
name: saloniva-app-builder
description: Build and extend the Saloniva beauty salon management app with consistent product quality, feature sequencing, Turkish business context, Expo React Native patterns, and Web/Android/iOS readiness. Use when working on this specific Saloniva project, continuing feature development, polishing flows, updating docs, or deciding the next implementation step.
---

# Saloniva App Builder

Use this skill to continue the Saloniva app with a consistent product and engineering standard.

## Product Direction

- Treat Saloniva as a premium beauty salon management product for Web, Android, and iOS.
- Prioritize practical business workflows over decorative pages.
- Keep the first experience usable: dashboard, calendar, customers, packages, payments, services, staff, reports, settings, booking, campaigns, inventory, and branches.
- Keep the app Turkish-first unless the user asks otherwise.
- Prefer demo-ready features that help sell the product: clear value, visible data, smooth interactions, and realistic salon scenarios.

## Implementation Order

1. Fix blockers that make the app fail to open.
2. Improve the current visible screen before expanding new modules.
3. Add one complete workflow at a time: screen, state, demo data, actions, empty/error states, and documentation.
4. Update `README.md`, `docs/product-roadmap.md`, or `docs/store-readiness.md` when the product surface changes.
5. Verify changed TypeScript/TSX files for syntax when full local commands are unavailable.

## Code Rules

- Follow the existing Expo React Native structure.
- Use the central store in `src/state/SalonStore.tsx` for shared demo state.
- Use existing theme files in `src/theme/` for colors, radius, typography, and spacing.
- Keep components reusable only when reuse is real.
- Avoid risky dependency upgrades unless needed to unblock the app.
- Do not reset user data or remove user changes without explicit approval.

## Quality Bar

- Every new feature should be demonstrable from the UI.
- Forms should have sensible defaults, labels, and success feedback.
- Lists should include filtering or clear grouping when useful.
- Mobile layout must remain usable with bottom navigation.
- Web layout must remain professional with the sidebar.
