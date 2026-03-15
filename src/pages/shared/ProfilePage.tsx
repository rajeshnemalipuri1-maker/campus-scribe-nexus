import { useAuth } from '@/contexts/AuthContext';
import { useLibrary } from '@/contexts/LibraryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, BookOpen, Mail, Building, Hash } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { getStudentBorrowedBooks, getAllIssuedBooks } = useLibrary();
  if (!user) return null;

  const borrowedCount = user.role === 'student'
    ? getStudentBorrowedBooks(user.id).length
    : getAllIssuedBooks().length;

  const fields = [
    { label: 'Name', value: user.name, icon: <User className="h-4 w-4" /> },
    { label: user.role === 'student' ? 'Roll Number' : 'Employee ID', value: user.rollNumber || user.employeeId, icon: <Hash className="h-4 w-4" /> },
    { label: 'Department', value: user.department, icon: <Building className="h-4 w-4" /> },
    { label: 'Email', value: user.email, icon: <Mail className="h-4 w-4" /> },
    { label: 'Borrowed Books', value: String(borrowedCount), icon: <BookOpen className="h-4 w-4" /> },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Profile</h1>
      <Card className="max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">{user.role} · {user.status}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map(f => (
            <div key={f.label} className="flex items-center gap-3 text-sm">
              <div className="text-muted-foreground">{f.icon}</div>
              <span className="text-muted-foreground w-32">{f.label}</span>
              <span className="font-medium">{f.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
