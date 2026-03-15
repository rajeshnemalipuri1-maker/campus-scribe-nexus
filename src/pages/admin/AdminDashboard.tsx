import { useLibrary } from '@/contexts/LibraryContext';
import { getBooks, getStudents } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, BookCheck, AlertTriangle, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { getAllIssuedBooks, requests } = useLibrary();
  const books = getBooks();
  const students = getStudents();
  const issued = getAllIssuedBooks();
  const overdue = issued.filter(r => r.dueDate && new Date(r.dueDate) < new Date());

  const stats = [
    { label: 'Total Books', value: books.length.toLocaleString(), icon: <BookOpen className="h-5 w-5" />, color: 'text-primary' },
    { label: 'Total Students', value: students.length.toLocaleString(), icon: <Users className="h-5 w-5" />, color: 'text-info' },
    { label: 'Active Loans', value: issued.length, icon: <BookCheck className="h-5 w-5" />, color: 'text-warning' },
    { label: 'Overdue Books', value: overdue.length, icon: <AlertTriangle className="h-5 w-5" />, color: 'text-destructive' },
  ];

  // Most borrowed categories
  const categoryCount: Record<string, number> = {};
  requests.forEach(r => {
    const book = books.find(b => b.id === r.bookId);
    if (book) categoryCount[book.category] = (categoryCount[book.category] || 0) + 1;
  });
  const topCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Admin Dashboard</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-display font-semibold">Most Borrowed Categories</h2>
            </div>
            {topCategories.length > 0 ? (
              <div className="space-y-3">
                {topCategories.map(([cat, count]) => (
                  <div key={cat} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{cat}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${(count / topCategories[0][1]) * 100}%` }} />
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

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-display font-semibold mb-4">System Overview</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-muted/30 rounded-md">
                <span className="text-muted-foreground">Total Requests</span>
                <span className="font-medium">{requests.length}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/30 rounded-md">
                <span className="text-muted-foreground">Librarians</span>
                <span className="font-medium">1</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/30 rounded-md">
                <span className="text-muted-foreground">Departments</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between p-3 bg-muted/30 rounded-md">
                <span className="text-muted-foreground">Categories</span>
                <span className="font-medium">30</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
