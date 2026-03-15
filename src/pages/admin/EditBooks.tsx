import { useState } from 'react';
import { getBooksPaginated } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Book } from '@/types';

export default function EditBooks() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');

  const { books, total } = getBooksPaginated(page, 20, { search });
  const totalPages = Math.ceil(total / 20);

  const openEdit = (book: Book) => {
    setEditing(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
  };

  const handleSave = () => {
    if (editing) {
      editing.title = editTitle;
      editing.author = editAuthor;
      toast.success(`Updated "${editTitle}"`);
      setEditing(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Edit Books</h1>
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search books..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
      </div>

      <div className="space-y-2">
        {books.map(book => (
          <Card key={book.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{book.title}</p>
                <p className="text-xs text-muted-foreground">{book.author} · {book.isbn}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => openEdit(book)}>
                <Edit className="h-4 w-4 mr-1" /> Edit
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

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Edit Book</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={editTitle} onChange={e => setEditTitle(e.target.value)} /></div>
            <div><Label>Author</Label><Input value={editAuthor} onChange={e => setEditAuthor(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
