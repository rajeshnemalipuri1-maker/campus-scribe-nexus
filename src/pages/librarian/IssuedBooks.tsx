import { useLibrary } from '@/contexts/LibraryContext';
import { Badge } from '@/components/ui/badge';

export default function IssuedBooks() {
  const { getAllIssuedBooks } = useLibrary();
  const issued = getAllIssuedBooks();

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Issued Books</h1>
      {issued.length === 0 ? (
        <p className="text-muted-foreground">No books currently issued.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Book</th>
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Roll No.</th>
                <th className="pb-3 font-medium">Issue Date</th>
                <th className="pb-3 font-medium">Due Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {issued.map(r => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 font-medium">{r.bookTitle}</td>
                  <td className="py-3">{r.studentName}</td>
                  <td className="py-3 font-mono text-xs">{r.studentRollNumber}</td>
                  <td className="py-3 text-muted-foreground">{r.approvedDate}</td>
                  <td className="py-3 text-muted-foreground">{r.dueDate}</td>
                  <td className="py-3">
                    <Badge variant={r.dueDate && new Date(r.dueDate) < new Date() ? 'destructive' : 'issued'}>
                      {r.dueDate && new Date(r.dueDate) < new Date() ? 'Overdue' : 'Active'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
