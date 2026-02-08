import { useState, useCallback, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { 
  LovePageSection, 
  LovePageContent, 
  SectionType,
  HeroSection,
  LoveLetterSection,
  TimelineSection,
  GallerySection,
  CountdownSection,
  SurpriseSection,
  AIStorySection,
  MagazineSection,
  BeMyValentineSection
} from "@/types/lovepage";
import type { Json } from "@/integrations/supabase/types";

const createDefaultSection = (type: SectionType, order: number): LovePageSection => {
  const baseSection = {
    id: nanoid(),
    type,
    visible: true,
    order,
  };

  switch (type) {
    case "hero":
      return {
        ...baseSection,
        type: "hero",
        data: {
          partnerName1: "",
          partnerName2: "",
          headline: "Our Love Story",
          coverImageUrl: undefined,
        },
      } as HeroSection;
    
    case "love-letter":
      return {
        ...baseSection,
        type: "love-letter",
        data: {
          title: "A Letter From My Heart",
          content: "",
          backgroundAudioUrl: undefined,
        },
      } as LoveLetterSection;
    
    case "timeline":
      return {
        ...baseSection,
        type: "timeline",
        data: {
          title: "Our Journey Together",
          events: [],
          backgroundAudioUrl: undefined,
        },
      } as TimelineSection;
    case "gallery":
      return {
        ...baseSection,
        type: "gallery",
        data: {
          title: "Precious Moments",
          images: [],
          layout: "grid",
          backgroundAudioUrl: undefined,
        },
      } as GallerySection;
    
    case "countdown":
      return {
        ...baseSection,
        type: "countdown",
        data: {
          title: "Counting Down To...",
          targetDate: "",
          message: "Something special awaits!",
        },
      } as CountdownSection;
    case "surprise":
      return {
        ...baseSection,
        type: "surprise",
        data: {
          title: "A Little Surprise",
          hiddenMessage: "",
          revealAnimation: "hearts",
        },
      } as SurpriseSection;
    
    case "ai-story":
      return {
        ...baseSection,
        type: "ai-story",
        data: {
          title: "Our Fairy Tale",
          storyStyle: "fairy-tale",
          generatedContent: undefined,
          promptDetails: undefined,
        },
      } as AIStorySection;
    
    case "magazine":
      return {
        ...baseSection,
        type: "magazine",
        data: {
          title: "Our Love Magazine",
          coverTitle: "A Journey of Love",
          pages: [],
        },
      } as MagazineSection;
    
    case "be-my-valentine":
      return {
        ...baseSection,
        type: "be-my-valentine",
        data: {
          question: "Will you be my Valentine?",
          acceptanceQuote: "Yes! A thousand times yes! You've made my heart complete. Every moment with you is a treasure I'll cherish forever. 💕",
          yesButtonText: "Yes 💖",
          noButtonText: "No 😶",
        },
      } as BeMyValentineSection;
    
    default:
      throw new Error(`Unknown section type: ${type}`);
  }
};

interface UseLovePageBuilderProps {
  pageId?: string;
}

export function useLovePageBuilder({ pageId }: UseLovePageBuilderProps = {}) {
  const { user } = useAuth();
  const [pageTitle, setPageTitle] = useState("My Love Page");
  const [pageSlug, setPageSlug] = useState("");
  const [sections, setSections] = useState<LovePageSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<string | null>(pageId || null);
  const [isPublished, setIsPublished] = useState(false);
  const [privacyMode, setPrivacyMode] = useState("public");
  const [unlockAt, setUnlockAt] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [themeSlug, setThemeSlug] = useState<string>("romantic-rose");
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load existing page data
  useEffect(() => {
    if (pageId && user) {
      loadPage(pageId);
    }
  }, [pageId, user]);

  // Auto-save with debounce
  useEffect(() => {
    if (currentPageId && sections.length > 0) {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
      autoSaveTimeout.current = setTimeout(() => {
        savePage();
      }, 2000);
    }

    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [sections, pageTitle]);

  const loadPage = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("love_pages")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setPageTitle(data.title);
        setPageSlug(data.slug);
        const content = data.content as unknown as LovePageContent;
        setSections(content?.sections || []);
        setCurrentPageId(data.id);
        setIsPublished(data.is_published || false);
        setPrivacyMode(data.privacy_mode || "public");
        setUnlockAt(data.unlock_at);
        setExpiresAt(data.expires_at);
        // Load theme from content if stored there
        if (content?.themeSlug) {
          setThemeSlug(content.themeSlug);
        }
      }
    } catch (error) {
      console.error("Error loading page:", error);
      toast.error("Failed to load page");
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (): Promise<{ id: string; slug: string } | null> => {
    if (!user) return null;

    try {
      const slug = nanoid(10);
      const contentJson: Json = { 
        sections: sections as unknown as Json[],
        themeSlug 
      };
      // Auto-publish on creation
      const { data, error } = await supabase
        .from("love_pages")
        .insert({
          user_id: user.id,
          title: pageTitle,
          slug,
          content: contentJson,
          is_published: true, // Auto-publish
          privacy_mode: "public",
        })
        .select()
        .single();

      if (error) throw error;
      
      setCurrentPageId(data.id);
      setPageSlug(data.slug);
      setIsPublished(true);
      return { id: data.id, slug: data.slug };
    } catch (error) {
      console.error("Error creating page:", error);
      toast.error("Failed to create page");
      return null;
    }
  };

  const savePage = async () => {
    if (!currentPageId || !user) return;

    setSaving(true);
    try {
      const contentJson: Json = { 
        sections: sections as unknown as Json[],
        themeSlug 
      };
      
      const { error } = await supabase
        .from("love_pages")
        .update({
          title: pageTitle,
          content: contentJson,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentPageId)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving page:", error);
    } finally {
      setSaving(false);
    }
  };

  const addSection = useCallback((type: SectionType) => {
    const newSection = createDefaultSection(type, sections.length);
    setSections((prev) => [...prev, newSection]);
  }, [sections.length]);

  const removeSection = useCallback((sectionId: string) => {
    setSections((prev) => 
      prev
        .filter((s) => s.id !== sectionId)
        .map((s, index) => ({ ...s, order: index }))
    );
  }, []);

  const updateSection = useCallback((
    sectionId: string, 
    updates: Record<string, unknown>
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, data: { ...section.data, ...updates } } as LovePageSection
          : section
      )
    );
  }, []);

  const toggleSectionVisibility = useCallback((sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, visible: !section.visible }
          : section
      )
    );
  }, []);

  const reorderSections = useCallback((activeId: string, overId: string) => {
    setSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === activeId);
      const newIndex = prev.findIndex((s) => s.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return prev;

      const newSections = [...prev];
      const [removed] = newSections.splice(oldIndex, 1);
      newSections.splice(newIndex, 0, removed);
      
      return newSections.map((s, index) => ({ ...s, order: index }));
    });
  }, []);

  const updatePageSettings = useCallback((updates: Record<string, unknown>) => {
    if (updates.is_published !== undefined) setIsPublished(updates.is_published as boolean);
    if (updates.privacy_mode !== undefined) setPrivacyMode(updates.privacy_mode as string);
    if (updates.unlock_at !== undefined) setUnlockAt(updates.unlock_at as string | null);
    if (updates.expires_at !== undefined) setExpiresAt(updates.expires_at as string | null);
  }, []);

  return {
    pageTitle,
    setPageTitle,
    pageSlug,
    sections,
    loading,
    saving,
    currentPageId,
    isPublished,
    privacyMode,
    unlockAt,
    expiresAt,
    themeSlug,
    setThemeSlug,
    addSection,
    removeSection,
    updateSection,
    toggleSectionVisibility,
    reorderSections,
    createPage,
    savePage,
    loadPage,
    updatePageSettings,
  };
}
