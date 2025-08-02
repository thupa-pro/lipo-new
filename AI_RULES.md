# AI Development Rules for Loconomy

This document defines the core technologies and engineering guidelines for Loconomy. Following these rules ensures consistency, maintainability, performance, and security across the codebase—reflecting top-tier engineering standards.

## Core Principles

- **Simplicity:** Favor clear, concise solutions; avoid unnecessary complexity.
- **Performance:** Optimize for speed and responsiveness at every layer.
- **Security:** Proactively address security risks; assume nothing is secure by default.
- **Accessibility:** Provide inclusive experiences for all users.
- **Reliability:** Implement robust error handling and design for high availability.
- **Scalability:** Architect for growth without major rework.
- **Maintainability:** Write self-documenting, consistent code that’s easy to debug and enhance.
- **Testing:** Practice comprehensive testing (unit, integration, E2E).
- **Pragmatism:** Avoid over-engineering and premature optimization.

## Tech Stack

- **Frontend:** Next.js (React, App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS (utility-first, only custom CSS for global or animation use)
- **UI Components:** shadcn/ui (Radix UI-based), extended in `components/` if needed
- **Database:** Supabase (PostgreSQL)
- **AI:** Google Generative AI (Gemini), via server API routes only
- **Payments:** Stripe (`@stripe/react-stripe-js` on frontend, `stripe` Node.js library on backend)
- **Icons:** lucide-react
- **State:** React hooks (`useState`, `useEffect`, `useContext`, `useCallback`)
- **Animations:** Custom CSS classes and utility components

## Library & Implementation Guidelines

### UI Components

- Always use `components/ui/` (shadcn/ui) for UI elements.
- Do not modify `components/ui/` directly; wrap or extend in `components/` as needed.
- Compose complex UIs from existing components wherever possible.

### Styling

- Use Tailwind utility classes exclusively.
- Only add custom CSS for global styles (`app/globals.css`) or non-utility animations.
- Avoid inline styles unless for dynamic, computed values not possible in Tailwind.
- Use Tailwind’s responsive prefixes for mobile-first design.
- Use Tailwind’s dark mode and `ThemeProvider` for theming.

### Icons

- Use `lucide-react` for all icons.
- Ensure consistent size and styling for icons throughout the application.

### AI Interactions

- All AI calls must be made in Next.js API routes (`app/api/ai/`) using `@google/generative-ai`.
- Never expose API keys to the client.
- Design, version, and if appropriate, A/B test prompts for clarity and effectiveness.
- Optimize token usage; select models (`gemini-2.0-flash-exp` for speed, `gemini-pro` for complex tasks) based on requirements.
- Implement robust error handling, including retries and graceful degradation.

### Database

- Use `@supabase/supabase-js` for all database operations.
- Centralize logic in `lib/supabase.ts` or `lib/database.ts`.
- Enforce Row Level Security (RLS) on all relevant tables.
- Create and maintain appropriate indexes; avoid N+1 queries.
- Use transactions for multi-step operations.

### Payments

- Use Stripe libraries as specified; never handle card data directly.
- Secure webhooks and ensure all payment operations are idempotent.

### Routing

- Use Next.js file-system-based routing in the `app/` directory.
- Use `next/navigation`’s `useRouter` and `next/link` for client-side navigation.
- Prefer Server Components for data fetching and static/server-rendered content.
- Use dynamic routes (`[slug]`) as needed.
- Protect sensitive routes with robust authentication and authorization.

### Notifications

- Use the `useToast` hook and provided UI components for all user notifications.
- Maintain a consistent tone and style in messaging.

### Animations

- Use custom CSS classes (e.g., `animate-fadeInDown`) and utility components.
- Ensure animations are smooth and avoid layout shifts.

## Code Standards

### TypeScript

- Enable strict mode.
- Explicitly type all functions, arguments, return values, and complex objects.
- Use interfaces for objects, types for unions/primitives.
- Avoid `any` unless absolutely necessary and well-documented.

### Linting & Formatting

- Use ESLint and Prettier; code must pass all lint checks before merging.
- Configure your IDE to format on save.

### Naming Conventions

- Components: `PascalCase` (e.g., `UserProfileCard`)
- Variables & functions: `camelCase`
- Folders: `kebab-case`; Component files: `PascalCase.tsx`
- Props: `camelCase`

### Component Structure

- One file per component or hook, regardless of size.
- Each component/hook should have a single, clear responsibility.
- Aim for <100 lines per component. Refactor large components.
- Define clear, well-typed props.
- Avoid prop drilling; use React Context if needed.

### Error Handling

- Use React Error Boundaries for the UI.
- Ensure all API routes return meaningful error messages and proper status codes.
- Implement structured logging for errors, both client and server, and integrate with a centralized logging service.
- Design features to degrade gracefully if services are unavailable.

### Environment Variables

- Store all secrets and sensitive data as environment variables.
- Use clear, consistent naming for env vars (e.g., `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).

### Documentation

- Use inline comments for complex or non-obvious logic.
- Document public functions and components with JSDoc.
- Maintain up-to-date README files for the project and modules.
- Document all API endpoints with inputs, outputs, and error codes.

### Testing

- Write unit tests for all critical functions, hooks, and components (Jest/React Testing Library).
- Implement integration tests for API routes and data flows.
- Use Playwright or Cypress for E2E tests on critical flows.
- Write testable code (pure functions, dependency injection).

## Deployment & Operations

### CI/CD

- All code must pass automated CI/CD pipelines (lint, test, build).
- Deployments to staging and production must be automated.

### Monitoring & Alerting

- Monitor performance (e.g., Lighthouse, Web Vitals, APM).
- Use error tracking services (e.g., Sentry) for production errors.
- Monitor system health and set up alerts for critical issues.

---

By adhering to these comprehensive rules, we ensure Loconomy is built with the highest standards of engineering excellence—delivering a reliable, secure, performant, and maintainable product.
