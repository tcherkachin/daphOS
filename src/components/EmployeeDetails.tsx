import { useState, useEffect } from 'react';
import { Save, UserX, UserCheck, Plus, Calendar, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ShiftTable } from './ShiftTable';
import { AddShiftForm } from './AddShiftForm';
import { EmployeeDashboard } from './EmployeeDashboard';
import type { Employee, Shift } from '../App';

interface EmployeeDetailsProps {
  employee: Employee;
  shifts: Shift[];
  onUpdateEmployee: (id: string, name: string, role: string) => void;
  onToggleStatus: (id: string) => void;
  onAddShift: (start: string, end: string, note: string) => void;
  onDeleteShift: (id: string) => void;
  onUpdateShift: (id: string, start: string, end: string, note: string) => void;
}

export function EmployeeDetails({
  employee,
  shifts,
  onUpdateEmployee,
  onToggleStatus,
  onAddShift,
  onDeleteShift,
  onUpdateShift,
}: EmployeeDetailsProps) {
  const [name, setName] = useState(employee.name);
  const [role, setRole] = useState(employee.role);
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  // Sync local state when employee changes
  useEffect(() => {
    setName(employee.name);
    setRole(employee.role);
  }, [employee.id, employee.name, employee.role]);

  const handleSave = () => {
    if (name.trim() && role.trim()) {
      onUpdateEmployee(employee.id, name.trim(), role.trim());
    }
  };

  const handleAddShift = (start: string, end: string, note: string) => {
    onAddShift(start, end, note);
    setIsShiftDialogOpen(false);
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setIsShiftDialogOpen(true);
  };

  const handleUpdateShift = (id: string, start: string, end: string, note: string) => {
    onUpdateShift(id, start, end, note);
    setIsShiftDialogOpen(false);
    setEditingShift(null);
  };

  const handleDialogClose = (open: boolean) => {
    setIsShiftDialogOpen(open);
    if (!open) {
      setEditingShift(null);
    }
  };

  const hasChanges = name !== employee.name || role !== employee.role;

  const totalHours = shifts.reduce((sum, shift) => {
    const start = new Date(shift.start);
    const end = new Date(shift.end);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  const initials = employee.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-81px)]">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className={`flex items-center gap-3 ${!employee.isActive ? 'opacity-40' : ''}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              employee.isActive 
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600'
            }`} aria-hidden="true">
              <span>{initials}</span>
            </div>
            <div>
              <h2 className="text-neutral-900 dark:text-neutral-50 mb-1">
                {employee.name}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {employee.role}
              </p>
            </div>
          </div>
          <Button
            variant={employee.isActive ? 'outline' : 'default'}
            onClick={() => onToggleStatus(employee.id)}
            aria-label={employee.isActive ? `${employee.name} deaktivieren` : `${employee.name} aktivieren`}
          >
            {employee.isActive ? (
              <>
                <UserX className="w-4 h-4 mr-2" aria-hidden="true" />
                Deaktivieren
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 mr-2" aria-hidden="true" />
                Aktivieren
              </>
            )}
          </Button>
        </div>

        <div className={`space-y-4 ${!employee.isActive ? 'opacity-40 pointer-events-none' : ''}`}>
          <div>
            <Label htmlFor="employee-name">Name</Label>
            <Input
              id="employee-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mitarbeitername"
              disabled={!employee.isActive}
            />
          </div>

          <div>
            <Label htmlFor="employee-role">Rolle</Label>
            <Input
              id="employee-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Mitarbeiterrolle"
              disabled={!employee.isActive}
            />
          </div>

          {hasChanges && (
            <Button onClick={handleSave} className="w-full" disabled={!employee.isActive}>
              <Save className="w-4 h-4 mr-2" />
              Änderungen speichern
            </Button>
          )}
        </div>
      </Card>

      <Tabs defaultValue="dashboard" className={!employee.isActive ? 'opacity-40 pointer-events-none' : ''}>
        <TabsList className="grid w-full grid-cols-2 bg-neutral-100 dark:bg-neutral-800">
          <TabsTrigger 
            value="dashboard"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-50 data-[state=active]:shadow-sm"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="shifts"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-50 data-[state=active]:shadow-sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schichtverwaltung
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          {shifts.length > 0 ? (
            <EmployeeDashboard employee={employee} shifts={shifts} />
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-neutral-400" aria-hidden="true" />
                </div>
                <h3 className="text-neutral-900 dark:text-neutral-50 mb-2">Keine Daten verfügbar</h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                  Fügen Sie Schichten hinzu, um das Dashboard zu sehen
                </p>
                <Button onClick={() => setIsShiftDialogOpen(true)} disabled={!employee.isActive}>
                  <Plus className="w-4 h-4 mr-2" />
                  Erste Schicht hinzufügen
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="shifts" className="mt-6 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-neutral-900 dark:text-neutral-50 mb-1">
                  Schichten
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {shifts.length} {shifts.length === 1 ? 'Schicht' : 'Schichten'} · {totalHours.toFixed(2)} Stunden
                </p>
              </div>
              <Button onClick={() => setIsShiftDialogOpen(true)} size="sm" disabled={!employee.isActive}>
                <Plus className="w-4 h-4 mr-2" />
                Schicht hinzufügen
              </Button>
            </div>

            <ShiftTable 
              shifts={shifts} 
              onDeleteShift={onDeleteShift}
              onAddShiftClick={() => setIsShiftDialogOpen(true)}
              onEditShift={handleEditShift}
            />
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isShiftDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingShift ? 'Schicht bearbeiten' : 'Neue Schicht hinzufügen'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <AddShiftForm 
              onAddShift={handleAddShift}
              editShift={editingShift}
              onUpdateShift={handleUpdateShift}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}