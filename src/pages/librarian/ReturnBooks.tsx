import { useLibrary } from '@/contexts/LibraryContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ReturnBooks() {
  const { getAllIssuedBooks, returnBook } = useLibrary();
  const issued = getAllIssuedBooks();

  const handleReturn = (id: string, title: string) => {
    returnBook(id);
    toast.success(`"${title}" has been returned successfully.`);
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Return Books</h1>
      {issued.length === 0 ? (
        <p className="text-muted-foreground">No books to return.</p>
      ) : (
        <div className="space-y-3">
          {issued.map(r => (
            <Card key={r.id}>
              <CardContent className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{r.bookTitle}</p>
                  <p className="text-xs text-muted-foreground">{r.studentName} · Due: {r.dueDate}</p>
                </div>
                <Button size="sm" onClick={() => handleReturn(r.id, r.bookTitle)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Accept Return
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
