import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { THEME_PRESETS } from "@/types/theme";
import { HeartParticles } from "@/components/effects/HeartParticles";
import { ConfettiEffect } from "@/components/effects/ConfettiEffect";
import { SparkleEffect } from "@/components/effects/SparkleEffect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartIcon, FloatingHearts } from "@/components/ui/HeartIcon";
import { Lock, Heart, ArrowLeft, Clock, Calendar, Sparkles, ArrowRight } from "lucide-react";
import type { LovePageContent, LovePageSection } from "@/types/lovepage";
import { HeroViewer } from "@/components/viewer/HeroViewer";
import { LoveLetterViewer } from "@/components/viewer/LoveLetterViewer";
import { TimelineViewer } from "@/components/viewer/TimelineViewer";
import { GalleryViewer } from "@/components/viewer/GalleryViewer";
import { CountdownViewer } from "@/components/viewer/CountdownViewer";
import { SurpriseViewer } from "@/components/viewer/SurpriseViewer";
import { AIStoryViewer } from "@/components/viewer/AIStoryViewer";
import { MagazineViewer } from "@/components/viewer/MagazineViewer";
import { BeMyValentineViewer } from "@/components/viewer/BeMyValentineViewer";
import { Link } from "react-router-dom";

// Using the secure public view that excludes password_hash
interface LovePageData {
  id: string;
  slug: string;
  title: string;
  content: LovePageContent;
  privacy_mode: string;
  is_password_protected: boolean; // Boolean flag instead of exposing hash
  unlock_at: string | null;
  expires_at: string | null;
  is_published: boolean;
  theme_id: string | null;
  view_count: number;
}

const incrementViewCount = async (pageId: string) => {
  try {
    await supabase.rpc("increment_view_count" as never, { page_id: pageId } as never);
  } catch {
    // Silently fail
  }
};

export default function LovePageViewer() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<LovePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [verifying, setVerifying] = useState(false);



  useEffect(() => {
    const fetchPage = async (pageSlug: string) => {
      setLoading(true);
      setError(null);

      try {
        // SECURITY: Using love_pages_public view which excludes password_hash
        // This prevents password hashes from being exposed to the client
        const { data, error: fetchError } = await supabase
          .from("love_pages_public")
          .select("*")
          .eq("slug", pageSlug)
          .single();

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            setError("Page not found");
          } else {
            setError("Failed to load page");
          }
          return;
        }

        if (!data) {
          setError("Page not found");
          return;
        }

        if (!data.is_published) {
          setError("This page is not yet published");
          return;
        }

        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setError("This page has expired");
          return;
        }

        if (data.privacy_mode === "time-locked" && data.unlock_at) {
          if (new Date(data.unlock_at) > new Date()) {
            setPage({
              ...data,
              content: data.content as unknown as LovePageContent,
            } as LovePageData);
            setLoading(false);
            return;
          }
        }

        // Use is_password_protected boolean from the secure view
        if (data.privacy_mode === "password" && data.is_password_protected) {
          setPage({
            ...data,
            content: data.content as unknown as LovePageContent,
          } as LovePageData);
          setIsUnlocked(false);
        } else {
          setPage({
            ...data,
            content: data.content as unknown as LovePageContent,
          } as LovePageData);
          setIsUnlocked(true);
          if (data.id) {
            incrementViewCount(data.id);
          }
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage(slug);
    }
  }, [slug]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page || verifying) return;

    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-page-password", {
        body: { pageId: page.id, password: passwordInput },
      });

      if (error || !data?.valid) {
        setPasswordError(true);
        return;
      }

      setIsUnlocked(true);
      setPasswordError(false);
      incrementViewCount(page.id);
    } catch {
      setPasswordError(true);
    } finally {
      setVerifying(false);
    }
  };

  const renderSection = (section: LovePageSection) => {
    if (!section.visible) return null;

    switch (section.type) {
      case "hero":
        return <HeroViewer key={section.id} section={section} />;
      case "love-letter":
        return <LoveLetterViewer key={section.id} section={section} />;
      case "timeline":
        return <TimelineViewer key={section.id} section={section} />;
      case "gallery":
        return <GalleryViewer key={section.id} section={section} />;
      case "countdown":
        return <CountdownViewer key={section.id} section={section} />;
      case "surprise":
        return <SurpriseViewer key={section.id} section={section} />;
      case "ai-story":
        return <AIStoryViewer key={section.id} section={section} />;
      case "magazine":
        return <MagazineViewer key={section.id} section={section} />;
      case "be-my-valentine":
        return <BeMyValentineViewer key={section.id} section={section} />;
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-romantic relative overflow-hidden">
        <FloatingHearts />
        <div className="text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <HeartIcon size="xl" className="text-primary animate-heart-beat" />
          </div>
          <p className="text-muted-foreground text-lg">Loading your love page...</p>
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-romantic relative overflow-hidden">
        <FloatingHearts className="opacity-30" />
        <Card className="max-w-md mx-4 border-0 shadow-romantic">
          <CardContent className="pt-8 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <HeartIcon size="xl" className="text-muted-foreground/30" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-3">{error}</h2>
            <p className="text-muted-foreground mb-8">
              The page you're looking for doesn't exist or is no longer available.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/")} className="btn-romantic text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Home
              </Button>
              <Button variant="outline" asChild>
                <Link to="/create">
                  Create Your Own
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!page) return null;

  // Time-locked page
  if (page.privacy_mode === "time-locked" && page.unlock_at && new Date(page.unlock_at) > new Date()) {
    const unlockDate = new Date(page.unlock_at);
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-romantic relative overflow-hidden">
        <HeartParticles count={20} />
        <FloatingHearts />
        <Card className="max-w-md mx-4 border-0 shadow-romantic relative z-10">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">
              Something Special Awaits
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              This love page will be unlocked on:
            </p>
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-lg font-semibold text-primary">
                <Calendar className="h-5 w-5" />
                {unlockDate.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <p className="text-muted-foreground mt-1">
                at {unlockDate.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Come back when it's time!</span>
              <Sparkles className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Password protected
  // Use is_password_protected boolean instead of checking password_hash
  if (page.privacy_mode === "password" && page.is_password_protected && !isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-romantic relative overflow-hidden">
        <HeartParticles count={15} />
        <FloatingHearts />
        <Card className="max-w-md mx-4 border-0 shadow-romantic relative z-10">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">
              This Page is Protected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-6">
              Enter the password to unlock this love page
            </p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                className={`h-12 text-center text-lg ${passwordError ? "border-destructive focus:border-destructive" : ""}`}
              />
              {passwordError && (
                <p className="text-sm text-destructive text-center">
                  Incorrect password. Please try again.
                </p>
              )}
              <Button
                type="submit"
                className="w-full h-12 btn-romantic text-white shadow-romantic group"
                disabled={verifying}
              >
                {verifying ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <>
                    <Heart className="mr-2 h-5 w-5" />
                    Unlock Page
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the actual love page with theme applied
  const content = page.content as LovePageContent;
  const sections = content?.sections || [];
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const pageThemeSlug = content?.themeSlug || "romantic-rose";

  return (
    <ThemedLovePage themeSlug={pageThemeSlug}>
      <div className="min-h-screen bg-background relative">
        <HeartParticles count={10} />

        <div className="relative z-10">
          {sortedSections.map((section) => renderSection(section))}
        </div>

        {/* Footer */}
        <footer className="py-12 text-center border-t border-border/50 bg-muted/30">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span>Made with</span>
            <HeartIcon size="sm" className="text-primary animate-heart-beat" />
            <span>on</span>
            <Link to="/" className="text-primary hover:underline font-medium">
              LUVNEST
            </Link>
          </div>
          <p className="text-sm text-muted-foreground/60 mt-2">
            Create your own love page for free
          </p>
        </footer>
      </div>
    </ThemedLovePage>
  );
}

// Component to apply theme to the love page
function ThemedLovePage({ themeSlug, children }: { themeSlug: string; children: React.ReactNode }) {
  useEffect(() => {
    const config = THEME_PRESETS[themeSlug];
    if (!config) return;

    const root = document.documentElement;
    const colors = config.colors.light;

    // Apply colors
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--foreground", colors.foreground);
    root.style.setProperty("--card", colors.card);
    root.style.setProperty("--card-foreground", colors.cardForeground);
    root.style.setProperty("--surface", colors.surface);
    root.style.setProperty("--surface-foreground", colors.surfaceForeground);
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-foreground", colors.primaryForeground);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--secondary-foreground", colors.secondaryForeground);
    root.style.setProperty("--muted", colors.muted);
    root.style.setProperty("--muted-foreground", colors.mutedForeground);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-foreground", colors.accentForeground);
    root.style.setProperty("--border", colors.border);
    root.style.setProperty("--input", colors.border);
    root.style.setProperty("--ring", colors.primary);

    // Apply effects
    root.style.setProperty("--gradient-romantic", config.effects.gradientPrimary);
    root.style.setProperty("--gradient-soft", config.effects.gradientSoft);
    root.style.setProperty("--gradient-hero", config.effects.gradientHero);
    root.style.setProperty("--shadow-romantic", config.effects.shadowRomantic);
    root.style.setProperty("--shadow-glow", config.effects.shadowGlow);
    root.style.setProperty("--radius", config.effects.borderRadius);

    // Fix: Ensure card background matches the theme's card color
    root.style.setProperty("--gradient-card", `linear-gradient(145deg, hsl(${colors.card}), hsl(${colors.card}))`);

    // Animation speed
    const speedMap: Record<string, string> = { slow: "1.5", normal: "1", fast: "0.7" };
    root.style.setProperty("--animation-speed", speedMap[config.animations.animationSpeed] || "1");
  }, [themeSlug]);

  return <>{children}</>;
}
