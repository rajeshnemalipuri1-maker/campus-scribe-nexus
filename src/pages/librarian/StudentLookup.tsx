import { useState } from 'react';
import { getStudents } from '@/data/mockData';
import { useLibrary } from '@/contexts/LibraryContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, User } from 'lucide-react';

export default function StudentLookup() {
  const [search, setSearch] = useState('');
  const { getStudentRequests } = useLibrary();

  const students = getStudents();
  const filtered = search.length >= 3
    ? students.filter(s =>
        s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 20)
    : [];

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Student Lookup</h1>
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by roll number or name (min 3 chars)..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(s => {
            const reqs = getStudentRequests(s.id);
            const borrowed = reqs.filter(r => r.status === 'issued').length;
            return (
              <Card key={s.id}>
                <CardContent className="py-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.rollNumber} · {s.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{borrowed} borrowed</p>
                    <p className="text-xs text-muted-foreground">{reqs.length} total requests</p>
                  </div>
                  <Badge variant={s.status === 'active' ? 'available' : 'destructive'}>{s.status}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : search.length >= 3 ? (
        <p className="text-muted-foreground">No students found.</p>
      ) : (
        <p className="text-muted-foreground">Type at least 3 characters to search.</p>
      )}
    </div>
  );
}
