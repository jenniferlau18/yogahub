# YogaHub Design System

## Brand

### Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#7C9082` | Buttons, links, icons, CTA banners |
| Primary Hover | `#6B7D71` | Button hover, active states |
| Background | `#FAFAF8` | Page background |
| Surface | `#FFFFFF` | Cards, inputs, modals |
| Text Primary | `#2D2D2D` | Headings, body text |
| Text Secondary | `#6B7280` | Descriptions, labels, placeholders |
| Accent Green | `#7C9082 / 10%` | Icon circles, badge backgrounds |
| Accent Warm | `#F5F0EB` | Info boxes, subtle backgrounds |
| Gradient Start | `#E8EDE8` | Hero section top-left |
| Gradient End | `#F0EBE3` | Hero section bottom-right |
| Destructive | `#EF4444` | Cancel, delete, errors |
| Success | `#16A34A` | Confirmation, booked badges |

### Typography
- **Font**: Inter (via `next/font/google`)
- **Scale**: text-xs (12px) → text-6xl (60px)
- **Weights**: normal (400), medium (500), semibold (600), bold (700)
- **Headings**: font-semibold, text-[#2D2D2D]
- **Body**: font-normal, text-gray-600

### Spacing
- **Base**: 4px (Tailwind default)
- **Section padding**: py-16 md:py-24
- **Container padding**: px-4
- **Card padding**: p-6
- **Gap between cards**: gap-6 (grid), gap-4 (small), gap-3 (list)

### Border Radius
- **Default**: rounded-lg
- **Cards**: rounded-xl
- **Buttons**: rounded-lg (default), rounded-full (pill/hero)
- **Badges**: rounded-full

## Components

### Button
```css
/* Primary */
bg-[#7C9082] hover:bg-[#6B7D71] text-white rounded-lg
/* Secondary/Ghost */
variant="ghost" text-gray-400 hover:text-red-500
variant="outline" border-red-200 text-red-500
/* Sizes */
size="sm" for inline actions
size="lg" for CTAs
```

### Card
```css
border-0 shadow-md hover:shadow-lg transition-shadow
/* Content padding */
CardContent: pt-8 pb-6 (feature), p-6 (standard)
```

### Input
```css
border-0 shadow-none focus-visible:ring-0
/* Pill variant (search) */
rounded-full bg-white shadow-lg
```

### Badge
```css
variant="secondary" bg-white/60
variant="outline" hover:bg-[#7C9082]/10 border-[#7C9082]/20
/* Status */
bg-green-100 text-green-700 (success/booked)
bg-red-100 text-red-700 (destructive)
```

### Navbar
- Height: h-14
- Background: bg-white/80 backdrop-blur border-b
- Logo: left-aligned, font-bold
- Links: text-sm text-gray-600 hover:text-[#2D2D2D]
- CTA: bg-[#7C9082] text-white rounded-lg px-4

## Layout

### Max Widths
| Context | Class |
|---------|-------|
| Page container | container mx-auto |
| Hero content | max-w-3xl mx-auto |
| Feature grid | max-w-4xl mx-auto |
| Card grid | container mx-auto |
| Auth forms | max-w-sm mx-auto |

### Page Sections (top to bottom)
1. **Hero**: gradient bg → badge → h1 → subtitle → search pill → quick links
2. **How It Works**: section heading → 3-column icon cards
3. **CTA Banner**: full-width primary bg → heading → text → button
4. **Featured Grid**: heading + "View All" → responsive grid (sm:2 lg:3)
5. **Footer**: 3-column links → copyright bar

## Motion

- **Transitions**: `transition-shadow`, `transition-colors` (150ms default)
- **Hover cards**: `hover:shadow-lg`
- **Hover badges**: `hover:bg-[#7C9082]/10`
- **Buttons**: `disabled:opacity-50`

## Voice

- **Tone**: Warm, encouraging, professional-yet-friendly
- **Headers**: Sentence case ("Find Your Yoga Rhythm")
- **Buttons**: Verb-first ("Book", "Search", "List Your Studio")
- **Errors**: Friendly + actionable ("Don't worry — give it another try.")
- **Empty states**: Encouraging + CTA ("No studios yet. Be the first!")

## States (every interactive element)

| State | Implementation |
|-------|---------------|
| Default | Styled as above |
| Hover | shadow-lg, bg shift |
| Focus | focus-visible ring (shadcn default) |
| Disabled | opacity-50, cursor-not-allowed |
| Loading | Skeleton pulse or "..." text |
| Empty | Icon + message + CTA button |
| Error | Red-tinted card + retry button |
