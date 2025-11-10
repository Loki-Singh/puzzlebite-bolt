# Puzzle Portal Transitions

This directory contains the portal-style transition animations that create immersive navigation experiences throughout the app.

## Components

### 1. PortalTransition

A circular portal animation with concentric rings that creates the feeling of entering a new dimension.

**Usage:**
```tsx
import { PortalTransition } from '@/components/transitions/PortalTransition';

<PortalTransition
  visible={showPortal}
  onAnimationComplete={() => console.log('Portal animation done')}
  type="open" // or "close"
  duration={800}
/>
```

**Props:**
- `visible`: boolean - Controls animation visibility
- `onAnimationComplete`: () => void - Callback when animation finishes
- `type`: 'open' | 'close' - Animation direction
- `duration`: number (optional) - Animation duration in ms (default: 800)

**Animation Details:**
- 3D rotation effect with perspective
- Concentric rings that expand/contract
- Smooth spring physics for natural feel
- Opacity transitions

### 2. PuzzlePieceTransition

Animates puzzle pieces that either assemble from scattered positions or scatter away.

**Usage:**
```tsx
import { PuzzlePieceTransition } from '@/components/transitions/PuzzlePieceTransition';

<PuzzlePieceTransition
  visible={showTransition}
  onAnimationComplete={() => router.push('/next-screen')}
  type="assemble" // or "scatter"
/>
```

**Props:**
- `visible`: boolean - Controls animation visibility
- `onAnimationComplete`: () => void - Callback when animation finishes
- `type`: 'assemble' | 'scatter' - Animation direction

**Animation Details:**
- 40 individual puzzle pieces (5x8 grid)
- Staggered timing (30ms delay per piece)
- Random positions and rotations
- Spring physics for natural movement
- Opacity fade in/out

## Current Implementation

### Category → Overview
Uses **PortalTransition** with `type="open"`
- Opens portal when category is selected
- Transitions to puzzle overview screen
- Creates feeling of entering category world

### Overview → Game
Uses **PuzzlePieceTransition** with `type="assemble"`
- Puzzle pieces fly in and assemble
- Transitions to game screen
- Represents puzzle being prepared

### Game → Success
Uses **PuzzlePieceTransition** with `type="assemble"`
- Pieces assemble to reveal reward
- Transitions to success screen
- Celebrates completion

## Technical Details

Built with:
- `react-native-reanimated` (native thread animations)
- Shared values for smooth 60fps performance
- Spring and timing animations
- 3D transforms (perspective, rotateY)
- Staggered delays for choreography

## Performance Considerations

- All animations run on native thread
- No blocking of JavaScript thread
- Optimized for mobile devices
- Tested on both iOS and Android

## Future Enhancements

Potential additions:
- Color customization based on category
- Sound effects integration
- Haptic feedback on transitions
- Additional transition types (fold, wipe, morph)
- Custom shapes beyond puzzle pieces
