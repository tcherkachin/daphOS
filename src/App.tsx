import { useState, useEffect } from 'react';
import { EmployeeAnimatedSidebar } from './components/EmployeeAnimatedSidebar';
import { EmployeeDetails } from './components/EmployeeDetails';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { cn } from './components/ui/utils';

export interface Employee {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
}

export interface Shift {
  id: string;
  employeeId: string;
  start: string;
  end: string;
  note: string;
}

const initialEmployees: Employee[] = [
  { id: '1', name: 'Anna Müller', role: 'Pflegeleitung', isActive: true },
  { id: '2', name: 'Ben Kochs', role: 'Krankenpfleger', isActive: true },
  { id: '3', name: 'Carla Reimann', role: 'Stationsärztin', isActive: false },
  { id: '4', name: 'David Schmidt', role: 'OP-Pfleger', isActive: true },
  { id: '5', name: 'Emma Weber', role: 'Intensivpflegerin', isActive: true },
  { id: '6', name: 'Felix Klein', role: 'Anästhesist', isActive: false },
  { id: '7', name: 'Greta Hoffmann', role: 'Notaufnahme', isActive: true },
  { id: '8', name: 'Hans Becker', role: 'Facharzt Chirurgie', isActive: true },
  { id: '9', name: 'Iris Neumann', role: 'Physiotherapeutin', isActive: true },
  { id: '10', name: 'Jonas Fischer', role: 'Radiologieassistent', isActive: false },
];

const initialShifts: Shift[] = [
  // Anna Müller - Pflegeleitung (Vollzeit)
  { id: 's1', employeeId: '1', start: '2025-11-10T06:00:00', end: '2025-11-10T14:00:00', note: 'Frühdienst' },
  { id: 's2', employeeId: '1', start: '2025-11-11T06:00:00', end: '2025-11-11T14:00:00', note: 'Frühdienst' },
  { id: 's3', employeeId: '1', start: '2025-11-12T06:00:00', end: '2025-11-12T14:00:00', note: 'Frühdienst' },
  { id: 's4', employeeId: '1', start: '2025-11-13T06:00:00', end: '2025-11-13T14:00:00', note: 'Frühdienst' },
  { id: 's5', employeeId: '1', start: '2025-11-14T06:00:00', end: '2025-11-14T14:00:00', note: 'Frühdienst' },

  // Ben Kochs - Krankenpfleger (Vollzeit mit Wechselschicht)
  { id: 's6', employeeId: '2', start: '2025-11-10T06:00:00', end: '2025-11-10T14:00:00', note: 'Frühdienst' },
  { id: 's7', employeeId: '2', start: '2025-11-11T14:00:00', end: '2025-11-11T22:00:00', note: 'Spätdienst' },
  { id: 's8', employeeId: '2', start: '2025-11-12T06:00:00', end: '2025-11-12T14:00:00', note: 'Frühdienst' },
  { id: 's9', employeeId: '2', start: '2025-11-13T14:00:00', end: '2025-11-13T22:00:00', note: 'Spätdienst' },
  { id: 's10', employeeId: '2', start: '2025-11-14T22:00:00', end: '2025-11-15T06:00:00', note: 'Nachtdienst' },

  // Carla Reimann - Stationsärztin (Inaktiv - nur 2 Schichten)
  { id: 's11', employeeId: '3', start: '2025-11-10T08:00:00', end: '2025-11-10T16:00:00', note: 'Reguläre Schicht' },
  { id: 's12', employeeId: '3', start: '2025-11-13T08:00:00', end: '2025-11-13T16:00:00', note: 'Reguläre Schicht' },

  // David Schmidt - OP-Pfleger (Vollzeit)
  { id: 's13', employeeId: '4', start: '2025-11-10T07:00:00', end: '2025-11-10T15:00:00', note: 'OP-Dienst' },
  { id: 's14', employeeId: '4', start: '2025-11-11T07:00:00', end: '2025-11-11T15:00:00', note: 'OP-Dienst' },
  { id: 's15', employeeId: '4', start: '2025-11-12T07:00:00', end: '2025-11-12T15:00:00', note: 'OP-Dienst' },
  { id: 's16', employeeId: '4', start: '2025-11-13T07:00:00', end: '2025-11-13T15:00:00', note: 'OP-Dienst' },
  { id: 's17', employeeId: '4', start: '2025-11-14T07:00:00', end: '2025-11-14T15:00:00', note: 'OP-Dienst' },

  // Emma Weber - Intensivpflegerin (Vollzeit mit 12h-Schichten)
  { id: 's18', employeeId: '5', start: '2025-11-10T06:00:00', end: '2025-11-10T18:00:00', note: 'Intensivstation' },
  { id: 's19', employeeId: '5', start: '2025-11-12T06:00:00', end: '2025-11-12T18:00:00', note: 'Intensivstation' },
  { id: 's20', employeeId: '5', start: '2025-11-14T06:00:00', end: '2025-11-14T18:00:00', note: 'Intensivstation' },
  { id: 's21', employeeId: '5', start: '2025-11-15T18:00:00', end: '2025-11-16T06:00:00', note: 'Nachtdienst' },

  // Felix Klein - Anästhesist (Inaktiv - nur 1 Schicht)
  { id: 's22', employeeId: '6', start: '2025-11-11T08:00:00', end: '2025-11-11T16:00:00', note: 'OP-Begleitung' },

  // Greta Hoffmann - Notaufnahme (Vollzeit mit Wechselschicht)
  { id: 's23', employeeId: '7', start: '2025-11-10T06:00:00', end: '2025-11-10T14:00:00', note: 'Notaufnahme Frühdienst' },
  { id: 's24', employeeId: '7', start: '2025-11-11T14:00:00', end: '2025-11-11T22:00:00', note: 'Notaufnahme Spätdienst' },
  { id: 's25', employeeId: '7', start: '2025-11-12T22:00:00', end: '2025-11-13T06:00:00', note: 'Notaufnahme Nachtdienst' },
  { id: 's26', employeeId: '7', start: '2025-11-14T06:00:00', end: '2025-11-14T14:00:00', note: 'Notaufnahme Frühdienst' },
  { id: 's27', employeeId: '7', start: '2025-11-15T14:00:00', end: '2025-11-15T22:00:00', note: 'Notaufnahme Spätdienst' },

  // Hans Becker - Facharzt Chirurgie (Vollzeit + Bereitschaft)
  { id: 's28', employeeId: '8', start: '2025-11-10T08:00:00', end: '2025-11-10T17:00:00', note: 'Sprechstunde & OP' },
  { id: 's29', employeeId: '8', start: '2025-11-11T08:00:00', end: '2025-11-11T17:00:00', note: 'OP-Tag' },
  { id: 's30', employeeId: '8', start: '2025-11-12T08:00:00', end: '2025-11-12T17:00:00', note: 'Sprechstunde' },
  { id: 's31', employeeId: '8', start: '2025-11-13T08:00:00', end: '2025-11-13T20:00:00', note: 'OP-Marathon' },
  { id: 's32', employeeId: '8', start: '2025-11-14T08:00:00', end: '2025-11-14T17:00:00', note: 'Visite & OP' },

  // Iris Neumann - Physiotherapeutin (Teilzeit)
  { id: 's33', employeeId: '9', start: '2025-11-10T08:00:00', end: '2025-11-10T12:00:00', note: 'Therapiesitzungen' },
  { id: 's34', employeeId: '9', start: '2025-11-11T08:00:00', end: '2025-11-11T12:00:00', note: 'Therapiesitzungen' },
  { id: 's35', employeeId: '9', start: '2025-11-12T13:00:00', end: '2025-11-12T17:00:00', note: 'Gruppentherapie' },
  { id: 's36', employeeId: '9', start: '2025-11-13T08:00:00', end: '2025-11-13T12:00:00', note: 'Therapiesitzungen' },
  { id: 's37', employeeId: '9', start: '2025-11-14T08:00:00', end: '2025-11-14T12:00:00', note: 'Therapiesitzungen' },
  { id: 's38', employeeId: '9', start: '2025-11-15T09:00:00', end: '2025-11-15T13:00:00', note: 'Reha-Betreuung' },

  // Jonas Fischer - Radiologieassistent (Inaktiv - minimale Stunden)
  { id: 's39', employeeId: '10', start: '2025-11-12T09:00:00', end: '2025-11-12T13:00:00', note: 'Röntgendienst' },
];

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>('1');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode to document element for portals
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  const handleAddEmployee = (name: string, role: string) => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name,
      role,
      isActive: true,
    };
    setEmployees([...employees, newEmployee]);
    setSelectedEmployeeId(newEmployee.id);
    toast.success('Mitarbeiter hinzugefügt');
  };

  const handleUpdateEmployee = (id: string, name: string, role: string) => {
    setEmployees(employees.map(e => 
      e.id === id ? { ...e, name, role } : e
    ));
    toast.success('Mitarbeiter aktualisiert');
  };

  const handleToggleEmployeeStatus = (id: string) => {
    setEmployees(employees.map(e => 
      e.id === id ? { ...e, isActive: !e.isActive } : e
    ));
    const employee = employees.find(e => e.id === id);
    toast.success(employee?.isActive ? 'Mitarbeiter deaktiviert' : 'Mitarbeiter aktiviert');
  };

  const handleAddShift = (start: string, end: string, note: string) => {
    if (!selectedEmployeeId) return;
    
    const newShift: Shift = {
      id: Date.now().toString(),
      employeeId: selectedEmployeeId,
      start,
      end,
      note,
    };
    setShifts([...shifts, newShift]);
    toast.success('Schicht hinzugefügt');
  };

  const handleDeleteShift = (id: string) => {
    setShifts(shifts.filter(s => s.id !== id));
    toast.success('Schicht gelöscht');
  };

  const handleUpdateShift = (id: string, start: string, end: string, note: string) => {
    setShifts(shifts.map(s => 
      s.id === id ? { ...s, start, end, note } : s
    ));
    toast.success('Schicht aktualisiert');
  };

  const employeeShifts = shifts.filter(s => s.employeeId === selectedEmployeeId);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={cn(
        "flex flex-col md:flex-row bg-neutral-50 dark:bg-neutral-950 w-full flex-1 min-h-screen overflow-hidden"
      )}>
        <EmployeeAnimatedSidebar
          employees={employees}
          selectedEmployeeId={selectedEmployeeId}
          onSelectEmployee={setSelectedEmployeeId}
          onAddEmployee={handleAddEmployee}
        />

        <div className="flex flex-1 flex-col">
          <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-10">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-neutral-900 dark:text-neutral-50">
                  Employee Management
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                  Verwalten Sie Mitarbeiter und Schichten
                </p>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
                aria-label={isDarkMode ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            {selectedEmployee ? (
              <EmployeeDetails
                employee={selectedEmployee}
                shifts={employeeShifts}
                onUpdateEmployee={handleUpdateEmployee}
                onToggleStatus={handleToggleEmployeeStatus}
                onAddShift={handleAddShift}
                onDeleteShift={handleDeleteShift}
                onUpdateShift={handleUpdateShift}
              />
            ) : (
              <div className="h-full flex items-center justify-center p-8 min-h-[calc(100vh-81px)]">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-neutral-900 dark:text-neutral-50 mb-2">Kein Mitarbeiter ausgewählt</h3>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Wählen Sie einen Mitarbeiter aus der Liste
                  </p>
                </div>
              </div>
            )}
          </div>

          <Toaster position="bottom-right" />
        </div>
      </div>
    </div>
  );
}
