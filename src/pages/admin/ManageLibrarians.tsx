import { defaultLibrarian } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Building, Hash } from 'lucide-react';

export default function ManageLibrarians() {
  const lib = defaultLibrarian;

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Manage Librarians</h1>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="font-display text-base">Registered Librarians</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{lib.name}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Hash className="h-3 w-3" />{lib.employeeId}</span>
                <span className="flex items-center gap-1"><Building className="h-3 w-3" />{lib.department}</span>
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lib.email}</span>
              </div>
            </div>
            <Badge variant="available">{lib.status}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
