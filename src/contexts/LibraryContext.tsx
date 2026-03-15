import React, { createContext, useContext, useState, useCallback } from 'react';
import { BookRequest, RequestStatus } from '@/types';
import { getBooks } from '@/data/mockData';

interface LibraryState {
  requests: BookRequest[];
  addRequest: (req: BookRequest) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus, dueDate?: string) => void;
  returnBook: (requestId: string) => void;
  getStudentRequests: (studentId: string) => BookRequest[];
  getStudentBorrowedBooks: (studentId: string) => BookRequest[];
  getPendingRequests: () => BookRequest[];
  getAllIssuedBooks: () => BookRequest[];
}

const LibraryContext = createContext<LibraryState | null>(null);

// Generate some initial requests for realism
function generateInitialRequests(): BookRequest[] {
  const books = getBooks();
  const initial: BookRequest[] = [
    {
      id: 'req-001', bookId: books[0].id, bookTitle: books[0].title,
      studentId: 'y23cs001', studentName: 'Aarav Sharma', studentRollNumber: 'y23cs001',
      status: 'issued', requestDate: '2024-03-01', approvedDate: '2024-03-02',
      dueDate: '2024-03-16',
    },
    {
      id: 'req-002', bookId: books[5].id, bookTitle: books[5].title,
      studentId: 'y23cs001', studentName: 'Aarav Sharma', studentRollNumber: 'y23cs001',
      status: 'pending', requestDate: '2024-03-14',
    },
    {
      id: 'req-003', bookId: books[10].id, bookTitle: books[10].title,
      studentId: 'y23cs001', studentName: 'Aarav Sharma', studentRollNumber: 'y23cs001',
      status: 'returned', requestDate: '2024-02-15', approvedDate: '2024-02-16',
      dueDate: '2024-03-01', returnDate: '2024-02-28',
    },
    {
      id: 'req-004', bookId: books[2].id, bookTitle: books[2].title,
      studentId: 'y23ec001', studentName: 'Arjun Singh', studentRollNumber: 'y23ec001',
      status: 'pending', requestDate: '2024-03-13',
    },
    {
      id: 'req-005', bookId: books[15].id, bookTitle: books[15].title,
      studentId: 'y23it001', studentName: 'Ishaan Gupta', studentRollNumber: 'y23it001',
      status: 'issued', requestDate: '2024-03-05', approvedDate: '2024-03-06',
      dueDate: '2024-03-20',
    },
  ];
  return initial;
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<BookRequest[]>(generateInitialRequests);

  const addRequest = useCallback((req: BookRequest) => {
    setRequests(prev => [req, ...prev]);
  }, []);

  const updateRequestStatus = useCallback((requestId: string, status: RequestStatus, dueDate?: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      const updated = { ...r, status };
      if (status === 'approved' || status === 'issued') {
        updated.approvedDate = new Date().toISOString().split('T')[0];
        if (dueDate) updated.dueDate = dueDate;
        else {
          const due = new Date();
          due.setDate(due.getDate() + 14);
          updated.dueDate = due.toISOString().split('T')[0];
        }
        updated.status = 'issued';
        // Update book availability
        const books = getBooks();
        const book = books.find(b => b.id === r.bookId);
        if (book && book.availableCopies > 0) {
          book.availableCopies--;
          book.available = book.availableCopies > 0;
        }
      }
      return updated;
    }));
  }, []);

  const returnBook = useCallback((requestId: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      const books = getBooks();
      const book = books.find(b => b.id === r.bookId);
      if (book) {
        book.availableCopies++;
        book.available = true;
      }
      return { ...r, status: 'returned' as RequestStatus, returnDate: new Date().toISOString().split('T')[0] };
    }));
  }, []);

  const getStudentRequests = useCallback((studentId: string) => {
    return requests.filter(r => r.studentId === studentId);
  }, [requests]);

  const getStudentBorrowedBooks = useCallback((studentId: string) => {
    return requests.filter(r => r.studentId === studentId && r.status === 'issued');
  }, [requests]);

  const getPendingRequests = useCallback(() => {
    return requests.filter(r => r.status === 'pending');
  }, [requests]);

  const getAllIssuedBooks = useCallback(() => {
    return requests.filter(r => r.status === 'issued');
  }, [requests]);

  return (
    <LibraryContext.Provider value={{
      requests, addRequest, updateRequestStatus, returnBook,
      getStudentRequests, getStudentBorrowedBooks, getPendingRequests, getAllIssuedBooks,
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
}
