# Animated Intro Component - ENGINOV DAYS

## Overview

The `AnimatedIntroHero` component is a stunning intro animation with the following features:

### Visual Elements

1. **Dark Tech Blue Gradient Background**
   - Deep blue gradient (#0d1b3a → #1a3a5a → #08172e)
   - Subtle noise texture overlay for enhancing the "tech" feel

2. **Particle Cloud System**
   - 600+ particles scattered across the screen
   - Creates a cloud-like dispersed effect at the start
   - Each particle has gentle floating motion with wave effects

3. **Text Formation with Points**
   - Particles gather together to form "ENGINOV DAYS" text
   - Smooth easing animation as they merge
   - Opacity increases as particles converge

4. **Shake/Pulse Effect**
   - Before explosion, the text shakes and trembles
   - Creates anticipation and energy
   - Intensity decreases over time

5. **Explosion Effect**
   - Particles explode radially outward from the text
   - Each particle moves along its individual vector
   - Opacity fades during explosion
   - Particles grow in size as they expand

6. **Subtitle Animation**
   - Date, location, and description fade in from below
   - Timing synchronized with the main animation
   - Appears after ENGINOV DAYS text forms (at ~4.2 seconds)
   - Smooth scale-up and blur removal

## Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| Cloud | 0-2s | Particles float randomly as a cloud |
| Gather | 2-4s | Particles converge toward text positions |
| Shake | 4-5.5s | Text trembles and shakes |
| Explode | 5.5-7.5s | Particles burst outward |
| Complete | 7.5-8s | Final fade-out |
| Total | 8 seconds | Full animation duration |

## Technical Details

### Component Props
```typescript
type AnimatedIntroHeroProps = {
  locale: SiteLocale; // 'fr', 'en', or 'ar'
};
```

### Key Features
- **Canvas-based rendering** for smooth 60fps performance
- **Particle physics** with velocity and acceleration
- **Responsive sizing** that adapts to viewport
- **Session storage** prevents animation replay on return visits
- **Hardware acceleration** via requestAnimationFrame
- **Easing functions** for natural motion (quad, cubic interpolation)

### Performance Optimizations
- Particle count: 600 (balanced for smooth animation)
- Canvas resolution adapts to device pixel ratio
- Reduced motion support (respects prefers-reduced-motion)
- Efficient particle position generation from text bitmap

## Localization

The animation includes full localization support:

- **French (fr)**: "ENGINOV DAYS" + "17 & 18 Avril 2026 · ENSA Fès" + "Journée de l'Innovation Industrielle & Technologique"
- **English (en)**: "ENGINOV DAYS" + "April 17 & 18, 2026 · ENSA Fès" + "Industrial & Technological Innovation Day"
- **Arabic (ar)**: "ENGINOV DAYS" + Arabic translations for date and subtitle

## Usage

The animation is automatically displayed when users visit the site. It shows only once per session (stored in localStorage).

To force replay (for development):
```javascript
sessionStorage.removeItem('introPlayed');
location.reload();
```

## Customization

To modify the animation, edit these values in `AnimatedIntroHero.tsx`:

```typescript
// Animation duration (ms)
const TOTAL_DURATION = 8000;

// Phase timing
const PHASES = {
  cloud: { start: 0, end: 2000 },
  gather: { start: 2000, end: 4000 },
  shake: { start: 4000, end: 5500 },
  explode: { start: 5500, end: 7500 },
  done: { start: 7500, end: 8000 }
};

// Particle count
const particleCount = 600;

// Background gradient colors
gradient.addColorStop(0, "#0d1b3a");     // Start color
gradient.addColorStop(0.3, "#1a3a5a");   // Mid color
gradient.addColorStop(1, "#08172e");     // End color
```

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14.1+
- ✅ Mobile browsers (with reduced complexity for older devices)

## Component Location

- **File**: `src/components/ui/AnimatedIntroHero.tsx`
- **Imported in**: `app/[locale]/layout.tsx`

## Accessibility

- Respects `prefers-reduced-motion` media query
- Auto-hides after animation completes
- Header remains accessible underneath
- No essential content is hidden during animation

---

*Created: March 14, 2026*  
*For: ENGINOV DAYS - Journée de l'Innovation Industrielle & Technologique*
