import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { BookOpen, GraduationCap, Users, Shield } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    if (!selectedRole) return;

    if (!userId || !password) {
      setError('Please enter User ID and Password');
      return;
    }

    const success = login(selectedRole, userId.toLowerCase().trim(), password);

    if (success) {
      navigate(`/${selectedRole}/dashboard`);
    } else {
      setError('Invalid User ID or Password');
    }
  };

  const roles: {
    role: UserRole;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      role: 'student',
      label: 'Student Login',
      icon: <GraduationCap className="h-8 w-8" />,
      description: 'Access your library account, search & request books',
    },
    {
      role: 'librarian',
      label: 'Librarian Login',
      icon: <Users className="h-8 w-8" />,
      description: 'Manage book circulation, approve requests',
    },
    {
      role: 'admin',
      label: 'Admin Login',
      icon: <Shield className="h-8 w-8" />,
      description: 'Full system control, manage users & catalog',
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

          <h1 className="text-3xl font-display font-semibold text-foreground">
            University Library
          </h1>

          <p className="text-muted-foreground mt-2 font-body">
            Library Management System
          </p>
        </div>

        {/* ROLE SELECTION */}
        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {roles.map(({ role, label, icon, description }) => (
              <Card
                key={role}
                className="cursor-pointer border-2 border-border hover:border-primary transition-colors duration-150"
                onClick={() => setSelectedRole(role)}
              >
                <CardHeader className="text-center pb-2">

                  <div className="mx-auto mb-3 h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {icon}
                  </div>

                  <CardTitle className="text-lg font-display">
                    {label}
                  </CardTitle>

                </CardHeader>

                <CardContent>
                  <CardDescription className="text-center text-sm">
                    {description}
                  </CardDescription>
                </CardContent>

              </Card>
            ))}
          </div>

        ) : (

          /* LOGIN CARD */

          <Card className="max-w-md mx-auto border-2">

            <CardHeader>

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {roles.find(r => r.role === selectedRole)?.icon}
                </div>

                <div>
                  <CardTitle className="font-display">
                    {roles.find(r => r.role === selectedRole)?.label}
                  </CardTitle>

                  <CardDescription>
                    Enter your credentials to continue
                  </CardDescription>
                </div>

              </div>

            </CardHeader>

            <CardContent className="space-y-4">

              {/* USER ID */}

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  User ID
                </label>

                <Input
                  placeholder="Enter User ID"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="font-mono"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Password
                </label>

                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              {/* BUTTONS */}

              <div className="flex gap-3">

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRole(null);
                    setUserId('');
                    setPassword('');
                    setError('');
                  }}
                  className="flex-1"
                >
                  Back
                </Button>

                <Button
                  onClick={handleLogin}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Sign In
                </Button>

              </div>

            </CardContent>

          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">
          University Library Management System · Academic Year 2024–25
        </p>

      </div>
    </div>
  );
}
