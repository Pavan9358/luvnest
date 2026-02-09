import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingHearts } from "@/components/ui/HeartIcon";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Palette,
  Heart,
  Sparkles,
  Moon,
  Sun,
  ArrowRight,
  Crown
} from "lucide-react";
import { SEO } from "@/components/SEO";

interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  preview_image_url: string | null;
  is_premium: boolean | null;
  config: unknown;
}

const defaultThemes = [
  {
    id: "1",
    name: "Romantic Rose",
    slug: "romantic-rose",
    description: "Soft pinks and elegant script fonts for a classic romantic feel",
    preview_image_url: null,
    is_premium: false,
    icon: Heart,
    colors: ["#e91e63", "#f8bbd9", "#fff0f5"],
  },
  {
    id: "2",
    name: "Minimal Love",
    slug: "minimal-love",
    description: "Clean whites and modern typography for a sophisticated look",
    preview_image_url: null,
    is_premium: false,
    icon: Sun,
    colors: ["#333333", "#f5f5f5", "#ffffff"],
  },
  {
    id: "3",
    name: "Cinematic Night",
    slug: "cinematic-night",
    description: "Dark mode elegance with dramatic contrasts and depth",
    preview_image_url: null,
    is_premium: true,
    icon: Moon,
    colors: ["#1a1a2e", "#e94560", "#0f0f1a"],
  },
  {
    id: "4",
    name: "Cute & Playful",
    slug: "cute-playful",
    description: "Bright colors and fun animations for a joyful experience",
    preview_image_url: null,
    is_premium: true,
    icon: Sparkles,
    colors: ["#ff6b9d", "#ffd93d", "#6bcb77"],
  },
];

export default function Themes() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from("themes")
        .select("*")
        .eq("is_active", true)
        .order("is_premium", { ascending: true });

      if (error) throw error;
      setThemes(data || []);
    } catch (error) {
      console.error("Error fetching themes:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayThemes = themes.length > 0 ? themes : defaultThemes;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Themes - LUVNEST"
        description="Choose from our collection of romantic themes. Romantic Rose, Minimal Love, Cinematic Night, and more."
        url="https://luvnest.app/themes"
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-romantic py-20 md:py-28">
          <FloatingHearts />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_60%)]" />

          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in backdrop-blur-sm border border-primary/20">
                <Palette className="h-4 w-4" />
                <span className="text-sm font-medium">Beautiful Themes</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 animate-fade-in-up">
                Find Your Perfect{" "}
                <span className="text-gradient-romantic">Style</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Choose from our collection of beautifully crafted themes, each designed
                to create the perfect mood for your love page.
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Themes Grid */}
        <section className="py-20 md:py-28">
          <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1920px] mx-auto">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {displayThemes.map((theme, index) => {
                  const Icon = (defaultThemes.find(t => t.slug === theme.slug)?.icon) || Heart;
                  const colors = defaultThemes.find(t => t.slug === theme.slug)?.colors || ["#e91e63", "#f8bbd9", "#fff0f5"];

                  return (
                    <div
                      key={theme.id}
                      className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card animate-fade-in-up hover:shadow-romantic transition-all duration-500"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Theme Preview */}
                      <div className="relative h-48 overflow-hidden">
                        {theme.preview_image_url ? (
                          <img
                            src={theme.preview_image_url}
                            alt={theme.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`
                            }}
                          >
                            <Icon className="h-16 w-16 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        )}

                        {/* Premium Badge */}
                        {theme.is_premium && (
                          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0 shadow-lg">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}

                        {/* Color swatches */}
                        <div className="absolute bottom-4 left-4 flex gap-2">
                          {colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Theme Info */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-display text-xl font-bold">{theme.name}</h3>
                          {!theme.is_premium && (
                            <Badge variant="secondary">Free</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">
                          {theme.description}
                        </p>
                        <Button asChild className="w-full group/btn">
                          <Link to="/login">
                            Use This Theme
                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Custom Theme CTA */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Want a{" "}
                <span className="text-gradient-romantic">Custom Theme?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Premium users can customize colors, fonts, and styles to create a truly unique experience.
              </p>
              <Button asChild size="lg" className="btn-romantic text-white px-8">
                <Link to="/login">
                  Unlock Customization
                  <ArrowRight className="ml-2 h-5 w-5" />
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
