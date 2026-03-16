import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { BookOpen, GraduationCap, Users, Shield } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");

    if (!selectedRole) return;

    const id = userId.trim().toLowerCase();
    const pass = password.trim();

    if (!id || !pass) {
      setError("Please enter User ID and Password");
      return;
    }

    const success = login(selectedRole, id, pass);

    if (success) {
      navigate(`/${selectedRole}/dashboard`);
    } else {
      setError("Invalid credentials");
    }
  };

  const roles: {
    role: UserRole;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      role: "student",
      label: "Student Login",
      icon: <GraduationCap className="h-8 w-8" />,
      description: "Access library account",
    },
    {
      role: "librarian",
      label: "Librarian Login",
      icon: <Users className="h-8 w-8" />,
      description: "Manage circulation",
    },
    {
      role: "admin",
      label: "Admin Login",
      icon: <Shield className="h-8 w-8" />,
      description: "System administration",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">

        {/* Header */}

        <div className="text-center mb-10">

          <div className="flex justify-center mb-4">

            <div className="h-14 w-14 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>

          </div>

          <h1 className="text-3xl font-semibold">
            University Library
          </h1>

          <p className="text-muted-foreground mt-2">
            Library Management System
          </p>

        </div>

        {!selectedRole ? (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">

            {roles.map((r) => (

              <Card
                key={r.role}
                className="cursor-pointer border-2 hover:border-primary"
                onClick={() => setSelectedRole(r.role)}
              >

                <CardHeader className="text-center">

                  <div className="mx-auto mb-3 h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {r.icon}
                  </div>

                  <CardTitle>{r.label}</CardTitle>

                </CardHeader>

                <CardContent>

                  <CardDescription className="text-center">
                    {r.description}
                  </CardDescription>

                </CardContent>

              </Card>

            ))}

          </div>

        ) : (

          <Card className="max-w-md mx-auto">

            <CardHeader>

              <CardTitle>
                {roles.find(r => r.role === selectedRole)?.label}
              </CardTitle>

              <CardDescription>
                Enter your credentials
              </CardDescription>

            </CardHeader>

            <CardContent className="space-y-4">

              {/* USER ID */}

              <div>

                <label className="text-sm font-medium">
                  User ID
                </label>

                <Input
                  placeholder="Enter user id"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setError("");
                  }}
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label className="text-sm font-medium">
                  Password
                </label>

                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value.trimStart());
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                />

              </div>

              {error && (
                <p className="text-red-500 text-sm">
                  {error}
                </p>
              )}

              {/* DEMO LOGIN */}

              <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded">

                <p className="font-semibold mb-1">
                  Demo Credentials
                </p>

                {selectedRole === "student" && (
                  <p>
                    ID: y23cd001 | Password: student123
                  </p>
                )}

                {selectedRole === "librarian" && (
                  <p>
                    ID: librarian01 | Password: lib123
                  </p>
                )}

                {selectedRole === "admin" && (
                  <p>
                    ID: admin01 | Password: admin123
                  </p>
                )}

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3">

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRole(null);
                    setUserId("");
                    setPassword("");
                    setError("");
                  }}
                  className="flex-1"
                >
                  Back
                </Button>

                <Button
                  onClick={handleLogin}
                  className="flex-1"
                >
                  Sign In
                </Button>

              </div>

            </CardContent>

          </Card>

        )}

        {/* Terms & Conditions and Return Policy */}
        <div className="max-w-3xl mx-auto mt-10 space-y-4 text-xs text-muted-foreground bg-muted/40 p-5 rounded-lg border">
          <h2 className="text-sm font-semibold text-foreground">Terms & Conditions</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Each student may borrow a maximum of <strong>3 books</strong> at a time.</li>
            <li>To request a new book when the limit is reached, one borrowed book must be returned first.</li>
            <li>Books are issued for a period of <strong>14 days</strong> from the date of approval.</li>
            <li>Students are responsible for the books in their possession and must return them in good condition.</li>
            <li>Misuse of library resources may result in suspension of borrowing privileges.</li>
          </ul>

          <h2 className="text-sm font-semibold text-foreground mt-4">Return Policy</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Books must be returned on or before the due date.</li>
            <li>Overdue books may attract a fine of <strong>₹5 per day</strong> per book.</li>
            <li>Lost or damaged books must be replaced or compensated at current market value.</li>
            <li>Returns are processed by the librarian and reflected in the student portal within 24 hours.</li>
          </ul>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          University Library Management System · 2024–25
        </p>

      </div>
    </div>
  );
}
