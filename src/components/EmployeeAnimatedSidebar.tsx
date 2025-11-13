import { useState } from 'react';
import { Plus, Users, Filter, SortAsc } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from './ui/animated-sidebar';
import { cn } from './ui/utils';
import logo from 'figma:asset/37e2ecf2f53b4ae77400c4cd2395b9adcf90795c.png';
import type { Employee } from '../App';

interface EmployeeAnimatedSidebarProps {
  employees: Employee[];
  selectedEmployeeId: string | null;
  onSelectEmployee: (id: string) => void;
  onAddEmployee: (name: string, role: string) => void;
}

type FilterType = 'all' | 'active' | 'inactive';
type SortType = 'name-asc' | 'name-desc' | 'role-asc' | 'role-desc';

export function EmployeeAnimatedSidebar({
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  onAddEmployee,
}: EmployeeAnimatedSidebarProps) {
  const [open, setOpen] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  
  return (
    <Sidebar open={open} setOpen={setOpen} lockOpen={lockOpen}>
      <SidebarBody className="justify-between gap-10">
        <SidebarContent
          employees={employees}
          selectedEmployeeId={selectedEmployeeId}
          onSelectEmployee={onSelectEmployee}
          onAddEmployee={onAddEmployee}
          setLockOpen={setLockOpen}
        />
      </SidebarBody>
    </Sidebar>
  );
}

function SidebarContent({
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  onAddEmployee,
  setLockOpen,
}: EmployeeAnimatedSidebarProps & { setLockOpen: (lock: boolean) => void }) {
  const { open, setOpen } = useSidebar();
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

  const Logo = () => (
    <div className="flex items-center gap-3 px-2">
      <img src={logo} alt="Logo" className="h-8 w-8 flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-neutral-900 dark:text-neutral-100 whitespace-pre"
      >
        Employee Manager
      </motion.span>
    </div>
  );

  const LogoIcon = () => (
    <div className="flex items-center justify-center">
      <img src={logo} alt="Logo" className="h-8 w-8 flex-shrink-0" />
    </div>
  );

  return (
    <>
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {open ? <Logo /> : <LogoIcon />}
        
        <div className="mt-4 space-y-3">
          {open && (
            <Input
              type="search"
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          )}

          <div className={cn("grid gap-2", open ? "grid-cols-2" : "grid-cols-1")}>
            <Select 
              value={filter} 
              onValueChange={(value: FilterType) => setFilter(value)}
              onOpenChange={(isOpen) => {
                if (isOpen) {
                  setOpen(true);
                  setLockOpen(true);
                } else {
                  setLockOpen(false);
                }
              }}
            >
              <SelectTrigger 
                className="w-full"
                onClick={(e) => {
                  if (!open) {
                    e.preventDefault();
                    setOpen(true);
                    setLockOpen(true);
                    // Give the sidebar time to open, then trigger the select
                    setTimeout(() => {
                      const trigger = e.currentTarget;
                      trigger.click();
                    }, 150);
                  }
                }}
              >
                <Filter className="w-3 h-3 mr-1" />
                {open && <SelectValue />}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="inactive">Inaktiv</SelectItem>
              </SelectContent>
            </Select>

            {open && (
              <Select 
                value={sort} 
                onValueChange={(value: SortType) => setSort(value)}
                onOpenChange={(isOpen) => {
                  if (isOpen) {
                    setOpen(true);
                    setLockOpen(true);
                  } else {
                    setLockOpen(false);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SortAsc className="w-3 h-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name ↑</SelectItem>
                  <SelectItem value="name-desc">Name ↓</SelectItem>
                  <SelectItem value="role-asc">Rolle ↑</SelectItem>
                  <SelectItem value="role-desc">Rolle ↓</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex flex-col gap-2">
          {activeEmployees.length > 0 && (
            <>
              {open && (
                <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-2 mb-1">
                  Aktive Mitarbeiter
                </div>
              )}
              {activeEmployees.map((employee) => {
                const initials = employee.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <SidebarLink
                    key={employee.id}
                    link={{
                      label: employee.name,
                      href: "#",
                      icon: (
                        <div className={cn(
                          "h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center transition-all",
                          !open && "opacity-40 grayscale-[50%]",
                          selectedEmployeeId === employee.id
                            ? "bg-brand-accent text-white"
                            : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
                        )}>
                          <span className="text-xs">{initials}</span>
                        </div>
                      ),
                    }}
                    onClick={() => onSelectEmployee(employee.id)}
                    className={cn(
                      !open && "opacity-50",
                      selectedEmployeeId === employee.id && "bg-neutral-200 dark:bg-neutral-700 rounded-md"
                    )}
                  />
                );
              })}
            </>
          )}

          {inactiveEmployees.length > 0 && (
            <>
              {open && (
                <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-2 mb-1 mt-4">
                  Inaktive Mitarbeiter
                </div>
              )}
              {inactiveEmployees.map((employee) => {
                const initials = employee.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <SidebarLink
                    key={employee.id}
                    link={{
                      label: employee.name,
                      href: "#",
                      icon: (
                        <div className={cn(
                          "h-8 w-8 flex-shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 flex items-center justify-center transition-all",
                          !open ? "opacity-30 grayscale" : "opacity-50"
                        )}>
                          <span className="text-xs">{initials}</span>
                        </div>
                      ),
                    }}
                    onClick={() => onSelectEmployee(employee.id)}
                    className={cn(
                      !open ? "opacity-40" : "opacity-60",
                      selectedEmployeeId === employee.id && "bg-neutral-200 dark:bg-neutral-700 rounded-md"
                    )}
                  />
                );
              })}
            </>
          )}

          {sortedEmployees.length === 0 && open && (
            <div className="p-4 text-center">
              <Users className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Keine Mitarbeiter
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <SidebarLink
              link={{
                label: "Neuer Mitarbeiter",
                href: "#",
                icon: <Plus className="text-brand-accent h-5 w-5 flex-shrink-0" />,
              }}
              className="hover:bg-brand-accent/10 dark:hover:bg-brand-accent/20 rounded-md"
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuen Mitarbeiter hinzufügen</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="z.B. Dr. Maria Schmidt"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Rolle</Label>
                <Select value={newRole} onValueChange={setNewRole} required>
                  <SelectTrigger id="role">
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
    </>
  );
}