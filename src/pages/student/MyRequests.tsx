import { useAuth } from '@/contexts/AuthContext';
import { useLibrary } from '@/contexts/LibraryContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function statusVariant(s: string): "pending" | "approved" | "issued" | "returned" | "destructive" | "secondary" {
  switch (s) {
    case 'pending': return 'pending';
    case 'approved': return 'approved';
    case 'issued': return 'issued';
    case 'returned': return 'returned';
    case 'rejected': return 'destructive';
    default: return 'secondary';
  }
}

export default function MyRequests() {
  const { user } = useAuth();
  const { getStudentRequests } = useLibrary();
  if (!user) return null;

  const requests = getStudentRequests(user.id);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">My Requests</h1>
      {requests.length === 0 ? (
        <p className="text-muted-foreground">No requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Book</th>
                <th className="pb-3 font-medium">Request Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 font-medium">{r.bookTitle}</td>
                  <td className="py-3 text-muted-foreground">{r.requestDate}</td>
                  <td className="py-3">
                    <Badge variant={statusVariant(r.status) as any} className="capitalize">{r.status}</Badge>
                  </td>
                  <td className="py-3 text-muted-foreground">{r.dueDate || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
