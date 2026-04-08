# SoFi Coach Chat — Flutter Migration Prototype

## Overview
This project is a mobile app prototype for an AI financial coach, built with React Native (Expo) and an Express API server. The core purpose is to validate the user experience, AI interactions, and technical integration before a full migration to Flutter using SoFi's Pacific component library. It serves as a detailed blueprint for mobile engineers, focusing on Flutter portability by adhering strictly to standard React Native APIs. Key features include live AI chat (GPT-4o-mini), pre-built demo scenarios, a Memory Center for user context, a Goals Dashboard, and chat history management.

## User Preferences
- Concise and accurate responses
- Iterative development with frequent, small updates
- Approval required before major architectural changes or new external dependencies
- Well-documented code for Flutter conversion (UI components, state management, styling)
- Standard APIs only — cross-platform compatibility is critical
- Skip Playwright e2e testing — do not run automated browser tests

## System Architecture

### Monorepo Structure
The project is organized as a pnpm monorepo with an `api-server` (Express 5) and a `mobile` client (Expo/React Native).

### API Endpoints
- `/api/chat`: Non-streaming AI chat.
- `/api/chat/stream`: SSE-based token streaming for web clients.
- `/api/title`: Auto-generates conversation titles.
- `/api/healthz`: Health check endpoint.

### AI Configuration
- **Model:** GPT-4o-mini via Replit AI Integrations proxy.
- **System Prompt:** Dynamically constructed, including a base prompt, memory detection instructions, and user context.
- **Memory System — Three Tiers:** Driven by a Confidence × Sensitivity decision matrix. **Tier 1 (Auto-Save with Notification):** AI detects low-sensitivity, high-confidence facts (operational context, stylistic patterns, specific facts like income/location/accounts) and saves automatically via `[MEMORY_SAVE]`. A "Saved to memory" chip always appears on the message. Source: `IMPLICIT_CONFIRMED`. **Tier 2 (Propose — Ask for Permission):** AI detects core preferences (high-impact, changes future output) or sensitive data (high privacy risk, even if factual) via `[MEMORY_PROPOSAL]`. Client shows a confirmation card with Remember/Not now. Key rule: sensitivity overrides objectivity. Source: `IMPLICIT_CONFIRMED` after approval. **Tier 3 (Manual — User-Created):** User creates memories directly in the Memory Center UI. Source: `EXPLICIT`. Highest-confidence signal. Additionally, `[MEMORY_UPDATE]` corrects previously stored facts regardless of originating tier. Memories are categorized into: `ABOUT_ME` (life facts, accounts, situation), `PREFERENCES` (communication style, risk tolerance), `PRIORITIES` (goals, focus areas). A server-side fallback (`inferMissingMemoryActions`) detects personal info patterns when the AI fails to emit markers.
- **Member 360 Profile Conflict Detection:** When the user shares an objective fact (via `[MEMORY_SAVE]` for `ABOUT_ME`), the client checks it against the SoFi Member 360 backend profile. If the user's statement contradicts verified profile data, a `Member360ConflictCard` prompts "Update your profile to [value]?" with Update / Not now buttons. The Member 360 backend is currently mocked in `constants/member360.ts` with a simulated profile — replace `getMember360Profile()` with an API call to the real Member 360 service. Mock profile: income $115k, location Austin TX, age 31, employer Stripe, credit score 742, rent $2,100, single renter with SoFi Money/Invest/Credit Card.
- **Memory Deletion via Chat (GA):** Users can delete memories through natural conversation using phrases like "delete this memory", "forget this", "I don't want you to remember this", "erase that", etc. The system uses word-overlap scoring to find the best matching memory from the user's active memories. **Specific match:** If a matching memory is found, Coach shows the memory content and presents a `MemoryDeletionCard` with Delete/Keep it buttons (uses `MorphingProposalCard` with trash icon, morphs to "Memory deleted" chip on confirm). **No match:** Lists all active memories with numbered items and suggestion pills. **Bulk delete:** "Delete all memories" or "forget everything" clears all memories immediately with a "All memories deleted" chip. Implementation: `MemoryDeletion` type in `types.ts` (memoryId, memoryContent, confirmed, dismissed), `confirmMemoryDeletion`/`dismissMemoryDeletion` in `CoachContext.tsx`, deletion patterns in `aiResponse.ts`. The `__ALL__` sentinel memoryId handles bulk deletion. Demo: The "Memory System" scenario includes a deletion exchange where the user asks Coach to forget their 401k details.
- **Goal Proposal System:** Live AI-generated goal proposals via `[GOAL_PROPOSAL]` markers. Goal proposals create DRAFT goals in the Goals Center and send a system nudge in chat. Users confirm or dismiss from the "Suggested" section in Goals Center. Goals can be `EMERGENCY_FUND`, `DEBT_PAYOFF`, `SAVINGS_TARGET`, or `CUSTOM`.

### Streaming Architecture
A dual-path streaming approach ensures compatibility across web (SSE) and native mobile (full response then word-by-word reveal). Both paths aim for a progressive text reveal with a shared drain animation.
- **Web:** Uses `ReadableStream` for SSE, tokens are collected and then drained.
- **Native Mobile:** Receives full response, then drains word-by-word.
- **Shared UI:** A typing indicator (orb GIF with shimmer text) is displayed until content starts streaming, then replaced by the progressive text.

### Text Formatting & Parse-Render Pipeline
AI responses are processed through a pipeline in `MessageBubble.tsx` to ensure consistent rendering:
1. **Normalization:** Handles markdown variants and strips links/inline code.
2. **Classification:** Identifies headers, lists, and text blocks. Headers are converted to bold text; numbered lists become bullets.
3. **Block Creation:** Converts classified lines into `ContentBlock` types (`text`, `bullet`, `header`, `divider`).
4. **Inline Styling:** Formats bold text within blocks.
5. **Rendering:** Maps blocks to React Native components.
The system is designed to defensively handle varied AI output while guiding the AI to use specific formatting (e.g., bold for headers, bullet points only).

### Design Tokens & Theming
- **Dynamic Theme System:** `constants/theme.ts` defines `AppTheme` interface with `lightTheme` and `darkTheme` palettes using Pacific design system tokens. `context/ThemeContext.tsx` provides `ThemeProvider` (wraps `useColorScheme`) and `useTheme()` hook. All 18+ components use `useTheme()` — zero static `Colors` imports remain.
- **Theme Architecture:** Module-level style objects converted to factory functions (`getChipStyles(c)`, `getSafetyStyles(c)`) for theme-dependent lookup tables. Static layout styles remain in `StyleSheet.create`; color values applied as inline overrides `[styles.x, { color: colors.xxx }]`.
- **Key Dark Pacific Values:** `surfaceBase=#0a0a0a`, `surfaceElevated=#1a1919`, `contentPrimary=#faf8f5`, `contentBrand=#32b7d9`, `surfaceToast=#3d3d3c`.
- **Special Tokens:** `contentPrimaryInverse` (white in light / `#0a0a0a` in dark) for text on `contentPrimary` backgrounds. `borderSubtle` (rgba 8% opacity), `borderMedium` (rgba 20% opacity). `whiteOnDark` always white. Shadow/scrim values use `shadowColor`/`scrimHeavy`.
- **Typography:** Uses TT Norms font family (Regular, Medium, Bold) with defined sizes and line heights for body, headers, and labels.
- **Spacing & Layout:** Standardized padding, gaps, border-radii, and header heights.
- **Animations:** GPU-accelerated animations for streaming entrance, block fade-in, typing indicator shimmer, and dropdowns.
- **Design System Map:** `docs/DESIGN_SYSTEM_MAP.md` — comprehensive inventory of all tokens, components, icons, and patterns, mapped to Pacific design system equivalents for Flutter migration.
- **Pacific Color Mapper Skill:** `.agents/skills/pacific-color-mapper/SKILL.md` — authoritative hex lookup for all 181 Pacific semantic tokens, full primitive hex scales, CSS/TypeScript bootstrap, Figma MCP workflow. Source of truth for all Pacific color lookups.
- **Color Migration:** All prototype→Pacific mappings (with Tailwind flags), alpha/opacity primitives, and the surfaceEdge distinction are in `docs/DESIGN_SYSTEM_MAP.md` §1.1. Several prototype colors (success/warning/info) used Tailwind CSS hex values, NOT Pacific.

### Navigation & Routing
- **Home Screen (`app/index.tsx`):** SoFi Home — the app's entry point. Pixel-perfect implementation of the Figma design (node 425:34261). Features teal header with profile/Plus badge/bell, frosted "Ask Coach" pill, greeting carousel, account cards (Banking/Invest/Crypto), product shortcuts row, Coach insights section (Spending + Net Worth), and bottom tab bar.
- **Chat Screen (`app/chat.tsx`):** Coach Chat — presented as a modal (slide-from-bottom). Accessible via the "Ask Coach" pill on Home. ChevronDown icon in header dismisses back to Home. `beforeRemove` listener resets `activePanel` on gesture dismiss.
- **Route Config (`app/_layout.tsx`):** Stack with `index` (Home) and `chat` (modal presentation, vertical gesture enabled).

### Prototype Phase System (Task #27)
Three strictly separated layers for GA / Post-GA prototyping:

- **GA (phase1):** `app/`, `components/`, `context/`, `constants/` — the original expo-router-based codebase. Zero changes.
- **Post-GA (phase2):** `phase2/` — complete file clone of GA with all `@/` imports rewritten to relative paths within `phase2/`. Uses its own `Phase2NavContext` instead of expo-router. `Phase2Root.tsx` is the entry point, wrapping its own providers (Theme, Coach, Toast, Phase2Nav). Screens are plain React components, not expo-router routes.
- **Prototype control layer:** `prototype/PrototypeContext.tsx` (phase state + toggle) and `prototype/PhaseSwitcherFab.tsx` (draggable FAB with Pan+Tap gesture). Mounted at root layout level above both phases. FAB shows "Switch to GA" (teal) or "Switch to Post-GA" (dark) and is draggable to any position. Tap toggles between phases.

The `_layout.tsx` conditionally renders GA (expo-router Stack) or Post-GA (Phase2Root) based on `protoPhase` from PrototypeContext. Post-GA `PanelType` includes `'profile'` for future use.

**Post-GA Profile Drawer:** `phase2/components/ProfileDrawer.tsx` — slides in from the left when the user taps the profile icon on the Post-GA home screen. Matches the Figma design (node 427-35241): avatar placeholder, name/member-since, menu items (Membership & rewards, About me, My finances, Goals, Preferences, Documents, Referral), and bottom section (Settings, Log Out). Animated with reanimated `withTiming` slide + scrim fade. Closes on scrim tap or X button.

### Key Architectural Decisions
- **State Management:** Utilizes a single `CoachContext` with plain React context, prioritizing Flutter portability over external state libraries.
- **Panel System:** Full-screen overlay panels (MemoryCenter, GoalsDashboard, ChatHistory, SettingsPanel) managed via a `PanelType` enum.
- **Chat Memory Naming Convention:** All user-facing text uses "chat memory" / "chat memories" (never just "memory") to clearly communicate that this feature only affects the chat experience and does not automatically consume or modify memory outside of chat conversations.
- **Memory Privacy Mode:** 3-mode picker (`full` | `ask-first` | `off`) accessible from Settings panel. Controls whether AI receives chat memories, how saves are handled (auto vs proposal vs suppressed), and Memory Center display state. Goals are unaffected by chat memory mode.
- **Chat Sessions:** In-memory management of sessions, each with `id`, `title`, `messages`, `memories`, `goals`. Includes auto-generation of titles and a `sessionVersionRef` for concurrency.
- **Demo vs Live Mode:** Supports switching between pre-built demo scenarios and live AI interactions.

## External Dependencies
- **OpenAI:** Accessed via Replit AI Integrations proxy (GPT-4o-mini).
- **Express 5:** Backend API server framework.
- **Expo/React Native:** Frontend mobile application framework.
- **expo-font:** Custom font loading for React Native.
- **expo-asset:** Asset preloading (e.g., GIF for typing indicator).
- **react-native-reanimated:** For advanced animations, specifically color interpolation.
- **react-native-svg:** For custom SVG icon rendering.
- **expo-clipboard:** For copying AI response text to clipboard.
- **@expo/vector-icons (Feather):** Provides a library of standard icons.
- **pino/pino-http:** Logging for the API server.