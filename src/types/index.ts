export type UserRole = 'student' | 'librarian' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string;
  rollNumber?: string;
  employeeId?: string;
  email: string;
  status: 'active' | 'suspended';
  borrowedCount: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  available: boolean;
  totalCopies: number;
  availableCopies: number;
  coverColor: string;
}

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'issued' | 'returned';

export interface BookRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  status: RequestStatus;
  requestDate: string;
  approvedDate?: string;
  dueDate?: string;
  returnDate?: string;
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}
