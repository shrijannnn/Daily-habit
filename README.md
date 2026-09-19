# HabitPulse ⚡ — Modern Portfolio-Grade Habit Tracker

[![Deploy to GitHub Pages](https://github.com/shrijannnn/habit-tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/shrijannnn/habit-tracker/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Built With React & Vite](https://img.shields.io/badge/React_18-Vite_6-61DAFB.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit_Tested-729B1B.svg)](https://vitest.dev/)

> **HabitPulse** is a fast, minimalist, and responsive Habit Tracking web application built to help users master daily consistency, celebrate milestones, and visualize their progress over time. Zero backend or account creation needed — powered by resilient `localStorage` and client-side calculations.

🌐 **Live Demo:** [https://shrijannnn.github.io/habit-tracker](https://shrijannnn.github.io/habit-tracker)

---

## ✨ Key Features

- 🎯 **Full Habit Management (CRUD + Archive)**: Custom name, emoji icons, curated color accent themes, and optional motivation descriptions.
- 📅 **Flexible Frequencies**: Configure habits for **Every Day** or **Specific Weekdays** (e.g. Mon / Wed / Fri, Weekends, Workdays).
- ⚡ **Interactive "Today" View**: One-click check-off with micro-animations, pleasant audio chimes, and past-day backfill carousel.
- 🔥 **Intelligent Streak Engine**:
  - Streak calculations respecting custom schedules (missing an unscheduled day does not break your streak).
  - Tracks both **Current Streak** and **Longest Streak (Record)** per habit.
- 🟩 **12-Month GitHub-Style Contribution Heatmap**:
  - Full 52-week activity grid with dynamic intensity shading.
  - Interactive tooltips showing completed habit details on hover.
  - Filter heatmap for all habits combined or isolate individual habits.
- 📊 **Analytics & Insights Dashboard**:
  - 7-day, 30-day, and all-time completion rate percentages.
  - Recharts-powered **Weekly Completion Bar Chart**.
  - **Spotlight Best Habit** card highlighting top performers.
- 🏆 **Milestone Celebrations**:
  - Particle confetti bursts (`canvas-confetti`) at **7, 30, 100, and 365-day** streak milestones.
- 🌓 **Dark & Light Mode**: Seamless theme switching with system preference detection and localStorage persistence.
- 💾 **JSON Backup, Restore & Seed Demo**:
  - Export snapshot as JSON and import back with schema validation.
  - Pre-populated portfolio seed data option for immediate visual demonstration.
- ⌨️ **Keyboard Shortcuts**:
  - `N`: Create new habit
  - `1`: Switch to Today view
  - `2`: Switch to 12M Heatmap
  - `3`: Switch to Analytics

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Core Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 6 |
| **Styling & Design** | Tailwind CSS v3, Tailwind Merge, Clsx, Lucide React Icons |
| **Data Visualization** | Recharts & Custom SVG Heatmap Matrix |
| **Date Calculations** | `date-fns` v3 |
| **Celebration Effects** | `canvas-confetti` + Web Audio API |
| **Testing** | Vitest + React Testing Library |
| **CI/CD Deployment** | GitHub Actions (`deploy.yml`) -> GitHub Pages |

---

## 🧪 Testing & Code Quality

Pure utility functions for date manipulations and streak counting are thoroughly tested:

```bash
# Run unit test suite
npm run test
```

### Test Coverage includes:
- Brand new habits with zero history
- Consecutive daily completions incrementing streak
- Uncompleted today preserving previous active streak
- Custom frequency (Mon/Wed/Fri) streak evaluation
- Longest streak calculation across historical gaps
- Timezone and midnight date key stability (`YYYY-MM-DD`)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- npm (or yarn / pnpm)

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/shrijannnn/habit-tracker.git
cd habit-tracker

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📦 Deployment to GitHub Pages

1. Push your code to the `main` branch on GitHub.
2. Go to **Settings > Pages** in your GitHub repository.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` workflow will automatically run tests, build the bundle, and deploy to GitHub Pages.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
