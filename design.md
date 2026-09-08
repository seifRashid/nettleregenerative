# Design System & UI Specification: Nettle Regenerative

> **Single Source of Truth for Visual Design and Frontend Engineering**  
> **Target Application:** `my-app` (Next.js 16 App Router, React 19, Tailwind CSS v4)  
> **Visual Reference Inspiration:** Atmospheric Clean-Tech & Eco-Futurism Landing Experience  
> **Brand Palette:** Primary `#113B27` | Secondary `#84C135` | Accent `#654320`

---

## Table of Contents

1. [Visual Reference Analysis & Design Direction](#1-visual-reference-analysis--design-direction)
2. [Design Philosophy & Core Principles](#2-design-philosophy--core-principles)
3. [Color System & Semantic Tokens](#3-color-system--semantic-tokens)
4. [Typography & Text Hierarchy](#4-typography--text-hierarchy)
5. [Spacing Scale & Layout Principles](#5-spacing-scale--layout-principles)
6. [Layout, Grids & Page Architecture](#6-layout-grids--page-architecture)
7. [UI Components Specification](#7-ui-components-specification)
   * 7.1 [Buttons & Interactive Pills](#71-buttons--interactive-pills)
   * 7.2 [Cards & Bento Containers](#72-cards--bento-containers)
   * 7.3 [Glassmorphic Floating Data Overlays](#73-glassmorphic-floating-data-overlays)
   * 7.4 [Circular Gauges & Metric Indicators](#74-circular-gauges--metric-indicators)
   * 7.5 [Navigation Header & Mobile Bar](#75-navigation-header--mobile-bar)
   * 7.6 [Forms, Inputs & Newsletter Field](#76-forms-inputs--newsletter-field)
   * 7.7 [Dropdowns & Select Menus](#77-dropdowns--select-menus)
   * 7.8 [Modals & Dialog Overlays](#78-modals--dialog-overlays)
   * 7.9 [Tables & Data Lists](#79-tables--data-lists)
   * 7.10 [Badges, Tags & Status Pills](#710-badges-tags--status-pills)
   * 7.11 [Alerts & In-App Notifications](#711-alerts--in-app-notifications)
   * 7.12 [Tabs & Segmented Switches](#712-tabs--segmented-switches)
   * 7.13 [Pagination & Numerical Steppers](#713-pagination--numerical-steppers)
   * 7.14 [Empty & Loading Skeleton States](#714-empty--loading-skeleton-states)
8. [Border Radius, Borders & Shadows](#8-border-radius-borders--shadows)
9. [Responsive Design & Breakpoint Behavior](#9-responsive-design--breakpoint-behavior)
10. [Accessibility & Inclusive Design (WCAG 2.1 AA)](#10-accessibility--inclusive-design-wcag-21-aa)
11. [Design Do's and Don'ts](#11-design-dos-and-donts)
12. [Developer Implementation Guide & Code Tokens](#12-developer-implementation-guide--code-tokens)

---

## 1. Visual Reference Analysis & Design Direction

The reference landing page introduces a visual language that fuses **architectural minimalism**, **lush organic landscape photography**, and **sleek clean-tech user interface design**. Rather than appearing industrial or sterile, it evokes an aura of serene ecological luxury.

### Deconstructed Anatomy of the Visual Reference

| Section | Key Visual Characteristics | Recurring Patterns |
| :--- | :--- | :--- |
| **Hero (Header)** | Full-bleed cinematic photography of rolling emerald hills and solar-integrated architecture; floating pill navigation; bold white headline; white pill CTA with directional arrow; floating preview card overlay in lower right. | Pill buttons (`rounded-full`), floating glassmorphic widgets, high-contrast white text on deep organic background. |
| **Bento Grid (3 Cards)** | Warm off-white canvas (`#F4F6F4`); centered eyebrow and H2; 3 asymmetrical cards: 1 dark photo card with circular kilowatt meter ("Saving 610 kW"), 2 clean white minimalist cards with circular icon badges and clean body text. | Generous corner radii (`rounded-3xl` / 28px), circular icon pods, circular metric gauges, subtle 1px border. |
| **Split Feature Section** | 2-column layout: Left column contains eyebrow, bold display heading, narrative body text, bulleted checklist with checkmark icons, and dark pill CTA. Right column features an expansive architectural photo of a timber-and-solar homestead with an integrated glassmorphic overlay ("700 kW"). | Circular checklist icons, frosted glass (`backdrop-blur-md`) data widget docked over image, dark green primary CTA. |
| **3-Column Story Cards** | 3 tall portrait-oriented cards displaying serene landscapes (wind farm sunset, steppe homestead, rainbow dome) with circular centered badge icons, bold bottom titles, and descriptive captions over subtle dark gradient scrims. | Portrait aspect ratio, dark bottom gradient scrim for text readability, centered circular glass icons. |
| **Dark Immersive Banner** | Full-width deep forest container (`#113B27`) with misty valley backdrop; massive centered headline ("Where sustainability meets style."); white pill CTA; 3 docked horizontal glass cards along the bottom with numerical indices ("01", "02", "03"), thumbnails, and titles. | Step-counter badges, bottom-docked glass cards, deep forest atmospheric contrast. |
| **Testimonial & Proof** | Split 2-column card layout: Left card features a large quotation mark icon, customer testimonial quote, avatar, role, and a pagination pill widget (`01 / 03`). Right card features a solar-paneled modern roofline with a floating brand badge. | Quotation icon glyph, pagination counters, balanced split composition. |
| **Footer & Newsletter** | Deep dark forest rounded-top container; top newsletter banner with pill input containing email field and embedded submit arrow; structured 4-column link tree with circular social buttons; subtle divider and bottom copyright bar. | High-radius container top (`rounded-t-[36px]`), pill input with nested button, circular social icon buttons. |

---

## 2. Design Philosophy & Core Principles

The design language of **Nettle Regenerative** is governed by five guiding principles:

### 1. Organic Architecture Meets High-Tech Precision
Clean energy and regenerative technology should feel natural, serene, and grounded. We balance hyper-precise digital interfaces (clean typography, fine-line circular gauges, crisp metrics) with natural textures, rich landscape imagery, and warm earthy undertones.

### 2. Luminous Contrast & Atmospheric Depth
Instead of flat, monotonous interfaces, we utilize dramatic tonal shifts:
* **Deep Immersion (Forest Dark):** Hero sections, thematic highlight banners, and footers draw users into a tranquil, cinematic environment.
* **Clarity & Light (Warm Off-White):** Content, data tables, feature breakdowns, and readable body sections sit on warm, restful light surfaces that prevent eye strain.
* **Glassmorphism:** Translucent surfaces (`backdrop-blur-md`, subtle white borders) float over photography to provide layered depth without obstructing the imagery.

### 3. Tactile Pill Geometry (`rounded-full` & `rounded-3xl`)
Every primary interactive element (buttons, search bars, email fields, filter badges) employs a pill form factor (`rounded-full`). Containers, cards, and image frames use generous modern corner radii (`rounded-3xl`, 24px–32px). This creates an inviting, human-friendly aesthetic.

### 4. Micro-Metric Storytelling
Key data points (kilowatts saved, efficiency percentages, step numbers) are elevated to primary visual accents through circular radial gauges, tabular numerals, and glowing secondary-green highlights (`#84C135`).

### 5. Restraint in Color Application
Brand colors are assigned precise functional roles. Green is not sprayed haphazardly; `#113B27` provides deep, grounding authority, `#84C135` acts as the energetic spark for actionable feedback and data visualizations, and `#654320` anchors natural timber and earth tones.

---

## 3. Color System & Semantic Tokens

### 3.1 Core Brand Palette

```
┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│        PRIMARY         │  │       SECONDARY        │  │   ACCENT / SUPPORTING  │
│        #113B27         │  │        #84C135         │  │        #654320         │
│   Deep Forest Pine     │  │   Vibrant Solar Lime   │  │   Warm Timber Bronze   │
└────────────────────────┘  └────────────────────────┘  └────────────────────────┘
```

| Token Name | Hex Code | HSL | Primary Roles & Usage |
| :--- | :--- | :--- | :--- |
| `color-brand-primary` | `#113B27` | `hsl(154, 55%, 15%)` | Hero backgrounds, dark sections, footer surface, primary text on light backgrounds, dark pill buttons. |
| `color-brand-secondary`| `#84C135` | `hsl(86, 57%, 48%)` | Energy metrics, circular gauge arcs, active status dots, focused ring highlights, vibrant pill buttons, CTA hover glow. |
| `color-brand-accent` | `#654320` | `hsl(31, 52%, 26%)` | Earthy accents, architectural timber tags, subtle warm badge borders, earthy icon containers. |

---

### 3.2 Extended Tonal Scales

#### Primary Green Scale (`#113B27`)
* `primary-950`: `#091E14` (Ultra-deep forest, hero gradient base, footer background)
* `primary-900`: `#113B27` **(Brand Primary Base)**
* `primary-800`: `#174A32` (Card surface on dark mode, button hover state)
* `primary-700`: `#226343` (Interactive borders, secondary headers on dark)
* `primary-600`: `#2F7E56` (Muted accent line, decorative borders)
* `primary-200`: `#C3D8CD` (Subtle tint for dark-on-light cards)
* `primary-100`: `#E4EDE8` (Light surface badge background)
* `primary-50`:  `#F2F7F4` (Soft tinted page canvas)

#### Secondary Solar Lime Scale (`#84C135`)
* `secondary-600`: `#6BA327` (Hover state for lime buttons)
* `secondary-500`: `#84C135` **(Brand Secondary Base)**
* `secondary-400`: `#99D34C` (High-contrast text on dark surfaces)
* `secondary-200`: `#D2EEA2` (Translucent chart fills)
* `secondary-100`: `#EBF7D9` (Success badge backgrounds)
* `secondary-50`:  `#F6FCED` (Highlight card tint)

#### Accent Timber Bronze Scale (`#654320`)
* `accent-700`: `#4B3116` (Deep shadow tint)
* `accent-600`: `#654320` **(Brand Accent Base)**
* `accent-500`: `#7F562B` (Hover state for earthy elements)
* `accent-200`: `#D8C4B0` (Warm card border)
* `accent-100`: `#F1E9E0` (Warm tag background)
* `accent-50`:  `#FAF7F3` (Warm neutral surface)

#### Neutrals & Surfaces
* `neutral-white`: `#FFFFFF` (Card surfaces, light button pills, high-contrast headings on dark)
* `neutral-canvas`: `#F7F9F6` (Main light page background with a hint of warm sage)
* `neutral-canvas-alt`: `#EFF2EE` (Subtle section alternating background)
* `neutral-card-border`: `rgba(17, 59, 39, 0.08)` (Delicate 1px card boundaries)
* `neutral-text-primary`: `#11231A` (Body and header text on light backgrounds)
* `neutral-text-secondary`: `#52665B` (Secondary descriptions, subheadings, metadata)
* `neutral-text-muted`: `#7E9387` (Captions, helper labels, disabled states)

---

### 3.3 Semantic & Feedback States

| State | Foreground | Background | Border | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | `#1E5C1B` | `#ECF8EB` | `#A6E09D` | Positive metrics, successful submission alerts, active solar production. |
| **Warning** | `#7A4B00` | `#FFF8E6` | `#F7D278` | System advisory notices, maintenance window, battery low warning. |
| **Error** | `#8E1E1E` | `#FDF2F2` | `#F5A3A3` | Validation error, input failure, offline inverter notification. |
| **Info** | `#113B27` | `#F2F7F4` | `#C3D8CD` | Informative tips, explanatory tooltips, calculation breakdowns. |

---

### 3.4 Glassmorphic & Translucent Tokens

Used for floating data widgets, navigation bars, and overlays above photographic imagery:

* `glass-bg-light`: `rgba(255, 255, 255, 0.22)` with `backdrop-blur(16px)`
* `glass-border-light`: `rgba(255, 255, 255, 0.35)` (1px solid)
* `glass-bg-dark`: `rgba(17, 59, 39, 0.65)` with `backdrop-blur(20px)`
* `glass-border-dark`: `rgba(255, 255, 255, 0.16)` (1px solid)
* `glass-shadow`: `0 20px 40px -15px rgba(0, 0, 0, 0.25)`

---

## 4. Typography & Text Hierarchy

### 4.1 Font Family Selection

* **Primary Display & Headings:** `Plus Jakarta Sans` (or `Geist Sans`)  
  *Geometric, crisp, modern letterforms with exceptional weight distribution.*
* **Body & User Interface:** `Inter` (or `Geist Sans`)  
  *Optimized for high legibility, neutral aesthetic, and outstanding UI reading comfort.*
* **Metrics & Monospace Figures:** `Geist Mono` or `Plus Jakarta Sans (tabular-nums)`  
  *Ensures numerical alignment in gauges, stats, and power output counters.*

```css
--font-display: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: "Geist Mono", monospace;
```

---

### 4.2 Typographic Hierarchy Table

| Level | Role | Size (Desktop) | Size (Mobile) | Weight | Line Height | Tracking | Color (Light Surface) | Color (Dark Surface) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-hero` | Hero Main Title | `4.25rem` (68px) | `2.5rem` (40px) | 700 (Bold) | 1.08 | `-0.025em` | `#11231A` | `#FFFFFF` |
| `h1` | Major Section Header | `3.25rem` (52px) | `2.125rem` (34px) | 700 (Bold) | 1.15 | `-0.02em` | `#113B27` | `#FFFFFF` |
| `h2` | Feature & Bento Title | `2.25rem` (36px) | `1.75rem` (28px) | 600 (SemiBold) | 1.22 | `-0.015em` | `#113B27` | `#FFFFFF` |
| `h3` | Card & Widget Heading | `1.5rem` (24px) | `1.25rem` (20px) | 600 (SemiBold) | 1.30 | `-0.01em` | `#11231A` | `#FFFFFF` |
| `h4` | Sub-card & Item Title | `1.125rem` (18px) | `1.0rem` (16px) | 600 (SemiBold) | 1.35 | `0` | `#113B27` | `#F2F7F4` |
| `eyebrow` | Category / Pre-title | `0.8125rem` (13px)| `0.75rem` (12px) | 600 (SemiBold) | 1.40 | `+0.06em` | `#52665B` or `#113B27` | `#A6D765` / `#84C135` |
| `body-large` | Hero Subtitles / Lead | `1.1875rem` (19px)| `1.0625rem` (17px)| 400 (Regular) | 1.60 | `0` | `#405349` | `rgba(255, 255, 255, 0.82)` |
| `body` | Standard Body Copy | `1.0rem` (16px) | `0.9375rem` (15px)| 400 (Regular) | 1.60 | `0` | `#52665B` | `rgba(255, 255, 255, 0.72)` |
| `body-small` | Captions & Metadata | `0.875rem` (14px) | `0.8125rem` (13px)| 400 (Regular) | 1.50 | `+0.01em` | `#7E9387` | `rgba(255, 255, 255, 0.60)` |
| `button-text`| Pill Actions & Tabs | `0.9375rem` (15px)| `0.875rem` (14px) | 600 (SemiBold) | 1.00 | `0` | Match Button Context | Match Button Context |
| `metric-stat`| Kilowatt Display | `1.75rem` (28px) | `1.5rem` (24px) | 700 (Bold) | 1.00 | `-0.02em` | `#113B27` | `#FFFFFF` |

---

## 5. Spacing Scale & Layout Principles

We utilize an **8pt foundational grid**, with 4pt micro-adjustments for fine UI components (badges, buttons, icons).

```
4px   (0.25rem)   ─── space-1   (Micro gap, icon padding)
8px   (0.5rem)    ─── space-2   (Badge internal padding, tight gap)
12px  (0.75rem)   ─── space-3   (Pill button Y padding, input Y padding)
16px  (1.0rem)    ─── space-4   (Standard element gap, base padding)
20px  (1.25rem)   ─── space-5   (Card compact padding)
24px  (1.5rem)    ─── space-6   (Pill button X padding, card padding)
32px  (2.0rem)    ─── space-8   (Large card internal padding, layout gap)
48px  (3.0rem)    ─── space-12  (Bento grid gutter, section divider)
64px  (4.0rem)    ─── space-16  (Standard section vertical margin)
80px  (5.0rem)    ─── space-20  (Medium section padding)
96px  (6.0rem)    ─── space-24  (Major landing section vertical padding)
128px (8.0rem)    ─── space-32  (Hero and feature separation)
```

---

## 6. Layout, Grids & Page Architecture

### 6.1 Container Widths

* **Maximum Content Boundary:** `max-w-7xl` (`1280px` / `80rem`) with fluid horizontal gutter:
  * Desktop (`≥ 1024px`): `px-8` (32px)
  * Tablet (`640px – 1023px`): `px-6` (24px)
  * Mobile (`< 640px`): `px-4` (16px)
* **Narrow Focus Container (Forms, Articles, Modals):** `max-w-3xl` (`768px`)
* **Hero Display Frame:** `max-w-[1400px]` with subtle container edge border.

---

### 6.2 Structural Layout Patterns (Derived from Visual Reference)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FLOATING NAVIGATION BAR                         │
│                    [Logo]      [Nav Links]      [CTA]                  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                        HERO SECTION (DARK IMMERSIVE)                   │
│   "Experience the future of Solar power."                              │
│   [Get Started ->]                      ┌──────────────────────────┐   │
│   (O)(O)(O) Socials                     │ Floating Preview Widget  │   │
│                                         └──────────────────────────┘   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                    BENTO GRID SECTION (LIGHT CANVAS)                   │
│   Eyebrow + Centered Headline                                          │
│   ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│   │ Image Card        │  │ Icon Card         │  │ Icon Card         │  │
│   │ "Saving 610 kW"   │  │ "Best Production" │  │ "Better Future"   │  │
│   │ [Radial Gauge]    │  │                   │  │                   │  │
│   └───────────────────┘  └───────────────────┘  └───────────────────┘  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                    SPLIT SHOWCASE SECTION                              │
│   ┌───────────────────────────────┐  ┌──────────────────────────────┐  │
│   │ Eyebrow + Headline            │  │ Wide Architectural Photo     │  │
│   │ Paragraph Copy                │  │                              │  │
│   │ (✓) Value Prop 1              │  │      ┌────────────────────┐  │  │
│   │ (✓) Value Prop 2              │  │      │ Glass Widget 700kW │  │  │
│   │ [Get Started ->]              │  │      └────────────────────┘  │  │
│   └───────────────────────────────┘  └──────────────────────────────┘  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                    3-COLUMN STORY / PHOTO SECTION                      │
│   ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│   │ Portrait Photo 1  │  │ Portrait Photo 2  │  │ Portrait Photo 3  │  │
│   │ (Icon Badge)      │  │ (Icon Badge)      │  │ (Icon Badge)      │  │
│   │ Bottom Title      │  │ Bottom Title      │  │ Bottom Title      │  │
│   └───────────────────┘  └───────────────────┘  └───────────────────┘  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                    MID-PAGE IMMERSIVE BANNER (DARK)                    │
│   "Where sustainability meets style."                                  │
│   [Get Started ->]                                                     │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│   │ [01] Dock Card   │  │ [02] Dock Card   │  │ [03] Dock Card   │     │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘     │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                    TESTIMONIAL & PROOF SECTION                         │
│   ┌───────────────────────────────┐  ┌──────────────────────────────┐  │
│   │ “ Large Quote Mark            │  │ Architectural Visual Card    │  │
│   │ Quote narrative copy          │  │                              │  │
│   │ [Avatar] Name - Role   [01/03]│  │                              │  │
│   └───────────────────────────────┘  └──────────────────────────────┘  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                    FOOTER & NEWSLETTER (DARK)                          │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Newsletter Headline             [ Your email... | Submit -> ]  │   │
│   ├────────────────────────────────────────────────────────────────┤   │
│   │ [Brand]       [Quick Links]      [Information]     [Discover]  │   │
│   │ (C) 2026 Nettle Regenerative. All rights reserved.             │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 7. UI Components Specification

### 7.1 Buttons & Interactive Pills

All buttons strictly adopt the **pill geometry** (`rounded-full`) with right-arrow icons for momentum and action.

```
┌──────────────────────────────┐  ┌──────────────────────────────┐  ┌──────────────────────────────┐
│       PRIMARY LIGHT PILL     │  │       PRIMARY DARK PILL      │  │      VIBRANT ACCENT PILL     │
│       Get Started    [→]     │  │       Get Started    [→]     │  │       Explore Plans   [→]    │
│  bg-white text-primary-900   │  │  bg-primary-900 text-white   │  │  bg-secondary-500 text-dark  │
└──────────────────────────────┘  └──────────────────────────────┘  └──────────────────────────────┘
```

#### Button Specifications

| Variant | Normal State | Hover State | Active / Focus State | Usage Context |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Light** | `bg-white text-[#113B27] shadow-sm` | `bg-[#84C135] text-[#113B27] shadow-md transform -translate-y-0.5` | `ring-2 ring-[#84C135] ring-offset-2 ring-offset-[#113B27]` | Hero sections, dark banners, image overlays. |
| **Primary Dark** | `bg-[#113B27] text-white shadow-sm` | `bg-[#1B4F35] text-white shadow-md transform -translate-y-0.5` | `ring-2 ring-[#84C135] ring-offset-2 ring-offset-white` | Light bento sections, feature rows, white forms. |
| **Vibrant Accent** | `bg-[#84C135] text-[#091E14] font-semibold` | `bg-[#99D34C] shadow-lg shadow-[#84C135]/30 transform -translate-y-0.5` | `ring-2 ring-[#113B27] ring-offset-2` | High-conversion promotional CTAs, calculator triggers. |
| **Glass Ghost** | `bg-white/10 text-white border border-white/25 backdrop-blur-md` | `bg-white/20 border-white/40 text-white` | `ring-2 ring-white/50` | Secondary hero actions, floating preview cards. |
| **Circular Icon** | `w-10 h-10 rounded-full border border-white/25 bg-white/5 text-white flex-center` | `bg-[#84C135] text-[#113B27] border-[#84C135]` | `ring-2 ring-[#84C135]` | Social buttons, carousel sliders, pagination. |

#### Code Token Pattern (Tailwind v4 / CSS)
```html
<!-- Primary Dark Button Example -->
<button class="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-[#113B27] text-white text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-[#1B4F35] hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#84C135] focus:ring-offset-2 cursor-pointer">
  <span>Get Started</span>
  <span class="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-xs transition-transform group-hover:translate-x-1">
    →
  </span>
</button>
```

---

### 7.2 Cards & Bento Containers

Cards feature generous **28px to 32px border radii** (`rounded-3xl`), subtle boundaries, and clean elevation.

#### 1. Image-Backed Bento Card (Dark / Rich)
* **Background:** High-definition photography with an upward dark gradient scrim (`linear-gradient(to top, rgba(17,59,39,0.92) 0%, rgba(17,59,39,0.4) 60%, transparent 100%)`).
* **Content:** White typography, top category label, and bottom circular kilowatt meter graphic (`Saving 610 kW`).
* **Border:** `1px solid rgba(255, 255, 255, 0.15)`.

#### 2. Clean Surface Bento Card (Light Minimalist)
* **Background:** Solid Pure White (`#FFFFFF`).
* **Icon Header:** 48px circle or rounded-2xl square with soft tint (`bg-[#F2F7F4] text-[#113B27]`).
* **Border:** `1px solid rgba(17, 59, 39, 0.07)`.
* **Shadow:** `0 10px 30px -10px rgba(17, 59, 39, 0.05)`.
* **Hover:** Subtle upward translation `-4px` and shadow deepening.

#### 3. Tall Portrait Story Card
* **Aspect Ratio:** `3 / 4` or `4 / 5`.
* **Corner Radius:** `rounded-3xl` (28px).
* **Overlay:** Centered floating translucent circle icon, bottom text block with dark gradient scrim.

#### 4. Docked Horizontal Glass Card
* **Layout:** Horizontal card with step badge (`01`, `02`, `03`), small rounded photo thumbnail, and compact description text.
* **Surface:** Frosted glass (`rgba(255, 255, 255, 0.12)`, `backdrop-blur-md`, `border border-white/20`).

---

### 7.3 Glassmorphic Floating Data Overlays

As observed in the reference hero and the split showcase section, interactive data widgets float organically over photography.

```html
<!-- Floating Kilowatt Widget -->
<div class="relative p-5 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl text-white max-w-[240px]">
  <div class="flex items-center justify-between mb-3">
    <span class="text-xs uppercase tracking-wider text-white/75 font-medium">Energy</span>
    <span class="w-2 h-2 rounded-full bg-[#84C135] animate-pulse"></span>
  </div>
  <div class="flex items-center gap-4">
    <!-- Mini SVG Arc Gauge -->
    <div class="relative w-12 h-12 flex items-center justify-center">
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path class="text-white/20" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        <path class="text-[#84C135]" stroke-dasharray="75, 100" stroke-width="3.5" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
      </svg>
      <span class="absolute text-[10px] font-bold">75%</span>
    </div>
    <div>
      <div class="text-2xl font-bold tracking-tight">700 <span class="text-xs font-normal text-white/80">kW</span></div>
      <p class="text-[11px] text-white/70">Nettle Solar Grid</p>
    </div>
  </div>
</div>
```

---

### 7.4 Circular Gauges & Metric Indicators

Data metrics must never be displayed as plain text alone. We use circular radial indicators directly inspired by the "Saving 610 kW" meter:

* **Active Stroke:** Brand Secondary `#84C135` (Solar Lime)
* **Track Stroke:** `rgba(255, 255, 255, 0.2)` on dark, `rgba(17, 59, 39, 0.12)` on light
* **Cap Style:** `stroke-linecap="round"`
* **Metric Typography:** Tabular bold numbers (`font-bold tracking-tight`)

---

### 7.5 Navigation Header & Mobile Bar

#### Desktop Header
* **Structure:** Floating island pill or full-width borderless header nestled in the hero.
* **Left:** Brand Wordmark / Logo ("Nettle Regenerative").
* **Center:** Pill container with frosted glass (`bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-2 rounded-full`). Links: "Impact", "Calculator", "Plans", "Projects", "About Us".
* **Right:** Action button (`Get Started` or `Contact Us` pill).

#### Mobile Drawer
* Full-screen smooth slide-in or sheet overlay with `bg-[#113B27]/98 backdrop-blur-2xl`.
* Large tactile navigation links (24px bold) with lime hover indicator.
* Bottom action stack with phone contact and social buttons.

---

### 7.6 Forms, Inputs & Newsletter Field

#### The Signature Newsletter Pill (From Reference Footer)
The footer newsletter element embeds the submit button directly inside a pill-shaped input capsule:

```html
<!-- Footer Newsletter Capsule -->
<form class="relative flex items-center w-full max-w-md bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-1.5 focus-within:border-[#84C135] focus-within:ring-2 focus-within:ring-[#84C135]/40 transition-all">
  <div class="pl-4 pr-2 text-white/50">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
  </div>
  <input 
    type="email" 
    placeholder="Your email here" 
    class="w-full bg-transparent text-white placeholder-white/50 text-sm focus:outline-none py-2"
    required
  />
  <button 
    type="submit" 
    class="w-10 h-10 rounded-full bg-white text-[#113B27] flex items-center justify-center hover:bg-[#84C135] transition-colors cursor-pointer shrink-0"
    aria-label="Subscribe"
  >
    →
  </button>
</form>
```

#### Standard In-App Form Inputs
* **Geometry:** `rounded-2xl` (16px) or `rounded-full` for search bars.
* **Background:** Light surfaces `#FFFFFF`, dark surfaces `rgba(255, 255, 255, 0.08)`.
* **Border:** `1px solid rgba(17, 59, 39, 0.15)`.
* **Focus State:** `border-[#84C135] ring-2 ring-[#84C135]/30 outline-none`.

---

### 7.7 Dropdowns & Select Menus

* **Container:** Floating popover card (`bg-white` with `shadow-2xl` and `rounded-2xl` border `border-neutral-200/80`).
* **Item States:** Default text `#11231A`, hover `bg-[#F2F7F4] text-[#113B27] font-medium`, selected item decorated with a `#84C135` checkmark or dot.
* **Chevron Animation:** Smooth 180° rotation on toggle (`transition-transform duration-200`).

---

### 7.8 Modals & Dialog Overlays

* **Backdrop:** `bg-[#091E14]/70 backdrop-blur-md` with smooth fade-in.
* **Dialog Container:** `rounded-[32px] bg-white p-8 max-w-lg shadow-2xl border border-black/5`.
* **Close Action:** Circular `w-9 h-9 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 flex-center`.

---

### 7.9 Tables & Data Lists

Used for solar energy production reports, billing summaries, and project milestones:

* **Header:** Subtle background `#F2F7F4`, text `uppercase tracking-wider text-xs font-semibold text-[#52665B]`.
* **Row Separators:** `border-b border-neutral-100`.
* **Row Hover:** `hover:bg-[#F2F7F4]/60 transition-colors`.
* **Data Numbers:** Tabular figures (`tabular-nums font-medium`).

---

### 7.10 Badges, Tags & Status Pills

All badges use small pill containers (`rounded-full px-3 py-1 text-xs font-semibold`):

| Badge Type | Background | Text | Border | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Active / Solar Live** | `bg-[#84C135]/15` | `text-[#3B660E]` | `border border-[#84C135]/30` | Inverter online, production active, savings recorded. |
| **Eco Category Tag** | `bg-[#113B27]/10` | `text-[#113B27]` | `border border-[#113B27]/15` | Blog categories, service types, technical specs. |
| **Timber Accent Tag** | `bg-[#654320]/10` | `text-[#654320]` | `border border-[#654320]/20` | Architectural tiers, materials, residential tags. |
| **Numerical Index** | `bg-white/90` | `text-[#113B27]` | `border border-black/5` | Step pills (`01`, `02`, `03` in dark banner). |

---

### 7.11 Alerts & In-App Notifications

* **Success Alert:** `bg-[#F2F9ED] border border-[#84C135]/40 text-[#1E5C1B] rounded-2xl p-4 flex gap-3 items-start`.
* **Warning Alert:** `bg-[#FFF9EE] border border-[#E0A838]/40 text-[#855308] rounded-2xl p-4 flex gap-3 items-start`.
* **Info Alert:** `bg-[#F2F7F4] border border-[#113B27]/20 text-[#113B27] rounded-2xl p-4 flex gap-3 items-start`.

---

### 7.12 Tabs & Segmented Switches

* **Track:** Pill container `bg-neutral-200/60 p-1 rounded-full flex gap-1`.
* **Active Pill:** `bg-[#113B27] text-white shadow-sm rounded-full px-5 py-2 text-sm font-semibold transition-all`.
* **Inactive Pill:** `text-neutral-600 hover:text-neutral-900 rounded-full px-5 py-2 text-sm font-medium`.

---

### 7.13 Pagination & Numerical Steppers

Inspired by the `01 / 03` counter widget in the reference testimonial section:

* **Format:** `01 / 03` in bold mono/tabular text (`text-sm font-bold text-neutral-800`).
* **Controls:** Twin circular buttons (`w-8 h-8 rounded-full border border-neutral-300 flex-center hover:bg-[#113B27] hover:text-white hover:border-[#113B27]`).

---

### 7.14 Empty & Loading Skeleton States

* **Empty State:** Clean circular icon with leaf or sun motif, centered display text, reassuring paragraph, and primary pill action.
* **Loading Skeletons:** Animated shimmering gradient (`bg-neutral-200 animate-pulse`), strictly inheriting `rounded-3xl` for cards and `rounded-full` for buttons and badges to prevent layout shifts.

---

## 8. Border Radius, Borders & Shadows

### 8.1 Border Radius Scale

```
rounded-sm    ─── 6px     (Tooltips, fine UI indicators)
rounded-md    ─── 10px    (Sub-badges, internal tags)
rounded-lg    ─── 14px    (Small input fields)
rounded-xl    ─── 18px    (Dropdown menus, popovers)
rounded-2xl   ─── 22px    (Standard cards, dialog containers)
rounded-3xl   ─── 28-32px (Primary Bento Cards, Photos, Story Modules)
rounded-full  ─── 9999px  (All buttons, badges, chips, newsletter inputs)
```

> **Strict Rule:** Never use square or sharp corners (`rounded-none` or `rounded-xs`). All cards must feel soft, organic, and inviting.

---

### 8.2 Borders & Dividers

* **Light Mode Cards:** `1px solid rgba(17, 59, 39, 0.08)`
* **Dark Mode Cards:** `1px solid rgba(255, 255, 255, 0.16)`
* **Subtle Dividers:** `border-t border-neutral-200/70` (light) or `border-t border-white/10` (dark)

---

### 8.3 Elevation & Shadow System

```css
/* Card resting state on light canvas */
--shadow-card-resting: 0 4px 20px -4px rgba(17, 59, 39, 0.05);

/* Card hover state */
--shadow-card-hover: 0 20px 40px -12px rgba(17, 59, 39, 0.12);

/* Floating glassmorphic widget */
--shadow-glass-float: 0 20px 50px -10px rgba(0, 0, 0, 0.35);

/* Vibrant solar glow for secondary accents */
--shadow-glow-lime: 0 8px 24px -4px rgba(132, 193, 53, 0.40);
```

---

## 9. Responsive Design & Breakpoint Behavior

### 9.1 Breakpoint Standards

* **Mobile (`sm`):** `360px – 639px`
* **Tablet Portrait (`md`):** `640px – 767px`
* **Tablet Landscape / Small Laptop (`lg`):** `768px – 1023px`
* **Standard Desktop (`xl`):** `1024px – 1279px`
* **Wide Monitor (`2xl`):** `1280px and above`

---

### 9.2 Section-by-Section Responsive Transformations

| Section | Desktop (`≥ 1024px`) | Tablet (`768px – 1023px`) | Mobile (`< 768px`) |
| :--- | :--- | :--- | :--- |
| **Hero** | Left-aligned 68px title, right-floating preview card, bottom-left socials. | 50px title, preview card repositions beneath CTA. | 38px title, centered or full-width pill buttons, preview card docks as a static card below. |
| **Bento Grid** | 3-column horizontal layout (1 dark photo card + 2 white cards). | 2-column layout (photo card spans 2 columns on top, 2 white cards below). | 1-column vertical stack (`gap-6`). |
| **Split Showcase** | 2 equal columns (50% text, 50% wide photography with overlay). | Stacked vertically: text above, full-width photo below. | Stacked vertically: photo height constrained to 320px, floating widget adapts to full width. |
| **3-Column Story** | 3 portrait cards side-by-side. | 3 cards with reduced height or 2-row layout. | Horizontal swipeable carousel or clean vertical stack. |
| **Dark Banner** | Full-width container with 3 docked horizontal cards at bottom. | 3 cards wrap into 2 + 1 layout. | 3 cards stack vertically or tabbed view. |
| **Testimonial** | 2-column split (Quote left, architectural photo right). | Stacked vertically. | Stacked vertically with quote on top. |
| **Footer** | Top newsletter row + 4-column structured link tree. | Newsletter row + 2x2 column link grid. | Newsletter stacks input and button; link tree stacks with accordion toggles. |

---

## 10. Accessibility & Inclusive Design (WCAG 2.1 AA)

1. **Color Contrast Standards:**
   * All standard body copy against light backgrounds must achieve a minimum contrast ratio of **4.5:1** (e.g., `#11231A` and `#52665B` against `#FFFFFF` / `#F7F9F6` exceed 7:1).
   * Large display headlines against dark backgrounds must achieve a minimum of **3:1** (pure white on `#113B27` provides a **12.6:1** ratio).
   * Secondary Green (`#84C135`) must only be paired with dark forest green (`#113B27` or `#091E14`) when displaying text to guarantee readability.

2. **Keyboard Focus States:**
   * Never suppress default outlines without providing an accessible alternative.
   * Universal focus treatment:
     ```css
     :focus-visible {
       outline: none;
       box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #84C135;
     }
     ```

3. **Touch Targets:**
   * All mobile buttons, pill actions, circular controls, and input fields must meet the minimum target size of **44px × 44px**.

4. **Screen Reader Support:**
   * Circular icon buttons must include descriptive `aria-label` attributes (e.g., `aria-label="Subscribe to newsletter"`, `aria-label="Previous testimonial"`).
   * Circular progress meters must expose semantic `role="meter"` or `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.

5. **Reduced Motion:**
   * Respect user system preferences via `@media (prefers-reduced-motion: reduce)`. Disable smooth float oscillations and card upward hover translations for sensitive users.

---

## 11. Design Do's and Don'ts

### ✅ DO
* **DO** use pill buttons (`rounded-full`) for all primary actions, search bars, and tags.
* **DO** pair bold white text with rich, dark photography to maintain the cinematic nature of the reference.
* **DO** introduce circular radial gauges and micro-metrics (`610 kW`, `700 kW`) when presenting technical or environmental statistics.
* **DO** utilize `backdrop-blur-md` on semi-transparent cards to preserve legible separation over photographic backgrounds.
* **DO** anchor the layout with generous whitespace and 28px–32px corner radii on major containers.
* **DO** incorporate Brand Secondary `#84C135` as an energetic accent for active indicators, meters, and hover feedback.
* **DO** use Brand Accent `#654320` to reflect architectural wood and earthy ground elements.

### ❌ DON'T
* **DON'T** use sharp, 90-degree square corners on cards or buttons (`rounded-none` violates the aesthetic).
* **DON'T** use pure, oversaturated neon colors or uncalibrated primary red/blue/green.
* **DON'T** apply `#84C135` (Solar Lime) to large background surfaces; it is an accent, not a background canvas.
* **DON'T** place light grey text on white cards (violates WCAG readability standards).
* **DON'T** use flat generic cards without subtle borders or delicate ambient shadows.
* **DON'T** create cluttered, dense layouts; honor the serene, spacious breathing room modeled in the visual reference.

---

## 12. Developer Implementation Guide & Code Tokens

### 12.1 Tailwind CSS v4 Theme Integration

In the project's `app/globals.css`, configure the design tokens using the modern `@theme` directive:

```css
@import "tailwindcss";

@theme inline {
  /* Brand Colors */
  --color-brand-primary: #113B27;
  --color-brand-primary-hover: #174A32;
  --color-brand-primary-deep: #091E14;
  
  --color-brand-secondary: #84C135;
  --color-brand-secondary-hover: #6BA327;
  --color-brand-secondary-light: #EBF7D9;
  
  --color-brand-accent: #654320;
  --color-brand-accent-hover: #7F562B;
  --color-brand-accent-light: #FAF7F3;

  /* Neutrals & Surfaces */
  --color-canvas-light: #F7F9F6;
  --color-surface-white: #FFFFFF;
  --color-text-main: #11231A;
  --color-text-muted: #52665B;
  --color-border-subtle: rgba(17, 59, 39, 0.08);

  /* Typography */
  --font-display: var(--font-geist-sans), "Plus Jakarta Sans", sans-serif;
  --font-body: var(--font-geist-sans), "Inter", sans-serif;
  --font-mono: var(--font-geist-mono), monospace;

  /* Custom Radii */
  --radius-2xl: 22px;
  --radius-3xl: 28px;
  --radius-4xl: 36px;
}
```

---

### 12.2 CSS Custom Properties (`:root` Tokens)

```css
:root {
  /* Brand Values */
  --primary: #113B27;
  --primary-foreground: #FFFFFF;
  
  --secondary: #84C135;
  --secondary-foreground: #091E14;
  
  --accent: #654320;
  --accent-foreground: #FFFFFF;

  /* Canvas and Body */
  --background: #F7F9F6;
  --foreground: #11231A;

  /* Card and Glass */
  --card: #FFFFFF;
  --card-foreground: #11231A;
  --card-border: rgba(17, 59, 39, 0.08);
  
  --glass-bg: rgba(255, 255, 255, 0.22);
  --glass-border: rgba(255, 255, 255, 0.35);
  --glass-blur: 16px;

  /* Elevations */
  --shadow-card: 0 10px 30px -10px rgba(17, 59, 39, 0.06);
  --shadow-float: 0 20px 40px -15px rgba(0, 0, 0, 0.25);
}
```

---

### 12.3 Reusable Component Markup Templates

#### Primary CTA Pill Button (Light over Dark)
```tsx
export function PrimaryPillButton({ 
  children, 
  href = "#" 
}: { 
  children: React.ReactNode; 
  href?: string; 
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-[#113B27] text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-[#84C135] hover:text-[#113B27] hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#84C135] focus:ring-offset-2"
    >
      <span>{children}</span>
      <span className="w-6 h-6 rounded-full bg-black/5 group-hover:bg-black/10 flex items-center justify-center text-xs transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}
```

#### Bento Metric Card
```tsx
export function MetricBentoCard({
  title,
  kwValue,
  bgImageUrl,
}: {
  title: string;
  kwValue: number;
  bgImageUrl: string;
}) {
  return (
    <div 
      className="relative overflow-hidden rounded-3xl p-8 min-h-[360px] flex flex-col justify-between text-white border border-white/20 shadow-xl bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImageUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#091E14]/90 via-[#113B27]/40 to-transparent" />
      
      <div className="relative z-10">
        <h3 className="text-xl font-semibold max-w-[200px] leading-snug">
          {title}
        </h3>
      </div>

      <div className="relative z-10 flex items-end justify-between">
        <div>
          <span className="text-xs text-white/70 uppercase tracking-wider block mb-1">Saving</span>
          <span className="text-3xl font-bold tracking-tight">{kwValue} <span className="text-sm font-normal text-white/80">kW</span></span>
        </div>
        
        {/* Metric Arc Indicator */}
        <div className="w-14 h-14 rounded-full border-2 border-white/20 border-t-[#84C135] border-r-[#84C135] transform rotate-45 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#84C135] animate-ping" />
        </div>
      </div>
    </div>
  );
}
```

---

### 12.4 Image Asset Requirements & Treatments

* **Atmospheric Landscape Photography:** 
  * Resolution: Minimum `1920x1080` for hero backgrounds; `800x1000` for portrait story cards.
  * Color Grading: Natural emerald greens, warm golden-hour sunsets, soft mist, high dynamic range with deep greens and clear daylight skies.
  * Overlay Scrims: Always apply gradient overlays (`linear-gradient(to top, rgba(17,59,39,0.85), transparent)`) when rendering text over images to guarantee WCAG AA legibility.

---

### 12.5 Final Developer Rule of Consistency

Whenever building or refactoring components in `my-app`:
1. Check `design.md` for existing colors, radii, spacing, and component definitions.
2. Reuse tokens (`--color-brand-primary`, `rounded-3xl`, `rounded-full`) rather than introducing ad-hoc arbitrary Tailwind values.
3. If new design requirements emerge, update `design.md` first to preserve a single, authoritative source of truth.
