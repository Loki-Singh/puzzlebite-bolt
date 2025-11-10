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

### 3. MirrorFlipTransition

A cinematic 3D flip animation that rotates the screen like a mirror, revealing the next view on the back side.

**Usage:**
```tsx
import { MirrorFlipTransition } from '@/components/transitions/MirrorFlipTransition';

<MirrorFlipTransition
  visible={showTransition}
  onAnimationComplete={() => console.log('Flip complete')}
  duration={1000}
  colors={['#F75564', '#FFDEA3']}
/>
```

**Props:**
- `visible`: boolean - Controls animation visibility
- `onAnimationComplete`: () => void - Callback when animation finishes
- `duration`: number (optional) - Animation duration in ms (default: 1000)
- `colors`: [string, string] (optional) - Front and back face colors

**Animation Details:**
- 3D rotation with perspective (rotateY)
- Smooth flip from 0° → 90° → 180°
- Scale effect (zooms slightly during flip)
- Backface visibility handling
- Glint effect on mirror surface

### 4. ExplosionTransition

Puzzle pieces explode outward from center, then rebuild themselves back into place.

**Usage:**
```tsx
import { ExplosionTransition } from '@/components/transitions/ExplosionTransition';

<ExplosionTransition
  visible={showTransition}
  onAnimationComplete={() => router.push('/next-screen')}
  colors={['#F75564', '#FF6B7A', '#FF8E9E', '#FFDEA3', '#FFE9B8']}
/>
```

**Props:**
- `visible`: boolean - Controls animation visibility
- `onAnimationComplete`: () => void - Callback when animation finishes
- `colors`: string[] (optional) - Array of colors for puzzle pieces

**Animation Details:**
- 60 individual puzzle pieces (6x10 grid)
- Explodes outward from center point
- Each piece rotates and scales during explosion
- Spring physics brings pieces back together
- Staggered timing (15ms delay per piece)
- Total duration: ~1.5 seconds

### 5. PuzzleBiteTransition ⭐ **SIGNATURE BRAND TRANSITION**

Pieces fly in from all directions and assemble to form the "PuzzleBITE" logo word by word, with glowing effects and particle trails.

**Usage:**
```tsx
import { PuzzleBiteTransition } from '@/components/transitions/PuzzleBiteTransition';

<PuzzleBiteTransition
  visible={showBrandTransition}
  onAnimationComplete={() => console.log('PuzzleBITE assembled!')}
  colors={['#F75564', '#FF6B7A', '#FF8E9E', '#FFDEA3', '#FFE9B8']}
/>
```

**Props:**
- `visible`: boolean - Controls animation visibility
- `onAnimationComplete`: () => void - Callback when animation finishes
- `colors`: string[] (optional) - Array of colors for puzzle pieces

**Animation Details:**
- 160 individual puzzle pieces (16 per letter)
- Letter-by-letter reveal (P → u → z → z → l → e → B → I → T → E)
- Each letter assembles from scattered pieces
- Glowing edges on pieces during assembly
- Particle trail background effect
- Spring physics for natural movement
- Scale bounce effect when complete
- Staggered timing: 120ms per letter, 25ms per piece
- Total duration: ~3 seconds

**Creative Features:**
- ✨ Dynamic glow intensity on pieces
- 🌊 Floating particle trails in background
- 🎨 Multi-color gradient across letters
- 💎 Premium shadow and elevation effects
- 🎯 Precise letter positioning
- 🔄 Authentic puzzle piece look with rounded corners

**Perfect For:**
- App splash screen
- Brand reveal moments
- Achievement unlocks
- Level completion
- Game intro/outro
- Special events

### 6. EmojiBurstTransition

Colorful emoji particles burst and fall like confetti, perfect for celebration moments.

**Usage:**
```tsx
import { EmojiBurstTransition } from '@/components/transitions/EmojiBurstTransition';

<EmojiBurstTransition
  visible={showTransition}
  onAnimationComplete={() => console.log('Burst complete')}
  emojis={['🧩', '🎯', '⭐', '🎉', '✨', '💫', '🏆', '🎊']}
  count={40}
  duration={2500}
/>
```

**Props:**
- `visible`: boolean - Controls animation visibility
- `onAnimationComplete`: () => void - Callback when animation finishes
- `emojis`: string[] (optional) - Array of emojis to use
- `count`: number (optional) - Number of particles (default: 40)
- `duration`: number (optional) - Fall duration in ms (default: 2500)

**Animation Details:**
- Particles start from top, fall to bottom
- Random horizontal drift
- Rotation during fall (360° + random extra)
- Scale animation on appearance (bounce effect)
- Staggered delays (25ms per particle)
- Fade out near the end

## Transition Recommendations

### When to Use Each:

**PortalTransition:**
- Category selection → Overview
- Entering new sections
- Modal overlays

**PuzzlePieceTransition:**
- Overview → Game start
- Level transitions
- Puzzle assembly moments

**MirrorFlipTransition:**
- Page flips
- Revealing answers
- "Next level" progression
- Dramatic reveals

**ExplosionTransition:**
- Game completion
- Achievement unlocks
- High-energy moments
- Success celebrations

**PuzzleBiteTransition:** ⭐ **SIGNATURE**
- App splash screen/intro
- Major milestone celebrations
- Brand reveal moments
- Special event announcements
- Game intro sequences
- "Powered by PuzzleBITE" screens

**EmojiBurstTransition:**
- Victory screens
- Reward animations
- Daily streak bonuses
- Special achievements

## Performance Optimization

- All animations use `react-native-reanimated`'s native thread
- No JavaScript thread blocking
- Optimized for 60fps on mobile devices
- Automatic cleanup after animations complete
- Memory-efficient particle systems

## Customization Examples

### Brand Colors
```tsx
<MirrorFlipTransition
  colors={['#F75564', '#FFDEA3']} // PuzzleBITE gradient
/>

<ExplosionTransition
  colors={['#F75564', '#FF6B7A', '#FF8E9E', '#FFDEA3', '#FFE9B8']}
/>

<PuzzleBiteTransition
  colors={['#F75564', '#FF6B7A', '#FF8E9E', '#FFDEA3', '#FFE9B8']}
/>
```

### Puzzle-Themed Emojis
```tsx
<EmojiBurstTransition
  emojis={['🧩', '🎯', '🧠', '💡', '⭐', '🏆']}
  count={50}
/>
```

### Fast Transitions
```tsx
<MirrorFlipTransition duration={600} />
<EmojiBurstTransition duration={1500} count={30} />
```

## Future Enhancements

Potential additions:
- Color customization based on category
- Sound effects integration
- Haptic feedback on transitions
- Additional transition types (liquid swipe, paper fold)
- Mascot integration in transitions
