// Types for Love Page Builder sections

export type SectionType = 
  | "hero"
  | "love-letter"
  | "timeline"
  | "gallery"
  | "countdown"
  | "surprise"
  | "ai-story"
  | "magazine"
  | "be-my-valentine";

export interface BaseSection {
  id: string;
  type: SectionType;
  visible: boolean;
  order: number;
}

export interface HeroSection extends BaseSection {
  type: "hero";
  data: {
    partnerName1: string;
    partnerName2: string;
    headline: string;
    coverImageUrl?: string;
  };
}

export interface LoveLetterSection extends BaseSection {
  type: "love-letter";
  data: {
    title: string;
    content: string;
    backgroundAudioUrl?: string;
  };
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface TimelineSection extends BaseSection {
  type: "timeline";
  data: {
    title: string;
    events: TimelineEvent[];
    backgroundAudioUrl?: string;
  };
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

export interface GallerySection extends BaseSection {
  type: "gallery";
  data: {
    title: string;
    images: GalleryImage[];
    layout: "grid" | "masonry" | "carousel";
    backgroundAudioUrl?: string;
  };
}

// Music section removed - audio integrated into individual sections

export interface CountdownSection extends BaseSection {
  type: "countdown";
  data: {
    title: string;
    targetDate: string;
    message: string;
  };
}

export interface SurpriseSection extends BaseSection {
  type: "surprise";
  data: {
    title: string;
    hiddenMessage: string;
    revealAnimation: "hearts" | "confetti" | "sparkle";
  };
}

export interface AIStorySection extends BaseSection {
  type: "ai-story";
  data: {
    title: string;
    storyStyle: "fairy-tale" | "adventure" | "classic-romance";
    generatedContent?: string;
    promptDetails?: string;
  };
}

// Magazine page type
export interface MagazinePage {
  id: string;
  imageUrl?: string;
  title: string;
  content: string;
}

export interface MagazineSection extends BaseSection {
  type: "magazine";
  data: {
    title: string;
    coverTitle: string;
    pages: MagazinePage[];
  };
}

export interface BeMyValentineSection extends BaseSection {
  type: "be-my-valentine";
  data: {
    question: string;
    acceptanceQuote: string;
    yesButtonText: string;
    noButtonText: string;
  };
}

export type LovePageSection = 
  | HeroSection
  | LoveLetterSection
  | TimelineSection
  | GallerySection
  | CountdownSection
  | SurpriseSection
  | AIStorySection
  | MagazineSection
  | BeMyValentineSection;

export interface LovePageContent {
  sections: LovePageSection[];
  themeSlug?: string;
}

export interface LovePage {
  id: string;
  slug: string;
  title: string;
  content: LovePageContent;
  themeId?: string;
  isPublished: boolean;
  privacyMode: "public" | "password" | "time-locked" | "expiry";
  passwordHash?: string;
  unlockAt?: string;
  expiresAt?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export const SECTION_LABELS: Record<SectionType, string> = {
  "hero": "Hero Section",
  "love-letter": "Love Letter",
  "timeline": "Memories Timeline",
  "gallery": "Photo Gallery",
  "countdown": "Countdown Timer",
  "surprise": "Surprise Reveal",
  "ai-story": "AI Love Story",
  "magazine": "Love Magazine",
  "be-my-valentine": "Be My Valentine",
};

export const SECTION_ICONS: Record<SectionType, string> = {
  "hero": "Heart",
  "love-letter": "Mail",
  "timeline": "Clock",
  "gallery": "Image",
  "countdown": "Timer",
  "surprise": "Gift",
  "ai-story": "Sparkles",
  "magazine": "BookHeart",
  "be-my-valentine": "HeartHandshake",
};
