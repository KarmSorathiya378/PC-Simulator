# PC Builder Lab

**Interactive Virtual Computer Assembly & Hardware Learning Web Application**

A desktop-first educational simulator designed to teach students computer hardware fundamentals through hands-on virtual PC assembly, socket validation, cable routing, and interactive assessments.

---

## Getting Started

### Development Server
To launch the Vite development server with hot module reloading:

```bash
npm run dev
```

The app will start at `http://localhost:3000` (or the port assigned by Vite).

### Production Build
To run TypeScript verification and compile the optimized production bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Tech Stack & Architecture

- **Build & Runtime:** [Vite](https://vite.dev/) 6 + [React](https://react.dev/) 18 + [TypeScript](https://www.typescriptlang.org/) 5
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) using the native `@tailwindcss/vite` plugin
- **UI Component Primitives:** [shadcn/ui](https://ui.shadcn.com/) (Button, Card, Dialog, Badge, Tooltip, Tabs, Progress, Select, Scroll-Area, Separator, Toggle-Group, Alert, Skeleton)
- **Icons:** [lucide-react](https://lucide.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/) (`react-router-dom`)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Canvas Rendering:** Konva & react-konva

---

## Design System & Language

The application follows a clean, light-first SaaS educational aesthetic. It conveys calm authority and hardware precision without being toy-like.

### Design Tokens
Global design tokens are declared as CSS variables in `src/index.css` and mapped into Tailwind v4:

- **Theme Default:** Light mode by default, with optional dark mode toggled via `.dark` CSS class switching and persisted in localStorage.
- **Surfaces:** Soft off-white canvas (`hsl(210 20% 98%)`), elevated pure white cards, and subtle 1px low-contrast borders (`hsl(214 28% 89%)`).
- **Primary Accent:** Focused tech indigo/blue (`hsl(231 84% 58%)` in light mode, `hsl(231 84% 65%)` in dark mode) for focused interactive targets.
- **Typography:** [Inter](https://fonts.google.com/specimen/Inter) font family loaded via Google Fonts with system fallback stack for crisp legibility.
- **Border Radius:** Generous rounded scale (`--radius: 0.75rem` / 12px) for a modern, tactile feel.
- **Micro-Interactions:** Subtle press-down scale feedback (`active:scale-[0.98]`), fast responsive transitions under 200ms using custom easing curves per Emil Kowalski's guidelines.

---

## UI Design Skills

The following specialized UI design skills are installed and registered in `.agents/skills` to govern frontend craft, taste, and motion:

1. **`emilkowalski/skill` (`emil-design-eng`, `animate`, `apple-design`, etc.)**
   - High-craft interface engineering principles.
   - Strict animation rules: purpose-driven, under 300ms, custom ease-out curves, no gratuitous delays, active press feedback.
2. **`impeccable`**
   - Visual hierarchy, typography, optical alignment, spacing rhythm, and responsive layouts.
3. **`Leonxlnx/taste-skill` (`design-taste-frontend`)**
   - Anti-slop frontend standards: avoids generic templates, enforces restrained palettes, high-contrast typography, and purposeful compositions.

---

## App Shell & Routes

The shared `AppShell` (`src/components/ui/app-shell.tsx`) provides the top header, navigation tabs, theme toggle, and responsive container layout:

- `/` — **Overview & Home**: Product introduction, feature highlights, and learning module selection grid.
- `/learn` — **Learn Mode**: Hardware component anatomy, specifications, and socket reference.
- `/guided` (or `/assembly`) — **Guided Assembly**: Interactive step-by-step assembly simulator with hints and valid-slot highlights.
- `/challenge` — **Challenge Mode**: Independent assembly test with 100-point rubric scoring and mistake audit.
- `/connection` — **Connection Mode**: Motherboard 24-pin ATX, 8-pin CPU EPS, PCIe power, and front panel header cabling.
- `/results` — **Results**: Performance evaluation, correct installations, incorrect attempts, and concepts to review.
