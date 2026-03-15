import { Book, User, BookRequest, Notification } from '@/types';

// --- Book Data Generation ---
const categories = [
  'Quantum Mechanics', 'Microeconomics', 'Data Structures', 'Organic Chemistry',
  'Linear Algebra', 'Thermodynamics', 'Machine Learning', 'Digital Electronics',
  'Operating Systems', 'Database Systems', 'Computer Networks', 'Calculus',
  'Discrete Mathematics', 'Fluid Mechanics', 'Control Systems', 'Signal Processing',
  'Artificial Intelligence', 'Software Engineering', 'Probability & Statistics',
  'Structural Analysis', 'Biochemistry', 'Molecular Biology', 'Political Science',
  'Macroeconomics', 'Financial Accounting', 'Business Analytics', 'Marketing Management',
  'Electromagnetic Theory', 'Solid State Physics', 'Environmental Science'
];

const authorFirstNames = [
  'James', 'Robert', 'Maria', 'David', 'Sarah', 'Richard', 'Emily', 'Thomas',
  'Jennifer', 'Charles', 'Priya', 'Amit', 'Sunita', 'Rajesh', 'Ananya',
  'Michael', 'Patricia', 'William', 'Linda', 'Andrew', 'Susan', 'Daniel', 'Karen'
];

const authorLastNames = [
  'Stewart', 'Cormen', 'Tanenbaum', 'Stallings', 'Haykin', 'Oppenheim',
  'Griffiths', 'Halliday', 'Mankiw', 'Varian', 'Morrison', 'Stroustrup',
  'Sedgewick', 'Silberschatz', 'Kurose', 'Ross', 'Sharma', 'Gupta', 'Patel',
  'Singh', 'Kumar', 'Anderson', 'Thompson', 'Wilson'
];

const titlePrefixes = [
  'Introduction to', 'Fundamentals of', 'Advanced', 'Principles of',
  'Modern', 'Applied', 'Computational', 'Engineering', 'Mathematical',
  'Theoretical', 'Practical', 'Essentials of', 'Concepts in', 'Foundations of'
];

const coverColors = [
  '#1E3A5F', '#2D4A22', '#6B2D2D', '#4A3B6B', '#2B4A6F',
  '#5C3D1E', '#1B4D3E', '#3D1E5C', '#4D1B3E', '#1E4D4D'
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

const rand = seededRandom(42);

function generateISBN(index: number): string {
  const prefix = '978';
  const group = String(Math.floor(rand() * 9) + 1);
  const publisher = String(10000 + index).slice(-5);
  const title2 = String(100 + (index % 900)).slice(-3);
  const base = `${prefix}${group}${publisher}${title2}`;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(base[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  return `${prefix}-${group}-${publisher}-${title2}-${check}`;
}

function generateBooks(count: number): Book[] {
  const books: Book[] = [];
  for (let i = 0; i < count; i++) {
    const cat = categories[i % categories.length];
    const prefix = titlePrefixes[i % titlePrefixes.length];
    const firstName = authorFirstNames[Math.floor(rand() * authorFirstNames.length)];
    const lastName = authorLastNames[Math.floor(rand() * authorLastNames.length)];
    const totalCopies = Math.floor(rand() * 5) + 1;
    const availableCopies = Math.floor(rand() * (totalCopies + 1));
    books.push({
      id: `book-${String(i + 1).padStart(5, '0')}`,
      title: `${prefix} ${cat}${i > categories.length ? ` Vol. ${Math.floor(i / categories.length) + 1}` : ''}`,
      author: `${firstName} ${lastName}`,
      category: cat,
      isbn: generateISBN(i),
      available: availableCopies > 0,
      totalCopies,
      availableCopies,
      coverColor: coverColors[i % coverColors.length],
    });
  }
  return books;
}

// --- Student Generation ---
const departments = ['cs', 'cm', 'ec', 'ee', 'ce', 'it', 'me', 'cb', 'co', 'ba', 'ms', 'ma'];
const deptNames: Record<string, string> = {
  cs: 'Computer Science', cm: 'Communication', ec: 'Electronics & Communication',
  ee: 'Electrical Engineering', ce: 'Civil Engineering', it: 'Information Technology',
  me: 'Mechanical Engineering', cb: 'Computer Business', co: 'Commerce',
  ba: 'Business Administration', ms: 'Management Studies', ma: 'Mathematics'
};
const firstNames = [
  'Aarav', 'Aditi', 'Arjun', 'Diya', 'Ishaan', 'Kavya', 'Rohan', 'Sneha',
  'Vikram', 'Ananya', 'Rahul', 'Priya', 'Aditya', 'Meera', 'Siddharth',
  'Neha', 'Karthik', 'Pooja', 'Varun', 'Riya', 'Amit', 'Shruti', 'Nikhil',
  'Divya', 'Harsh', 'Tanvi', 'Rajat', 'Nisha', 'Akash', 'Simran'
];
const lastNames = [
  'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Joshi', 'Verma',
  'Nair', 'Mehta', 'Iyer', 'Das', 'Rao', 'Mishra', 'Agarwal', 'Chauhan',
  'Pillai', 'Bhat', 'Kulkarni', 'Desai'
];

function generateStudents(): User[] {
  const students: User[] = [];
  let idx = 0;
  for (const dept of departments) {
    const count = dept === 'cs' || dept === 'it' || dept === 'ec' ? 198 : Math.min(198, Math.floor(3000 / departments.length));
    for (let roll = 1; roll <= count && students.length < 3000; roll++) {
      const rollStr = String(roll).padStart(3, '0');
      const rollNumber = `y23${dept}${rollStr}`;
      const fn = firstNames[idx % firstNames.length];
      const ln = lastNames[Math.floor(idx / firstNames.length) % lastNames.length];
      students.push({
        id: rollNumber,
        name: `${fn} ${ln}`,
        role: 'student',
        department: deptNames[dept],
        rollNumber,
        email: `${rollNumber}@university.edu`,
        status: 'active',
        borrowedCount: 0,
      });
      idx++;
    }
  }
  return students;
}

// Singleton data store
let books: Book[] | null = null;
let students: User[] | null = null;

export function getBooks(): Book[] {
  if (!books) books = generateBooks(30000);
  return books;
}

// Paginated book access to avoid rendering 30k at once
export function getBooksPaginated(page: number, perPage: number, filters?: {
  search?: string;
  category?: string;
  available?: boolean;
}): { books: Book[]; total: number } {
  let filtered = getBooks();
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(s) ||
      b.author.toLowerCase().includes(s) ||
      b.isbn.toLowerCase().includes(s)
    );
  }
  if (filters?.category) {
    filtered = filtered.filter(b => b.category === filters.category);
  }
  if (filters?.available !== undefined) {
    filtered = filtered.filter(b => b.available === filters.available);
  }
  return {
    books: filtered.slice((page - 1) * perPage, page * perPage),
    total: filtered.length,
  };
}

export function getBookById(id: string): Book | undefined {
  return getBooks().find(b => b.id === id);
}

export function getStudents(): User[] {
  if (!students) students = generateStudents();
  return students;
}

export function getStudentById(id: string): User | undefined {
  return getStudents().find(s => s.id === id);
}

export function getCategories(): string[] {
  return categories;
}

export function getDepartmentName(code: string): string {
  return deptNames[code] || code;
}

// Default librarian and admin users
export const defaultLibrarian: User = {
  id: 'lib-001',
  name: 'Dr. Anand Kulkarni',
  role: 'librarian',
  employeeId: 'LIB-2024-001',
  department: 'Central Library',
  email: 'librarian@university.edu',
  status: 'active',
  borrowedCount: 0,
};

export const defaultAdmin: User = {
  id: 'admin-001',
  name: 'Prof. Sunita Deshmukh',
  role: 'admin',
  employeeId: 'ADM-2024-001',
  department: 'Library Administration',
  email: 'admin@university.edu',
  status: 'active',
  borrowedCount: 0,
};

export const sampleNotifications: Notification[] = [
  { id: 'n1', message: 'Your book request for "Introduction to Quantum Mechanics" has been approved.', date: '2024-03-14', read: false, type: 'success' },
  { id: 'n2', message: 'Reminder: "Fundamentals of Data Structures" is due in 2 days.', date: '2024-03-13', read: false, type: 'warning' },
  { id: 'n3', message: 'New books have been added to the Machine Learning category.', date: '2024-03-12', read: true, type: 'info' },
];
