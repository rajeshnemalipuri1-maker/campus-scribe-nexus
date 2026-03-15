import { useAuth } from '@/contexts/AuthContext';
import { useLibrary } from '@/contexts/LibraryContext';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

export default function BorrowedBooks() {
  const { user } = useAuth();
  const { getStudentBorrowedBooks } = useLibrary();
  if (!user) return null;

  const borrowed = getStudentBorrowedBooks(user.id);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Borrowed Books</h1>
      {borrowed.length === 0 ? (
        <p className="text-muted-foreground">No books currently borrowed.</p>
      ) : (
        <div className="space-y-3">
          {borrowed.map(b => (
            <div key={b.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
              <div className="h-12 w-9 rounded bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{b.bookTitle}</p>
                <p className="text-xs text-muted-foreground">Issued: {b.approvedDate} · Due: {b.dueDate}</p>
              </div>
              <Badge variant={b.dueDate && new Date(b.dueDate) < new Date() ? 'destructive' : 'issued'}>
                {b.dueDate && new Date(b.dueDate) < new Date() ? 'Overdue' : 'Active'}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
