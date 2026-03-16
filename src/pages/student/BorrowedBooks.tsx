import { useAuth } from '@/contexts/AuthContext';
import { useLibrary } from '@/contexts/LibraryContext';
import { Badge } from '@/components/ui/badge';
import { BookOpen, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FINE_PER_DAY = 5;

function calculateFine(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff * FINE_PER_DAY : 0;
}

export default function BorrowedBooks() {
  const { user } = useAuth();
  const { getStudentBorrowedBooks } = useLibrary();
  if (!user) return null;

  const borrowed = getStudentBorrowedBooks(user.id);
  const totalFine = borrowed.reduce((s, b) => s + (b.dueDate ? calculateFine(b.dueDate) : 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-semibold">Borrowed Books</h1>
        {totalFine > 0 && (
          <Link to="/student/fines" className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors">
            <AlertTriangle className="h-4 w-4" />
            Outstanding Fine: ₹{totalFine}
          </Link>
        )}
      </div>
      {borrowed.length === 0 ? (
        <p className="text-muted-foreground">No books currently borrowed.</p>
      ) : (
        <div className="space-y-3">
          {borrowed.map(b => {
            const fine = b.dueDate ? calculateFine(b.dueDate) : 0;
            const isOverdue = b.dueDate && new Date(b.dueDate) < new Date();
            return (
              <div key={b.id} className={`flex items-center gap-4 p-4 rounded-lg border bg-card ${isOverdue ? 'border-destructive/30' : ''}`}>
                <div className={`h-12 w-9 rounded flex items-center justify-center ${isOverdue ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                  <BookOpen className={`h-5 w-5 ${isOverdue ? 'text-destructive' : 'text-primary'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{b.bookTitle}</p>
                  <p className="text-xs text-muted-foreground">Issued: {b.approvedDate} · Due: {b.dueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  {fine > 0 && (
                    <span className="text-sm font-semibold text-destructive">₹{fine}</span>
                  )}
                  <Badge variant={isOverdue ? 'destructive' : 'issued'}>
                    {isOverdue ? 'Overdue' : 'Active'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
