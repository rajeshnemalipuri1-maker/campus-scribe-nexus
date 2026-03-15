import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLibrary } from '@/contexts/LibraryContext';
import { getBooksPaginated, getCategories } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function SearchBooks() {
  const { user } = useAuth();
  const { addRequest, getStudentRequests } = useLibrary();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 20;

  const { books, total } = getBooksPaginated(page, perPage, {
    search,
    category: category || undefined,
    available: availableOnly ? true : undefined,
  });

  const totalPages = Math.ceil(total / perPage);
  const studentRequests = user ? getStudentRequests(user.id) : [];

  const handleRequest = (bookId: string, bookTitle: string) => {
    if (!user) return;
    const alreadyRequested = studentRequests.some(r => r.bookId === bookId && (r.status === 'pending' || r.status === 'issued'));
    if (alreadyRequested) {
      toast.error('You already have an active request for this book.');
      return;
    }
    addRequest({
      id: `req-${Date.now()}`,
      bookId,
      bookTitle,
      studentId: user.id,
      studentName: user.name,
      studentRollNumber: user.rollNumber || '',
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
    });
    toast.success(`Request submitted for "${bookTitle}"`);
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Search Books</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, author, or ISBN..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={v => { setCategory(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {getCategories().map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button
          variant={availableOnly ? 'default' : 'outline'}
          onClick={() => { setAvailableOnly(!availableOnly); setPage(1); }}
          size="sm"
          className="whitespace-nowrap"
        >
          Available Only
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{total.toLocaleString()} books found</p>

      <div className="space-y-2">
        {books.map(book => (
          <Card key={book.id} className="hover:shadow-sm transition-shadow duration-150">
            <CardContent className="py-4 flex items-center gap-4">
              <div className="h-14 w-10 rounded flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: book.coverColor }}>
                <BookOpen className="h-5 w-5 text-card" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{book.title}</p>
                <p className="text-xs text-muted-foreground">{book.author} · {book.category}</p>
                <p className="text-xs text-muted-foreground font-mono">{book.isbn}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Badge variant={book.available ? 'available' : 'unavailable'}>
                  {book.available ? `${book.availableCopies} avail.` : 'Unavailable'}
                </Badge>
                {user?.role === 'student' && book.available && (
                  <Button size="sm" onClick={() => handleRequest(book.id, book.title)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Request
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
