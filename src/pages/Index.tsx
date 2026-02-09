import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeartIcon, FloatingHearts } from "@/components/ui/HeartIcon";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  Heart,
  Lock,
  Share2,
  Palette,
  Sparkles,
  MessageSquareHeart,
  Timer,
  FileText,
  ArrowRight,
  Star,
  Users,
  Zap,
  Check
} from "lucide-react";
import { SEO } from "@/components/SEO";

// ... (features and testimonials arrays remain unchanged)

const features = [
  {
    icon: Heart,
    title: "Love Page Builder",
    description: "Create beautiful pages with hero sections, love letters, photo galleries, and memories timeline.",
    gradient: "from-primary to-pink-400",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description: "Generate romantic stories, love letters, and get writing assistance powered by AI.",
    gradient: "from-purple-500 to-primary",
  },
  {
    icon: Palette,
    title: "Beautiful Themes",
    description: "Choose from romantic, minimal, cinematic, or playful themes to match your style.",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    icon: Lock,
    title: "Privacy Controls",
    description: "Password protection, time-locked reveals, and expiry dates for complete privacy.",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share via WhatsApp, Instagram, QR codes, or simply copy the unique link.",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    icon: Timer,
    title: "Countdown Timers",
    description: "Build anticipation with countdown timers to anniversaries or special dates.",
    gradient: "from-violet-400 to-purple-500",
  },
  {
    icon: FileText,
    title: "PDF Magazine",
    description: "Export your love page as a beautiful AI-designed PDF magazine keepsake.",
    gradient: "from-cyan-400 to-blue-500",
  },
];

const testimonials = [
  {
    quote: "Made my girlfriend cry happy tears. Worth every second!",
    author: "Rahul S.",
    role: "Created for Anniversary",
  },
  {
    quote: "The AI love story generator captured our journey perfectly.",
    author: "Priya M.",
    role: "Valentine's Surprise",
  },
  {
    quote: "So easy to use and the themes are absolutely gorgeous!",
    author: "Amit K.",
    role: "Proposal Page",
  },
];

// Stats removed per user request

export default function Index() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isProcessingHash, setIsProcessingHash] = useState(false);

  useEffect(() => {
    const handleAuthHash = async () => {
      // Direct window location check to bypass any router lag
      const hash = window.location.hash;
      console.log("Index: Checking hash:", hash);

      if (hash && hash.includes("access_token")) {
        console.log("Index: Auth token detected, attempting manual session set...");
        setIsProcessingHash(true);

        try {
          // Parse tokens manually
          const params = new URLSearchParams(hash.substring(1)); // remove #
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken) {
            console.log("Index: Found access token, setting session...");
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || "",
            });

            if (error) {
              console.error("Index: Error setting session:", error);
              // Fallback: let internal supabase logic try
            } else if (data.session) {
              console.log("Index: Session successfully set, redirecting...");
              // Force reload/redirect to dashboard
              // We use window.location to ensure a clean state
              window.location.href = "/dashboard";
              return;
            }
          }
        } catch (e) {
          console.error("Index: Manual hash parsing failed", e);
        }
      }
    };

    handleAuthHash();

    // Fallback timeout
    const timer = setTimeout(() => {
      if (isProcessingHash) {
        console.warn("Index: Auth processing timed out, resetting UI");
        setIsProcessingHash(false);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []); // Run once on mount

  // Combined loading state: either global auth loading OR we are processing a hash on this page
  if (loading || isProcessingHash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {isProcessingHash ? "Finalizing secure login..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <SEO />
      {/* Love signature watermark */}
      <div className="fixed bottom-4 right-4 z-50 text-xs text-muted-foreground/40 font-medium select-none pointer-events-none">
        made for &lt;3
      </div>

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-romantic py-24 md:py-36">
          <FloatingHearts />

          {/* Decorative gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.2),transparent_50%)]" />

          {/* Animated circles */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />

          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 animate-fade-in backdrop-blur-sm border border-primary/20">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">Create Magical Moments</span>
                <Badge variant="secondary" className="ml-2 text-xs">New AI Features</Badge>
              </div>

              <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-8 animate-fade-in-up leading-tight">
                Express Your Love with{" "}
                <span className="block md:inline relative">
                  <span
                    className="text-gradient-romantic"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                  >
                    Beautiful Digital Pages
                  </span>
                  <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-3 md:h-4" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
                    <path
                      d="M2 10C50 4 150 2 298 6"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="animate-fade-in"
                      style={{ animationDelay: "0.5s" }}
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Create private, romantic digital experiences for your special someone.
                Share your love story with personalized pages, AI-generated content, and stunning themes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <Button asChild size="lg" className="btn-romantic text-white px-8 h-14 text-lg group shadow-romantic">
                  <Link to="/login?mode=signup">
                    <Heart className="mr-2 h-5 w-5 group-hover:animate-heart-beat" />
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 text-lg border-2 hover:bg-secondary/50">
                  <Link to="/themes">
                    <Palette className="mr-2 h-5 w-5" />
                    Browse Themes
                  </Link>
                </Button>
              </div>

              {/* Stats section removed */}
            </div>
          </div>

          {/* Decorative gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y border-border/50 bg-muted/20">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="font-medium">Trusted by couples</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-border" />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 font-medium">4.9/5 rating</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-border" />
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span className="font-medium">Built with love in India</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 md:py-32 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--secondary)/0.3),transparent_70%)]" />

          <div className="container relative z-10">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-4">Features</Badge>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Everything You Need to{" "}
                <span className="text-gradient-romantic">Express Your Love</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From AI-powered content generation to beautiful themes, create the perfect digital love experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl p-6 bg-card border border-border/50 animate-fade-in-up hover:shadow-romantic hover:border-primary/20 transition-all duration-500"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />

                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link to="/features">
                  See All Features
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

          <div className="container relative z-10">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-4">How It Works</Badge>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Create Your Love Page in{" "}
                <span className="text-gradient-romantic">3 Simple Steps</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Choose a Theme",
                  description: "Pick from our romantic, minimal, cinematic, or playful themes to set the perfect mood.",
                  icon: Palette
                },
                {
                  step: "2",
                  title: "Add Your Content",
                  description: "Upload photos, write love letters, add music, and use AI assistance to create magic.",
                  icon: Sparkles
                },
                {
                  step: "3",
                  title: "Share Privately",
                  description: "Get a unique link to share with your special someone, with optional password protection.",
                  icon: Share2
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className="relative text-center animate-fade-in-up group"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Connection line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-primary/20" />
                  )}

                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-pink-400 text-white text-3xl font-display font-bold mb-6 shadow-romantic group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center shadow-md">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 md:py-32">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Testimonials</Badge>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Loved by{" "}
                <span className="text-gradient-romantic">Thousands of Couples</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="card-romantic rounded-2xl p-8 animate-fade-in-up relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Quote mark */}
                  <div className="absolute top-6 right-6 text-6xl text-primary/10 font-serif">"</div>

                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 relative z-10">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview - Synced with Pricing Page */}
        <section className="py-24 md:py-32 bg-muted/30">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">Pricing</Badge>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                  Plans to{" "}
                  <span className="text-gradient-romantic">Create</span>
                </h2>
                <p className="text-muted-foreground text-lg">
                  Choose the plan that matches how much love you want to express. All plans are valid for 1 year.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* First Crush */}
                <div className="card-romantic rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <h3 className="font-display text-xl font-bold mb-2">First Crush</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold">₹199</span>
                    </div>
                    <p className="text-primary font-semibold">5 Templates</p>
                    <p className="text-xs text-muted-foreground mt-1">Valid for 1 year</p>
                  </div>
                  <p className="text-muted-foreground text-sm text-center mb-6">
                    Perfect for your first love letter
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/pricing">Choose Plan</Link>
                  </Button>
                </div>

                {/* True Love */}
                <div className="relative rounded-2xl p-8 overflow-hidden border-2 border-primary shadow-romantic">
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                  <div className="text-center mb-6">
                    <h3 className="font-display text-xl font-bold mb-2">True Love</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold">₹499</span>
                    </div>
                    <p className="text-primary font-semibold">10 Templates</p>
                    <p className="text-xs text-muted-foreground mt-1">Valid for 1 year</p>
                  </div>
                  <p className="text-muted-foreground text-sm text-center mb-6">
                    For those who want to express more
                  </p>
                  <Button asChild className="w-full btn-romantic text-white">
                    <Link to="/pricing">
                      Choose Plan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Forever Valentine */}
                <div className="card-romantic rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <h3 className="font-display text-xl font-bold mb-2">Forever Valentine</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold">₹999</span>
                    </div>
                    <p className="text-primary font-semibold">Unlimited Templates</p>
                    <p className="text-xs text-muted-foreground mt-1">Valid for 1 year</p>
                  </div>
                  <p className="text-muted-foreground text-sm text-center mb-6">
                    Unlimited love, unlimited pages
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/pricing">Choose Plan</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <FloatingHearts className="opacity-30" />

          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1),transparent_60%)]" />

          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-8 animate-float">
                <MessageSquareHeart className="h-10 w-10" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Ready to Create Something{" "}
                <span className="text-gradient-romantic">Beautiful?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10">
                Join thousands of couples sharing their love stories through stunning digital pages.
                Start for free — no credit card required.
              </p>
              <Button asChild size="lg" className="btn-romantic text-white px-10 h-14 text-lg group shadow-romantic">
                <Link to="/login">
                  <Heart className="mr-2 h-5 w-5 group-hover:animate-heart-beat" />
                  Start Your Love Page
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
