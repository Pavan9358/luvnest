import { AuthForm } from "@/components/auth/AuthForm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingHearts } from "@/components/ui/HeartIcon";
import { Heart, Sparkles, Lock, Share2 } from "lucide-react";

export default function Login({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 relative overflow-hidden bg-hero-romantic">
        <FloatingHearts />

        {/* Decorative gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.2),transparent_50%)]" />

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 w-full max-w-md">
          {/* Feature badges */}
          <div className="flex justify-center gap-3 mb-6">
            {[
              { icon: Heart, label: "Love Pages" },
              { icon: Sparkles, label: "AI Magic" },
              { icon: Lock, label: "Private" },
              { icon: Share2, label: "Share" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 text-xs font-medium text-muted-foreground"
              >
                <feature.icon className="h-3 w-3 text-primary" />
                {feature.label}
              </div>
            ))}
          </div>

          <div className="card-romantic rounded-2xl p-8 shadow-romantic backdrop-blur-sm bg-card/95">
            <AuthForm isAdmin={isAdmin} />
          </div>

          {/* Trust indicator */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Trusted by <span className="font-semibold text-foreground">10,000+</span> couples worldwide 💕
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
