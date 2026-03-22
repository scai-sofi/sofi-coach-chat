# SoFi Coach Chat — Flutter Migration Prototype

## Overview
This project is a mobile app prototype for an AI financial coach, built with React Native (Expo) and an Express API server. The core purpose is to validate the user experience, AI interactions, and technical integration before a full migration to Flutter using SoFi's Pacific component library. It serves as a detailed blueprint for mobile engineers, focusing on Flutter portability by adhering strictly to standard React Native APIs. Key features include live AI chat (GPT-4o-mini), pre-built demo scenarios, a Memory Center for user context, a Goals Dashboard, and chat history management.

## User Preferences
- Concise and accurate responses
- Iterative development with frequent, small updates
- Approval required before major architectural changes or new external dependencies
- Well-documented code for Flutter conversion (UI components, state management, styling)
- Standard APIs only — cross-platform compatibility is critical

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
- **Memory System:** Live AI detection and saving of user context, with markers for auto-save (`[MEMORY_SAVE]`) and proposals (`[MEMORY_PROPOSAL]`). Memories are categorized (e.g., PREFERENCE, GOAL_RELATED) and can be confirmed or implicitly saved.

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

### Design Tokens
- **Color Palette:** Defines `surfaceBase`, `contentPrimary`, `contentBrand`, etc., for consistent theming.
- **Typography:** Uses TT Norms font family (Regular, Medium, Bold) with defined sizes and line heights for body, headers, and labels.
- **Spacing & Layout:** Standardized padding, gaps, border-radii, and header heights.
- **Animations:** GPU-accelerated animations for streaming entrance, block fade-in, typing indicator shimmer, and dropdowns.

### Key Architectural Decisions
- **State Management:** Utilizes a single `CoachContext` with plain React context, prioritizing Flutter portability over external state libraries.
- **Panel System:** Full-screen overlay panels (MemoryCenter, GoalsDashboard, ChatHistory) managed via a `PanelType` enum.
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
- **@expo/vector-icons (Feather):** Provides a library of standard icons.
- **pino/pino-http:** Logging for the API server.