import { useState } from 'react';
import { Plus, Users, Filter, SortAsc } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Employee } from '../App';

interface EmployeeListProps {
  employees: Employee[];
  selectedEmployeeId: string | null;
  onSelectEmployee: (id: string) => void;
  onAddEmployee: (name: string, role: string) => void;
}

type FilterType = 'all' | 'active' | 'inactive';
type SortType = 'name-asc' | 'name-desc' | 'role-asc' | 'role-desc';

export function EmployeeList({
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  onAddEmployee,
}: EmployeeListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('name-asc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roleToUse = newRole === 'custom' ? customRole : newRole;
    if (newName.trim() && roleToUse.trim()) {
      onAddEmployee(newName.trim(), roleToUse.trim());
      setNewName('');
      setNewRole('');
      setCustomRole('');
      setIsDialogOpen(false);
    }
  };

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'active' ? employee.isActive :
      !employee.isActive;
    
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    switch (sort) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'role-asc':
        return a.role.localeCompare(b.role);
      case 'role-desc':
        return b.role.localeCompare(a.role);
      default:
        return 0;
    }
  });

  // Separate active and inactive employees
  const activeEmployees = sortedEmployees.filter(emp => emp.isActive);
  const inactiveEmployees = sortedEmployees.filter(emp => !emp.isActive);

  const renderEmployeeButton = (employee: Employee) => {
    const isSelected = selectedEmployeeId === employee.id;
    const initials = employee.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <button
        key={employee.id}
        onClick={() => onSelectEmployee(employee.id)}
        className={`w-full text-left p-4 rounded-lg transition-all mb-1 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${
          isSelected
            ? 'bg-brand-accent/10 dark:bg-brand-accent/20 border border-brand-accent/30 dark:border-brand-accent/40'
            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-transparent'
        } ${!employee.isActive ? 'opacity-50' : ''}`}
        role="listitem"
        aria-label={`${employee.name}, ${employee.role}`}
        aria-current={isSelected ? 'true' : 'false'}
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            employee.isActive 
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600'
          }`} aria-hidden="true">
            <span className="text-sm">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`truncate mb-1 ${
              isSelected
                ? 'text-brand-primary dark:text-brand-accent'
                : employee.isActive 
                  ? 'text-neutral-900 dark:text-neutral-50'
                  : 'text-neutral-500 dark:text-neutral-500'
            }`}>
              {employee.name}
            </h3>
            <p className={`text-sm truncate ${
              employee.isActive 
                ? 'text-neutral-500 dark:text-neutral-400'
                : 'text-neutral-400 dark:text-neutral-600'
            }`}>
              {employee.role}
            </p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="w-full lg:w-80 xl:w-96 bg-white dark:bg-neutral-900 border-b lg:border-b-0 border-neutral-200 dark:border-neutral-800">
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
            <h2 className="text-neutral-900 dark:text-neutral-50">Mitarbeiter</h2>
          </div>
          <span className="text-sm text-neutral-500 dark:text-neutral-400" aria-label={`${employees.length} Mitarbeiter insgesamt`}>
            {employees.length}
          </span>
        </div>

        <Input
          type="search"
          placeholder="Mitarbeiter suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          aria-label="Mitarbeiter durchsuchen"
        />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="filter-select" className="sr-only">Filter</Label>
            <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
              <SelectTrigger id="filter-select" className="w-full" aria-label="Mitarbeiter filtern">
                <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="inactive">Inaktiv</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sort-select" className="sr-only">Sortierung</Label>
            <Select value={sort} onValueChange={(value: SortType) => setSort(value)}>
              <SelectTrigger id="sort-select" className="w-full" aria-label="Mitarbeiter sortieren">
                <SortAsc className="w-4 h-4 mr-2" aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name ↑</SelectItem>
                <SelectItem value="name-desc">Name ↓</SelectItem>
                <SelectItem value="role-asc">Rolle ↑</SelectItem>
                <SelectItem value="role-desc">Rolle ↓</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Neuer Mitarbeiter
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="add-employee-description">
            <DialogHeader>
              <DialogTitle>Neuen Mitarbeiter hinzufügen</DialogTitle>
            </DialogHeader>
            <p id="add-employee-description" className="sr-only">
              Formular zum Hinzufügen eines neuen Mitarbeiters mit Name und Rolle
            </p>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="z.B. Dr. Maria Schmidt"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <Label htmlFor="role">Rolle</Label>
                <Select value={newRole} onValueChange={setNewRole} required>
                  <SelectTrigger id="role" aria-required="true">
                    <SelectValue placeholder="Rolle auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Krankenpfleger/in">Krankenpfleger/in</SelectItem>
                    <SelectItem value="Arzt/Ärztin">Arzt/Ärztin</SelectItem>
                    <SelectItem value="Intensivpfleger/in">Intensivpfleger/in</SelectItem>
                    <SelectItem value="OP-Pfleger/in">OP-Pfleger/in</SelectItem>
                    <SelectItem value="Notaufnahme">Notaufnahme</SelectItem>
                    <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                  </SelectContent>
                </Select>
                {newRole === 'custom' && (
                  <Input
                    id="custom-role"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Rolle eingeben..."
                    required
                    aria-required="true"
                    className="mt-2"
                  />
                )}
              </div>
              <Button type="submit" className="w-full">
                Mitarbeiter hinzufügen
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-445px)]" role="list" aria-label="Mitarbeiterliste">
        {sortedEmployees.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-neutral-400" aria-hidden="true" />
            </div>
            <h3 className="text-neutral-900 dark:text-neutral-50 mb-1">
              {searchQuery || filter !== 'all' ? 'Keine Ergebnisse' : 'Keine Mitarbeiter'}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {searchQuery || filter !== 'all' 
                ? 'Versuchen Sie einen anderen Filter oder Suchbegriff' 
                : 'Fügen Sie Ihren ersten Mitarbeiter hinzu'}
            </p>
          </div>
        ) : (
          <>
            {activeEmployees.length > 0 && (
              <div className="p-2">
                <h3 className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Aktive Mitarbeiter
                </h3>
                {activeEmployees.map(renderEmployeeButton)}
              </div>
            )}
            
            {inactiveEmployees.length > 0 && (
              <div className="p-2">
                <h3 className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Inaktive Mitarbeiter
                </h3>
                {inactiveEmployees.map(renderEmployeeButton)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}