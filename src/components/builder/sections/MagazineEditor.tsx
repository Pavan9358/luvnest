import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Plus, Trash2, BookHeart, GripVertical } from "lucide-react";
import type { MagazineSection, MagazinePage } from "@/types/lovepage";

interface MagazineEditorProps {
  section: MagazineSection;
  onUpdate: (updates: Partial<MagazineSection["data"]>) => void;
}

export function MagazineEditor({ section, onUpdate }: MagazineEditorProps) {
  const addPage = () => {
    if (section.data.pages.length >= 10) {
      return; // Max 10 pages
    }
    const newPage: MagazinePage = {
      id: nanoid(),
      imageUrl: undefined,
      title: `Page ${section.data.pages.length + 1}`,
      content: "",
    };
    onUpdate({ pages: [...section.data.pages, newPage] });
  };

  const updatePage = (pageId: string, updates: Partial<MagazinePage>) => {
    const updatedPages = section.data.pages.map((page) =>
      page.id === pageId ? { ...page, ...updates } : page
    );
    onUpdate({ pages: updatedPages });
  };

  const removePage = (pageId: string) => {
    onUpdate({ pages: section.data.pages.filter((p) => p.id !== pageId) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary mb-4">
        <BookHeart className="h-5 w-5" />
        <span className="text-sm font-medium">Love Magazine (5-10 pages)</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${section.id}-title`}>Magazine Title</Label>
        <Input
          id={`${section.id}-title`}
          value={section.data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Our Love Story Magazine"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${section.id}-cover`}>Cover Title</Label>
        <Input
          id={`${section.id}-cover`}
          value={section.data.coverTitle}
          onChange={(e) => onUpdate({ coverTitle: e.target.value })}
          placeholder="A Journey of Love"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Magazine Pages ({section.data.pages.length}/10)</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addPage}
            disabled={section.data.pages.length >= 10}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Page
          </Button>
        </div>

        {section.data.pages.length === 0 ? (
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={addPage}
          >
            <BookHeart className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to add your first magazine page
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {section.data.pages.map((page, index) => (
              <Card key={page.id} className="p-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center pt-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div className="mt-2 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Input
                        value={page.title}
                        onChange={(e) => updatePage(page.id, { title: e.target.value })}
                        placeholder="Page title"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removePage(page.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">
                          Page Image
                        </Label>
                        <ImageUpload
                          value={page.imageUrl}
                          onChange={(url) => updatePage(page.id, { imageUrl: url })}
                          aspectRatio="portrait"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">
                          Page Content
                        </Label>
                        <Textarea
                          value={page.content}
                          onChange={(e) => updatePage(page.id, { content: e.target.value })}
                          placeholder="Write your story..."
                          className="min-h-[150px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {section.data.pages.length > 0 && section.data.pages.length < 5 && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            Add at least 5 pages to create a beautiful magazine experience
          </p>
        )}
      </div>
    </div>
  );
}
