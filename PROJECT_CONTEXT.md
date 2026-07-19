# PROJECT_CONTEXT.md — imgsfix

> **Project memory for future sessions.** This file documents the complete structure, features, and conventions of the imgsfix project. Use it to quickly resume work in future sessions.

## Project Overview

**imgsfix** is a privacy-focused, 100% client-side web application for local image processing, QR/barcode scanning, and advanced image editing. No backend, no servers, no uploads — all processing happens in the browser via HTML5 Canvas API and Fabric.js.

- **Philosophy**: Privacy-first, free forever, no sign-up, bilingual (EN/AR with RTL)
- **Tech stack**: HTML5, CSS3, Vanilla JS (ES5-compatible IIFE modules), Tailwind-free custom CSS, Fabric.js 5.3.0 (CDN), Google Fonts Cairo
- **No dependencies on**: Node.js, npm, build tools, bundlers, Supabase, any backend, any API

---

## Project Structure

```
imgsfix/
├── index.html                      # Home page (hero, services, tools, workflow, features, CTA)
├── PROJECT_CONTEXT.md              # This file
├── css/
│   └── style.css                   # Complete design system (~36KB)
├── js/
│   ├── main.js                     # Shared logic: i18n, theme, header/footer, toast, modal (~26KB)
│   ├── tool-core.js                # Shared tool workspace: file loading, before/after, progress (~7KB)
│   ├── qr-reader.js                # QR/barcode scanner (~6KB)
│   └── editor.js                   # Fabric.js advanced editor (~16KB)
├── pages/
│   ├── about.html                  # About page
│   ├── services.html               # Services overview
│   ├── contact.html                # Contact form (client-side validated)
│   ├── faq.html                    # FAQ accordion (10 items)
│   ├── privacy-policy.html         # Privacy policy
│   ├── terms.html                  # Terms of use
│   ├── cookies.html                # Cookie policy
│   ├── disclaimer.html             # Disclaimer
│   ├── 404.html                    # 404 error page
│   ├── qr-reader.html              # QR/barcode reader page
│   ├── advanced-editor.html        # Advanced image editor page
│   └── tools/
│       ├── compress.html           # Image compression (quality slider, format select)
│       ├── resize.html             # Image resize (W/H inputs, aspect ratio lock)
│       ├── convert.html            # Format conversion (JPG/PNG/WebP)
│       ├── crop.html               # Interactive crop (drag selection, AR presets)
│       ├── remove-bg.html          # Background removal (color sampling, tolerance)
│       ├── cartoon.html            # Cartoonize (Sobel edges + posterize)
│       ├── enhance.html            # Enhancement (brightness/contrast/saturation/sharpness)
│       └── filters.html            # 8 preset filters with intensity control
```

**Total: 24 files** (1 CSS, 4 JS, 19 HTML)

---

## All Implemented Features

### Core Platform
- **Light/Dark theme system**: CSS custom properties with `[data-theme]` attribute, animated toggle, LocalStorage persistence
- **Bilingual i18n (EN/AR)**: `data-i18n` attributes, dictionary in `main.js`, RTL direction switching, `data-i18n-ph` for placeholders
- **Depth-aware BASE path**: Auto-computes relative paths from any directory level (`./` at root, `../` or `../../` for subpages)
- **Sticky glass header**: Logo, nav links, language switcher (EN/ع), theme toggle, CTA button, injected by `buildHeader()`
- **4-column footer**: Brand/about, Tools links, Company links, Resources links, bottom bar with copyright + theme indicator, injected by `buildFooter()`
- **Mobile hamburger menu**: Slide-in drawer, toggled by menu button
- **Scroll-to-top button**: Appears after 400px scroll, smooth scroll back
- **Toast notifications**: `imgsfix.toast(msg, kind)` — supports 'ok', 'err', default kinds
- **Modal system**: `imgsfix.openModal(title, body, onConfirm)` — overlay with backdrop blur
- **Reveal-on-scroll**: IntersectionObserver adds `.in` class to `.reveal` elements
- **Search filter**: Instant tool filtering on home page tools grid
- **Breadcrumbs**: On every tool and content page
- **SEO**: Meta descriptions, Open Graph tags, semantic HTML, canonical links
- **Accessibility**: ARIA labels, landmark roles, keyboard navigation, focus-visible outlines, sr-only class
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables animations

### Home Page Sections
1. **Hero**: Badge, gradient heading, lead text, 2 CTAs, 5 stat badges, animated visual (orbit rings + floating core)
2. **Services**: 3 cards (Image Tools, QR & Barcodes, Advanced Editor)
3. **Tools grid**: 8 tool cards with search box for instant filtering
4. **Workflow**: 3-step process (Pick → Drop → Download) with connecting lines
5. **Features**: 4 cards (Private, Fast, Free, Bilingual)
6. **CTA banner**: Gradient background with floating orbs, 2 action buttons

### 8 Image Tools (all in `pages/tools/`)
Each tool uses the shared `tool-core.js` workspace with:
- Drag & drop file upload + click to browse
- File validation (image type check, 50MB max)
- Before/after comparison slider (clip-based reveal)
- Progress indicator with simulated progress
- Download / Reset / Clear buttons
- Paste support (Ctrl+V from clipboard)

| Tool | Key Features |
|------|-------------|
| **Compress** | Quality slider (10-100%), format select (JPG/WebP/PNG), size comparison display |
| **Resize** | Width/height inputs, aspect ratio lock checkbox, high-quality smoothing |
| **Convert** | Format dropdown (JPG/PNG/WebP), quality slider for lossy formats |
| **Crop** | Interactive drag-to-select crop area, 7 aspect ratio presets, live coordinate display |
| **Remove BG** | Click-to-sample background color, tolerance slider (0-120), transparent/white/custom background |
| **Cartoonize** | Sobel edge detection + color posterization, edge intensity, color levels, smoothness controls |
| **Enhance** | Brightness, contrast, saturation (±100), sharpness (0-100 via convolution kernel) |
| **Filters** | 8 presets (grayscale, sepia, invert, warm, cool, vintage, noir), intensity slider (0-100%) |

### QR & Barcode Reader (`pages/qr-reader.html`)
- **Camera mode**: Live scanning via `getUserMedia`, device selection dropdown
- **Image mode**: Upload image file for scanning
- Uses native **BarcodeDetector API** (Chrome/Edge/Android Chrome)
- Supports QR, Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E
- Scan overlay with animated scan line
- Result actions: Copy, Open URL, Clear
- Graceful fallback message for unsupported browsers
- Privacy note badge

### Advanced Editor (`pages/advanced-editor.html`)
Powered by **Fabric.js 5.3.0** (CDN):
- **5 canvas presets**: IG Post (1080²), IG Story (1080×1920), YT Thumb (1280×720), FB Post (1200×630), Custom (1920×1080)
- **8 tools**: Select, Brush (free drawing), Text (editable IText), Rectangle, Circle, Triangle, Line, Arrow
- **Properties panel**: Fill color, opacity (0-100%), rotation (0-360°), font size, text content, bold/italic/underline, text alignment
- **Layers panel**: List with select/delete, auto-updates on add/remove/modify
- **Object ordering**: Bring forward/front, send backward/back
- **Undo/Redo**: JSON snapshot stack (max 60 states)
- **Duplicate**: Clone selected object with offset
- **Zoom controls**: Zoom in/out/fit
- **Background color picker**
- **Export PNG** (2× multiplier)
- **Save/Load project** to LocalStorage
- **Keyboard shortcuts**: Del (delete), Ctrl+Z (undo), Ctrl+Y (redo), Ctrl+D (duplicate), Ctrl+S (save)
- **Auto-fit canvas** to container on load and resize

### Content Pages (9 pages in `pages/`)
| Page | Purpose |
|------|---------|
| **about.html** | Mission, how it works, team philosophy, technology, privacy values |
| **services.html** | Three pillars overview with links to all tools |
| **contact.html** | Client-side validated contact form with privacy note |
| **faq.html** | 10 accordion items covering common questions |
| **privacy-policy.html** | Full privacy policy (no data collection, no servers, no analytics) |
| **terms.html** | Terms of use (8 sections) |
| **cookies.html** | Cookie policy (no tracking cookies, localStorage only) |
| **disclaimer.html** | General disclaimer |
| **404.html** | Error page with big "404" and go-home button |

---

## All Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `index.html` | Hero, services, tools grid, workflow, features, CTA |
| Compress | `pages/tools/compress.html` | Image compression tool |
| Resize | `pages/tools/resize.html` | Image resize tool |
| Convert | `pages/tools/convert.html` | Format conversion tool |
| Crop | `pages/tools/crop.html` | Interactive crop tool |
| Remove BG | `pages/tools/remove-bg.html` | Background removal tool |
| Cartoonize | `pages/tools/cartoon.html` | Cartoon effect tool |
| Enhance | `pages/tools/enhance.html` | Image enhancement tool |
| Filters | `pages/tools/filters.html` | Preset filters tool |
| QR Reader | `pages/qr-reader.html` | QR/barcode scanner |
| Editor | `pages/advanced-editor.html` | Fabric.js advanced editor |
| About | `pages/about.html` | About page |
| Services | `pages/services.html` | Services overview |
| Contact | `pages/contact.html` | Contact form |
| FAQ | `pages/faq.html` | FAQ accordion |
| Privacy Policy | `pages/privacy-policy.html` | Privacy policy |
| Terms | `pages/terms.html` | Terms of use |
| Cookies | `pages/cookies.html` | Cookie policy |
| Disclaimer | `pages/disclaimer.html` | Disclaimer |
| 404 | `pages/404.html` | Error page |

**Total: 20 HTML pages**

---

## Libraries Used

| Library | Version | Source | Purpose |
|---------|---------|--------|---------|
| Fabric.js | 5.3.0 | CDN (`cdnjs.cloudflare.com`) | Advanced canvas editor (shapes, text, layers, drawing) |
| Google Fonts Cairo | - | CDN (`fonts.googleapis.com`) | Primary UI font (weights 400, 500, 700) |
| BarcodeDetector API | Native | Browser API | QR/barcode scanning (no library needed) |

**No other external dependencies.** All image processing uses native Canvas API. No npm packages, no build tools.

---

## Key Technical Patterns

### Depth-Aware BASE Path
```javascript
var depth = location.pathname.replace(/^\//, '').split('/').length - 1;
var BASE = depth === 0 ? './' : '../'.repeat(depth);
function link(p) { return BASE + p; }
```
Works from root (`index.html`), `/pages/`, and `/pages/tools/` levels.

### i18n System
- Dictionary object `I18N` with `en` and `ar` keys in `main.js`
- `t(key)` helper returns translated string
- `applyLanguage(lang)` updates all `[data-i18n]` elements via `textContent`, sets `dir` and `lang` on `<html>`, dispatches `imgsfix:langchange` event
- `data-i18n-ph` attribute for placeholder translations
- Emoji icons in badges must be wrapped in separate `<span>` (not in the `data-i18n` element) because `textContent` assignment overwrites child elements

### Theme System
- `[data-theme='light']` and `[data-theme='dark']` on `<html>` element
- CSS variables defined in `:root`, `[data-theme='light']`, `[data-theme='dark']`
- `applyTheme(theme)` sets attribute + saves to LocalStorage (`imgsfix_theme`)
- `toggleTheme()` switches between light/dark

### Tool Workspace (tool-core.js)
- `initTool(opts)` — shared initialization for all 8 image tools
- `opts.onImage(img)` — called when image loads (for setup like aspect ratio)
- `opts.onProcess(img, canvas, ctx)` — per-tool processing callback
- `opts.autoProcess` — if false, tool waits for explicit "Apply" button
- Before/after slider uses clip-based reveal: `.ba-clip` div with adjustable width %
- Returns `{ process, reset, clear, download, getOriginal, getAfterCanvas }`

### Editor (editor.js)
- Uses Fabric.js `Canvas` instance
- `saveState()` serializes canvas to JSON, pushes to undo stack (max 60)
- `isRestoring` flag prevents save-during-restore loops
- `fitCanvas()` scales canvas element to fit container while preserving internal resolution
- Layer list auto-updates via `object:added`, `object:removed`, `object:modified` events

### Asset Paths
- Root pages: `css/style.css`, `js/main.js`
- `/pages/` pages: `../css/style.css`, `../js/main.js`
- `/pages/tools/` pages: `../../css/style.css`, `../../js/main.js`

---

## CSS Design System

### Color Palette
- **Primary**: Blue ramp (50-900) — `#e8f1ff` to `#102f70`, core `#1a5fff`
- **Accent**: Cyan — `#06b6d4`
- **Success**: Green — `#10b981`
- **Warning**: Amber — `#f59e0b`
- **Error**: Red — `#ef4444`
- **Neutrals**: Theme-dependent via CSS variables

### Spacing
- 8px base system: `--s-1` (4px) through `--s-9` (96px)

### Typography
- Font: Cairo (Google Fonts)
- Sizes: `--fs-xs` (12px) through `--fs-3xl` (52px)
- Line heights: 1.6 body, 1.2 headings
- Weights: 400 regular, 500 medium, 700 bold

### Border Radius
- `--r-sm` (8px), `--r-md` (14px), `--r-lg` (20px), `--r-xl` (28px), `--r-pill` (999px)

### Components
- `.btn` (primary, secondary, ghost, sizes), `.card`, `.badge`, `.stat-badge`
- `.service-card`, `.tool-card`, `.step-card`, `.feature-card`
- `.tool-shell` (300px + 1fr), `.tool-panel`, `.tool-stage`, `.drop-zone`, `.ba-wrap`
- `.editor-shell` (240px + 1fr + 260px), `.editor-toolbar`, `.tool-btn`, `.layer-list`, `.preset-grid`
- `.video-wrap`, `.scan-overlay`, `.result-box`, `.privacy-note`
- `.faq-item`, `.form-field`, `.prose`, `.center-stack`
- `.toast`, `.modal-overlay`, `.scroll-top`, `.spinner`, `.skeleton`
- `.search-box`, `.breadcrumb`

---

## Public API (`window.imgsfix`)

```javascript
window.imgsfix = {
  t(key)               // Translate a key
  applyTheme(theme)    // 'light' or 'dark'
  toggleTheme()        // Switch theme
  applyLanguage(lang)  // 'en' or 'ar'
  toast(msg, kind)     // kind: 'ok', 'err', or undefined
  openModal(title, body, onConfirm)
  $(selector, root?)   // querySelector
  $$(selector, root?)  // querySelectorAll (returns Array)
  BASE                 // Current relative base path
  link(path)           // Prepend BASE to path
  lang                 // Current language ('en' or 'ar')
}
```

---

## Known Issues & Past Fixes

1. **Emoji in `data-i18n` elements**: `applyLanguage()` uses `textContent` which wipes child elements. Always wrap emoji in separate `<span>` outside the `data-i18n` element.
2. **Asset paths**: Must use correct relative depth — `../` for `/pages/`, `../../` for `/pages/tools/`.
3. **Language detection**: `navigator.language` check must use proper parentheses to avoid operator precedence issues.
4. **Editor `saveState`**: Must guard with `isRestoring` flag to prevent undo stack corruption during `loadFromJSON`.
5. **QR fallback**: Native `BarcodeDetector` API is not available in all browsers (notably Safari, Firefox). Show clear fallback message.

---

## Future Development Notes

### Potential Enhancements
- **Web Workers**: Offload heavy image processing (cartoonize, enhance) to Web Workers for non-blocking UI
- **Batch processing**: Allow multiple file upload and batch compress/resize/convert
- **More filters**: Additional filter presets (duotone, halftone, pixelate, blur)
- **AI background removal**: Integrate a WASM-based ML model for intelligent background removal
- **More QR formats**: Add support for Data Matrix, PDF417, Aztec codes
- **QR generator**: Create QR codes from text/URLs (not just reading)
- **Image annotation**: Add arrow/text annotation on top of images before export
- **Collage maker**: Multi-image layout tool
- **Watermark tool**: Add text or image watermarks
- **GIF maker**: Create animated GIFs from images

### Performance
- Consider lazy-loading Fabric.js only on the editor page
- Add Web Worker support for CPU-intensive operations
- Implement image downscaling for very large images before processing

### Accessibility
- Add full keyboard support for before/after slider (arrow keys)
- Add screen reader announcements for processing status
- Add high-contrast mode option

### Internationalization
- Add more languages (French, Spanish, German, Turkish)
- Add RTL-aware number formatting for Arabic

### Browser Support
- **Works**: Chrome 83+, Edge 83+, Opera 69+ (BarcodeDetector support)
- **Partial**: Firefox (no BarcodeDetector — QR reader shows fallback, all image tools work)
- **Partial**: Safari (no BarcodeDetector — QR reader shows fallback, all image tools work)
- **Minimum**: Any browser with Canvas API support for image tools

---

## File Sizes (Approximate)

| File | Size |
|------|------|
| `css/style.css` | ~36 KB |
| `js/main.js` | ~26 KB |
| `js/editor.js` | ~16 KB |
| `js/tool-core.js` | ~7 KB |
| `js/qr-reader.js` | ~6 KB |
| `index.html` | ~11 KB |
| Each tool page | ~6-8 KB |
| `pages/advanced-editor.html` | ~8 KB |
| `pages/qr-reader.html` | ~4 KB |
| Each content page | ~4-8 KB |

---

*Last updated: 2026-07-14*
