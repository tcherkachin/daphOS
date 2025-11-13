import { useState, useEffect } from 'react';
import { Plus, Save, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';

interface AddShiftFormProps {
  onAddShift: (start: string, end: string, note: string) => void;
  editShift?: {
    id: string;
    start: string;
    end: string;
    note: string;
  } | null;
  onUpdateShift?: (id: string, start: string, end: string, note: string) => void;
}

export function AddShiftForm({ onAddShift, editShift, onUpdateShift }: AddShiftFormProps) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Convert ISO datetime to datetime-local format
  const toDatetimeLocal = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (editShift) {
      setStart(toDatetimeLocal(editShift.start));
      setEnd(toDatetimeLocal(editShift.end));
      setNote(editShift.note);
    } else {
      setStart('');
      setEnd('');
      setNote('');
    }
    setError(null);
  }, [editShift]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (start && end) {
      // Validate that end time is after start time
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      if (endDate <= startDate) {
        setError('Die Endzeit muss nach der Startzeit liegen. Negative Arbeitsstunden sind nicht möglich.');
        return;
      }
      
      if (editShift && onUpdateShift) {
        onUpdateShift(editShift.id, start, end, note);
      } else {
        onAddShift(start, end, note);
      }
      setStart('');
      setEnd('');
      setNote('');
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="shift-start">Start</Label>
          <Input
            id="shift-start"
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            className="[color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>

        <div>
          <Label htmlFor="shift-end">Ende</Label>
          <Input
            id="shift-end"
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
            className="[color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="shift-note">Notiz (optional)</Label>
        <Input
          id="shift-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="z.B. Frühdienst, Spätdienst"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full">
        {editShift ? (
          <>
            <Save className="w-4 h-4 mr-2" />
            Schicht aktualisieren
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Schicht hinzufügen
          </>
        )}
      </Button>
    </form>
  );
}