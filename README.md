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
| Hosting | GitHub Pages (free) |
| CI/CD | GitHub Actions |

---

## Local Development

```bash
# 1. Clone your repo
git clone https://github.com/YOUR_USERNAME/weekflow.git
cd weekflow

# 2. Install dependencies
npm install

# 3. Start dev server
npm start
# Opens http://localhost:3000
```

---

## Deploy to GitHub Pages (Free)

### Step 1 - Create a new GitHub repository

Go to github.com/new and create a public repository named `weekflow`.

### Step 2 - Push this code

```bash
git init
git add .
git commit -m "Initial WeekFlow PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/weekflow.git
git push -u origin main
```

### Step 3 - Enable GitHub Pages with Actions

1. Go to your repo on GitHub
2. Click **Settings** then **Pages**
3. Under "Source", select **GitHub Actions**
4. The deploy workflow at `.github/workflows/deploy.yml` runs automatically on every push to `main`

### Step 4 - Done

Your app will be live at `https://YOUR_USERNAME.github.io/weekflow/` within about 60 seconds.

---

## Install on iPhone

1. Open `https://YOUR_USERNAME.github.io/weekflow/` in **Safari**
2. Tap the Share button (box with arrow)
3. Tap **Add to Home Screen**
4. Tap **Add**

WeekFlow will appear on your home screen and launch full-screen like a native app.

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
