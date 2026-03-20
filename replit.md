# Workspace

## Overview

This project is a pnpm monorepo using TypeScript, designed as a mobile app prototype for an AI financial coach. The primary goal is to prototype the user experience, interactions, and AI integration using React Native, with the explicit intention of converting it to Flutter. The prototype serves as a blueprint for a mobile engineer to implement using SoFi's Pacific Flutter component library.

The project features a full-stack architecture, including an Express API server, a PostgreSQL database with Drizzle ORM, and a React Native mobile client. Key capabilities include live AI chat, pre-built demo scenarios, a Memory Center for coach interactions, and a Goals Dashboard. The project emphasizes Flutter portability, ensuring that all design and implementation decisions facilitate a straightforward conversion.

## User Preferences

I prefer concise and accurate responses.
I want iterative development, with frequent, small updates.
Ask for my approval before making any major architectural changes or introducing new external dependencies.
Ensure all code is well-documented, especially concerning UI components, state management, and styling, to aid in Flutter conversion.
Prioritize using standard APIs and avoid web-specific features to maintain cross-platform compatibility.

## System Architecture

The project is structured as a pnpm workspace monorepo.

### UI/UX Decisions
- **Mobile Prototype:** Developed in Expo/React Native, designed for eventual Flutter conversion.
- **Color Scheme:** Utilizes SoFi brand colors (`#FAF8F5` for surface base, `#1A1919` for primary content) consistent with Figma specifications.
- **Typography:** Uses TT Norms font family (Regular, Medium, Bold) loaded via `expo-font`.
- **Layout and Spacing:** Explicitly defined values for `fontSize`, `lineHeight`, `gap` between elements, header bar height, input sizes, and `borderRadius` to ensure precise replication in Flutter.
- **Iconography:** Custom SVG icons with specified paths and fill colors (`#1A1919`).
- **Shadows:** Defined using native shadow properties (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation`) for Flutter `BoxShadow` mapping.

### Technical Implementations
- **Monorepo Tool:** pnpm workspaces.
- **Node.js:** Version 24.
- **TypeScript:** Version 5.9 with composite projects for efficient type-checking across packages.
- **API Framework:** Express 5.
- **Database:** PostgreSQL with Drizzle ORM.
- **Validation:** Zod (`zod/v4`) and `drizzle-zod`.
- **API Codegen:** Orval, generating React Query hooks and Zod schemas from an OpenAPI spec.
- **Build Tool:** esbuild for CJS bundles.

### Feature Specifications
- **AI Financial Coach:** Interactive chat interface using OpenAI via Replit AI Integrations proxy.
- **Chat Modes:** Supports "live" AI chat (default) and "demo" mode with mock data and pre-built scenarios.
- **Memory Center:** CRUD operations for managing coach memories.
- **Goals Dashboard:** Displays progress rings and milestones.
- **Message Rendering:** Employs a parse-render pipeline for chat message content, converting markdown into typed `ContentBlock[]` for extensible rendering.
- **Chat History Panel:** Slides in from the right, groups sessions by month, supports search, and displays session titles.
- **API Server (`@workspace/api-server`):** Handles API requests, including `/api/chat` for AI interaction, `/api/title` for auto-generating session titles, and `/api/healthz`. Includes in-memory rate limiting for the chat endpoint.
- **Database Layer (`@workspace/db`):** Manages database connection and Drizzle ORM schema.
- **API Specifications (`@workspace/api-spec`):** Contains the OpenAPI 3.1 spec and Orval configuration.
- **Generated API Clients (`@workspace/api-zod`, `@workspace/api-client-react`):** Provide Zod schemas and React Query hooks based on the OpenAPI spec.

## External Dependencies

- **OpenAI:** Integrated via Replit AI Integrations proxy for AI chat functionalities (GPT-4o-mini).
- **PostgreSQL:** Used as the primary database.
- **Express 5:** Web application framework for the API server.
- **Drizzle ORM:** Object-Relational Mapper for database interaction.
- **Zod:** Schema declaration and validation library.
- **Orval:** OpenAPI client code generator.
- **React Query:** For data fetching and caching in the React Native client.
- **Expo/React Native:** Mobile application development framework for the prototype.
- **`expo-font`:** For custom font loading in the mobile app.