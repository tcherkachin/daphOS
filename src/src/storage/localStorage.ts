import type { Employee, Shift } from '../App';

const EMPLOYEES_KEY = 'daphos.employees';
const SHIFTS_KEY = 'daphos.shifts';

export function loadEmployees(fallback: Employee[]): Employee[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(EMPLOYEES_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Employee[];
    if (!Array.isArray(parsed)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export function saveEmployees(employees: Employee[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
  } catch {
    // fail silently; in a real app we would show a toast or log the error
  }
}

export function loadShifts(fallback: Shift[]): Shift[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(SHIFTS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Shift[];
    if (!Array.isArray(parsed)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export function saveShifts(shifts: Shift[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SHIFTS_KEY, JSON.stringify(shifts));
  } catch {
    // fail silently
  }
}
