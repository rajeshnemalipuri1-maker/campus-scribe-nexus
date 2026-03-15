import { useAuth } from '@/contexts/AuthContext';
import { useLibrary } from '@/contexts/LibraryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { sampleNotifications } from '@/data/mockData';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { getStudentRequests, getStudentBorrowedBooks } = useLibrary();

  if (!user) return null;

  const requests = getStudentRequests(user.id);
  const borrowed = getStudentBorrowedBooks(user.id);
  const pending = requests.filter(r => r.status === 'pending');
  const overdue = borrowed.filter(r => r.dueDate && new Date(r.dueDate) < new Date());

  const stats = [
    { label: 'Borrowed Books', value: borrowed.length, icon: <BookOpen className="h-5 w-5" />, color: 'text-primary' },
    { label: 'Pending Requests', value: pending.length, icon: <Clock className="h-5 w-5" />, color: 'text-warning' },
    { label: 'Total Requests', value: requests.length, icon: <CheckCircle className="h-5 w-5" />, color: 'text-success' },
    { label: 'Overdue', value: overdue.length, icon: <AlertTriangle className="h-5 w-5" />, color: 'text-destructive' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold text-foreground">Welcome, {user.name}</h1>
        <p className="text-muted-foreground text-sm mt-1">{user.department} · {user.rollNumber}</p>
      </div>

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
        {/* Borrowed Books */}
        <Card>
          <CardHeader><CardTitle className="text-lg font-display">Currently Borrowed</CardTitle></CardHeader>
          <CardContent>
            {borrowed.length === 0 ? (
              <p className="text-sm text-muted-foreground">No books currently borrowed.</p>
            ) : (
              <div className="space-y-3">
                {borrowed.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{b.bookTitle}</p>
                      <p className="text-xs text-muted-foreground">Due: {b.dueDate}</p>
                    </div>
                    <Badge variant={b.dueDate && new Date(b.dueDate) < new Date() ? 'destructive' : 'issued'}>
                      {b.dueDate && new Date(b.dueDate) < new Date() ? 'Overdue' : 'Issued'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader><CardTitle className="text-lg font-display">Notifications</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sampleNotifications.map(n => (
                <div key={n.id} className={`p-3 rounded-md border ${n.read ? 'bg-card' : 'bg-muted/50'}`}>
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 h-2 w-2 rounded-full ${n.type === 'success' ? 'bg-success' : n.type === 'warning' ? 'bg-warning' : 'bg-info'}`} />
                    <div>
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
