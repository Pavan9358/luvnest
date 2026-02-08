// Theme configuration types for the LUVNEST platform

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  surface: string;
  surfaceForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
}

export interface ThemeTypography {
  displayFont: string;
  bodyFont: string;
}

export interface ThemeEffects {
  gradientPrimary: string;
  gradientSoft: string;
  gradientHero: string;
  shadowRomantic: string;
  shadowGlow: string;
  borderRadius: string;
}

export interface ThemeAnimations {
  enableHeartParticles: boolean;
  enableFloatingElements: boolean;
  enableRevealAnimations: boolean;
  enablePageTransitions: boolean;
  animationSpeed: "slow" | "normal" | "fast";
}

export interface ThemeConfig {
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  typography: ThemeTypography;
  effects: ThemeEffects;
  animations: ThemeAnimations;
}

export interface Theme {
  id: string;
  slug: string;
  name: string;
  description: string;
  previewImageUrl?: string;
  isPremium: boolean;
  isActive: boolean;
  config: ThemeConfig;
}

// Default theme configurations
export const THEME_PRESETS: Record<string, ThemeConfig> = {
  "romantic-rose": {
    colors: {
      light: {
        background: "340 100% 99%",
        foreground: "340 30% 15%",
        card: "0 0% 100%",
        cardForeground: "340 30% 15%",
        surface: "0 0% 100%",
        surfaceForeground: "340 30% 15%",
        primary: "346 77% 49%",
        primaryForeground: "0 0% 100%",
        secondary: "340 82% 94%",
        secondaryForeground: "340 30% 25%",
        muted: "340 40% 96%",
        mutedForeground: "340 20% 45%",
        accent: "15 70% 85%",
        accentForeground: "340 30% 20%",
        border: "340 40% 90%",
      },
      dark: {
        background: "340 30% 8%",
        foreground: "340 20% 95%",
        card: "340 25% 12%",
        cardForeground: "340 20% 95%",
        surface: "340 25% 15%",
        surfaceForeground: "340 20% 92%",
        primary: "346 77% 60%",
        primaryForeground: "340 30% 8%",
        secondary: "340 30% 20%",
        secondaryForeground: "340 20% 90%",
        muted: "340 25% 18%",
        mutedForeground: "340 20% 65%",
        accent: "15 50% 25%",
        accentForeground: "15 70% 90%",
        border: "340 25% 20%",
      },
    },
    typography: {
      displayFont: "Playfair Display",
      bodyFont: "Quicksand",
    },
    effects: {
      gradientPrimary: "linear-gradient(135deg, hsl(346 77% 49%) 0%, hsl(340 82% 65%) 50%, hsl(15 70% 75%) 100%)",
      gradientSoft: "linear-gradient(180deg, hsl(340 100% 99%) 0%, hsl(340 82% 96%) 100%)",
      gradientHero: "linear-gradient(135deg, hsl(340 82% 96%) 0%, hsl(340 100% 99%) 50%, hsl(15 70% 95%) 100%)",
      shadowRomantic: "0 10px 40px -10px hsl(346 77% 49% / 0.2)",
      shadowGlow: "0 0 30px hsl(346 77% 49% / 0.3)",
      borderRadius: "0.75rem",
    },
    animations: {
      enableHeartParticles: true,
      enableFloatingElements: true,
      enableRevealAnimations: true,
      enablePageTransitions: true,
      animationSpeed: "normal",
    },
  },
  "minimal-love": {
    colors: {
      light: {
        background: "0 0% 100%",
        foreground: "0 0% 10%",
        card: "0 0% 100%",
        cardForeground: "0 0% 10%",
        surface: "0 0% 100%",
        surfaceForeground: "0 0% 10%",
        primary: "0 0% 15%",
        primaryForeground: "0 0% 100%",
        secondary: "0 0% 96%",
        secondaryForeground: "0 0% 20%",
        muted: "0 0% 96%",
        mutedForeground: "0 0% 45%",
        accent: "346 77% 95%",
        accentForeground: "346 77% 35%",
        border: "0 0% 90%",
      },
      dark: {
        background: "0 0% 5%",
        foreground: "0 0% 95%",
        card: "0 0% 8%",
        cardForeground: "0 0% 95%",
        surface: "0 0% 12%",
        surfaceForeground: "0 0% 90%",
        primary: "0 0% 90%",
        primaryForeground: "0 0% 5%",
        secondary: "0 0% 15%",
        secondaryForeground: "0 0% 85%",
        muted: "0 0% 12%",
        mutedForeground: "0 0% 60%",
        accent: "346 50% 20%",
        accentForeground: "346 70% 85%",
        border: "0 0% 18%",
      },
    },
    typography: {
      displayFont: "Inter",
      bodyFont: "Inter",
    },
    effects: {
      gradientPrimary: "linear-gradient(135deg, hsl(0 0% 15%) 0%, hsl(0 0% 25%) 100%)",
      gradientSoft: "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 98%) 100%)",
      gradientHero: "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 96%) 100%)",
      shadowRomantic: "0 4px 20px -4px hsl(0 0% 0% / 0.1)",
      shadowGlow: "0 0 20px hsl(0 0% 0% / 0.1)",
      borderRadius: "0.5rem",
    },
    animations: {
      enableHeartParticles: false,
      enableFloatingElements: false,
      enableRevealAnimations: true,
      enablePageTransitions: true,
      animationSpeed: "fast",
    },
  },
   "cinematic-night": {
     colors: {
       light: {
         background: "240 15% 12%",
         foreground: "45 30% 92%",
         card: "240 12% 18%",
         cardForeground: "45 30% 90%",
         surface: "240 10% 22%",
         surfaceForeground: "40 25% 85%",
         primary: "280 70% 65%",
         primaryForeground: "240 15% 10%",
         secondary: "240 12% 25%",
         secondaryForeground: "45 20% 88%",
         muted: "240 12% 20%",
         mutedForeground: "40 15% 65%",
         accent: "320 70% 55%",
         accentForeground: "240 15% 10%",
         border: "240 12% 28%",
       },
      dark: {
        background: "240 10% 4%",
        foreground: "45 30% 92%",
        card: "240 10% 10%",
        cardForeground: "45 30% 90%",
        surface: "240 8% 14%",
        surfaceForeground: "40 25% 82%",
        primary: "280 70% 65%",
        primaryForeground: "240 10% 4%",
        secondary: "240 10% 18%",
        secondaryForeground: "45 20% 85%",
        muted: "240 10% 12%",
        mutedForeground: "40 15% 60%",
        accent: "320 70% 55%",
        accentForeground: "240 10% 4%",
        border: "240 10% 18%",
      },
    },
    typography: {
      displayFont: "Cormorant Garamond",
      bodyFont: "Lato",
    },
    effects: {
      gradientPrimary: "linear-gradient(135deg, hsl(280 70% 60%) 0%, hsl(320 70% 50%) 100%)",
      gradientSoft: "linear-gradient(180deg, hsl(240 10% 8%) 0%, hsl(240 10% 6%) 100%)",
      gradientHero: "linear-gradient(135deg, hsl(240 10% 8%) 0%, hsl(280 30% 12%) 50%, hsl(320 20% 10%) 100%)",
      shadowRomantic: "0 10px 40px -10px hsl(280 70% 50% / 0.3)",
      shadowGlow: "0 0 40px hsl(280 70% 50% / 0.4)",
      borderRadius: "0.25rem",
    },
    animations: {
      enableHeartParticles: true,
      enableFloatingElements: true,
      enableRevealAnimations: true,
      enablePageTransitions: true,
      animationSpeed: "slow",
    },
  },
  "cute-playful": {
    colors: {
      light: {
        background: "350 80% 97%",
        foreground: "330 45% 22%",
        card: "0 0% 100%",
        cardForeground: "330 45% 22%",
        surface: "350 50% 98%",
        surfaceForeground: "330 40% 25%",
        primary: "340 85% 62%",
        primaryForeground: "0 0% 100%",
        secondary: "280 50% 92%",
        secondaryForeground: "280 40% 30%",
        muted: "350 50% 95%",
        mutedForeground: "330 25% 45%",
        accent: "50 95% 70%",
        accentForeground: "50 80% 20%",
        border: "340 35% 88%",
      },
      dark: {
        background: "340 25% 10%",
        foreground: "350 70% 95%",
        card: "340 22% 14%",
        cardForeground: "350 70% 95%",
        surface: "340 20% 18%",
        surfaceForeground: "350 60% 92%",
        primary: "340 85% 65%",
        primaryForeground: "340 25% 10%",
        secondary: "280 35% 25%",
        secondaryForeground: "280 50% 90%",
        muted: "340 22% 18%",
        mutedForeground: "340 20% 60%",
        accent: "50 70% 50%",
        accentForeground: "50 80% 10%",
        border: "340 22% 25%",
      },
    },
    typography: {
      displayFont: "Pacifico",
      bodyFont: "Nunito",
    },
    effects: {
      gradientPrimary: "linear-gradient(135deg, hsl(340 85% 62%) 0%, hsl(280 50% 70%) 50%, hsl(50 95% 70%) 100%)",
      gradientSoft: "linear-gradient(180deg, hsl(350 80% 97%) 0%, hsl(280 50% 95%) 100%)",
      gradientHero: "linear-gradient(135deg, hsl(350 70% 95%) 0%, hsl(280 45% 95%) 50%, hsl(50 80% 94%) 100%)",
      shadowRomantic: "0 10px 40px -10px hsl(340 85% 50% / 0.25)",
      shadowGlow: "0 0 30px hsl(340 85% 60% / 0.35)",
      borderRadius: "1.25rem",
    },
    animations: {
      enableHeartParticles: true,
      enableFloatingElements: true,
      enableRevealAnimations: true,
      enablePageTransitions: true,
      animationSpeed: "fast",
    },
  },
};

export const THEME_NAMES: Record<string, { name: string; description: string }> = {
  "romantic-rose": {
    name: "Romantic Rose",
    description: "Soft pinks and elegant script fonts for a classic romantic feel",
  },
  "minimal-love": {
    name: "Minimal Love",
    description: "Clean whites and modern typography for understated elegance",
  },
  "cinematic-night": {
    name: "Cinematic Night",
    description: "Dark mode with dramatic contrasts and purple accents",
  },
  "cute-playful": {
    name: "Cute & Playful",
    description: "Bright colors and fun animations for a joyful vibe",
  },
};
