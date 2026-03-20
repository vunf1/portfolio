# Hero-Text Scroll Rules – Conflict Analysis

> **Update:** The landing hero was refactored to use shadcn-style UI (`Card`, `Badge`, `Separator`, `Button`) and a `.landing-hero__copy` column. The old `.hero-text` / `.hero-text * { overflow: hidden }` cascade was removed to fix clipping (badges, shadows, CTA hover). The analysis below documents the **previous** conflict model; current hero overflow is handled without universal descendant overrides on the copy column.

## CSS Load Order (index.css → landing.css)

1. `_layout.css` – layout, universal selectors, hero group
2. `_animations.css` – `.landing-section` overflow
3. `_hero.css` – hero-text scroll-disable, hero-title, hero-actions
4. `_features.css`, `_about.css`, `_footer.css`
5. `_responsive.css` – media queries (1025px, 480px)
6. `_accessibility.css` – reduced-motion (no overflow)

**Override layer:** `_hero.css` and `_responsive.css` include a high-specificity block (e.g. `section.landing-hero.landing-section.section-visible .hero-text` and `.hero-text *`) so hero-text and its descendants never get layout’s `overflow-y: visible` when `section-visible` is present; page scroll is preserved and hero-text does not become a scroll container.

---

## Conflicting Rules: Overflow & Touch-Action

### Rule A: Layout – Force visible overflow (CONFLICT SOURCE)

**File:** `_layout.css` lines 155-168  
**Selector:** `.landing-hero .hero-content, .landing-hero .hero-text, ...`  
**Specificity:** (0,2,0)  
```css
overflow: visible !important;
overflow-y: visible !important;
```

**File:** `_layout.css` lines 251-280  
**Selector:** `.landing-hero *` (all descendants)  
**Specificity:** (0,1,1)  
```css
overflow: visible !important;
overflow-y: visible !important;
```

### Rule B: Hero – Scroll-disable on hero-text (INTENDED)

**File:** `_hero.css` lines 86-94  
**Selector:** `.landing-hero .hero-text`  
**Specificity:** (0,2,0)  
```css
overflow: hidden !important;
overflow-y: hidden !important;
touch-action: none;
```

**File:** `_hero.css` lines 97-115  
**Selector:** `.landing-hero .hero-text *` + specific child selectors  
**Specificity:** (0,2,1) to (0,3,0)  
```css
overflow: hidden !important;
overflow-y: hidden !important;
touch-action: none !important;
```

### Rule C: Hero – Overflow visible on hero-title (CONFLICT)

**File:** `_hero.css` lines 117-130  
**Selector:** `.landing-hero .hero-title, .landing-page .hero-title`  
**Specificity:** (0,2,0)  
```css
overflow: visible !important;
overflow-x: visible !important;
```

**Resolution:** `.landing-hero .hero-text .hero-title` (0,3,0) in Rule B wins over Rule C when inside hero-text ✓

### Rule D: Hero – Overflow visible on hero-actions (CONFLICT)

**File:** `_hero.css` lines 217-220  
**Selector:** `.landing-hero .hero-actions`  
**Specificity:** (0,2,0)  
```css
overflow: visible !important;
overflow-x: visible !important;
```

**Resolution:** `.landing-hero .hero-text .hero-actions` (0,3,0) in Rule B wins ✓

### Rule E: Responsive – hero-content overflow (CONFLICT on mobile)

**File:** `_responsive.css` @media (max-width: 1025px) lines 121-133  
**Selector:** `.hero-content`  
**Specificity:** (0,1,0)  
```css
overflow: visible !important;
overflow-y: visible !important;
```

**Resolution:** `.hero-content` is the parent of `.hero-text`, not a child. Our rules target `.hero-text` and `.hero-text *`. Parent overflow does not override child overflow. ✓

### Rule F: Responsive – hero-title-subtitle overflow (WEAK CONFLICT)

**File:** `_responsive.css` lines 181-186 (1025px), 419-426 (480px)  
**Selector:** `.hero-title-subtitle`  
**Specificity:** (0,1,0)  
```css
overflow: visible;  /* No !important */
```

**Resolution:** Our `.landing-hero .hero-text *` has `overflow: hidden !important`. The `!important` wins. ✓

---

## Specificity Summary

| Selector                         | Specificity | Overflow       | Winner        |
|----------------------------------|-------------|----------------|---------------|
| `.landing-hero .hero-text`       | (0,2,0)     | hidden         | ✓ Scroll-disable |
| `.landing-hero .hero-text *`     | (0,2,1)     | hidden         | ✓ Scroll-disable |
| `.landing-hero .hero-text .hero-title` | (0,3,0) | hidden     | ✓ Scroll-disable |
| `.landing-hero .hero-text .hero-actions` | (0,3,0) | hidden  | ✓ Scroll-disable |
| `.landing-hero *` (layout)      | (0,1,1)     | visible        | ✗ Loses to hero-text * |
| `.landing-hero .hero-title`      | (0,2,0)     | visible        | ✗ Loses when inside hero-text |
| `.landing-hero .hero-actions`    | (0,2,0)     | visible        | ✗ Loses when inside hero-text |

---

## Recommendations

### 1. Remove conflicting overflow from hero-title (optional cleanup)

`_hero.css` lines 125-126 set `overflow: visible !important` on `.landing-hero .hero-title`. This conflicts for hero-title when inside hero-text. Our hero-text-specific rule wins, but the redundant visible rule can be removed for hero-text context by narrowing the selector:

- **Current:** `.landing-hero .hero-title` → overflow visible (intended for hero-visual side)
- **Safer:** Avoid overflow on hero-title when it is inside hero-text. The `.hero-title` is used in both hero-text (left column) and possibly elsewhere. Our `.landing-hero .hero-text .hero-title` already overrides. No change required.

### 2. Remove conflicting overflow from hero-actions (optional cleanup)

`_hero.css` lines 218-219 set `overflow: visible !important` on `.landing-hero .hero-actions`. Same situation: our hero-text rule wins. Optional cleanup only.

### 3. Layout universal selector purpose

`.landing-hero *` in `_layout.css` is meant to avoid scrollbars on hero children. An exception for hero-text descendants would reduce conflicts:

- Add `.landing-hero .hero-text, .landing-hero .hero-text *` with `overflow: hidden` to `_layout.css` before the universal selector, or
- Exclude hero-text from the universal rule (more complex).

Current solution (hero-specific overrides in `_hero.css` and `_responsive.css`) is sufficient; layout changes are optional.

---

## Verification

**Desktop (>1025px):** `_hero.css` scroll-disable rules apply. Layout and hero-title/hero-actions lose to hero-text rules ✓  

**Tablet/Mobile (≤1025px):** `_responsive.css` `.landing-hero .hero-text` and `.landing-hero .hero-text *` apply within the media query ✓  

**Small mobile (≤480px):** Same responsive rules at top of media query ✓  

**Touch:** `touch-action: none` on hero-text and children blocks touch scrolling ✓  

**Reduced motion:** `_accessibility.css` only sets `transition: none` on `.hero-text`, not overflow ✓
