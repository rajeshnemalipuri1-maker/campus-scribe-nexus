import { useState } from 'react';
import { getStudents } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

export default function ManageStudents() {
  const [search, setSearch] = useState('');
  const students = getStudents();
  const filtered = search.length >= 2
    ? students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
        s.department?.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 50)
    : students.slice(0, 50);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Manage Students</h1>
      <p className="text-sm text-muted-foreground mb-4">{students.length.toLocaleString()} students registered</p>
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Roll Number</th>
              <th className="pb-3 font-medium">Department</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="py-3 font-medium">{s.name}</td>
                <td className="py-3 font-mono text-xs">{s.rollNumber}</td>
                <td className="py-3 text-muted-foreground">{s.department}</td>
                <td className="py-3 text-muted-foreground">{s.email}</td>
                <td className="py-3"><Badge variant="available">{s.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
