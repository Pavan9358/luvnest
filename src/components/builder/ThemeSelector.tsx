import { useState, useEffect } from "react";
import { Check, Moon, Sun, Crown, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { THEME_PRESETS, THEME_NAMES } from "@/types/theme";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ThemePreviewProps {
  slug: string;
  name: string;
  description: string;
  isPremium: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

function ThemePreview({ slug, name, description, isPremium, isSelected, onSelect }: ThemePreviewProps) {
  const config = THEME_PRESETS[slug];
  if (!config) return null;

  const colors = config.colors.light;

  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-all duration-300 overflow-hidden group",
        isSelected 
          ? "ring-2 ring-primary shadow-lg" 
          : "hover:shadow-md hover:scale-[1.02]"
      )}
      onClick={onSelect}
    >
      {/* Theme Preview Colors */}
      <div className="h-24 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: config.effects.gradientHero }}
        />
        <div className="absolute bottom-2 left-2 right-2 flex gap-1">
          {/* Color swatches */}
          <div
            className="w-6 h-6 rounded-full border-2 border-white/50 shadow-sm"
            style={{ backgroundColor: `hsl(${colors.primary})` }}
          />
          <div
            className="w-6 h-6 rounded-full border-2 border-white/50 shadow-sm"
            style={{ backgroundColor: `hsl(${colors.secondary})` }}
          />
          <div
            className="w-6 h-6 rounded-full border-2 border-white/50 shadow-sm"
            style={{ backgroundColor: `hsl(${colors.accent})` }}
          />
        </div>
        
        {/* Premium badge */}
        {isPremium && (
          <Badge 
            className="absolute top-2 right-2 gap-1" 
            variant="secondary"
          >
            <Crown className="w-3 h-3" />
            Premium
          </Badge>
        )}
        
        {/* Selected check */}
        {isSelected && (
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <h4 className="font-semibold text-sm">{name}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>
    </Card>
  );
}

interface ThemeSelectorProps {
  onThemeChange?: (themeSlug: string) => void;
}

export function ThemeSelector({ onThemeChange }: ThemeSelectorProps = {}) {
  const { themeSlug, setTheme, isDark, toggleDarkMode, currentTheme } = useTheme();
  const [themes, setThemes] = useState<Array<{ slug: string; name: string; description: string; isPremium: boolean }>>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Load themes from database or use defaults
    async function loadThemes() {
      const { data } = await supabase
        .from("themes")
        .select("*")
        .eq("is_active", true)
        .order("is_premium", { ascending: true });

      if (data && data.length > 0) {
        setThemes(
          data.map((t) => ({
            slug: t.slug,
            name: t.name,
            description: t.description || "",
            isPremium: t.is_premium || false,
          }))
        );
      } else {
        // Fallback to preset themes
        setThemes(
          Object.entries(THEME_NAMES).map(([slug, info]) => ({
            slug,
            name: info.name,
            description: info.description,
            isPremium: slug === "cinematic-night" || slug === "cute-playful",
          }))
        );
      }
    }

    loadThemes();
  }, []);

  const handleThemeSelect = (slug: string) => {
    setTheme(slug);
    onThemeChange?.(slug);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          Theme
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[340px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Choose Theme
          </SheetTitle>
          <SheetDescription>
            Select a theme to customize the look of your love page
          </SheetDescription>
        </SheetHeader>

        {/* Dark mode toggle */}
        <div className="flex items-center justify-between py-4 border-b">
          <div className="flex items-center gap-2">
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>
          <Switch
            id="dark-mode"
            checked={isDark}
            onCheckedChange={toggleDarkMode}
          />
        </div>

        {/* Animation settings */}
        <div className="py-4 border-b space-y-3">
          <h4 className="text-sm font-medium">Animation Settings</h4>
          <div className="flex items-center justify-between">
            <Label htmlFor="heart-particles" className="text-sm text-muted-foreground">
              Heart particles
            </Label>
            <Switch
              id="heart-particles"
              checked={currentTheme.animations.enableHeartParticles}
              disabled
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="floating-elements" className="text-sm text-muted-foreground">
              Floating elements
            </Label>
            <Switch
              id="floating-elements"
              checked={currentTheme.animations.enableFloatingElements}
              disabled
            />
          </div>
        </div>

        {/* Theme grid */}
        <div className="py-4">
          <h4 className="text-sm font-medium mb-3">Available Themes</h4>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <ThemePreview
                key={theme.slug}
                slug={theme.slug}
                name={theme.name}
                description={theme.description}
                isPremium={theme.isPremium}
                isSelected={themeSlug === theme.slug}
                onSelect={() => handleThemeSelect(theme.slug)}
              />
            ))}
          </div>
        </div>

        {/* Apply button */}
        <div className="pt-4 border-t">
          <Button className="w-full" onClick={() => setOpen(false)}>
            Apply Theme
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
