# Copilot Instructions - Interactive Calendar Component

## Project Overview
Interactive React/Next.js calendar component with date range selection, notes functionality, and responsive design. Built with TypeScript and Tailwind CSS. No backend required - all data stored client-side with localStorage.

## Key Files & Architecture
- **src/components/Calendar.tsx** - Main container, state management, month navigation
- **src/components/CalendarGrid.tsx** - Memoized date grid, range highlighting
- **src/components/NotesSection.tsx** - Notes textarea, save/load/delete functionality
- **src/app/page.tsx** - Home page entry point
- **public/mountain.svg** - Default hero image placeholder

## Technology Stack
- Next.js 16 (App Router)
- TypeScript for type safety
- Tailwind CSS for styling
- React Hooks for state (useState, useEffect, useMemo)
- localStorage API for persistence
- lucide-react for icons

## Code Style & Patterns
- Use TypeScript strictly - all components have proper type annotations
- Component composition preferred over large mixed files
- React Hooks for state management (useState, useEffect)
- useMemo for performance-critical calculations
- Tailwind utility classes for styling
- Client-side only - no server-side rendering needed for this component

## Feature Requirements
1. **Wall Calendar Aesthetic**: Hero image + calendar grid layout
2. **Day Range Selector**: First click = start, second click = end (with auto-swap)
3. **Notes Section**: General notes + range-specific saved notes
4. **Responsive Design**: Desktop (side-by-side), mobile (stacked)
5. **Data Persistence**: All data saved to localStorage automatically
6. **User Feedback**: Visual states, smooth animations, hover effects

## Common Customizations
- **Colors**: Edit tailwind.config.ts theme.extend.colors
- **Fonts**: Update font imports in src/app/layout.tsx
- **Spacing**: Adjust Tailwind utility values in components
- **Hero Image**: Replace SVG in public/mountain.svg
- **Default Month**: Change initial date in Calendar component state

## Testing Checklist
- [ ] Date range selection: two clicks create range with correct highlighting
- [ ] Notes save/load: range-specific notes persist and load correctly
- [ ] Responsive: layout works on 375px (mobile), 768px (tablet), 1920px (desktop)
- [ ] Persistence: refresh page and verify data persists
- [ ] Image upload: can upload and see custom image (small files only)
- [ ] Month navigation: prev/next buttons work, calendar grid updates correctly

## Performance Notes
- CalendarGrid uses useMemo to prevent re-renders of 35+ date cells
- Efficient date comparisons avoid creating unnecessary Date objects
- No external API calls - everything client-side
- Tailwind CSS is purged in production (small bundle)

## Documentation Files
- **README.md** - Complete user guide with features and API
- **FEATURES.md** - Design decisions, feature deep-dive, technical details
- **DEVELOPMENT.md** - Developer guide with extension examples and testing
- **QUICK_START.md** - Quick reference guide for getting started
- **QUICK_START_CALENDAR.md** - This file

## Common Issues & Solutions
- **localStorage undefined**: Always wrap in useEffect for client-side only
- **Image upload persistence**: Only works for small files; large files need compression
- **Dates off by one**: Remember month is 0-indexed in Date constructor
- **Tailwind styles not applying**: Use full class names, never dynamic strings

## Deployment Guidance
- Recommended: Vercel (automatic Git integration, free tier)
- Alternative: Netlify, GitHub Pages, or any Node.js server
- Build command: `npm run build`
- Start command: `npm start`

## When Extending This Component
1. Maintain TypeScript strictness
2. Keep components focused and under 300 lines
3. Use Tailwind utilities - minimize custom CSS
4. Test responsiveness at mobile/tablet/desktop
5. localStorage for new persistent features
6. Check browser console for errors

## Git & Version Control
- Built with Next.js productivity features
- Hot reload enabled for development
- ESLint configured for code quality
- TypeScript strict mode enabled

## Notes
- No backend/database needed - this is intentional for simplicity and privacy
- All user data stays in their browser
- Component is fully self-contained and can be extracted/reused
- Comment complex logic for maintainability
- Keep components pure and deterministic when possible

---

**Quick Commands:**
```bash
npm run dev      # Start development server
npm run build    # Build production bundle
npm start        # Start production server
npm run lint     # Check code quality
```
