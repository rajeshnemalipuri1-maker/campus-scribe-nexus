// src/data/mockData.ts
import { Book, User, Notification } from '@/types';

/* ---------------- BOOK DATA ---------------- */

const categories = [
  'Quantum Mechanics','Microeconomics','Data Structures','Organic Chemistry',
  'Linear Algebra','Thermodynamics','Machine Learning','Digital Electronics',
  'Operating Systems','Database Systems','Computer Networks','Calculus',
  'Discrete Mathematics','Fluid Mechanics','Control Systems','Signal Processing',
  'Artificial Intelligence','Software Engineering','Probability & Statistics'
];

const authorFirstNames = ['James','Robert','David','Richard','Thomas','Michael','William'];
const authorLastNames = ['Stewart','Cormen','Tanenbaum','Stallings','Haykin','Oppenheim','Griffiths'];

const titlePrefixes = ['Introduction to','Fundamentals of','Advanced','Principles of','Modern'];

const coverColors = ['#1E3A5F','#2D4A22','#6B2D2D','#4A3B6B','#2B4A6F'];

function seededRandom(seed:number){
  let s=seed;
  return ()=>{
    s=(s*16807)%2147483647;
    return s/2147483647;
  };
}

const rand=seededRandom(42);

function generateISBN(index:number){
  const base=`9781${10000+index}${100+(index%900)}`;
  return base;
}

function generateBooks(count:number):Book[]{
  const books:Book[]=[];
  for(let i=0;i<count;i++){

    const cat=categories[i%categories.length];
    const prefix=titlePrefixes[i%titlePrefixes.length];

    const first=authorFirstNames[Math.floor(rand()*authorFirstNames.length)];
    const last=authorLastNames[Math.floor(rand()*authorLastNames.length)];

    const totalCopies=Math.floor(rand()*5)+1;
    const availableCopies=Math.floor(rand()*(totalCopies+1));

    books.push({
      id:`book-${String(i+1).padStart(5,'0')}`,
      title:`${prefix} ${cat}`,
      author:`${first} ${last}`,
      category:cat,
      isbn:generateISBN(i),
      available:availableCopies>0,
      totalCopies,
      availableCopies,
      coverColor:coverColors[i%coverColors.length]
    });
  }
  return books;
}

let books:Book[]|null=null;

export function getBooks(){
  if(!books) books=generateBooks(30000);
  return books;
}

export function getBookById(id:string){
  return getBooks().find(b=>b.id===id);
}

/* ---------------- STUDENTS ---------------- */

export const students:User[]=[

{ id:"y23cd158", name:"Regula Venkata Naga Maneesh Kumar", role:"student", department:"CSE Data Science", rollNumber:"y23cd158", email:"y23cd158@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd007", name:"Appapurapu Venkata Krishna Sri Thanmai", role:"student", department:"CSE Data Science", rollNumber:"y23cd007", email:"y23cd007@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd023", name:"Boddu Sri Charan", role:"student", department:"CSE Data Science", rollNumber:"y23cd023", email:"y23cd023@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd031", name:"Chalamala Uday", role:"student", department:"CSE Data Science", rollNumber:"y23cd031", email:"y23cd031@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd143", name:"Patibandla Narendra", role:"student", department:"CSE Data Science", rollNumber:"y23cd143", email:"y23cd143@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd092", name:"Mahesh Katteboina", role:"student", department:"CSE Data Science", rollNumber:"y23cd092", email:"y23cd092@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd047", name:"D.Sreepadha Reddy", role:"student", department:"CSE Data Science", rollNumber:"y23cd047", email:"y23cd047@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd188", name:"Varikuti Joshua Abhishek", role:"student", department:"CSE Data Science", rollNumber:"y23cd188", email:"y23cd188@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd073", name:"Hemanth Sai", role:"student", department:"CSE Data Science", rollNumber:"y23cd073", email:"y23cd073@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd127", name:"Myneni Sri Charan", role:"student", department:"CSE Data Science", rollNumber:"y23cd127", email:"y23cd127@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd139", name:"Pangala Tarun", role:"student", department:"CSE Data Science", rollNumber:"y23cd139", email:"y23cd139@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd152", name:"Rachuri Bala Koteswara Rao", role:"student", department:"CSE Data Science", rollNumber:"y23cd152", email:"y23cd152@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd156", name:"Ravuri Bhargav", role:"student", department:"CSE Data Science", rollNumber:"y23cd156", email:"y23cd156@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd167", name:"Shaik Mahemood", role:"student", department:"CSE Data Science", rollNumber:"y23cd167", email:"y23cd167@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd178", name:"T.Chaitanya Sai", role:"student", department:"CSE Data Science", rollNumber:"y23cd178", email:"y23cd178@rvrjc.ac.in", status:"active", borrowedCount:0 },

{ id:"y23cd183", name:"T.Harsha Vardhan", role:"student", department:"CSE Data Science", rollNumber:"y23cd183", email:"y23cd183@rvrjc.ac.in", status:"active", borrowedCount:0 }

];

export function getStudents(){
  return students;
}

export function getStudentById(id:string){
  return students.find(s=>s.id===id);
}

/* ---------------- DEMO USERS ---------------- */

export const defaultLibrarian:User={
  id:'lib-001',
  name:'Dr. Anand Kulkarni',
  role:'librarian',
  employeeId:'LIB-2024-001',
  department:'Central Library',
  email:'librarian@university.edu',
  status:'active',
  borrowedCount:0
};

export const defaultAdmin:User={
  id:'admin-001',
  name:'Prof. Sunita Deshmukh',
  role:'admin',
  employeeId:'ADM-2024-001',
  department:'Library Administration',
  email:'admin@university.edu',
  status:'active',
  borrowedCount:0
};

/* ---------------- NOTIFICATIONS ---------------- */

export const sampleNotifications:Notification[]=[
{
id:'n1',
message:'Your book request has been approved',
date:'2024-03-14',
read:false,
type:'success'
},
{
id:'n2',
message:'Book due in 2 days',
date:'2024-03-13',
read:false,
type:'warning'
},
{
id:'n3',
message:'New books added to Machine Learning',
date:'2024-03-12',
read:true,
type:'info'
}
];
