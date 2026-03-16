import { useAuth } from '@/contexts/AuthContext';
import { useLibrary } from '@/contexts/LibraryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, IndianRupee, BookOpen, ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';

const FINE_PER_DAY = 5; // ₹5 per day

function calculateFine(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays * FINE_PER_DAY : 0;
}

function getDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export default function FinesTransactions() {
  const { user } = useAuth();
  const { getStudentRequests } = useLibrary();

  if (!user) return null;

  const allRequests = getStudentRequests(user.id);

  // Active fines from currently issued overdue books
  const overdueBooks = allRequests.filter(
    r => r.status === 'issued' && r.dueDate && new Date(r.dueDate) < new Date()
  );
  const totalActiveFine = overdueBooks.reduce(
    (sum, r) => sum + (r.dueDate ? calculateFine(r.dueDate) : 0), 0
  );

  // Build transaction log from all requests
  const transactions = allRequests
    .flatMap(r => {
      const items: { id: string; date: string; type: string; description: string; amount: number; icon: React.ReactNode; color: string }[] = [];

      // Request placed
      items.push({
        id: `${r.id}-req`,
        date: r.requestDate,
        type: 'Request',
        description: `Requested "${r.bookTitle}"`,
        amount: 0,
        icon: <ArrowUpRight className="h-4 w-4" />,
        color: 'text-info',
      });

      // Issued
      if (r.approvedDate && (r.status === 'issued' || r.status === 'returned')) {
        items.push({
          id: `${r.id}-issue`,
          date: r.approvedDate,
          type: 'Issued',
          description: `"${r.bookTitle}" issued — Due: ${r.dueDate}`,
          amount: 0,
          icon: <BookOpen className="h-4 w-4" />,
          color: 'text-success',
        });
      }

      // Returned
      if (r.returnDate && r.status === 'returned') {
        const fine = r.dueDate && new Date(r.dueDate) < new Date(r.returnDate)
          ? Math.floor((new Date(r.returnDate).getTime() - new Date(r.dueDate).getTime()) / (1000 * 60 * 60 * 24)) * FINE_PER_DAY
          : 0;
        items.push({
          id: `${r.id}-return`,
          date: r.returnDate,
          type: 'Returned',
          description: `"${r.bookTitle}" returned${fine > 0 ? ` — Late fine: ₹${fine}` : ''}`,
          amount: fine,
          icon: <ArrowDownLeft className="h-4 w-4" />,
          color: fine > 0 ? 'text-destructive' : 'text-success',
        });
      }

      // Rejected
      if (r.status === 'rejected') {
        items.push({
          id: `${r.id}-reject`,
          date: r.requestDate,
          type: 'Rejected',
          description: `Request for "${r.bookTitle}" was rejected`,
          amount: 0,
          icon: <Clock className="h-4 w-4" />,
          color: 'text-muted-foreground',
        });
      }

      return items;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Fines & Transactions</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Fine</p>
                <p className="text-3xl font-display font-semibold mt-1 text-destructive">₹{totalActiveFine}</p>
              </div>
              <div className="text-destructive opacity-80">
                <IndianRupee className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue Books</p>
                <p className="text-3xl font-display font-semibold mt-1">{overdueBooks.length}</p>
              </div>
              <div className="text-warning opacity-80">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-3xl font-display font-semibold mt-1">{transactions.length}</p>
              </div>
              <div className="text-primary opacity-80">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fines" className="w-full">
        <TabsList>
          <TabsTrigger value="fines">Active Fines</TabsTrigger>
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
        </TabsList>

        {/* Active Fines Tab */}
        <TabsContent value="fines">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Overdue Books & Fines</CardTitle>
            </CardHeader>
            <CardContent>
              {overdueBooks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No overdue books — no fines due! 🎉</p>
              ) : (
                <div className="space-y-3">
                  {overdueBooks.map(b => {
                    const fine = b.dueDate ? calculateFine(b.dueDate) : 0;
                    const days = b.dueDate ? getDaysOverdue(b.dueDate) : 0;
                    return (
                      <div key={b.id} className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-destructive/10 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{b.bookTitle}</p>
                            <p className="text-xs text-muted-foreground">
                              Due: {b.dueDate} · {days} day{days !== 1 ? 's' : ''} overdue
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-destructive">₹{fine}</p>
                          <p className="text-xs text-muted-foreground">@ ₹{FINE_PER_DAY}/day</p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <p className="text-sm font-medium">Total Outstanding</p>
                    <p className="text-xl font-display font-semibold text-destructive">₹{totalActiveFine}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No transactions yet.</p>
              ) : (
                <div className="space-y-2">
                  {transactions.map(t => (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                      <div className={`${t.color} opacity-80`}>{t.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{t.description}</p>
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          t.type === 'Returned' ? 'secondary' :
                          t.type === 'Issued' ? 'default' :
                          t.type === 'Rejected' ? 'destructive' : 'outline'
                        }>
                          {t.type}
                        </Badge>
                        {t.amount > 0 && (
                          <span className="text-sm font-semibold text-destructive">₹{t.amount}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
