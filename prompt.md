Audit and improve the **entire app's UI design and layout consistency**.

The goal is to make every screen feel like it belongs to the **same polished, clean, premium product**. Do not redesign the product unnecessarily or change functionality. Focus on consistency, hierarchy, spacing, states, and visual quality.

### 1. Audit the entire app first

Before making changes, inspect all screens, routes, layouts, components, and shared UI.

Identify inconsistencies in:

* Page/container widths
* Horizontal and vertical padding
* Margins and gaps
* Header/navbar heights
* Sidebar widths
* Section spacing
* Typography hierarchy
* Font sizes and weights
* Border radius
* Borders
* Shadows
* Colors
* Icons
* Buttons
* Inputs
* Cards
* Tables
* Dropdowns
* Modals/dialogs
* Empty states
* Loading states
* Error states
* No-data states
* Mobile/responsive behavior

Find existing shared components/design patterns and **reuse them instead of creating parallel implementations**.

---

### 2. Establish consistent app layout

Create a consistent layout system across all screens.

Standardize:

* Maximum content width
* Page-level horizontal padding
* Page-level vertical spacing
* Header spacing
* Sidebar/content relationship
* Section gaps
* Card padding
* Grid/list gaps
* Form spacing
* Responsive breakpoints

Avoid screens where one page feels:

* Too cramped
* Too wide
* Too padded
* Too close to the navbar
* Inconsistent with neighboring pages

Every page should follow the same basic visual rhythm.

---

### 3. Standardize page structure

Where appropriate, pages should follow a consistent structure:

```text
App Shell
 ├── Sidebar / Navigation
 └── Main Content
      ├── Page Header
      │    ├── Title
      │    ├── Description
      │    └── Actions
      │
      └── Page Content
           ├── Sections
           ├── Cards / Tables / Forms
           └── Supporting content
```

Do not force this structure where it doesn't make sense, but maintain consistent alignment and spacing.

---

### 4. Fix Loading States

Audit every screen that performs asynchronous operations.

Loading states should:

* Match the final layout dimensions
* Prevent layout jumps
* Use consistent skeleton components
* Use consistent skeleton shapes
* Use appropriate animation
* Avoid random spinners everywhere
* Preserve page structure while content loads

For example, if a page eventually displays a table, the loading state should resemble the table rather than showing a generic centered spinner.

Create/reuse shared loading components where possible.

---

### 5. Fix Error States

Standardize error handling UI across the application.

Error states should have:

* Clear visual hierarchy
* Short, understandable message
* Appropriate icon
* Primary recovery action where possible
* Consistent spacing
* Consistent typography
* Consistent container treatment

Avoid inconsistent error implementations such as:

* Raw red text
* Browser-like alerts
* Random cards
* Huge error illustrations
* Different button styles

Different error types can have different layouts, but they should clearly belong to the same design system.

---

### 6. Fix Empty / No-Data States

Audit every screen where data can legitimately be empty.

Create consistent empty states for:

* Empty lists
* Empty tables
* No projects
* No documents
* No search results
* No activity
* No repositories
* No notifications
* First-time states

Each should communicate:

1. What is empty
2. Why it might be empty, when useful
3. What the user can do next

Keep them minimal and premium. Avoid excessive illustrations or unnecessary copy.

---

### 7. Standardize components

Identify repeated UI patterns and consolidate them.

Prioritize consistency for:

* Buttons
* Inputs
* Selects
* Tabs
* Badges
* Cards
* Tables
* Dialogs
* Dropdowns
* Tooltips
* Alerts
* Skeletons
* Empty states
* Error states

If the same concept is implemented differently in multiple places, create/use a shared component.

Do not create abstractions purely for the sake of abstraction.

---

### 8. Typography

Establish a clear typography hierarchy.

Ensure consistent:

* Page titles
* Section headings
* Subheadings
* Body text
* Descriptions
* Labels
* Metadata
* Helper text
* Error text

Avoid arbitrary font sizes and weights across screens.

Typography should feel restrained and professional.

---

### 9. Spacing system

Use a consistent spacing scale throughout the application.

Pay particular attention to:

* Page padding
* Header → content spacing
* Title → description spacing
* Description → actions spacing
* Section → section spacing
* Card internal padding
* Form field spacing
* Table row spacing
* Empty-state spacing

Remove arbitrary one-off spacing values where an existing design token can be used.

---

### 10. Responsive design

Audit the application at:

* Mobile
* Tablet
* Laptop
* Large desktop

Fix:

* Overflow
* Broken grids
* Excessive whitespace
* Cramped layouts
* Incorrect padding
* Misaligned buttons
* Sidebar behavior
* Tables
* Dialogs
* Headers
* Empty/loading/error states

Responsive behavior should feel intentional rather than simply stacking everything vertically.

---

### 11. Visual style

Keep the overall visual language:

* Clean
* Minimal
* Premium
* Technical
* Modern
* Restrained

Avoid unnecessary:

* Gradients
* Excessive shadows
* Excessive rounded cards
* Decorative elements
* Huge empty containers
* Random colors
* Excessive animations
* Visual noise

Prefer strong typography, spacing, alignment, subtle borders, and clear hierarchy.

---

### 12. Consistency rules

When fixing a screen, **do not optimize it in isolation**.

Always compare it against the rest of the application.

If you discover a better pattern on one screen:

1. Determine whether it should become the shared pattern.
2. Update the shared component/design token if appropriate.
3. Apply the pattern consistently across relevant screens.

The goal is **system-level consistency**, not individual screen perfection.

---

### 13. Implementation rules

* Inspect before modifying.
* Reuse existing components wherever possible.
* Prefer shared components over duplicated UI.
* Prefer design tokens over arbitrary values.
* Do not change business logic.
* Do not change API behavior.
* Do not remove functionality.
* Do not introduce unnecessary dependencies.
* Do not rewrite working components without a reason.
* Preserve accessibility.
* Preserve responsive behavior.
* Preserve existing routes and interactions.

After implementation, run the project's typecheck/lint/build checks and fix any issues introduced by the UI changes.

### Final verification

Perform a final pass across **every screen** and verify:

* [ ] App shell is consistent
* [ ] Page padding is consistent
* [ ] Content widths are consistent
* [ ] Typography hierarchy is consistent
* [ ] Spacing follows a predictable system
* [ ] Buttons and inputs are consistent
* [ ] Cards/tables are consistent
* [ ] Loading states match their content
* [ ] Error states are consistent
* [ ] Empty states are consistent
* [ ] Responsive layouts work correctly
* [ ] No unnecessary visual noise exists
* [ ] No duplicated UI patterns remain where shared components make sense
* [ ] Overall app feels like one cohesive premium product

**Do not stop after fixing the most obvious screens. Audit the complete application and apply the design system consistently across all routes and states.**
