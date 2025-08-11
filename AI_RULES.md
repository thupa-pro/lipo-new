# AI Development Rules for Loconomy - AGI-Enhanced Edition

This document defines the core technologies, engineering guidelines, and futuristic design standards for Loconomy's next-generation platform. Following these rules ensures consistency, maintainability, performance, security, and cutting-edge user experiences that set global standards in design and functionality.

## Core Principles - AGI Enhanced

- **Quantum Simplicity:** Favor elegant, intuitive solutions that hide complexity behind beautiful interfaces
- **Neural Performance:** Optimize for ultra-low latency and quantum-responsive experiences at every layer
- **AGI Security:** Proactively address security with AI-powered threat detection and quantum encryption
- **Universal Accessibility:** Provide inclusive experiences that exceed WCAG 3.0 standards
- **Quantum Reliability:** Implement AI-enhanced error handling and design for 99.99% availability
- **Neural Scalability:** Architect for exponential growth with AI-driven auto-scaling
- **AGI Maintainability:** Write self-documenting, AI-analyzable code that enhances over time
- **Quantum Testing:** Practice comprehensive testing with AI-powered test generation and validation
- **Future Pragmatism:** Avoid over-engineering while preparing for quantum computing integration

## Tech Stack - Futuristic Architecture

- **Frontend:** Next.js 15 (React 18+, App Router with concurrent features)
- **Language:** TypeScript (strict mode with AI-enhanced type checking)
- **Styling:** Tailwind CSS + Custom Design System (glassmorphism, neumorphism, holographic effects)
- **UI Components:** shadcn/ui + Custom AGI Components (neural loading, holographic text, AI cards)
- **Database:** Supabase (PostgreSQL with AI-enhanced queries)
- **AI/AGI:** Google Generative AI (Gemini Pro), Custom Neural Networks, Quantum-Enhanced Agents
- **Payments:** Stripe (quantum-secure transactions)
- **Icons:** lucide-react (with custom AGI-themed icons)
- **State:** React Quantum Hooks + AGI Context Providers
- **Animations:** Framer Motion + Custom Neural Animations + Quantum Transitions

## Library & Implementation Guidelines - AGI Standards

### UI Components - Futuristic Design System

- **Primary Components:** Use `components/ui/` (shadcn/ui) as foundation
- **AGI Components:** Extend with `components/admin/design-system/` for futuristic elements:
  - `GlassmorphicContainer` - Advanced glassmorphism with quantum effects
  - `AICard` - Neural-enhanced cards with confidence indicators
  - `HolographicText` - Text with holographic shimmer effects
  - `NeuralLoading` - AI-themed loading animations
  - `FuturisticMetrics` - Advanced metric displays with quantum styling
- **Composition Strategy:** Layer AGI components over base UI for enhanced experiences
- **Neural Responsiveness:** All components must adapt to user behavior and preferences

### Styling - Quantum Design Language

- **Base Framework:** Tailwind utility classes for rapid development
- **Custom Extensions:** Quantum gradients, neural animations, holographic effects
- **Glassmorphism Standard:** Use backdrop-blur, transparency layers, and glow effects
- **Color Palette:** Quantum-inspired gradients (blue→purple→pink transitions)
- **Typography:** Holographic text effects, neural weight variations
- **Spacing:** Quantum rhythm (8px base unit with fibonacci scaling)
- **Dark Mode:** Full quantum theme support with enhanced contrast

### AGI Icons & Visual Elements

- **Primary:** lucide-react for standard interface elements
- **AGI Enhancement:** Custom quantum-themed icons (Brain, Network, Sparkles)
- **Animation:** All icons support hover states and neural transitions
- **Consistency:** Maintain 24px standard with quantum scaling effects

### AI/AGI Interactions - Neural Network Standards

- **Architecture:** All AI calls through Next.js API routes with quantum security
- **Models:** Gemini-1.5-pro for complex reasoning, Gemini-2.0-flash for speed
- **Agents:** Four specialized AGI agents (Sophia, Marcus, Elena, Alex) with quantum personas
- **Prompting:** Quantum-enhanced prompts with confidence ratings and neural context
- **Error Handling:** Graceful degradation with fallback responses and retry logic
- **Token Optimization:** Smart context management and adaptive model selection

### Database - Quantum Data Management

- **Primary:** Supabase with `@supabase/supabase-js` for quantum-fast operations
- **Architecture:** Centralized logic in `lib/supabase/` with AI-enhanced queries
- **Security:** Quantum-level Row Level Security (RLS) on all sensitive tables
- **Performance:** AI-optimized indexes and predictive query caching
- **Transactions:** Atomic operations with neural consistency guarantees

### Payments - Quantum Commerce

- **Standard:** Stripe with quantum security enhancements
- **Security:** Never handle raw card data, quantum webhook verification
- **UX:** Frictionless flows with AI-powered fraud detection

### Routing - Neural Navigation

- **Architecture:** Next.js App Router with quantum page transitions
- **Navigation:** AI-enhanced routing with predictive preloading
- **Security:** Quantum authentication and neural authorization checks
- **Performance:** Edge-optimized routes with AI cache management

### Notifications - Neural Feedback

- **System:** Enhanced `useToast` with quantum animations and AI categorization
- **Design:** Glassmorphic notifications with neural importance scoring
- **Accessibility:** Screen reader optimization with quantum audio cues

### Animations - Quantum Motion

- **Primary:** Framer Motion for complex orchestrations
- **Neural:** Custom CSS classes for AI-themed animations (pulse, glow, shimmer)
- **Performance:** GPU-accelerated with quantum smoothness (60fps minimum)
- **Accessibility:** Respect motion preferences with quantum fallbacks

## Code Standards - AGI Excellence

### TypeScript - Quantum Type Safety

- **Mode:** Strict with AI-enhanced error detection
- **Typing:** Explicit types for all AGI interactions and quantum state
- **Interfaces:** Structured for AI components and neural data flows
- **Validation:** Runtime type checking for critical AGI operations

### Component Architecture - Neural Organization

- **Structure:** One component per file with quantum modularity
- **Size:** <100 lines ideal, refactor into neural microcomponents
- **Props:** Quantum-typed with AI behavior specifications
- **Hooks:** Custom hooks for AGI state and neural lifecycle management

### AGI Component Standards

```typescript
// Example AGI Component Structure
interface AGIComponentProps {
  aiInsight?: {
    title: string;
    description: string;
    confidence: number;
    status: 'active' | 'processing' | 'alert';
  };
  neuralAnimation?: boolean;
  quantumEffects?: 'subtle' | 'intense' | 'neon';
  className?: string;
}

export function AGIComponent({ 
  aiInsight, 
  neuralAnimation = true, 
  quantumEffects = 'subtle',
  className 
}: AGIComponentProps) {
  // Neural processing logic
  // Quantum state management
  // AGI behavior implementation
}
```

### Error Handling - Quantum Resilience

- **UI:** AGI-enhanced Error Boundaries with neural recovery
- **API:** Structured error responses with AI categorization
- **Logging:** Quantum-level monitoring with predictive error detection
- **Fallbacks:** Graceful degradation with AI-powered alternatives

### Environment - Quantum Configuration

- **Secrets:** Quantum-encrypted environment variables
- **AI Keys:** Secure storage with neural access patterns
- **Naming:** Clear, quantum-prefixed variables (e.g., `QUANTUM_AI_API_KEY`)

### Documentation - Neural Knowledge Base

- **Code:** JSDoc with AI behavior descriptions
- **Components:** Quantum interaction patterns and neural state explanations
- **APIs:** Full AGI endpoint documentation with confidence ratings
- **Architecture:** Neural network diagrams and quantum flow charts

### Testing - AGI Validation

- **Unit:** Jest/RTL with AI behavior simulation
- **Integration:** AGI workflow testing with neural state validation
- **E2E:** Playwright with quantum user journey simulation
- **AI Testing:** Specialized tests for agent responses and neural processing

## Deployment & Operations - Quantum Infrastructure

### CI/CD - Neural Pipeline

- **Validation:** AI-enhanced code review and quantum quality gates
- **Testing:** Automated AGI regression testing with neural validation
- **Deployment:** Zero-downtime with quantum rollback capabilities

### Monitoring - AGI Observability

- **Performance:** Quantum metrics with neural anomaly detection
- **Errors:** AI-categorized error tracking with predictive alerts
- **User Experience:** Neural user journey monitoring with quantum insights
- **AGI Health:** Agent performance monitoring with confidence tracking

## AGI Design Patterns - Quantum UX

### Glassmorphism Implementation
```css
.glassmorphic-base {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
```

### Neural Loading States
- Use `NeuralLoading` component for all AI operations
- Implement quantum progress indicators with confidence ratings
- Provide neural feedback for user actions

### Holographic Text Effects
- Apply `HolographicText` for important headings and CTAs
- Use quantum color transitions for emphasis
- Maintain readability while adding visual sophistication

### AI Confidence Indicators
- Always display confidence percentages for AI-generated content
- Use quantum progress bars and neural visual cues
- Color-code confidence levels (90%+ green, 70-89% amber, <70% red)

## Security - Quantum Protection

### AGI Security Standards
- All AI interactions must be server-side authenticated
- Implement quantum-level input validation for user queries
- Use neural pattern recognition for threat detection
- Apply AGI-enhanced rate limiting and abuse prevention

### Data Privacy - Neural Ethics
- Implement quantum anonymization for user data in AI training
- Provide transparent AI decision explanations
- Enable user control over AGI personalization settings
- Follow ethical AI guidelines for responsible development

---

By adhering to these quantum-enhanced comprehensive rules, we ensure Loconomy is built with the highest standards of AGI engineering excellence—delivering a reliable, secure, performant, and truly futuristic product that sets new global standards in user experience and artificial intelligence integration.

## Quick Reference - AGI Commands

```bash
# Component Generation
npx create-agi-component ComponentName

# Neural Testing
npm run test:neural

# Quantum Build
npm run build:quantum

# AGI Development
npm run dev:agi
```

*Last updated: Neural network sync completed - Quantum enhancement active*
