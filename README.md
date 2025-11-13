# DaphOS – Employee Time Tracking SPA

This project implements the take-home challenge for the DaphOS Frontend Coding Challenge – Employee Time Tracking UI. The goal is to build a small, API-ready Single Page Application (SPA) that manages employees and their working shifts, including visualizations and LocalStorage persistence.

The application is built with React, TypeScript, TailwindCSS, ShadCN/Radix UI, and Recharts, and follows a clean, maintainable structure with separation between UI and storage logic.

## ⭐ Features

### Employee Management
- List all employees (name, role, active/inactive)
- Create new employees
- Edit employee name and role
- Activate / deactivate employees
- Search, filter (active/inactive), and sort by name or role
- Master–detail UX layout (sidebar left, details right)

### Shift Management
- Shifts per employee
- Add, edit and delete shifts
- Validation: End time must be after start time
- Alert messages for invalid ranges
- Toast notifications for successful actions

### Visualizations
- Bar chart: hours worked per day
- Employee dashboard with KPIs (total hours, weekly hours, etc.)

### Data Persistence
- Stored entirely in LocalStorage
- Values persist across reloads
- Safe fallback loading

### UI/UX
- Responsive layout
- Dark/Light mode toggle
- Animated sidebar
- Modern UI components (Radix/ShadCN)

## 🚀 Setup & Running the App

Install dependencies:

    npm install

Start development server:

    npm run dev




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
- Central application state and handlers: src/App.tsx
- UI logic and presentation in src/components/

### Storage Layer (LocalStorage)
- Implemented in src/src/storage/localStorage.ts
- loadEmployees / loadShifts — read from LocalStorage with fallback
- saveEmployees / saveShifts — persist changes on state updates
- All persistence is isolated in this file

### Domain Model
- Employee and Shift interfaces defined in App.tsx
- Used consistently by UI and persistence
- Can be moved to domain/types.ts in future expansions

## 🌐 API-Ready Design (Where API Integration Would Happen)

The app is structured so that replacing the data source is simple:

1. The **entire data access layer lives in one place**:  
   src/src/storage/localStorage.ts  
   This file is responsible for all loading and saving of data.

2. To switch to a real backend API, replace the LocalStorage functions with:  
   fetch('/api/employees') or axios.get('/api/shifts') etc.

3. The UI does not need to change.  
   App.tsx will still call loadEmployees() and loadShifts(), but those functions would now call the backend.

4. Only minor additions would be required:  
   - loading states  
   - error handling  
   - authentication (if needed)

This ensures a clean separation of concerns and a simple path to scaling the application with a proper backend.

## 📄 Non-Goals (per challenge instructions)
- No backend
- No authentication
- No routing
- No advanced state managers
- No tests (time-boxed)

## 📬 Notes
This project was developed in the 4–5 hour timebox of the DaphOS challenge with focus on UX, clarity, and maintainable architecture that can grow into a fully API-driven system.
