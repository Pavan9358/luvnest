import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAuth } from "@/hooks/useAuth";
import { useLovePageBuilder } from "@/hooks/useLovePageBuilder";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/builder/SectionCard";
import { SectionPicker } from "@/components/builder/SectionPicker";
import { ThemeSelector } from "@/components/builder/ThemeSelector";
import { PrivacySettings } from "@/components/builder/PrivacySettings";
import { HeartParticles } from "@/components/effects/HeartParticles";
import { HeroEditor } from "@/components/builder/sections/HeroEditor";
import { LoveLetterEditor } from "@/components/builder/sections/LoveLetterEditor";
import { TimelineEditor } from "@/components/builder/sections/TimelineEditor";
import { GalleryEditor } from "@/components/builder/sections/GalleryEditor";
import { CountdownEditor } from "@/components/builder/sections/CountdownEditor";
import { SurpriseEditor } from "@/components/builder/sections/SurpriseEditor";
import { AIStoryEditor } from "@/components/builder/sections/AIStoryEditor";
import { MagazineEditor } from "@/components/builder/sections/MagazineEditor";
import { HeartIcon } from "@/components/ui/HeartIcon";
import { ScrollingBanner } from "@/components/ui/ScrollingBanner";
import { TemplateLimitBlock } from "@/components/limits/TemplateLimitBlock";
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Loader2,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import type { 
  LovePageSection,
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
import { BeMyValentineEditor } from "@/components/builder/sections/BeMyValentineEditor";

export default function CreatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const [limitBlocked, setLimitBlocked] = useState<"create" | "edit" | null>(null);
  const [editLimitInfo, setEditLimitInfo] = useState<{ editCount: number; maxEdits: number } | null>(null);

  const {
    planLimits,
    loading: limitsLoading,
    checkCanCreate,
    checkCanEdit,
    incrementTemplateCount,
    incrementEditCount,
  } = usePlanLimits();

  const {
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
    updatePageSettings,
  } = useLovePageBuilder({ pageId: id });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check limits before allowing access
  useEffect(() => {
    const checkLimits = async () => {
      if (!user || limitsLoading) return;

      if (id) {
        // Editing existing page - check edit limits
        const result = await checkCanEdit(id);
        if (!result.allowed) {
          setLimitBlocked("edit");
          setEditLimitInfo({ editCount: result.editCount || 3, maxEdits: 3 });
        }
      } else {
        // Creating new page - check create limits
        const result = await checkCanCreate();
        if (!result.allowed) {
          setLimitBlocked("create");
        }
      }
    };

    checkLimits();
  }, [user, id, limitsLoading, checkCanCreate, checkCanEdit]);

  // Initialize new page with hero section
  useEffect(() => {
    if (!id && !initialized && user && !loading && !limitBlocked) {
      addSection("hero");
      setInitialized(true);
    }
  }, [id, initialized, user, loading, addSection, limitBlocked]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderSections(active.id as string, over.id as string);
    }
  };

  const handleSave = async () => {
    if (!currentPageId) {
      // Creating new page - increment template count first
      const canProceed = await incrementTemplateCount();
      if (!canProceed) {
        toast.error("Unable to create page. Template limit reached.");
        setLimitBlocked("create");
        return;
      }

      const result = await createPage();
      if (result) {
        // Increment edit count for the first save
        await incrementEditCount(result.id);
        toast.success("Love page created! Redirecting to your page...");
        // Redirect to the public love page
        setTimeout(() => {
          window.location.href = `/love/${result.slug}`;
        }, 1500);
      }
    } else {
      // Editing existing page - increment edit count
      const canEdit = await incrementEditCount(currentPageId);
      if (!canEdit) {
        toast.error("Edit limit reached. This template cannot be modified anymore.");
        setLimitBlocked("edit");
        setEditLimitInfo({ editCount: 3, maxEdits: 3 });
        return;
      }

      await savePage();
      toast.success("Changes saved!");
    }
  };

  const handlePreview = () => {
    if (currentPageId && pageSlug) {
      window.open(`/love/${pageSlug}`, "_blank");
    } else {
      toast.info("Save the page first to preview it");
    }
  };

  const renderSectionEditor = (section: LovePageSection) => {
    switch (section.type) {
      case "hero":
        return (
          <HeroEditor
            section={section as HeroSection}
            onUpdate={(updates) => updateSection(section.id, updates)}
          />
        );
      case "love-letter":
        return (
          <LoveLetterEditor
            section={section as LoveLetterSection}
            onUpdate={(updates) => updateSection(section.id, updates)}
          />
        );
      case "timeline":
        return (
          <TimelineEditor
            section={section as TimelineSection}
            onUpdate={(updates) => updateSection(section.id, updates)}
          />
        );
      case "gallery":
        return (
          <GalleryEditor
            section={section as GallerySection}
            onUpdate={(updates) => updateSection(section.id, updates)}
          />
        );
      case "countdown":
        return (
          <CountdownEditor
            section={section as CountdownSection}
            onUpdate={(updates) => updateSection(section.id, updates)}
          />
        );
      case "surprise":
        return (
          <SurpriseEditor
            section={section as SurpriseSection}
            onUpdate={(updates) => updateSection(section.id, updates)}
          />
        );
      case "ai-story":
        return (
          <AIStoryEditor
            section={section as AIStorySection}
            onUpdate={(updates) => updateSection(section.id, updates)}
          />
        );
      case "magazine":
        return (
          <MagazineEditor
            section={section as MagazineSection}
            onUpdate={(updates) => updateSection(section.id, updates)}
          />
        );
      case "be-my-valentine":
        return (
          <BeMyValentineEditor
            section={section as BeMyValentineSection}
            onUpdate={(updates) => updateSection(section.id, updates)}
          />
        );
      default:
        return <div>Unknown section type</div>;
    }
  };

  // Show limit block screen BEFORE loading the editor
  if (limitBlocked === "create") {
    return (
      <TemplateLimitBlock
        type="create"
        planType={planLimits?.planType}
        templatesUsed={planLimits?.templatesUsed}
        maxTemplates={planLimits?.maxTemplates}
      />
    );
  }

  if (limitBlocked === "edit") {
    return (
      <TemplateLimitBlock
        type="edit"
        editCount={editLimitInfo?.editCount}
        maxEdits={editLimitInfo?.maxEdits}
      />
    );
  }

  if (authLoading || loading || limitsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <HeartIcon size="xl" className="text-primary animate-heart-beat mx-auto mb-4" />
          <p className="text-muted-foreground">Loading builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <HeartParticles count={12} />
      <Header />

      {/* Builder Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1">
              <Input
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="text-lg font-display font-semibold border-none bg-transparent focus-visible:ring-0 px-0 h-auto"
                placeholder="Enter page title..."
              />
            </div>

            <div className="flex items-center gap-2">
              {saving ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </div>
              ) : currentPageId ? (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle className="h-4 w-4" />
                  Saved
                </div>
              ) : null}

              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              <ThemeSelector onThemeChange={setThemeSlug} />

              {currentPageId && pageSlug && (
                <PrivacySettings
                  pageId={currentPageId}
                  slug={pageSlug}
                  isPublished={isPublished}
                  privacyMode={privacyMode}
                  unlockAt={unlockAt}
                  expiresAt={expiresAt}
                  onUpdate={updatePageSettings}
                />
              )}

              <Button onClick={handleSave} className="btn-romantic text-white">
                <Save className="h-4 w-4 mr-2" />
                {currentPageId ? "Save" : "Create Page"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Banner */}
      <ScrollingBanner text="Sections can be added and removed individually" />

      {/* Builder Content */}
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {sections.map((section) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    onToggleVisibility={() => toggleSectionVisibility(section.id)}
                    onRemove={() => removeSection(section.id)}
                  >
                    {renderSectionEditor(section)}
                  </SectionCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add Section Button */}
          <div className="mt-6 flex justify-center">
            <SectionPicker
              onAddSection={addSection}
              existingSections={sections.map((s) => s.type)}
            />
          </div>

          {/* Empty State */}
          {sections.length === 0 && (
            <div className="text-center py-12">
              <HeartIcon size="xl" className="text-primary/30 mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold mb-2">
                Start Building Your Love Page
              </h3>
              <p className="text-muted-foreground mb-6">
                Add sections to create a beautiful page for your special someone
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
