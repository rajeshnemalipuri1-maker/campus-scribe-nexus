import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LibraryProvider } from "@/contexts/LibraryContext";

import LoginPage from "@/pages/LoginPage";
import DashboardLayout from "@/components/DashboardLayout";
import NotFound from "@/pages/NotFound";

// Student pages
import StudentDashboard from "@/pages/student/StudentDashboard";
import SearchBooks from "@/pages/student/SearchBooks";
import MyRequests from "@/pages/student/MyRequests";
import BorrowedBooks from "@/pages/student/BorrowedBooks";
import FinesTransactions from "@/pages/student/FinesTransactions";
import StudentCatalog from "@/pages/student/StudentCatalog";

// Librarian pages
import LibrarianDashboard from "@/pages/librarian/LibrarianDashboard";
import PendingRequests from "@/pages/librarian/PendingRequests";
import IssuedBooks from "@/pages/librarian/IssuedBooks";
import ReturnBooks from "@/pages/librarian/ReturnBooks";
import StudentLookup from "@/pages/librarian/StudentLookup";
import LibrarianCatalog from "@/pages/librarian/LibrarianCatalog";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AddBooks from "@/pages/admin/AddBooks";
import EditBooks from "@/pages/admin/EditBooks";
import DeleteBooks from "@/pages/admin/DeleteBooks";
import ManageStudents from "@/pages/admin/ManageStudents";
import ManageLibrarians from "@/pages/admin/ManageLibrarians";
import Analytics from "@/pages/admin/Analytics";
import SystemSettings from "@/pages/admin/SystemSettings";

// Shared
import ProfilePage from "@/pages/shared/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LibraryProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />

              {/* Student Routes */}
              <Route element={<DashboardLayout requiredRole="student" />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/search" element={<SearchBooks />} />
                <Route path="/student/requests" element={<MyRequests />} />
                <Route path="/student/borrowed" element={<BorrowedBooks />} />
                <Route path="/student/catalog" element={<StudentCatalog />} />
                <Route path="/student/profile" element={<ProfilePage />} />
              </Route>

              {/* Librarian Routes */}
              <Route element={<DashboardLayout requiredRole="librarian" />}>
                <Route path="/librarian/dashboard" element={<LibrarianDashboard />} />
                <Route path="/librarian/pending" element={<PendingRequests />} />
                <Route path="/librarian/issue" element={<IssuedBooks />} />
                <Route path="/librarian/return" element={<ReturnBooks />} />
                <Route path="/librarian/borrowed" element={<IssuedBooks />} />
                <Route path="/librarian/students" element={<StudentLookup />} />
                <Route path="/librarian/catalog" element={<LibrarianCatalog />} />
                <Route path="/librarian/profile" element={<ProfilePage />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<DashboardLayout requiredRole="admin" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/catalog" element={<SearchBooks />} />
                <Route path="/admin/books/add" element={<AddBooks />} />
                <Route path="/admin/books/edit" element={<EditBooks />} />
                <Route path="/admin/books/delete" element={<DeleteBooks />} />
                <Route path="/admin/students" element={<ManageStudents />} />
                <Route path="/admin/librarians" element={<ManageLibrarians />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/settings" element={<SystemSettings />} />
                <Route path="/admin/profile" element={<ProfilePage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LibraryProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
