import { Trash2, Clock, Plus, Pencil } from 'lucide-react';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import type { Shift } from '../App';

interface ShiftTableProps {
  shifts: Shift[];
  onDeleteShift: (id: string) => void;
  onAddShiftClick: () => void;
  onEditShift: (shift: Shift) => void;
}

export function ShiftTable({ shifts, onDeleteShift, onAddShiftClick, onEditShift }: ShiftTableProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return hours.toFixed(2);
  };

  if (shifts.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
        <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6 text-neutral-400" />
        </div>
        <h3 className="text-neutral-900 dark:text-neutral-50 mb-1">
          Keine Schichten
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Fügen Sie die erste Schicht hinzu
        </p>
        <Button onClick={onAddShiftClick} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Schicht hinzufügen
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Start</TableHead>
            <TableHead>Ende</TableHead>
            <TableHead>Dauer</TableHead>
            <TableHead>Notiz</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.map((shift) => (
            <TableRow key={shift.id}>
              <TableCell>{formatDateTime(shift.start)}</TableCell>
              <TableCell>{formatDateTime(shift.end)}</TableCell>
              <TableCell>
                {calculateDuration(shift.start, shift.end)} h
              </TableCell>
              <TableCell>
                <span className="text-neutral-600 dark:text-neutral-400">
                  {shift.note || '-'}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditShift(shift)}
                  className="hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400"
                  aria-label={`Schicht vom ${formatDateTime(shift.start)} bearbeiten`}
                >
                  <Pencil className="w-4 h-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteShift(shift.id)}
                  className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
                  aria-label={`Schicht vom ${formatDateTime(shift.start)} löschen`}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}