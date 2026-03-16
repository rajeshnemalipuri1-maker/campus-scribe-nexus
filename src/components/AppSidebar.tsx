import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { UserRole } from '@/types';
import {
  BookOpen, LayoutDashboard, Search, FileText, BookMarked, Library, User,
  LogOut, ClipboardList, BookCheck, BookX, Users, UserSearch,
  PlusCircle, Edit, Trash2, BarChart3, Settings, ChevronLeft, ChevronRight,
  IndianRupee,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Search Books', path: '/student/search', icon: <Search className="h-5 w-5" /> },
  { label: 'My Requests', path: '/student/requests', icon: <FileText className="h-5 w-5" /> },
  { label: 'Borrowed Books', path: '/student/borrowed', icon: <BookMarked className="h-5 w-5" /> },
  { label: 'Fines & Transactions', path: '/student/fines', icon: <IndianRupee className="h-5 w-5" /> },
  { label: 'Library Catalog', path: '/student/catalog', icon: <Library className="h-5 w-5" /> },
  { label: 'Profile', path: '/student/profile', icon: <User className="h-5 w-5" /> },
];

const librarianNav: NavItem[] = [
  { label: 'Dashboard', path: '/librarian/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Pending Requests', path: '/librarian/pending', icon: <ClipboardList className="h-5 w-5" /> },
  { label: 'Issue Books', path: '/librarian/issue', icon: <BookCheck className="h-5 w-5" /> },
  { label: 'Return Books', path: '/librarian/return', icon: <BookX className="h-5 w-5" /> },
  { label: 'Borrowed Books', path: '/librarian/borrowed', icon: <BookMarked className="h-5 w-5" /> },
  { label: 'Student Lookup', path: '/librarian/students', icon: <UserSearch className="h-5 w-5" /> },
  { label: 'Library Catalog', path: '/librarian/catalog', icon: <Library className="h-5 w-5" /> },
  { label: 'Profile', path: '/librarian/profile', icon: <User className="h-5 w-5" /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Library Catalog', path: '/admin/catalog', icon: <Library className="h-5 w-5" /> },
  { label: 'Add Books', path: '/admin/books/add', icon: <PlusCircle className="h-5 w-5" /> },
  { label: 'Edit Books', path: '/admin/books/edit', icon: <Edit className="h-5 w-5" /> },
  { label: 'Delete Books', path: '/admin/books/delete', icon: <Trash2 className="h-5 w-5" /> },
  { label: 'Manage Students', path: '/admin/students', icon: <Users className="h-5 w-5" /> },
  { label: 'Manage Librarians', path: '/admin/librarians', icon: <UserSearch className="h-5 w-5" /> },
  { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'System Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  { label: 'Profile', path: '/admin/profile', icon: <User className="h-5 w-5" /> },
];

function getNavForRole(role: UserRole): NavItem[] {
  switch (role) {
    case 'student': return studentNav;
    case 'librarian': return librarianNav;
    case 'admin': return adminNav;
  }
}

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const navItems = getNavForRole(user.role);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={cn(
      "h-screen flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-200 sticky top-0",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="h-9 w-9 min-w-[2.25rem] rounded-md bg-sidebar-accent flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-sidebar-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-display font-semibold leading-tight truncate">University Library</p>
            <p className="text-xs text-sidebar-foreground/60 truncate capitalize">{user.role} Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-2 py-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/50 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>Collapse</span></>}
        </button>
      </div>

      {/* Sign Out */}
      <div className="px-2 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm border border-destructive text-sidebar-foreground hover:bg-destructive/10 transition-colors duration-150"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
