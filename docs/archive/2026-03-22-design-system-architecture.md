---
name: design-system-architecture
status: backlog
created: 2026-03-22T14:53:41Z
updated: 2026-03-22T14:53:41Z
---

# NeonPhysics v2 Design System Architecture

> Visual identity, component language, and UX patterns for a K12 science experiment platform.
> Target: 14-18 year old North American high school students + teachers who need to trust it.
> Benchmark: Beat PhET visually, match Brilliant's engagement, keep Khan Academy's clarity.

## 1. Design Philosophy

### The Problem with "edu-academic"

The current theme (Merriweather serif headings, academic blue, paper textures, `.edu-quote` blocks) says "university textbook." That's exactly what a 16-year-old scrolling TikTok between classes does NOT want to engage with. It also makes NeonPhysics visually indistinguishable from a Coursera clone or a generic edtech SaaS template.

### Visual Metaphor: "The Digital Lab Bench"

Not a textbook. Not a game. Not a SaaS dashboard. A **modern laboratory workbench** -- the place where you DO science, not just read about it.

Key visual cues:
- **Glass and translucency** -- frosted glass panels, subtle blur effects, layered surfaces (like lab equipment on a bench)
- **Precision grids** -- engineering graph paper undertones, not notebook ruled lines
- **Live data aesthetics** -- oscilloscope traces, real-time measurement readouts, glowing indicators
- **Contained energy** -- subtle neon accents that suggest things are powered on and ready, not garish cyberpunk
- **Clean surfaces with depth** -- white/dark surfaces with elevation hierarchy, like an Apple product on a lab bench

### Emotional Targets

| Emotion | How We Achieve It |
|---------|-------------------|
| **Curious** | Animated previews, "what happens if..." prompts, visible parameter controls |
| **Empowered** | "Create Your Own" prominent, easy fork/remix, visible authorship |
| **Excited** | Achievement animations, streak counters, progress unlocks |
| **Confident** | Clean typography, consistent spacing, professional data display |
| **Not bored** | Motion, interactivity, visual variety across subjects |

### What Makes NeonPhysics Visually Distinct

| vs PhET | vs Brilliant | vs Generic SaaS |
|---------|-------------|-----------------|
| Modern glass UI vs 2010s flat | Science-specific vs math-generic | Lab equipment aesthetic vs corporate dashboard |
| Dark mode first vs no dark mode | Real experiments vs abstract puzzles | Subject-coded colors vs monotone blue |
| 3D experiments vs 2D Java applets | Student creation vs consumption only | Physics-native typography vs generic sans |

### Design Principles (Ordered by Priority)

1. **Dark mode is the default.** Students use dark mode. The lab bench is dark. Light mode is the alternative.
2. **Show, don't describe.** Every experiment card shows a live thumbnail. Every feature section has an embedded demo.
3. **Subject identity is color.** You know you're in Physics (electric blue) vs Chemistry (emerald) vs Biology (amber) from the accent color alone.
4. **Progressive disclosure.** Simple surface, powerful depth. A card shows title + thumbnail. Click reveals parameters, equations, AP alignment.
5. **Earn trust through precision.** Typography, spacing, alignment must be pixel-perfect. Teachers evaluate credibility in 3 seconds.

## 2. Color System

### Core Palette

Moving from pure "academic blue" to a more vibrant, energetic palette that still reads as trustworthy.

```
Primary:     oklch(0.55 0.22 245)    -- "Electric Indigo" -- slightly brighter, more saturated than current
                                        Light mode primary, dark mode accent
Primary-fg:  oklch(0.98 0.01 245)

Surface:     oklch(0.13 0.02 260)    -- "Lab Dark" -- dark mode background
Surface-2:   oklch(0.17 0.02 260)    -- "Raised Panel"
Surface-3:   oklch(0.21 0.02 260)    -- "Card Surface"

Light-bg:    oklch(0.97 0.005 260)   -- Light mode background
Light-card:  oklch(1.00 0 0)         -- Pure white cards in light mode
```

### Subject Colors (The Identity System)

Each science subject gets a distinct hue family. These are NOT decorative -- they're structural. Navigation, cards, badges, progress bars all use the subject color when in that subject context.

```
Physics:     oklch(0.60 0.20 245)    -- Electric Blue
Chemistry:   oklch(0.60 0.18 155)    -- Emerald Green
Biology:     oklch(0.65 0.15 80)     -- Amber Gold
Math:        oklch(0.58 0.20 300)    -- Violet
Earth Sci:   oklch(0.55 0.15 25)     -- Terracotta
```

Subject color usage pattern:
```css
/* Each subject context sets this variable */
--subject: var(--subject-physics);    /* or chemistry, biology, etc. */

/* Components reference --subject for contextual coloring */
.experiment-card   { border-top: 3px solid var(--subject); }
.subject-badge     { background: var(--subject); }
.progress-fill     { background: var(--subject); }
```

### Semantic Colors

```
Success:     oklch(0.65 0.18 145)    -- Green (experiment completed, correct answer)
Warning:     oklch(0.75 0.15 75)     -- Amber (approaching limit, hint available)
Error:       oklch(0.60 0.22 25)     -- Red (wrong answer, generation failed)
Info:        oklch(0.65 0.15 230)    -- Sky blue (tips, documentation links)
```

### Neon Accents (Controlled Energy)

Keep the existing neon variables but define strict usage rules:

```
--neon-cyan:   oklch(0.85 0.18 195)  -- Live experiment indicators, "running" state
--neon-green:  oklch(0.80 0.20 145)  -- Success flash, achievement unlock
--neon-orange: oklch(0.75 0.18 50)   -- Streak counter, hot content
--neon-purple: oklch(0.60 0.22 300)  -- Pro/premium features, special badges
```

Usage rules:
- Neon colors ONLY appear as: small indicators (8px dots), thin borders (1px), text highlights, glow effects
- Neon NEVER as large area fills (no neon backgrounds, no neon buttons)
- Neon glow via `box-shadow` or `text-shadow`, never `background`

### Gradient Strategies

```css
/* Hero gradient -- dark mode */
--gradient-hero: linear-gradient(
  180deg,
  oklch(0.13 0.04 260) 0%,
  oklch(0.10 0.06 245) 50%,
  oklch(0.13 0.02 260) 100%
);

/* Card hover glow -- subject-contextual */
--gradient-card-glow: radial-gradient(
  ellipse at 50% -20%,
  oklch(from var(--subject) l c h / 0.08) 0%,
  transparent 70%
);

/* Subject section headers */
--gradient-subject: linear-gradient(
  135deg,
  oklch(from var(--subject) calc(l - 0.1) c h) 0%,
  var(--subject) 100%
);

/* Glass effect overlay */
--gradient-glass: linear-gradient(
  135deg,
  oklch(1 0 0 / 0.05) 0%,
  oklch(1 0 0 / 0.02) 100%
);
```

### Dark Mode (Default) vs Light Mode

| Token | Dark (default) | Light |
|-------|------|-------|
| `--background` | `oklch(0.13 0.02 260)` | `oklch(0.97 0.005 260)` |
| `--foreground` | `oklch(0.93 0.01 260)` | `oklch(0.15 0.03 260)` |
| `--card` | `oklch(0.17 0.02 260)` | `oklch(1.00 0 0)` |
| `--card-foreground` | `oklch(0.93 0.01 260)` | `oklch(0.15 0.03 260)` |
| `--muted` | `oklch(0.22 0.02 260)` | `oklch(0.95 0.005 260)` |
| `--muted-foreground` | `oklch(0.60 0.02 260)` | `oklch(0.45 0.02 260)` |
| `--border` | `oklch(0.25 0.02 260)` | `oklch(0.88 0.01 260)` |
| `--primary` | `oklch(0.65 0.20 245)` | `oklch(0.50 0.22 245)` |
| `--primary-foreground` | `oklch(0.13 0.02 260)` | `oklch(0.98 0.01 245)` |

## 3. Typography

### Font Stack Redesign

**Heading font: Inter (weight 700-900)**
- Rationale: Merriweather serif screams "textbook." Inter is the most readable geometric sans-serif, used by Linear, Vercel, Stripe -- companies teens see as "premium tech." Its tight metrics work well at large sizes for hero text and at small sizes for UI labels.
- Alternative considered: Geist (Vercel's font) -- slightly more distinctive but less mature ecosystem. **Recommendation: Inter.**

**Body font: Inter (weight 400-500)**
- Same family for body creates cohesion. Inter's x-height and letter spacing are optimized for screen reading.
- This replaces Noto Sans which is fine but generic.

**Mono font: JetBrains Mono (keep)**
- Already in use, excellent for formulas, code blocks, measurement readouts. No change needed.

**Math font: KaTeX default (Latin Modern)**
- For rendered LaTeX formulas. Already handled by KaTeX CDN. No CSS override needed.

### Type Scale

Using a 1.25 ratio (Major Third) scale, optimized for educational content density:

```css
--text-xs:    0.75rem;    /* 12px -- captions, footnotes, timestamps */
--text-sm:    0.875rem;   /* 14px -- secondary text, badge labels */
--text-base:  1rem;       /* 16px -- body text, descriptions */
--text-lg:    1.125rem;   /* 18px -- lead paragraphs, card titles */
--text-xl:    1.25rem;    /* 20px -- section subheadings */
--text-2xl:   1.5rem;     /* 24px -- section headings */
--text-3xl:   1.875rem;   /* 30px -- page titles */
--text-4xl:   2.25rem;    /* 36px -- hero subheading */
--text-5xl:   3rem;       /* 48px -- hero heading (mobile) */
--text-6xl:   3.75rem;    /* 60px -- hero heading (desktop) */
--text-7xl:   4.5rem;     /* 72px -- hero heading (wide desktop) */
```

### Line Heights

```css
--leading-tight:  1.2;    /* headings */
--leading-snug:   1.4;    /* card titles, short text */
--leading-normal: 1.6;    /* body text */
--leading-relaxed: 1.8;   /* long-form reading (docs, blog) */
```

### Font Weight Usage

| Weight | Usage |
|--------|-------|
| 400 (Regular) | Body text, descriptions |
| 500 (Medium) | UI labels, nav links, secondary buttons |
| 600 (Semibold) | Card titles, badge text, primary buttons |
| 700 (Bold) | Section headings, stat numbers |
| 800 (Extrabold) | Hero headings only |

### Letter Spacing

```css
--tracking-tighter: -0.03em;  /* Hero headings (text-5xl+) */
--tracking-tight:   -0.02em;  /* Section headings */
--tracking-normal:  0em;       /* Body text */
--tracking-wide:    0.05em;    /* All-caps labels, badge text */
--tracking-wider:   0.1em;     /* Chapter numbers, category labels */
```

## 4. Component Design Language

### 4.1 Card System

All cards share a base style, then specialize by context.

**Base Card**
```css
.np-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;                    /* slightly larger than current 8px */
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.3s, transform 0.2s;
}
.np-card:hover {
  border-color: oklch(from var(--subject) l c h / 0.3);
  box-shadow: 0 8px 32px oklch(from var(--subject) l c h / 0.08);
  transform: translateY(-2px);
}
```

**Experiment Card**
```
+---------------------------------------+
| [Live Thumbnail / WebGL Preview]      |  <- 16:9 ratio, lazy-loaded
| 200px height                          |
+---------------------------------------+
| Physics  |  Mechanics  |  AP C        |  <- subject badge + topic + AP tag
|                                       |
| Projectile Motion                     |  <- title (text-lg, font-semibold)
| Explore trajectories with             |  <- description (text-sm, muted)
| adjustable angle and velocity         |
|                                       |
| ●●●○○  Intermediate  |  ⏱ 15 min   |  <- difficulty dots + time estimate
+---------------------------------------+
```

Subject badge uses `--subject-physics` color. The top border is 3px solid in subject color. Thumbnail area shows an actual screenshot or animated preview (not a placeholder icon).

**Quest Card**
```
+---------------------------------------+
| [Subject Color Gradient Header]       |
| 🔬 Quest #12                         |  <- quest number, mono font
| "Why Does Ice Float?"                 |  <- quest title, bold
+---------------------------------------+
| POE: Predict > Observe > Explain      |  <- step indicator
|   ✓        ●        ○                 |  <- progress dots
|                                       |
| 3/5 steps complete                    |  <- progress text
| [=========------]                     |  <- progress bar in subject color
|                                       |
| +45 XP  |  🏆 Badge: Density Master  |  <- rewards preview
+---------------------------------------+
```

**AP Question Card**
```
+---------------------------------------+
| AP Physics 1  |  Unit 3: Circular     |  <- exam + unit badges
| Motion                                |
+---------------------------------------+
| Q: A satellite orbits Earth at        |  <- question text
| radius r. If the radius doubles...    |
|                                       |
| (A) v doubles                         |  <- answer choices
| (B) v halves                          |     (collapsed in browse view,
| (C) v increases by sqrt(2)            |      expanded in practice view)
| (D) v decreases by sqrt(2)            |
+---------------------------------------+
| Difficulty: ●●●●○  |  75% accuracy   |  <- stats bar
| 📊 View Visual Explanation            |  <- links to UPG visualization
+---------------------------------------+
```

**Lab Notebook Card**
```
+---------------------------------------+
| 📓  Experiment: Free Fall Analysis    |  <- notebook icon + title
|     Draft  |  Last edited 2h ago      |  <- status badge + timestamp
+---------------------------------------+
| Sections: 6/8 complete                |  <- section checklist
|   ✓ Hypothesis  ✓ Materials           |
|   ✓ Procedure   ● Data (editing)      |
|   ○ Analysis    ○ Conclusion          |
|                                       |
| AI Score: 82/100  "Needs stronger     |  <- AI quality assessment
|  error analysis"                      |
+---------------------------------------+
```

### 4.2 Button Hierarchy

```css
/* Primary -- subject-colored, filled */
.np-btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 20px;
  transition: background 0.15s, transform 0.1s;
}
.np-btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
.np-btn-primary:active { transform: translateY(0); }

/* Secondary -- bordered, transparent */
.np-btn-secondary {
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
}
.np-btn-secondary:hover { background: var(--muted); border-color: var(--muted-foreground); }

/* Ghost -- text only, no border */
.np-btn-ghost {
  background: transparent;
  color: var(--muted-foreground);
  padding: 10px 20px;
  font-weight: 500;
}
.np-btn-ghost:hover { color: var(--foreground); background: var(--muted); }

/* Danger -- destructive action */
.np-btn-danger {
  background: var(--destructive);
  color: var(--destructive-foreground);
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
}

/* CTA -- special hero button with glow */
.np-btn-cta {
  background: var(--primary);
  color: var(--primary-foreground);
  border-radius: 8px;
  padding: 14px 28px;
  font-weight: 700;
  font-size: 1.125rem;
  box-shadow: 0 0 20px oklch(from var(--primary) l c h / 0.3);
  transition: box-shadow 0.3s, transform 0.15s;
}
.np-btn-cta:hover {
  box-shadow: 0 0 30px oklch(from var(--primary) l c h / 0.5);
  transform: translateY(-2px);
}
```

Button sizes: `sm` (8px 16px, text-sm), `default` (10px 20px, text-base), `lg` (14px 28px, text-lg)

### 4.3 Badge System

**Subject Badges** -- pill-shaped, subject-colored background
```css
.np-badge-subject {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  background: oklch(from var(--subject) l c h / 0.15);
  color: var(--subject);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Difficulty Badges** -- dot scale (1-5)
```
Beginner:      ●○○○○  green
Intermediate:  ●●●○○  blue
Advanced:      ●●●●○  orange
AP Level:      ●●●●●  red
```

**Tier Badges** -- user subscription tier
```
Free:   gray background, no icon
Pro:    purple background, lightning icon
Max:    gradient background (purple-to-blue), star icon
```

**Achievement Badges** -- earned through Physics Quest
```
Round shape, 48x48px
Background: subject gradient
Icon: achievement-specific (beaker, atom, wave, etc.)
Border: 2px gold for rare achievements
Locked state: grayscale + 50% opacity
```

### 4.4 Progress Indicators

**Linear Progress Bar**
```css
.np-progress {
  height: 6px;
  background: var(--muted);
  border-radius: 9999px;
  overflow: hidden;
}
.np-progress-fill {
  height: 100%;
  background: var(--subject);          /* contextual color */
  border-radius: 9999px;
  transition: width 0.5s ease-out;
}
/* Animated shimmer on active progress */
.np-progress-fill.active::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, oklch(1 0 0 / 0.2), transparent);
  animation: shimmer 2s infinite;
}
```

**Circular Progress** (for dashboard stats)
- SVG-based, 64px diameter
- Subject-colored stroke
- Percentage text centered inside
- Animate on scroll-into-view

**Step Progress** (for Physics Quest POE flow)
```
  [✓]----[●]----[○]----[○]----[○]
 Know   Predict  Test  Compare Explain

 ✓ = completed (filled, green check)
 ● = current (pulsing, subject color)
 ○ = upcoming (outline, muted)
 Line = solid for completed, dashed for upcoming
```

**AP Unit Progress** (radar chart pattern)
- 7-axis radar chart per AP exam
- Each axis = unit mastery %
- Fill area in subject color with 20% opacity
- Data points as solid dots

### 4.5 Interactive Elements

**Parameter Slider** (for experiment viewer)
```css
.np-slider {
  --slider-track: var(--muted);
  --slider-fill: var(--subject);
  --slider-thumb: var(--card);
  height: 6px;
  border-radius: 9999px;
}
.np-slider-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--slider-thumb);
  border: 2px solid var(--slider-fill);
  box-shadow: 0 2px 8px oklch(0 0 0 / 0.2);
}
/* Value tooltip above thumb on hover/drag */
.np-slider-tooltip {
  background: var(--foreground);
  color: var(--background);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
}
```

**Formula Display**
```css
.np-formula {
  font-family: var(--font-mono);
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 20px;
  text-align: center;
  font-size: 1.25rem;
  position: relative;
}
/* Optional "copy equation" button */
.np-formula-copy {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}
.np-formula:hover .np-formula-copy { opacity: 1; }
```

**Measurement Readout** (oscilloscope-style data display)
```css
.np-readout {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--neon-cyan);
  text-shadow: 0 0 8px oklch(from var(--neon-cyan) l c h / 0.5);
  letter-spacing: 0.05em;
}
.np-readout-label {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted-foreground);
  margin-bottom: 2px;
}
.np-readout-unit {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--muted-foreground);
  margin-left: 4px;
}
```

## 5. Layout Patterns

### 5.1 Responsive Breakpoints

```css
/* Mobile first */
--bp-sm:   640px;     /* Large phone / small tablet */
--bp-md:   768px;     /* Tablet portrait */
--bp-lg:   1024px;    /* Tablet landscape / small laptop */
--bp-xl:   1280px;    /* Desktop */
--bp-2xl:  1536px;    /* Wide desktop */
```

### 5.2 Landing Page Sections

```
[1] Hero Section
    - Full-width, dark gradient background
    - Animated 3D experiment preview (WebGL, right side)
    - Headline + subline + 2 CTAs (left side)
    - Trust bar below (school logos or stats)

[2] Live Demo Section
    - "Try it now" -- embedded UPG input with pre-filled example
    - Shows generation process, then result
    - No login required for this demo

[3] Subject Explorer
    - 5 subject cards in a horizontal scroll (mobile) or grid (desktop)
    - Each card: subject icon + color + experiment count + featured thumbnail

[4] How It Works
    - 3-step visual flow: Describe > Generate > Interact
    - Each step with animation/video preview
    - Arrow/line connections between steps

[5] Featured Experiments
    - Masonry grid of 6-8 experiment cards
    - Mix of curated labs and UPG community creations
    - "View All" links to experiment explorer

[6] For Students / For Teachers
    - Two-column split
    - Student side: create, explore, earn badges
    - Teacher side: assign, monitor, align to standards

[7] AP Prep Preview
    - Shows a sample AP question with visual explanation
    - "Ace your AP exam with interactive physics"

[8] Social Proof
    - Stats bar: experiments created, students active, schools
    - Student testimonials (when available)

[9] Pricing
    - 3-tier cards: Free / Pro / Max
    - Feature comparison matrix below

[10] CTA Footer
    - "Start your first experiment in 30 seconds"
    - Email signup or "Get Started Free" button
```

### 5.3 Experiment Browser Layout

**Desktop (lg+)**
```
+--sidebar--+--------main content---------+
| Filters   | Sort: Popular | Recent | AP  |
|           |                              |
| Subject   | +------+ +------+ +------+  |
|  Physics  | | Card | | Card | | Card |  |
|  Chem     | +------+ +------+ +------+  |
|  Bio      | +------+ +------+ +------+  |
|           | | Card | | Card | | Card |  |
| Difficulty| +------+ +------+ +------+  |
|  Beginner |                              |
|  Inter    | +------+ +------+ +------+  |
|  Advanced | | Card | | Card | | Card |  |
|           | +------+ +------+ +------+  |
| Grade     |                              |
|  9-10     | [Load More / Infinite Scroll]|
|  11-12    |                              |
|  AP       |                              |
+--240px----+--------3-col grid-----------+
```

**Tablet (md)**
- Filters collapse to horizontal chip bar at top
- 2-column card grid

**Mobile (sm)**
- Filters behind a slide-out drawer (filter icon button)
- 1-column card list
- Cards become horizontal (thumbnail left, text right)

### 5.4 Experiment Viewer Layout

**Desktop (lg+)**
```
+--full width header bar (experiment title + back nav)--+
|                                                        |
| +--------3D/HTML Canvas--------+ +--Control Panel--+  |
| |                               | | Parameters     |  |
| |   Interactive Experiment      | |  Velocity: [==]|  |
| |   (WebGL / iframe)           | |  Angle:   [==] |  |
| |                               | |  Mass:    [==] |  |
| |   Takes 70% width            | |                 |  |
| |   min-height: 500px          | | Measurements    |  |
| |                               | |  t: 2.3s       |  |
| |                               | |  d: 45.2m      |  |
| +-------------------------------+ |  v: 12.1 m/s   |  |
|                                    |                 |  |
| +----Info Panel (collapsible)----+ | Actions         |  |
| | Theory | Equations | AP Align  | |  [Reset]        |  |
| | F=ma, projectile motion...     | |  [Screenshot]   |  |
| +--------------------------------+ |  [Share]        |  |
|                                    +---------30%----+  |
+--------------------------------------------------------+
```

**Mobile**
- Canvas: full width, 56.25vw height (16:9)
- Controls: horizontal scrollable chip bar below canvas
- Parameter sliders: bottom sheet (swipe up)
- Info panel: tabs below controls

### 5.5 Dashboard Layout

```
+--full width------------------------------------------+
| Welcome back, Alex        [Streak: 7 days 🔥]        |
+------------------------------------------------------+
| +--Quick Actions--+ +--Progress Overview-----------+ |
| | [New Experiment]| | Physics  [========--] 78%     | |
| | [AP Practice]   | | Chem     [====------] 42%     | |
| | [Continue Quest]| | Bio      [==--------] 18%     | |
| | [Lab Notebook]  | +-------------------------------+ |
| +-----------------+                                   |
+------------------------------------------------------+
| Recent Activity          | Achievements              |
| - Completed "Free Fall"  | 🏆 Gravity Master         |
| - AP Q answered (12/15)  | 🔓 3 new unlockable       |
| - UPG: "Doppler Effect"  |                           |
+------------------------------------------------------+
| Recommended Next         | Weekly Stats               |
| [Experiment Card]        | Experiments: 12            |
| [Quest Card]             | Questions: 45              |
| [AP Unit Suggestion]     | Time: 3h 20m               |
+------------------------------------------------------+
```

## 6. Motion and Animation

### Design Tokens for Motion

```css
--duration-fast:    100ms;    /* Button press, toggle */
--duration-normal:  200ms;    /* Hover effects, focus rings */
--duration-slow:    300ms;    /* Card transitions, panel slides */
--duration-slower:  500ms;    /* Page transitions, progress fills */

--ease-out:         cubic-bezier(0.16, 1, 0.3, 1);     /* Deceleration */
--ease-in-out:      cubic-bezier(0.65, 0, 0.35, 1);    /* Smooth */
--ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy */
```

### Page Transitions

- Use View Transitions API (already have `::view-transition` rules in global.css)
- New page content fades up from 10px below, 300ms
- Shared elements (header, sidebar) don't transition
- Experiment viewer: canvas crossfades, controls slide in from right

### Experiment Loading States

**Generation Loading (UPG)**
```
Phase 1 (0-5s):   Pulsing grid pattern in canvas area
                   Text: "Analyzing your description..."
Phase 2 (5-20s):  Animated particle system forming into shape
                   Text: "Generating physics simulation..."
Phase 3 (20-40s): Wireframe preview starts appearing
                   Text: "Building interactive controls..."
Phase 4 (40s+):   Near-complete preview with shimmer overlay
                   Text: "Finalizing experiment..."
```

Each phase transitions smoothly into the next. The loading experience itself should feel like watching an experiment materialize -- not a spinner.

**Curated Lab Loading**
- Skeleton shimmer on canvas area (dark rectangle with moving highlight)
- Control panel skeleton: 3 slider-shaped rectangles shimmer
- Load time target: under 2s (bundle-split experiment components)

### Achievement Unlock Animation

```
1. Screen dims slightly (overlay at 20% opacity)
2. Badge appears at center, scale 0 -> 1.2 -> 1.0 (spring easing, 500ms)
3. Particle burst radiates outward from badge (subject-colored particles)
4. Achievement name types in below badge (typewriter effect, 300ms)
5. "+XP" number flies up and fades (200ms)
6. Auto-dismiss after 3s, or tap anywhere to close
```

### Micro-interactions

| Element | Trigger | Animation |
|---------|---------|-----------|
| Button | Hover | Scale 1.02, subtle shadow increase |
| Button | Click | Scale 0.98, 100ms, then back |
| Card | Hover | Lift 2px, border-color shifts to subject, glow appears |
| Toggle | Switch | Thumb slides with spring ease, track color fills |
| Badge | Earn | Pop-in with scale bounce |
| Like | Click | Heart fills with scale pulse, particle burst |
| Nav link | Active | Underline draws in from center, 200ms |
| Tab | Switch | Indicator bar slides to new tab, 200ms ease-out |
| Slider | Drag | Value tooltip appears, follows thumb |
| Progress | Fill | Bar animates width with ease-out, 500ms |

### Scroll Animations (Landing Page Only)

- Cards: fade-in-up as they enter viewport (IntersectionObserver, threshold 0.1)
- Stats counters: count-up animation when visible
- Section headings: slide-in from left, 300ms
- Feature demos: start playing when 50% visible
- Stagger: sequential cards delay by 100ms each

**Important**: NO scroll animations inside the app (experiment viewer, dashboard, etc.). Scroll animations are landing page marketing only. App pages render instantly.

## 7. Iconography and Illustration

### Icon Style

**Lucide icons** (already in use via shadcn/ui) -- consistent with current stack. Use outline style (weight 1.5px) as default. Solid fill only for active/selected states.

Size scale:
```
--icon-sm:   16px   /* inline with text, badges */
--icon-md:   20px   /* buttons, nav items */
--icon-lg:   24px   /* card actions, toolbar */
--icon-xl:   32px   /* feature highlights, empty states */
--icon-2xl:  48px   /* hero features, subject icons */
```

### Subject Icons

Each subject has a primary icon (used in navigation, badges, cards):

| Subject | Icon | Lucide Name |
|---------|------|-------------|
| Physics | Atom with orbits | `atom` |
| Chemistry | Flask/beaker | `flask-conical` |
| Biology | DNA helix | `dna` |
| Math | Function curve | `sigma` |
| Earth Science | Globe | `globe` |

These are always rendered in the subject color. In badges, they appear at 16px next to the subject name.

### Achievement Illustrations

Custom SVG illustrations (not Lucide) for achievement badges:
- Style: geometric, low-poly, subject-colored gradients
- Size: 48x48px in lists, 96x96px in unlock modal
- Locked state: grayscale filter + 50% opacity + lock icon overlay
- Examples: "Gravity Master" (falling apple with motion lines), "Circuit Builder" (connected nodes), "Wave Surfer" (sine wave with rider)

**Implementation note**: These should be stored as SVG files in `public/achievements/` and loaded by slug. Start with 10-15 core achievements, expand as Physics Quest content grows.

### Empty States

Each major section has a dedicated empty state illustration:

| Section | Illustration | Message |
|---------|-------------|---------|
| My Experiments | Beaker with sparkles | "Your lab bench is empty. Create your first experiment!" |
| Quest Progress | Winding path with flag | "Your physics quest awaits. Start your first challenge!" |
| AP Practice | Graduation cap outline | "Ready to ace your AP exam? Pick a subject to begin." |
| Lab Notebook | Open notebook with pen | "No notebooks yet. Start documenting your experiments!" |
| Search (no results) | Magnifying glass + question marks | "No experiments match your search. Try different keywords." |

Style: monochrome (muted-foreground color), with one subject-colored accent element. Max 200x200px. Include a CTA button below the message.

### Loading States

- **Spinner**: NOT a generic circle spinner. Use a custom atom-like spinner: 3 elliptical orbits rotating at different speeds around a central dot. Subject-colored.
- **Skeleton**: Standard shimmer pattern (dark rectangles with moving highlight gradient). Matches the shape of the content it replaces.
- **Progress**: For long operations (UPG generation), use the phased loading animation described in Section 6.

## 8. Accessibility

### Color Contrast

All text must meet **WCAG AA** minimum:
- Normal text (under 24px): 4.5:1 contrast ratio against background
- Large text (24px+ or 19px+ bold): 3:1 contrast ratio
- UI components and graphical objects: 3:1 against adjacent colors

**Verification required**: Every subject color must be checked against both dark and light mode backgrounds. The oklch values chosen above are designed to meet AA, but must be validated with a contrast checker tool during implementation.

Special concern: neon accent colors are decorative only and NEVER carry semantic meaning alone. A neon indicator dot must always be accompanied by text or icon.

### Focus States

```css
/* Global focus-visible style */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* High-contrast focus for dark backgrounds */
.dark :focus-visible {
  outline-color: oklch(0.80 0.20 245);
  box-shadow: 0 0 0 4px oklch(from var(--primary) l c h / 0.2);
}
```

Focus is visible ONLY on keyboard navigation (`:focus-visible`), not on mouse click.

### Screen Reader Considerations for 3D Experiments

Interactive experiments (WebGL/iframe) are inherently visual. Mitigation strategy:

1. **Every experiment has an `aria-label`** describing what the experiment shows: "Interactive simulation of projectile motion. Adjust velocity and angle parameters to see how they affect the trajectory."

2. **Parameter controls are fully keyboard-accessible**: sliders use `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` (e.g., "Velocity: 15 meters per second").

3. **Measurement readouts are `aria-live="polite"`**: when values change due to parameter adjustment, screen readers announce the new values.

4. **Text alternative panel**: every experiment has a "Description" tab in the info panel that provides a text-based explanation of what the visualization shows, including key relationships ("As velocity increases, the range increases proportionally").

5. **Skip link**: "Skip to experiment controls" link before the canvas, so keyboard users can jump past the visual-only area.

### Keyboard Navigation

| Context | Key | Action |
|---------|-----|--------|
| Experiment viewer | Tab | Cycle through parameter controls |
| Experiment viewer | Arrow keys | Adjust slider value |
| Experiment viewer | Space | Play/pause simulation |
| Experiment viewer | R | Reset to defaults |
| Experiment viewer | Escape | Exit fullscreen |
| Card grid | Arrow keys | Navigate between cards |
| Card grid | Enter | Open card |
| Quest steps | Left/Right | Previous/next step |
| AP question | 1-5 | Select answer choice |
| AP question | Enter | Submit answer |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .np-progress-fill.active::after { display: none; }
  /* Keep functional animations (page loads) but remove decorative ones */
}
```

## 9. Key Page Wireframes

### 9.1 Landing Hero Section

```
+================================================================+
|  [Logo]   Experiments   UPG   Quest   AP Prep   Gallery   [$]  |
+================================================================+
|                                                                 |
|  (dark gradient background with subtle grid pattern)            |
|                                                                 |
|  col-left (55%)              |  col-right (45%)                 |
|                              |                                  |
|  "See Physics.              |  +---------------------------+   |
|   Build Understanding."     |  | Animated 3D Preview       |   |
|                              |  | (rotating pendulum or     |   |
|  text-6xl, extrabold,       |  |  projectile trajectory)   |   |
|  tracking-tighter           |  |                           |   |
|                              |  | Glow border in primary    |   |
|  "Create interactive        |  | color, subtle shadow      |   |
|   physics experiments       |  +---------------------------+   |
|   with AI. Explore 80+      |                                  |
|   simulations. Ace your     |                                  |
|   AP exam."                 |                                  |
|                              |                                  |
|  text-xl, muted-foreground  |                                  |
|                              |                                  |
|  [CTA: Start Free] [See Experiments]                            |
|   primary glow     secondary outline                            |
|                                                                 |
|  "No credit card. 3 free experiments daily."                    |
|   text-sm, muted                                                |
|                                                                 |
+----trust bar (horizontal divider line)--------------------------+
|  🏫 Used in 120+ schools  |  🧪 15,000+ experiments  |  ⭐ 4.8 |
+-----------------------------------------------------------------+
```

Mobile variant:
- Single column, heading above 3D preview
- 3D preview: 16:9 aspect ratio, full width
- CTAs: stacked vertically, full width
- Trust bar: 3 items stacked, centered

### 9.2 Experiment Explorer Page

```
+================================================================+
| [Logo]   Experiments*  UPG   Quest   AP Prep   Gallery   [$]   |
+================================================================+
|                                                                 |
| "Experiment Library"  text-3xl, bold                            |
| "80+ interactive physics simulations"  text-lg, muted           |
|                                                                 |
| [Search: "Search experiments..."]    [Grid View] [List View]   |
|                                                                 |
+--sidebar 240px--+--main content----------------------------+   |
|                  |                                          |   |
| SUBJECTS         | Sort: [Popular v]  Showing 24 of 83     |   |
| ● Physics (42)   |                                          |   |
| ○ Chemistry (18) | +--------+ +--------+ +--------+       |   |
| ○ Biology (12)   | |        | |        | |        |       |   |
| ○ Math (8)       | | Exp    | | Exp    | | Exp    |       |   |
| ○ Earth Sci (3)  | | Card   | | Card   | | Card   |       |   |
|                  | |        | |        | |        |       |   |
| DIFFICULTY       | +--------+ +--------+ +--------+       |   |
| [x] Beginner     |                                          |   |
| [x] Intermediate | +--------+ +--------+ +--------+       |   |
| [x] Advanced     | |        | |        | |        |       |   |
| [ ] AP Level     | | Exp    | | Exp    | | Exp    |       |   |
|                  | | Card   | | Card   | | Card   |       |   |
| GRADE LEVEL      | |        | |        | |        |       |   |
| [ ] 6-8          | +--------+ +--------+ +--------+       |   |
| [x] 9-10         |                                          |   |
| [x] 11-12        | [Load More Experiments]                  |   |
| [x] AP           |                                          |   |
|                  |                                          |   |
| AP ALIGNMENT     |                                          |   |
| [ ] AP Physics 1 |                                          |   |
| [ ] AP Physics 2 |                                          |   |
| [ ] AP Phys C-M  |                                          |   |
| [ ] AP Phys C-EM |                                          |   |
+------------------+------------------------------------------+   |
```

### 9.3 Experiment Viewer Page

```
+================================================================+
| [<- Back to Experiments]     Projectile Motion     [Share] [♥] |
+================================================================+
|                                                                 |
| +---Canvas Area (70%)-------------------+ +--Controls (30%)-+  |
| |                                        | |                 |  |
| |                                        | | PARAMETERS      |  |
| |    Interactive 3D Experiment           | |                 |  |
| |    (WebGL canvas or sandboxed iframe)  | | Initial Vel.    |  |
| |                                        | | [====●=====]    |  |
| |    min-height: 500px                   | | 25 m/s          |  |
| |    border: 1px solid border            | |                 |  |
| |    border-radius: 12px                 | | Launch Angle    |  |
| |                                        | | [==●========]   |  |
| |                                        | | 45 deg          |  |
| |                                        | |                 |  |
| |    [Fullscreen]  [Play/Pause]  [Reset] | | Mass            |  |
| +----------------------------------------+ | [●==========]   |  |
|                                            | | 1.0 kg         |  |
| +---Info Tabs-------------------------------+                 |  |
| | [Theory] [Equations] [AP Standards] [Discussion]            |  |
| |                                                             |  |
| | Theory:                                       MEASUREMENTS |  |
| | Projectile motion describes the motion of     |            |  |
| | an object launched into the air, subject      | TIME       |  |
| | only to gravity. The trajectory forms a       | 2.34 s     |  |
| | parabolic path...                             |            |  |
| |                                               | RANGE      |  |
| | Key Equations:                                | 63.7 m     |  |
| | x = v0 * cos(theta) * t                      |            |  |
| | y = v0 * sin(theta) * t - 0.5*g*t^2          | MAX HEIGHT |  |
| |                                               | 15.9 m     |  |
| +-----------------------------------------------+            |  |
|                                                  +------------+  |
|                                                                  |
| Related Experiments                                              |
| [Card: Free Fall] [Card: Circular Motion] [Card: Momentum]     |
+------------------------------------------------------------------+
```

### 9.4 AP Prep Question Page

```
+================================================================+
| [<- AP Physics 1]   Unit 3: Circular Motion   Q 12/45  [Skip] |
+================================================================+
|                                                                 |
| Progress: [============---------] 12/45 questions               |
|                                                                 |
| +--Question Area (60%)----------------+ +-Visual (40%)---------+|
| |                                      | |                      ||
| | Q12. A satellite orbits Earth at     | | [3D orbital          ||
| | a constant speed in a circular       | |  animation shows     ||
| | orbit of radius r. If the            | |  the scenario        ||
| | orbital radius is doubled to 2r,     | |  described in        ||
| | by what factor does the orbital      | |  the question]       ||
| | speed change?                        | |                      ||
| |                                      | | "See it in action"   ||
| | +--Choices (radio buttons)--------+ | |                      ||
| | | ○ (A) Speed doubles              | | +----------------------+|
| | | ○ (B) Speed halves               | |                        |
| | | ● (C) Speed multiplied by 1/√2   | |                        |
| | | ○ (D) Speed multiplied by √2     | |                        |
| | +----------------------------------+ |                        |
| |                                      |                        |
| | [Submit Answer]                      |                        |
| +--------------------------------------+                        |
|                                                                 |
| +--After Submit: Explanation Panel (full width)----------------+|
| | ✅ Correct!                                                   ||
| |                                                               ||
| | For circular orbit: v = sqrt(GM/r)                            ||
| | Doubling r: v_new = sqrt(GM/2r) = v/sqrt(2) = v * 1/sqrt(2) ||
| |                                                               ||
| | [▶ Watch Visual Explanation]  -- opens UPG-generated viz      ||
| | [📖 Review: Gravitational Force] -- links to theory           ||
| +---------------------------------------------------------------+|
|                                                                   |
| [<- Previous]                              [Next Question ->]    |
+-------------------------------------------------------------------+
```

### 9.5 Physics Quest Step Page

```
+================================================================+
| [<- Quest List]    Quest: Why Does Ice Float?    ⭐ 120 XP     |
+================================================================+
|                                                                 |
| Step Progress:                                                  |
| [✓ Know]--[✓ Predict]--[● Observe]--[○ Compare]--[○ Explain]  |
|                                                                 |
| +--Step Content (full width)----------------------------------+ |
| |                                                              | |
| | STEP 3: OBSERVE                                              | |
| | "Run the experiment and record what happens"                 | |
| |                                                              | |
| | +--Embedded Experiment-------------------------------------+ | |
| | |                                                           | | |
| | |  [Density simulation: ice cube in water beaker]          | | |
| | |  Interactive -- student can change temperature,           | | |
| | |  add salt, change liquid density                          | | |
| | |                                                           | | |
| | |  Canvas: 100% width, 400px height                        | | |
| | |                                                           | | |
| | +-----------------------------------------------------------+ | |
| |                                                              | |
| | OBSERVATION PROMPT:                                          | |
| | "What fraction of the ice cube is above the water line?     | |
| |  Try changing the water temperature. What happens?"         | |
| |                                                              | |
| | Your Observation:                                            | |
| | +--textarea--------------------------------------------+    | |
| | | About 10% of the ice is above the water. When I      |    | |
| | | changed the temperature...                            |    | |
| | +------------------------------------------------------+    | |
| |                                                              | |
| | [Save & Continue ->]                                         | |
| +--------------------------------------------------------------+ |
|                                                                   |
| +--Sidebar Hint (collapsible)--+                                 |
| | 💡 Hint available (1 of 3)  |                                 |
| | [Reveal Hint]                |                                 |
| | Cost: -5 XP                  |                                 |
| +------------------------------+                                 |
+-------------------------------------------------------------------+
```

## 10. Implementation Roadmap

### Phase A: Foundation (Estimated 5 dev-days)

| Task | Hours | Description |
|------|-------|-------------|
| A1: CSS variable migration | 8h | Replace all oklch values in `theme.css` and `theme-education.css` with new palette. Add subject color system. Add motion tokens. |
| A2: Font swap | 4h | Replace Merriweather/Noto Sans imports with Inter. Update `--font-heading`, `--font-body`. Verify all pages render correctly. |
| A3: Base card component | 6h | Create `np-card` base component replacing `edu-card`. Add subject-contextual border/glow. |
| A4: Button overhaul | 4h | Update shadcn Button variants to match new hierarchy. Add CTA variant with glow. |
| A5: Badge components | 6h | Subject badges, difficulty dots, tier badges. All as Tailwind utility classes or small React components. |
| A6: Dark mode as default | 4h | Flip theme provider default to dark. Ensure all components look correct dark-first. |
| A7: Remove `.edu-*` classes | 8h | Replace all `.edu-*` usages across codebase with new `.np-*` classes or Tailwind utilities. |

### Phase B: Page Layouts (Estimated 8 dev-days)

| Task | Hours | Description |
|------|-------|-------------|
| B1: Landing page rebuild | 16h | Implement new hero, live demo, subject explorer, how-it-works, featured experiments, for students/teachers, pricing sections. |
| B2: Experiment explorer | 12h | Sidebar filters + card grid + search + sort. Responsive layouts. |
| B3: Experiment viewer | 12h | Canvas + control panel + info tabs + measurements. Responsive. |
| B4: Dashboard redesign | 8h | Quick actions + progress overview + activity + achievements. |
| B5: Header/nav update | 8h | New navigation structure, subject-aware context, mobile menu. |
| B6: AP Prep layout | 8h | Question view, answer selection, explanation panel, visual embed. |

### Phase C: Motion and Polish (Estimated 4 dev-days)

| Task | Hours | Description |
|------|-------|-------------|
| C1: Loading states | 8h | UPG generation phases, skeleton screens, atom spinner. |
| C2: Scroll animations | 6h | Landing page only. IntersectionObserver + CSS animations. |
| C3: Achievement unlock | 6h | Modal animation, particle burst, XP counter. |
| C4: Micro-interactions | 6h | Hover, focus, click feedback across all interactive elements. |
| C5: Accessibility audit | 6h | Contrast check all colors, keyboard nav testing, screen reader testing. |

### Phase D: Iconography and Assets (Estimated 3 dev-days)

| Task | Hours | Description |
|------|-------|-------------|
| D1: Subject icons | 4h | Configure Lucide icons per subject, ensure color consistency. |
| D2: Achievement SVGs | 8h | Design 15 core achievement badge illustrations. |
| D3: Empty states | 6h | Design and implement 5 empty state illustrations. |
| D4: Experiment thumbnails | 6h | Generate/capture preview images for all curated experiments. |

**Total estimate: 20 dev-days (160 hours)**

### Dependency Order

```
Phase A (foundation) -- must complete first
  |
  +-- Phase B (layouts) -- depends on A1-A6
  |     |
  |     +-- Phase C (motion) -- depends on B1-B3 at minimum
  |
  +-- Phase D (assets) -- can run in parallel with B after A completes
```

### Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Inter font increases bundle size | Low | Font subsetting, `display=swap`, only load weights 400/500/600/700/800 |
| Dark mode default breaks existing content | Medium | Audit all pages before flipping default. Some admin pages may assume light. |
| Subject color contrast fails AA | Medium | Pre-validate all subject colors at both L (dark bg) and L (light bg) before implementation. Adjust chroma if needed. |
| `.edu-*` to `.np-*` migration breaks pages | High | Do it in one atomic commit. Run full test suite immediately after. |
| 3D preview thumbnails are heavy | Medium | Use static WebP screenshots (not live WebGL) for card thumbnails. Lazy load. |
| Landing page rebuild scope creep | High | Ship section by section. Hero first, then iterate. Each section is independently deployable. |

## 11. CSS Architecture Notes

### File Organization

```
src/config/style/
├── global.css              -- Tailwind imports, base layer
├── theme.css               -- shadcn CSS variable tokens (auto-generated structure)
├── theme-neonphysics.css   -- NEW: NeonPhysics-specific variables and components
├── theme-education.css     -- DEPRECATED: keep during migration, remove after
└── docs.css                -- Fumadocs overrides
```

### Naming Convention Migration

| Old (edu-academic) | New (neonphysics) |
|-------|-----|
| `.edu-card` | `.np-card` or Tailwind composition |
| `.edu-button` | shadcn `<Button>` variants |
| `.edu-heading` | Tailwind `font-heading font-bold tracking-tight` |
| `.edu-tag` | `.np-badge-subject` |
| `.edu-paper-bg` | `.np-grid-bg` (engineering grid, not notebook lines) |
| `.edu-quote` | `.np-callout` |
| `.edu-formula` | `.np-formula` |
| `.edu-navbar` | Tailwind composition on `<header>` |
| `.edu-hero` | `.np-hero` |

### Tailwind v4 Custom Theme Extension

The subject color system should be registered as Tailwind theme values so we can use `bg-subject`, `text-subject`, `border-subject` etc:

```css
@theme inline {
  --color-subject: var(--subject);
  --color-subject-physics: var(--subject-physics);
  --color-subject-chemistry: var(--subject-chemistry);
  --color-subject-biology: var(--subject-biology);
  --color-subject-math: var(--subject-math);
  --color-subject-earth: var(--subject-earth);
}
```

Then in components: `className="bg-subject/15 text-subject border-subject/30"`

### CSS Variable Scope for Subject Context

Subject colors are set via a React context provider or data attribute:

```tsx
// Option A: data attribute (recommended -- no JS, pure CSS)
<div data-subject="physics">
  {/* All children inherit --subject = --subject-physics */}
</div>
```

```css
[data-subject="physics"]  { --subject: var(--subject-physics); }
[data-subject="chemistry"]{ --subject: var(--subject-chemistry); }
[data-subject="biology"]  { --subject: var(--subject-biology); }
[data-subject="math"]     { --subject: var(--subject-math); }
[data-subject="earth"]    { --subject: var(--subject-earth); }
```

This is clean, performant, and requires zero runtime JS for color switching.

## 12. Open Questions for User Decision

1. **Font choice**: Inter is the recommendation. Alternatives: Geist (more unique, Vercel-native), DM Sans (slightly rounder, more friendly). All three are free. Which direction?

2. **Dark mode default**: Flipping to dark-first affects the admin panel and docs. Should admin/docs stay light mode while public-facing pages default dark? Or unified?

3. **`.edu-*` to `.np-*` migration**: Do it all at once (clean but risky) or gradual (messy but safe)? Recommendation: all at once in Phase A, since test coverage exists.

4. **Achievement illustrations**: Commission custom SVGs or use an open-source icon set (like Tabler Icons) as placeholders until a designer creates them?

5. **Landing page rebuild priority**: Ship the new hero section first and iterate, or redesign the entire landing page and ship at once?
