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

    if (!userId || !password) {
      setError("Please enter User ID and Password");
      return;
    }

    const success = login(selectedRole, userId, password);

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
      description: "Access your library account",
    },
    {
      role: "librarian",
      label: "Librarian Login",
      icon: <Users className="h-8 w-8" />,
      description: "Manage book circulation",
    },
    {
      role: "admin",
      label: "Admin Login",
      icon: <Shield className="h-8 w-8" />,
      description: "Full system control",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-3xl font-semibold">University Library</h1>
          <p className="text-muted-foreground mt-2">
            Library Management System
          </p>
        </div>

        {/* ROLE SELECTION */}

        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">

            {roles.map(({ role, label, icon, description }) => (

              <Card
                key={role}
                className="cursor-pointer border-2 hover:border-primary"
                onClick={() => setSelectedRole(role)}
              >

                <CardHeader className="text-center">

                  <div className="mx-auto mb-3 h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {icon}
                  </div>

                  <CardTitle>{label}</CardTitle>

                </CardHeader>

                <CardContent>
                  <CardDescription className="text-center">
                    {description}
                  </CardDescription>
                </CardContent>

              </Card>

            ))}

          </div>

        ) : (

          /* LOGIN CARD */

          <Card className="max-w-md mx-auto">

            <CardHeader>

              <CardTitle>
                {roles.find(r => r.role === selectedRole)?.label}
              </CardTitle>

              <CardDescription>
                Enter credentials to continue
              </CardDescription>

            </CardHeader>

            <CardContent className="space-y-4">

              {/* USER ID */}

              <div>
                <label className="text-sm font-medium">User ID</label>

                <Input
                  placeholder="Enter ID"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setError("");
                  }}
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label className="text-sm font-medium">Password</label>

                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
              </div>

              {/* ERROR MESSAGE */}

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {/* DEMO LOGIN INFO */}

              <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded">

                {selectedRole === "student" && (
                  <p>
                    Demo Login → ID: <span className="font-mono">y23cs001</span> |
                    Password: <span className="font-mono">student123</span>
                  </p>
                )}

                {selectedRole === "librarian" && (
                  <p>
                    Demo Login → ID: <span className="font-mono">librarian01</span> |
                    Password: <span className="font-mono">lib123</span>
                  </p>
                )}

                {selectedRole === "admin" && (
                  <p>
                    Demo Login → ID: <span className="font-mono">admin01</span> |
                    Password: <span className="font-mono">admin123</span>
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

        <p className="text-center text-xs text-muted-foreground mt-8">
          University Library Management System · 2024–25
        </p>

      </div>
    </div>
  );
}
