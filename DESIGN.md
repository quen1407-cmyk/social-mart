# Design Brief

## Direction

Social Mart — A modern social commerce platform blending Instagram/TikTok feed aesthetics with marketplace functionality, optimized for mobile discovery and interaction.

## Tone

Energetic, refined minimalism. Bold enough to feel premium and contemporary, restrained enough for mobile clarity and user focus.

## Differentiation

Soft, tactile surfaces with intentional elevation hierarchy and smooth micro-interactions that reward user engagement without overwhelming the feed.

## Color Palette

| Token              | OKLCH        | Role                                     |
|--------------------|--------------|------------------------------------------|
| background         | 0.145 0.01 260  | Deep charcoal base, reduces eye strain   |
| foreground         | 0.95 0.008 260  | High-contrast white text                 |
| card               | 0.18 0.012 260  | Elevated content surfaces                |
| primary/accent     | 0.7 0.2 190     | Vivid teal for CTAs, likes, active state |
| secondary          | 0.65 0.2 30     | Warm coral for marketplace highlights    |
| muted              | 0.22 0.015 260  | Subtle backgrounds, secondary UI         |
| destructive        | 0.55 0.22 25    | Red for delete/danger actions            |

## Typography

- Display: Space Grotesk — geometric, modern, strong hierarchy for headings and app chrome
- Body: General Sans — clean, legible at small sizes, excellent mobile readability
- Scale: hero `text-2xl font-bold`, h2 `text-xl font-semibold`, body `text-sm font-normal`

## Elevation & Depth

Four-layer hierarchy: base layer (0.145L), card layer (0.18L), popover (0.22L), overlay (0.25L). Soft shadows (2–8px blur) create depth without harshness. No glows or neon effects.

## Structural Zones

| Zone           | Background            | Border               | Notes                            |
|----------------|-----------------------|----------------------|----------------------------------|
| Header/Top Bar | card (0.18 L)         | border-b subtle      | Profile, search access           |
| Feed/Content   | background (0.145 L)  | —                    | Scrollable primary content area  |
| Bottom Nav     | card (0.18 L)         | border-t subtle      | 5 tabs, active = teal primary    |
| Cards          | card (0.18 L)         | —                    | Product/post cards, 16px radius |
| Modals/Popover | popover (0.22 L)      | —                    | Comment threads, product details |

## Spacing & Rhythm

Base unit: 1rem (16px). Section gaps: 1.5rem. Card padding: 1rem. Micro-spacing between UI elements: 0.5rem. Consistent 16px border-radius on primary surfaces, 24px on prominent cards, 100% on avatars.

## Component Patterns

- Buttons: teal primary on dark, no outline, active = scale(0.98) + shadow-feed, hover = shadow-card-hover
- Cards: card background, 16px radius, shadow-feed, scale(0.98) on press
- Avatars: 40–48px circular, primary teal ring, white border
- Badges: muted background, uppercase 10px font, rounded-sm

## Motion

- Entrance: fade-in + slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) for feed items
- Hover: scale-up 0.3s, shadow transitions
- Active: scale(0.98), shadow reduction on tap
- Decorative: none (focus on feed momentum)

## Constraints

- No gradients, full-page animations, or decorative imagery
- Radius varies by component (0 for inputs, 16px for cards, 24px for featured, 100% for avatars)
- Mobile-first: 375px–1024px viewports; landscape optional
- All colors must use OKLCH CSS variables; no hex literals in components

## Signature Detail

Soft card elevation with intentional 4-layer depth hierarchy creates a "floating feed" aesthetic unique to modern social commerce without visual clutter.
