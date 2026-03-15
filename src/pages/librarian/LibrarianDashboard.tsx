import { useLibrary } from '@/contexts/LibraryContext';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList, BookCheck, BookX, AlertTriangle } from 'lucide-react';

export default function LibrarianDashboard() {
  const { getPendingRequests, getAllIssuedBooks, requests } = useLibrary();
  const pending = getPendingRequests();
  const issued = getAllIssuedBooks();
  const overdue = issued.filter(r => r.dueDate && new Date(r.dueDate) < new Date());
  const returned = requests.filter(r => r.status === 'returned');

  const stats = [
    { label: 'Pending Requests', value: pending.length, icon: <ClipboardList className="h-5 w-5" />, color: 'text-warning' },
    { label: 'Books Issued', value: issued.length, icon: <BookCheck className="h-5 w-5" />, color: 'text-primary' },
    { label: 'Overdue Books', value: overdue.length, icon: <AlertTriangle className="h-5 w-5" />, color: 'text-destructive' },
    { label: 'Books Returned', value: returned.length, icon: <BookX className="h-5 w-5" />, color: 'text-success' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Librarian Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-display font-semibold mt-1">{s.value}</p>
                </div>
                <div className={`${s.color} opacity-80`}>{s.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-display font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {requests.slice(0, 10).map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-md bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{r.bookTitle}</p>
                  <p className="text-xs text-muted-foreground">{r.studentName} ({r.studentRollNumber})</p>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{r.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
