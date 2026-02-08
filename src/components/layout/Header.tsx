import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "@/components/ui/HeartIcon";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, LayoutDashboard, Settings, Shield, Wallet } from "lucide-react";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const { data } = await supabase.rpc("has_role", {
          _user_id: user!.id,
          _role: "admin",
        });
        setIsAdmin(!!data);
      } catch {
        setIsAdmin(false);
      }
    };

    if (user) {
      checkAdminRole();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (email?: string, name?: string) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <HeartIcon
              size="lg"
              className="text-primary transition-transform group-hover:scale-110"
            />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            LUVNEST
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            to="/themes"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Themes
          </Link>
          <Link
            to="/pricing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.full_name || user.email}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(user.email, user.user_metadata?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(user.email, user.user_metadata?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {user.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wallet" className="cursor-pointer">
                    <Wallet className="mr-2 h-4 w-4" />
                    Add Templates
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer text-primary">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/login?mode=signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
