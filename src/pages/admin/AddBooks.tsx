import { useState } from 'react';
import { getBooks, getCategories } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AddBooks() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [isbn, setIsbn] = useState('');
  const [copies, setCopies] = useState('1');

  const handleAdd = () => {
    if (!title || !author || !category || !isbn) {
      toast.error('Please fill all required fields.');
      return;
    }
    const books = getBooks();
    books.unshift({
      id: `book-new-${Date.now()}`,
      title, author, category, isbn,
      available: true,
      totalCopies: parseInt(copies) || 1,
      availableCopies: parseInt(copies) || 1,
      coverColor: '#1E3A5F',
    });
    toast.success(`"${title}" added to catalog.`);
    setTitle(''); setAuthor(''); setCategory(''); setIsbn(''); setCopies('1');
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-6">Add Books</h1>
      <Card className="max-w-lg">
        <CardHeader><CardTitle className="font-display">New Book Entry</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Book title" />
          </div>
          <div>
            <Label>Author</Label>
            <Input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name" />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {getCategories().map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>ISBN</Label>
            <Input value={isbn} onChange={e => setIsbn(e.target.value)} placeholder="978-X-XXXXX-XXX-X" className="font-mono" />
          </div>
          <div>
            <Label>Copies</Label>
            <Input type="number" min="1" value={copies} onChange={e => setCopies(e.target.value)} />
          </div>
          <Button onClick={handleAdd} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Add Book</Button>
        </CardContent>
      </Card>
    </div>
  );
}
