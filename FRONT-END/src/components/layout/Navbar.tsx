import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, User, Settings, LogOut, Menu, X } from "lucide-react";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    role: 'user' | 'agent' | 'admin';
  };
}

export default function Navbar({ user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'badge-primary';
      case 'agent':
        return 'badge-success';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">QuickDesk</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/ask" 
                  className="btn-outline"
                >
                  Ask Question
                </Link>
                {user.role === 'agent' && (
                  <Link 
                    to="/agent" 
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Agent Panel
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 p-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-medium">{user.name}</span>
                        <Badge className={`text-xs ${getRoleBadgeVariant(user.role)}`}>
                          {user.role}
                        </Badge>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 pb-3 border-b border-border">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <Badge className={`text-xs ${getRoleBadgeVariant(user.role)}`}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/ask" 
                  className="block py-2 text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ask Question
                </Link>
                {user.role === 'agent' && (
                  <Link 
                    to="/agent" 
                    className="block py-2 text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Agent Panel
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="block py-2 text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="block py-2 text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-destructive hover:text-destructive"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  to="/login" 
                  className="block py-2 text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block py-2 text-primary hover:text-primary-hover font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}