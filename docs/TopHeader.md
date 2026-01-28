# TopHeader Component

## Overview

The `TopHeader` component is a responsive header bar for the PEM Digital application. It provides navigation, search functionality, notifications, settings, and user profile access in a clean, accessible layout.

## Features

- **Responsive Design**: Adapts to different screen sizes using Tailwind CSS breakpoints.
- **Accessibility**: Includes ARIA labels, semantic HTML (`<header role="banner">`), and keyboard navigation support.
- **Search Bar**: Integrated search input visible on medium screens and above.
- **Notifications**: Bell icon with a badge indicating unread notifications.
- **Dropdown Menus**: For project selection, notifications, settings, and user profile.
- **Dark Mode Support**: Uses CSS variables for theming.
- **Brand Integration**: Displays the project logo and brand text.

## Usage

Import and use the component in your layout:

```tsx
import { TopHeader } from "@/shared/components/top-header";

function AppLayout() {
  return (
    <div>
      <TopHeader />
      {/* Main content */}
    </div>
  );
}
```

## Structure

- **Left Section**: Project logo, brand text (hidden on small screens), and search bar (hidden on small/medium screens).
- **Right Section**: Project selector (hidden on small screens), notifications dropdown, settings dropdown, and user profile dropdown.

## Props

The component currently has no props and uses hardcoded values for demonstration. In a real application, consider making it configurable:

- `notificationCount`: Number of unread notifications.
- `user`: User object for profile display.
- `projects`: Array of available projects.

## Styling

- Uses Tailwind CSS classes and custom utilities from `index.css`.
- CSS variables from the design system (e.g., `--color-grey-50`, `--font-helvetica-now`).
- Responsive breakpoints: `sm` (640px+), `md` (768px+), `lg` (1024px+).

## Accessibility

- Semantic `<header>` with `role="banner"`.
- ARIA labels on interactive elements (e.g., buttons).
- Badge includes dynamic ARIA label for screen readers.
- Focus management via shadcn/ui components.

## Dependencies

- React
- Lucide React (icons)
- shadcn/ui components (Button, Input, DropdownMenu, etc.)
- Tailwind CSS

## Notes

- The notification count is currently hardcoded to 3. Replace with dynamic data.
- Search functionality is not implemented; add event handlers as needed.
- For production, consider memoizing the component with `React.memo` if re-renders are frequent.