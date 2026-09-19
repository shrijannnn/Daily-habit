<div align="center">

# HabitPulse ⚡
### A Modern, Portfolio-Grade Habit & Streak Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-10B981.svg?style=for-the-badge)](LICENSE)
[![React 18](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Tested-FCC624?style=for-the-badge&logo=vitest&logoColor=black)](https://vitest.dev/)

<br />

**[🌐 View Live Demo](https://shrijannnn.github.io/Daily-habit)** • **[🚀 Quickstart](#-getting-started)** • **[✨ Features](#-core-features)** • **[🧠 Streak Engine](#-streak-engine--architecture)**

<br />

</div>

---

## 📖 Overview

**HabitPulse** is a clean, lightning-fast, and responsive Habit Tracking web application built with **React 18, TypeScript, Tailwind CSS, Recharts, and date-fns**. 

Designed to showcase clean frontend architecture, pure functional streak algorithms, and rich visual feedback — all client-side with zero login or backend requirements.

---

## ✨ Core Features

### 1. 🎯 Complete Habit Lifecycle (CRUD + Archive)
- **Customizable**: Name, emoji icon picker, color accent themes, and motivational descriptions.
- **Flexible Frequencies**:
  - **Daily**: Every day (7 days/week).
  - **Specific Weekdays**: e.g., Mon / Wed / Fri, Weekends only, or custom day schedules.
- **Archive & Restore**: Keep inactive habits saved without cluttering your active Today view.
- **Safe Deletion**: Soft confirmation dialog prevents accidental data loss.

### 2. ⚡ "Today" Interactive Dashboard
- **One-Click Check-ins**: Haptic animations and gentle audio chime when completing routines.
- **Circular Progress Ring**: Real-time visual indicator of daily completion % with dynamic motivational coaching.
- **7-Day Date Navigator**: Switch between today and past dates to review or backfill check-ins seamlessly.
- **Search & Filters**: Filter by *All*, *Pending*, *Completed*, or *Archived*.

### 3. 🟩 12-Month GitHub-Style Contribution Heatmap
- **52-Week Matrix**: Visualizes a full year (365+ days) of consistency.
- **Color Intensity Shading**: Dynamic color tiers based on completion percentage.
- **Interactive Tooltip**: Hover or tap on any day to see completed count, due count, and exact list of habits completed.
- **Habit Isolator**: Filter between combined overview or inspect an individual habit's heatmap.

### 4. 📊 Analytics & Insights Dashboard
- **4 Core KPIs**: Total Lifetime Check-ins, Active Streaks Count, Longest Record Streak, and 30-Day Average Rate.
- **Recharts Weekly Bar Chart**: Visual comparison of daily completion rates across the last 7 days.
- **Spotlight Habit Card**: Highlights your most consistent routine with performance records.
- **Habit Breakdown Table**: Detailed streak and 30-day consistency progress bars.

### 5. 🏆 Motivational Milestone Celebrations
- Particle confetti physics (`canvas-confetti`) triggered on key milestones:
  - 🔥 **7 Days**: Bronze Flame
  - ⚡ **30 Days**: Silver Flame
  - 👑 **100 Days**: Golden Legend
  - 💎 **365 Days**: Master of Habit

### 6. 🌓 Dark / Light Mode & JSON Backups
- **Theme Switcher**: Smooth transitions with automatic system theme detection.
- **JSON Export / Import**: Export full snapshot and restore with schema validation.
- **Seed Demo Data**: One-click toggle to load realistic 1-year historical demo data.

---

## 🧠 Streak Engine & Architecture

Streak calculations are handled by pure, unit-tested utility functions in [`src/utils/streakUtils.ts`](src/utils/streakUtils.ts).

### Frequency-Aware Logic:
Unlike basic counters, HabitPulse respects your scheduled days:
- If a habit is scheduled for **Mon/Wed/Fri**, missing Tuesday does **not** break the streak.
- If today is due but not yet completed, the streak from yesterday remains **active** (does not reset prematurely).

```
   Scheduled Days: [Mon] ➔ (Tue) ➔ [Wed] ➔ (Thu) ➔ [Fri]
   Status:         Done  ➔ Rest  ➔ Done  ➔ Rest  ➔ Done
   Result:         🔥 Active 3-Session Streak!
```

---

## 📁 Project Structure

```
Daily-habit/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deploy workflow
├── src/
│   ├── components/
│   │   ├── celebration/
│   │   │   └── MilestoneCelebration.tsx   # Floating confetti toast
│   │   ├── common/
│   │   │   ├── Badge.tsx                  # Reusable color badges
│   │   │   ├── Modal.tsx                  # Accessible modal overlay
│   │   │   └── ProgressRing.tsx           # SVG animated circle
│   │   ├── habit/
│   │   │   ├── HabitCard.tsx              # Interactive daily habit item
│   │   │   ├── HabitDetailModal.tsx       # 90-day mini calendar deep dive
│   │   │   ├── HabitFormModal.tsx         # Create / Edit form
│   │   │   └── HabitList.tsx              # Today view with search & filters
│   │   ├── heatmap/
│   │   │   └── HeatmapGrid.tsx            # 12-Month GitHub heatmap
│   │   ├── layout/
│   │   │   ├── DataBackupModal.tsx        # JSON Export / Import & Demo data
│   │   │   ├── DateNavigator.tsx          # 7-day date strip
│   │   │   └── Header.tsx                 # Navigation bar & theme toggle
│   │   └── stats/
│   │       └── StatsOverview.tsx          # Recharts weekly charts & KPIs
│   ├── context/
│   │   ├── HabitContext.tsx               # Central habit state & storage
│   │   └── ThemeContext.tsx               # Light/Dark mode state
│   ├── hooks/
│   │   ├── useHabits.ts                   # Habit actions hook
│   │   └── useStreaks.ts                  # Aggregated analytics hook
│   ├── types/
│   │   └── habit.ts                       # Strict TypeScript interfaces
│   ├── utils/
│   │   ├── confetti.ts                    # Confetti & audio chimes
│   │   ├── dateUtils.ts                   # Date keys & interval grids
│   │   ├── seedData.ts                    # Realistic demo habits
│   │   ├── storageUtils.ts                # LocalStorage & JSON backup
│   │   └── streakUtils.ts                 # Pure streak calculation engine
│   ├── __tests__/
│   │   ├── dateUtils.test.ts              # Unit tests for date logic
│   │   └── streakUtils.test.ts            # Unit tests for streak engine
│   ├── App.tsx                            # Root application component
│   ├── index.css                          # Tailwind CSS & custom styles
│   └── main.tsx                           # App entrypoint
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── LICENSE
└── README.md
```

---

## 🧪 Unit Testing

Run the test suite using **Vitest**:

```bash
npm run test
```

### Coverage includes:
- ✅ Brand new habits (0 streak default)
- ✅ Consecutive daily check-ins incrementing streak
- ✅ Active streak preserved when today is pending
- ✅ Custom weekday frequencies (e.g., Mon/Wed/Fri non-scheduled days ignored)
- ✅ Longest streak calculation across historical gaps
- ✅ Timezone-resilient date key generation (`yyyy-MM-dd`)
- ✅ 7-day, 30-day, and all-time completion percentages

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or v20+)
- npm (or yarn / pnpm)

### Setup & Run Locally
```bash
# 1. Clone repository
git clone https://github.com/shrijannnn/Daily-habit.git
cd Daily-habit

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|:---:|:---|
| <kbd>N</kbd> | Open **Create New Habit** modal |
| <kbd>1</kbd> | Navigate to **Today** view |
| <kbd>2</kbd> | Navigate to **12-Month Heatmap** |
| <kbd>3</kbd> | Navigate to **Analytics & Stats** |
| <kbd>Esc</kbd> | Close any open modal |

---

## 🚢 GitHub Pages Deployment

1. Go to repository **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions** (or Deploy from branch `gh-pages`).
3. Push to `main`, and the app will deploy automatically via the included workflow.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
