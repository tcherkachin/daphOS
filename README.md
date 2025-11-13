# DaphOS – Employee Time Tracking SPA

This project implements the take-home challenge for the DaphOS Frontend Coding Challenge – Employee Time Tracking UI. The goal is to build a small, API-ready Single Page Application (SPA) that manages employees and their working shifts, including visualizations and LocalStorage persistence.

The application is built with React, TypeScript, TailwindCSS, ShadCN/Radix UI, and Recharts, and follows a clean, maintainable structure with separation between UI and storage logic.

## ⭐ Features

### Employee Management
- List all employees (name, role, active/inactive)
- Create new employees
- Edit employee name & role
- Activate / deactivate employees
- Search, filter (active/inactive), and sort by name/role
- Master–detail UX layout (list on the left, details on the right)

### Shift Management
- List shifts per employee
- Add, edit, delete shifts
- Validation: End time must be after start time
- Alert messages for invalid shift ranges
- Toast notifications for success actions

### Visualizations
- Bar chart: Hours worked per day
- Employee dashboard with weekly & total hours

### Data Persistence
- All employees and shifts stored in LocalStorage
- Data survives page reloads
- Safe fallback behavior on first load

### UI/UX
- Responsive layout
- Dark/Light mode toggle
- Smooth sidebar animations
- Modern UI components (Radix/ShadC N)

## 🚀 Setup & Running the App

npm install
npm run dev


The dev server usually runs at http://localhost:5173/.

Build for production:

npm run build


## 📌 Implementation Overview (Feature → File Mapping)

| Requirement / Feature | Where implemented |
|-----------------------|------------------|
| List employees (name, role, status) | src/components/EmployeeAnimatedSidebar.tsx |
| Create employee | EmployeeAnimatedSidebar.tsx (Add dialog) + logic in App.tsx |
| Edit employee | src/components/EmployeeDetails.tsx + update logic in App.tsx |
| Activate / deactivate employee | EmployeeDetails.tsx + handleToggleEmployeeStatus in App.tsx |
| Master–detail layout | src/App.tsx |
| Persist data in LocalStorage | src/src/storage/localStorage.ts |
| Initial demo data | initialEmployees / initialShifts in App.tsx |
| Shifts CRUD | Logic in App.tsx; UI in ShiftTable.tsx + AddShiftForm.tsx |
| Shift validation (start < end) | src/components/AddShiftForm.tsx |
| Helpful error messages | AddShiftForm.tsx (alert) + toast messages |
| Search / Filter / Sort employees | EmployeeAnimatedSidebar.tsx |
| Hours-per-day visualization | src/components/ShiftVisualization.tsx |
| Dashboard KPIs | src/components/EmployeeDashboard.tsx |
| Responsive layout | Tailwind utility classes |
| Dark mode support | isDarkMode logic in App.tsx |
| UI component system | src/components/ui/* |
| Guidelines | src/guidelines/Guidelines.md |
| Optional tests | Not included (time-boxed) |

## 🧱 Architecture Overview

### UI Layer
- Primary application state in src/App.tsx  
- Components under src/components/ handle presentation and user interaction

### Storage Layer (LocalStorage)
- Implemented in src/src/storage/localStorage.ts  
- loadEmployees / loadShifts load data with fallback  
- saveEmployees / saveShifts persist changes safely  

### Domain Model
- Employee and Shift interfaces defined in App.tsx  
- Shared across UI and storage  
- Can be moved to domain/types.ts for a future API

### API-Ready Design
The application separates UI concerns from data access.  
To switch to an API:
1. Replace load/save functions with fetch-based API calls  
2. Add loading/error states  
3. Keep all components unchanged (they consume state only)

## 📄 Non-Goals (per challenge instructions)
- No backend  
- No authentication  
- No routing  
- No advanced state managers (Redux/Zustand)  
- No tests (time-boxed)

## 📬 Notes
This project was intentionally built within the 4–5 hour timebox of the DaphOS challenge, focusing on UX quality, clear structure, clean state handling, and a maintainable architecture prepared for future API integration.
