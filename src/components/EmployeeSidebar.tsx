import { useState } from 'react';
import { Plus, Users, Filter, SortAsc } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from './ui/sidebar';
import type { Employee } from '../App';

interface EmployeeSidebarProps {
  employees: Employee[];
  selectedEmployeeId: string | null;
  onSelectEmployee: (id: string) => void;
  onAddEmployee: (name: string, role: string) => void;
}

type FilterType = 'all' | 'active' | 'inactive';
type SortType = 'name-asc' | 'name-desc' | 'role-asc' | 'role-desc';

export function EmployeeSidebar({
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  onAddEmployee,
}: EmployeeSidebarProps) {
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

  const renderEmployeeItem = (employee: Employee) => {
    const isSelected = selectedEmployeeId === employee.id;
    const initials = employee.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <SidebarMenuItem key={employee.id}>
        <SidebarMenuButton
          onClick={() => onSelectEmployee(employee.id)}
          isActive={isSelected}
          className={`${!employee.isActive ? 'opacity-50' : ''}`}
          aria-label={`${employee.name}, ${employee.role}`}
          aria-current={isSelected ? 'true' : 'false'}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            employee.isActive 
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600'
          }`} aria-hidden="true">
            <span className="text-xs">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate">{employee.name}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {employee.role}
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Users className="w-5 h-5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
          <div className="flex-1">
            <h2 className="text-neutral-900 dark:text-neutral-50">Mitarbeiter</h2>
            <span className="text-xs text-neutral-500 dark:text-neutral-400" aria-label={`${employees.length} Mitarbeiter insgesamt`}>
              {employees.length} Gesamt
            </span>
          </div>
        </div>

        <div className="space-y-2 px-2">
          <Input
            type="search"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8"
            aria-label="Mitarbeiter durchsuchen"
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="filter-select" className="sr-only">Filter</Label>
              <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
                <SelectTrigger id="filter-select" className="w-full h-8 text-xs" aria-label="Mitarbeiter filtern">
                  <Filter className="w-3 h-3 mr-1" aria-hidden="true" />
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
                <SelectTrigger id="sort-select" className="w-full h-8 text-xs" aria-label="Mitarbeiter sortieren">
                  <SortAsc className="w-3 h-3 mr-1" aria-hidden="true" />
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
        </div>
      </SidebarHeader>

      <SidebarContent>
        {sortedEmployees.length === 0 ? (
          <div className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-neutral-400" aria-hidden="true" />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {searchQuery || filter !== 'all' 
                ? 'Keine Ergebnisse' 
                : 'Keine Mitarbeiter'}
            </p>
          </div>
        ) : (
          <>
            {activeEmployees.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>Aktive Mitarbeiter</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {activeEmployees.map(renderEmployeeItem)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
            
            {inactiveEmployees.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>Inaktive Mitarbeiter</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {inactiveEmployees.map(renderEmployeeItem)}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" size="sm">
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
      </SidebarFooter>
    </Sidebar>
  );
}
