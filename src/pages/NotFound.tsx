import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, FloatingHearts } from "@/components/ui/HeartIcon";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-romantic relative overflow-hidden">
      <FloatingHearts />
      
      {/* Decorative gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1),transparent_60%)]" />
      
      <div className="relative z-10 text-center px-4 max-w-lg">
        {/* Animated heart */}
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse-soft">
            <HeartIcon size="xl" className="text-primary/50" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-display font-bold text-foreground">404</span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Page Not Found
        </h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          Oops! The page you're looking for seems to have wandered off. 
          Let's get you back to creating beautiful love pages.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="btn-romantic text-white shadow-romantic">
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-2">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Dashboard
            </Link>
          </Button>
        </div>
        
        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/features" className="text-primary hover:underline">Features</Link>
            <Link to="/themes" className="text-primary hover:underline">Themes</Link>
            <Link to="/pricing" className="text-primary hover:underline">Pricing</Link>
            <Link to="/login" className="text-primary hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
