import { useLibrary } from '@/contexts/LibraryContext';
import { getBooks, getStudents, getCategories } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function Analytics() {
  const { requests, getAllIssuedBooks } = useLibrary();
  const books = getBooks();
  const students = getStudents();
  const issued = getAllIssuedBooks();
  const overdue = issued.filter(r => r.dueDate && new Date(r.dueDate) < new Date());

  // Most borrowed books
  const bookBorrowCount: Record<string, { title: string; count: number }> = {};
  requests.forEach(r => {
    if (!bookBorrowCount[r.bookId]) bookBorrowCount[r.bookId] = { title: r.bookTitle, count: 0 };
    bookBorrowCount[r.bookId].count++;
  });
  const topBooks = Object.values(bookBorrowCount).sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Analytics & Reports</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Books', value: books.length.toLocaleString() },
          { label: 'Total Users', value: (students.length + 2).toLocaleString() },
          { label: 'Active Loans', value: issued.length },
          { label: 'Overdue', value: overdue.length },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-display font-semibold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold">Most Borrowed Books</h2>
          </div>
          {topBooks.length > 0 ? (
            <div className="space-y-3">
              {topBooks.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-6">{i + 1}.</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="truncate">{b.title}</span>
                      <span className="text-muted-foreground ml-2">{b.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-accent" style={{ width: `${(b.count / topBooks[0].count) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No borrowing data yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
