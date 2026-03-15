import { useState } from 'react';
import { getBooksPaginated, getBooks } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function DeleteBooks() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingTitle, setDeletingTitle] = useState('');
  const [refresh, setRefresh] = useState(0);

  const { books, total } = getBooksPaginated(page, 20, { search });
  const totalPages = Math.ceil(total / 20);

  const handleDelete = () => {
    if (deletingId) {
      const allBooks = getBooks();
      const idx = allBooks.findIndex(b => b.id === deletingId);
      if (idx !== -1) allBooks.splice(idx, 1);
      toast.success(`"${deletingTitle}" removed from catalog.`);
      setDeletingId(null);
      setRefresh(r => r + 1);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Delete Books</h1>
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search books to delete..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
      </div>

      <div className="space-y-2">
        {books.map(book => (
          <Card key={book.id}>
            <CardContent className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{book.title}</p>
                <p className="text-xs text-muted-foreground">{book.author}</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => { setDeletingId(book.id); setDeletingTitle(book.title); }}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
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

      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{deletingTitle}"? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
