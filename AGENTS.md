# AGENTS.md - Agent Coding Guidelines for Cyber Treasure Hunt

## Project Overview
This is a React + TypeScript + Vite web application for a cyber-themed escape room game. It uses Firebase for real-time multiplayer functionality and features powerups, attacks, and interactive gameplay.

## Build & Development Commands

### Core Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production (includes TypeScript compilation)
npm run preview      # Preview production build
npm run lint         # Run ESLint with TypeScript/React rules
```

### Testing
**No testing framework is currently configured.** To add testing:
- Install Jest/Vitest + React Testing Library
- Add test scripts to package.json
- Create __tests__ directories next to component files

### Single Test (when testing is added)
```bash
# If using Vitest:
npm test -- Game.test.tsx
npm test -- --run Game.test.tsx

# If using Jest:
npm test -- --testPathPattern=Game.test.tsx
```

## Code Style Guidelines

### TypeScript & React
- **Strict TypeScript**: All files must be properly typed (tsconfig.json has `"strict": true`)
- **React 18**: Use functional components with hooks
- **File Extensions**: Use `.tsx` for React components, `.ts` for utility files
- **Component Types**: Always type component props with interfaces

```typescript
// ✅ Correct
interface GameProps {
  uid: string;
  sessionId: string;
}

const Game: React.FC<GameProps> = ({ uid, sessionId }) => {
  // ...
};

// ❌ Avoid
const Game = ({ uid, sessionId }) => {
  // ...
};
```

### Imports & File Organization
- **Import Order**: React imports first, then third-party, then local files
- **Path Aliases**: Use `@/` alias for absolute imports (configured in tsconfig.json)
- **Named Exports**: Prefer named exports over default exports for components

```typescript
// ✅ Correct import order
import React, { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { LEVELS } from '@/levels';
import { GameProps } from '@/types';
import { TeamStatsHUD } from '@/components/TeamStatsHUD';
```

### Naming Conventions
- **Components**: PascalCase (e.g., `Game`, `TeamStatsHUD`)
- **Functions**: camelCase (e.g., `handleSubmitAnswer`, `advanceLevel`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `SUCCESS_MEME_VIDEOS`, `POWERUP_IDS`)
- **Interfaces**: PascalCase (e.g., `GameState`, `GameProps`)
- **Variables**: camelCase (e.g., `gameState`, `currentLevel`)

### State Management
- **React State**: Use `useState` for component state, `useEffect` for side effects
- **Firebase State**: Use Firebase Realtime Database with `onValue` listeners
- **State Updates**: Use functional updates for derived state

```typescript
// ✅ Correct state patterns
const [gameState, setGameState] = useState<GameState | null>(null);

// Firebase listener
useEffect(() => {
  const sessionRef = ref(db, `game_sessions/${sessionId}`);
  const unsubscribe = onValue(sessionRef, (snapshot) => {
    setGameState(snapshot.val());
  });
  
  return () => unsubscribe();
}, [sessionId]);

// Functional update
setAnswer(prev => prev.trim());
```

### Error Handling
- **Firebase Errors**: Wrap Firebase operations in try-catch blocks
- **User Input**: Validate input before submission
- **Loading States**: Show loading indicators during async operations

```typescript
// ✅ Correct error handling
try {
  await signInAnonymously(auth);
} catch (error) {
  console.error("Error signing in anonymously:", error);
}

// ✅ Loading state
if (!uid) {
  return (
    <div className="min-h-screen bg-grid flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
```

### Styling Guidelines
- **Tailwind CSS**: Primary styling solution (loaded via CDN in index.html)
- **Custom Styles**: Use `<style>` tags in components for unique animations
- **Theme Colors**: Stick to cyber theme - cyan, blue, amber accents on dark backgrounds
- **Responsive Design**: Use Tailwind responsive classes (md:, lg:)

```typescript
// ✅ Styling patterns
<div className="bg-slate-900 border border-cyan-400/30 rounded-lg p-4">
  <h2 className="font-orbitron text-lg text-cyan-400 mb-2">TITLE</h2>
</div>
```

### Firebase Integration
- **Real-time Updates**: Use `onValue` listeners with cleanup
- **Database Updates**: Use `update()` for partial updates, `runTransaction()` for atomic operations
- **Authentication**: Anonymous authentication for players
- **Environment Variables**: Use Vite's `loadEnv()` for API keys

```typescript
// ✅ Firebase patterns
import { db } from '@/firebase';
import { ref, onValue, update, runTransaction } from 'firebase/database';

// Listener with cleanup
const sessionRef = ref(db, `game_sessions/${sessionId}`);
const unsubscribe = onValue(sessionRef, (snapshot) => {
  // Handle updates
});
return () => unsubscribe();

// Atomic transaction
runTransaction(ref(db, `game_sessions/${sessionId}`), (session) => {
  if (session) {
    // Modify session
  }
  return session;
});
```

### Component Structure
- **Functional Components**: Keep components pure and focused
- **Custom Hooks**: Extract complex logic to custom hooks (e.g., `useGameEngines`)
- **Prop Drilling**: Prefer context or custom hooks over deep prop drilling
- **Conditional Rendering**: Use ternary operators for simple conditions, extract to variables for complex logic

```typescript
// ✅ Component structure
interface GameEnginesProps {
  sessionId: string;
  amITypist: boolean;
  sortedPlayerIds: string[];
  level: number;
}

export const useGameEngines = ({ sessionId, amITypist, sortedPlayerIds, level }: GameEnginesProps) => {
  // Hook logic
  return { powerupBubble, secretPayload, powerups };
};
```

### Performance Considerations
- **React.memo**: Use for components that re-render unnecessarily
- **useMemo/useCallback**: Use for expensive computations and stable function references
- **Cleanup**: Always cleanup Firebase listeners and timers
- **Bundle Size**: Consider lazy loading for large components

### File Organization
```
src/
├── components/          # React components
│   ├── admin/          # Admin-related components
│   └── common/         # Reusable UI components
├── hooks/              # Custom React hooks
├── types.ts            # TypeScript interfaces
├── constants.ts        # Game constants and configuration
├── levels.ts           # Level definitions
├── powerups.ts         # Powerup definitions
├── firebase.ts         # Firebase configuration
└── App.tsx            # Main application component
```

## Additional Guidelines
- **Game Logic**: Keep game state synchronized between players using Firebase
- **Audio/Video**: Handle media files properly with loading states
- **Accessibility**: Add ARIA labels where appropriate
- **Security**: Never expose sensitive keys or tokens in client code
- **Console Logs**: Keep console logs minimal for production builds