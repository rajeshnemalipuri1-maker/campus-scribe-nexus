import { Book, User, Notification } from "@/types";

/* ---------------- BOOK DATA ---------------- */

const categories = [
  "Quantum Mechanics",
  "Microeconomics",
  "Data Structures",
  "Organic Chemistry",
  "Linear Algebra",
  "Thermodynamics",
  "Machine Learning",
  "Digital Electronics",
  "Operating Systems",
  "Database Systems",
  "Computer Networks",
  "Calculus",
  "Discrete Mathematics",
  "Artificial Intelligence",
  "Software Engineering"
];

const authorFirstNames = [
  "James","Robert","David","Richard","Thomas","Michael","William","Rajesh","Amit"
];

const authorLastNames = [
  "Stewart","Cormen","Tanenbaum","Stallings","Haykin","Oppenheim","Griffiths","Sharma","Gupta"
];

const titlePrefixes = [
  "Introduction to",
  "Fundamentals of",
  "Advanced",
  "Principles of",
  "Modern",
  "Applied"
];

const coverColors = [
  "linear-gradient(135deg, #1a1a2e, #16213e)",
  "linear-gradient(135deg, #0f3460, #533483)",
  "linear-gradient(135deg, #2d4059, #ea5455)",
  "linear-gradient(135deg, #1b262c, #0f4c75)",
  "linear-gradient(135deg, #3a0ca3, #7209b7)",
  "linear-gradient(135deg, #184e77, #1a759f)",
  "linear-gradient(135deg, #6b2737, #c94c4c)",
  "linear-gradient(135deg, #2b580c, #639a67)",
  "linear-gradient(135deg, #4a1942, #c74b50)",
  "linear-gradient(135deg, #0d1b2a, #1b4332)",
];

function seededRandom(seed:number){
  let s = seed;
  return ()=>{
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  }
}

const rand = seededRandom(42);

function generateISBN(index:number){
  return `978-1-${10000+index}-${100+(index%900)}`;
}

function generateBooks(count:number):Book[]{

  const books:Book[]=[];

  for(let i=0;i<count;i++){

    const cat = categories[i % categories.length];
    const prefix = titlePrefixes[i % titlePrefixes.length];

    const first = authorFirstNames[Math.floor(rand()*authorFirstNames.length)];
    const last = authorLastNames[Math.floor(rand()*authorLastNames.length)];

    const totalCopies = Math.floor(rand()*5)+1;
    const availableCopies = Math.floor(rand()*(totalCopies+1));

    books.push({
      id:`book-${String(i+1).padStart(5,"0")}`,
      title:`${prefix} ${cat}`,
      author:`${first} ${last}`,
      category:cat,
      isbn:generateISBN(i),
      available:availableCopies>0,
      totalCopies,
      availableCopies,
      coverColor:coverColors[i % coverColors.length]
    });
  }

  return books;
}

/* ---------------- STUDENTS (CSD) ---------------- */

const deptName = "Computer Science & Data Science";

const firstNames = [
  "Aarav","Arjun","Ishaan","Rohan","Vikram","Rahul","Aditya","Siddharth",
  "Karthik","Varun","Amit","Nikhil","Harsh","Rajat","Akash","Sai",
  "Krishna","Teja","Abhishek","Charan","Manoj","Rakesh","Praneeth","Surya"
];

const lastNames = [
  "Sharma","Patel","Singh","Kumar","Gupta","Reddy","Joshi","Verma",
  "Nair","Mehta","Iyer","Das","Rao","Mishra","Agarwal","Chauhan"
];

function generateStudents():User[]{

  const students:User[]=[];

  for(let i=1;i<=198;i++){

    const roll = String(i).padStart(3,"0");
    const id = `y23cd${roll}`;

    const first = firstNames[i % firstNames.length];
    const last = lastNames[i % lastNames.length];

    students.push({
      id,
      name:`${first} ${last}`,
      role:"student",
      department:deptName,
      rollNumber:id,
      email:`${id}@university.edu`,
      status:"active",
      borrowedCount:0
    });

  }

  return students;
}

/* ---------------- DATA STORAGE ---------------- */

let books:Book[]|null=null;
let students:User[]|null=null;

export function getBooks():Book[]{
  if(!books) books = generateBooks(30000);
  return books;
}

export function getBooksPaginated(
  page:number,
  perPage:number,
  filters?:{
    search?:string;
    category?:string;
    available?:boolean;
  }
){

  let filtered = getBooks();

  if(filters?.search){

    const s = filters.search.toLowerCase();

    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(s) ||
      b.author.toLowerCase().includes(s)
    );
  }

  if(filters?.category){
    filtered = filtered.filter(b=>b.category===filters.category);
  }

  if(filters?.available !== undefined){
    filtered = filtered.filter(b=>b.available===filters.available);
  }

  return{
    books: filtered.slice((page-1)*perPage, page*perPage),
    total: filtered.length
  }

}

export function getBookById(id:string){
  return getBooks().find(b=>b.id===id);
}

export function getStudents():User[]{
  if(!students) students = generateStudents();
  return students;
}

export function getStudentById(id:string){
  return getStudents().find(s=>s.id===id);
}

export function getCategories(){
  return categories;
}

/* ---------------- STAFF USERS ---------------- */

export const defaultLibrarian:User = {
  id:"lib-001",
  name:"Dr. Anand Kulkarni",
  role:"librarian",
  employeeId:"LIB-2024-001",
  department:"Central Library",
  email:"librarian@university.edu",
  status:"active",
  borrowedCount:0
};

export const defaultAdmin:User = {
  id:"admin-001",
  name:"Prof. Sunita Deshmukh",
  role:"admin",
  employeeId:"ADM-2024-001",
  department:"Library Administration",
  email:"admin@university.edu",
  status:"active",
  borrowedCount:0
};

/* ---------------- NOTIFICATIONS ---------------- */

export const sampleNotifications:Notification[]=[

{
id:"n1",
message:"Your book request has been approved.",
date:"2024-03-14",
read:false,
type:"success"
},

{
id:"n2",
message:"Reminder: Book due in 2 days.",
date:"2024-03-13",
read:false,
type:"warning"
},

{
id:"n3",
message:"New books added to Machine Learning.",
date:"2024-03-12",
read:true,
type:"info"
}

];
