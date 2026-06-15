# WeekFlow
**Author: Andrei Ando**

A minimalist weekly to-do planner built as a Progressive Web App (PWA). Inspired by Apple Notes and Apple Reminders, focused exclusively on weekly task planning. No login, no backend, no ads.

---

## Features

- Weekly view from Monday to Sunday
- Tap the circle to complete a task (yellow checkmark)
- Swipe left on any task to delete it
- Long-press a task to edit it
- Tap + (FAB or the day's own + button) to add a task to any day
- Incomplete tasks automatically roll over to today each time the app opens
- At the start of a new week, any leftover tasks move to Monday
- Fully offline after first load
- Installable on iPhone/iPad via Safari "Add to Home Screen"
- All data stored locally in the browser - never leaves your device

---

## Tech Stack

| Layer | Choice |
|---|---|
| UI | React 18 |
| Styling | Tailwind CSS 3 |
| Storage | Browser LocalStorage |
| PWA | Custom Service Worker |


---


## Project Structure

```
weekflow/
  .github/workflows/deploy.yml   # Auto-deploy to GitHub Pages
  public/
    index.html                   # HTML shell
    manifest.json                # PWA manifest
    sw.js                        # Service worker (offline support)
    icon-192.png                 # App icon
    icon-512.png                 # App icon (large)
  src/
    index.js                     # React entry point + SW registration
    index.css                    # Tailwind + global styles
    App.jsx                      # Root component
    components/
      DayCard.jsx                # One card per weekday
      TaskRow.jsx                # Task row with swipe + long-press
      Checkbox.jsx               # Animated circle checkbox
      AddTaskSheet.jsx           # Bottom sheet to add tasks
      FAB.jsx                    # Floating action button
    hooks/
      useTasks.js                # All task state + rollover logic
    utils/
      weekUtils.js               # Date helpers
      storage.js                 # LocalStorage read/write
```

---

## Data Schema

Tasks are stored as a JSON array in `localStorage` under the key `weekflow_tasks`.

```json
[
  {
    "id": "uuid-v4",
    "title": "Write weekly review",
    "completed": false,
    "assignedDate": "2024-06-10",
    "createdAt": "2024-06-10T09:00:00.000Z"
  }
]
```
