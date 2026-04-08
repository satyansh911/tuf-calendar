# Interactive Wall Calendar Component

A polished, responsive React/Next.js interactive calendar component inspired by physical wall calendars. Built with TypeScript, Tailwind CSS, and features a modern UI with comprehensive date range selection and integrated notes functionality.

## Features

### Core Features
- **Wall Calendar Aesthetic**: Clean, modern design inspired by physical wall calendars with a dedicated hero image area and organized date grid
- **Day Range Selector**: 
	- Click first date to set start date (highlighted in solid blue)
	- Click second date to set end date (highlighted with date range shown in light blue)
	- Full visual feedback for selected range
	- Clear visual distinction between start, end, and in-between dates
  
- **Integrated Notes Section**:
	- General notes for the month
	- Save and load notes for specific date ranges
	- Notes auto-save to browser localStorage
	- View all saved notes in a scrollable preview
	- Delete individual saved notes
  
- **Fully Responsive Design**:
	- **Desktop**: Side-by-side layout with hero image on left, calendar and notes on right
	- **Tablet**: Compact layout with proper spacing
	- **Mobile**: Stacked vertical layout with full functionality on touch screens

### Extra Features
- **Dynamic Hero Image**: Upload custom images or use the default mountain scene
- **Month Navigation**: Easy previous/next month buttons
- **Local Storage Persistence**: All data persists in browser between sessions
- **Smooth Animations**: Hover effects and transitions throughout the UI
- **Accessibility**: Semantic HTML, keyboard navigable, clear visual states

## Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Icons**: lucide-react
- **Storage**: Browser localStorage (no backend required)
- **Package Manager**: npm

## Project Structure

```
e:\tuf-assignment/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Main page component
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Calendar.tsx        # Main calendar container component
│   │   ├── CalendarGrid.tsx    # Calendar grid with date cells
│   │   └── NotesSection.tsx    # Notes input and saved notes display
│   └── ...
├── public/
│   ├── mountain.svg            # Default hero image
│   └── ...
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## Component Architecture

### `Calendar` Component
- Main container and state management
- Handles month navigation
- Manages date range selection
- Handles hero image uploads
- Saves/loads data from localStorage

### `CalendarGrid` Component
- Displays calendar grid for current month
- Renders day of week headers
- Manages visual states for selected dates
- Handles date click events
- Optimized with useMemo for performance

### `NotesSection` Component
- Text area for typing notes
- Save functionality for date ranges
- Display saved notes preview
- Load/delete saved notes
- Manages range-specific notes in localStorage

## Installation

### Prerequisites
- Node.js 18+ and npm

### Steps

1. **Clone or download the project**
	 ```bash
	 cd e:\tuf-assignment
	 ```

2. **Install dependencies**
	 ```bash
	 npm install
	 ```

3. **Run development server**
	 ```bash
	 npm run dev
	 ```
	 The app will be available at `http://localhost:3000`

4. **Build for production**
	 ```bash
	 npm run build
	 npm start
	 ```

## Usage

### Selecting a Date Range
1. **Click a date** in the calendar grid to set the start date (appears in solid blue)
2. **Click another date** to set the end date (the range is highlighted in light blue)
3. **Click "Clear Selection"** to reset and start a new range

### Managing Notes
1. **Type notes** in the text area - supports both general month notes and range-specific notes
2. **Click "Save for Range"** (only available when dates are selected) to save notes tied to that date range
3. **Click "Load Saved"** to retrieve previously saved notes for the current selection
4. **Click "Delete"** to remove saved notes for a range
5. Notes are automatically persisted in browser storage

### Changing the Hero Image
1. **Hover over the hero image** on the left side
2. **Click "Click to change"** to open file picker
3. **Select an image** from your computer
4. The image will update immediately and persist across sessions

### Navigating Months
- **Click the left arrow** to go to the previous month
- **Click the right arrow** to go to the next month

## Responsive Design

The component automatically adapts to different screen sizes:

- **Desktop (1024px+)**: 3-column grid layout
	- Left: Hero image and selected dates display
	- Right: Calendar grid and notes section stacked
  
- **Tablet (768px - 1023px)**: Adjusted spacing and padding
	- Still side-by-side but more compact
  
- **Mobile (<768px)**: Stacked vertical layout
	- All components stack for easy scrolling
	- Touch-friendly button sizes
	- Full-width text areas and date cells

## Data Persistence

All data is stored locally in the browser using localStorage:

- **Calendar Data**: Current month, selected date range, general notes
- **Range Notes**: Map of date ranges to their associated notes
- **Hero Image**: Stored as data URL in localStorage (limited by storage size)

Data persists across browser sessions but is specific to each browser/device.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome for Android 90+)

## Performance Optimizations

- **Memoized Calendar Grid**: Uses `useMemo` to prevent unnecessary re-renders of the date grid
- **Efficient Date Comparisons**: Optimized date range checking logic
- **Lazy State Updates**: Only updates when necessary
- **Responsive Image Handling**: SVG placeholder for fast initial load

## CSS/Styling Approach

The project uses Tailwind CSS for:
- Responsive grid layouts with `grid-cols-1 lg:grid-cols-3`
- Conditional styling with Tailwind's `group-hover` for interactive states
- Smooth transitions and transforms for hover effects
- Gradient backgrounds for modern aesthetic
- Shadow and rounded corner utilities for depth

## Key Design Decisions

1. **Client-Side Storage**: No backend required, making deployment simple
2. **TypeScript**: Ensures type safety and better development experience
3. **Tailwind CSS**: Rapid development and consistent design tokens
4. **Component Composition**: Separated concerns into focused, reusable components
5. **Responsive Grid**: CSS Grid for flexible desktop-to-mobile layouts
6. **localStorage API**: Simple, battle-tested solution for client-side persistence

## Future Enhancement Ideas

- **Holiday Markers**: Highlight holidays automatically
- **Recurring Events**: Set up repeating events
- **Multiple Calendars**: Support for multiple calendar views
- **Export/Import**: Export notes as PDF or import calendar data
- **Dark Mode**: Toggle dark theme
- **Themes**: Multiple color themes based on hero image
- **Keyboard Shortcuts**: Quick navigation with keyboard
- **Sync**: Cloud sync with backend (optional)
- **Print**: Print calendar with notes

## Testing

To test the component:

1. **Date Range Selection**:
	 - Click dates and verify they highlight correctly
	 - Test selecting dates out of order (should auto-swap)
	 - Test clearing selection

2. **Notes Functionality**:
	 - Save notes for a range and verify they're stored
	 - Switch to different date ranges and verify notes are independent
	 - Test loading, editing, and deleting saved notes

3. **Responsive Design**:
	 - Open DevTools and test at mobile (375px), tablet (768px), and desktop (1024px+)
	 - Verify all interactive elements work on touch screens
	 - Test image upload on mobile

4. **Persistence**:
	 - Refresh the page and verify data persists
	 - Clear localStorage and verify fresh state
	 - Test in different browsers

## Deployment

The project can be deployed to:

- **Vercel** (recommended):
	```bash
	npm install -g vercel
	vercel
	```

- **Netlify**:
	- Connect GitHub repository
	- Build command: `npm run build`
	- Publish directory: `.next`

- **GitHub Pages**:
	- Export as static site with `next export`

- **Traditional Hosting**:
	- Run `npm run build` then `npm start` on server

## License

MIT License - feel free to use this component in your projects!

## Author Notes

This calendar component demonstrates:
- Modern React patterns with hooks and component composition
- Responsive design that works seamlessly across devices
- Client-side state management and persistence
- Attention to UX details (visual feedback, animations, accessibility)
- Clean, maintainable code structure with TypeScript

Enjoy building with this component! 🗓️

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
