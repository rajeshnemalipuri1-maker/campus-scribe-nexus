import React from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function PendingRequests() {
  const { getPendingRequests, updateRequestStatus, message, clearMessage } = useLibrary();
  const pending = getPendingRequests();

  // Show library context messages (e.g. 3-book limit)
  React.useEffect(() => {
    if (message) {
      toast.error(message);
      clearMessage();
    }
  }, [message, clearMessage]);

  const handleApprove = (id: string, title: string) => {
    updateRequestStatus(id, 'issued');
    toast.success(`Approved and issued: "${title}"`);
  };

  const handleReject = (id: string, title: string) => {
    updateRequestStatus(id, 'rejected');
    toast.info(`Rejected request for: "${title}"`);
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Pending Requests</h1>
      {pending.length === 0 ? (
        <p className="text-muted-foreground">No pending requests.</p>
      ) : (
        <div className="space-y-3">
          {pending.map(r => (
            <Card key={r.id}>
              <CardContent className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{r.bookTitle}</p>
                  <p className="text-xs text-muted-foreground">{r.studentName} · {r.studentRollNumber} · Requested: {r.requestDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => handleApprove(r.id, r.bookTitle)} className="bg-success text-success-foreground hover:bg-success/90">
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReject(r.id, r.bookTitle)} className="border-destructive text-destructive hover:bg-destructive/10">
                    <X className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
