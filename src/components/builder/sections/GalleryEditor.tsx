import { useRef } from "react";
import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, X, Loader2, Music } from "lucide-react";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import type { GallerySection, GalleryImage } from "@/types/lovepage";
import { AIAssistButton } from "@/components/builder/AIAssistButton";

interface GalleryEditorProps {
  section: GallerySection;
  onUpdate: (updates: Partial<GallerySection["data"]>) => void;
}

export function GalleryEditor({ section, onUpdate }: GalleryEditorProps) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { uploadFile, uploading } = useMediaUpload();

  const addImage = () => {
    const newImage: GalleryImage = {
      id: nanoid(),
      url: "",
      caption: "",
    };
    onUpdate({ images: [...section.data.images, newImage] });
  };

  const updateImage = (imageId: string, updates: Partial<GalleryImage>) => {
    const updatedImages = section.data.images.map((img) =>
      img.id === imageId ? { ...img, ...updates } : img
    );
    onUpdate({ images: updatedImages });
  };

  const removeImage = (imageId: string) => {
    onUpdate({ images: section.data.images.filter((img) => img.id !== imageId) });
  };

  const handleFileUpload = async (imageId: string, file: File) => {
    const result = await uploadFile(file);
    if (result) {
      updateImage(imageId, { url: result.url });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${section.id}-title`}>Gallery Title</Label>
          <Input
            id={`${section.id}-title`}
            value={section.data.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Precious Moments"
          />
        </div>
        <div className="space-y-2">
          <Label>Layout Style</Label>
          <Select
            value={section.data.layout}
            onValueChange={(value: "grid" | "masonry" | "carousel") =>
              onUpdate({ layout: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="masonry">Masonry</SelectItem>
              <SelectItem value="carousel">Carousel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Photos</Label>
          <div className="flex gap-2">
            <AIAssistButton
              sectionType="gallery"
              onApplySuggestion={(suggestion) => {
                onUpdate({ title: suggestion });
              }}
            />
            <Button variant="outline" size="sm" onClick={addImage}>
              <ImagePlus className="h-4 w-4 mr-1" />
              Add Photo
            </Button>
          </div>
        </div>

        {section.data.images.length === 0 ? (
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={addImage}
          >
            <ImagePlus className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to add your first photo
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {section.data.images.map((image) => (
              <div key={image.id} className="space-y-2">
                <input
                  ref={(el) => { inputRefs.current[image.id] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(image.id, file);
                  }}
                />
                <div
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/25 cursor-pointer"
                  onClick={() => !image.url && inputRefs.current[image.id]?.click()}
                >
                  {image.url ? (
                    <>
                      <img
                        src={image.url}
                        alt={image.caption || "Gallery photo"}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(image.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : uploading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      <span className="text-xs text-muted-foreground">Uploading...</span>
                    </div>
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center gap-1"
                      onClick={() => inputRefs.current[image.id]?.click()}
                    >
                      <ImagePlus className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                    </div>
                  )}
                </div>
                <Input
                  value={image.caption || ""}
                  onChange={(e) => updateImage(image.id, { caption: e.target.value })}
                  placeholder="Caption..."
                  className="h-8 text-xs"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Background Audio URL */}
      <div className="space-y-2 pt-4 border-t">
        <Label className="flex items-center gap-2">
          <Music className="h-4 w-4 text-primary" />
          Background Music (Optional)
        </Label>
        <Input
          value={section.data.backgroundAudioUrl || ""}
          onChange={(e) => onUpdate({ backgroundAudioUrl: e.target.value })}
          placeholder="Paste Spotify, YouTube, or audio link..."
          className="text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Add music that plays while viewing photos 🎵
        </p>
      </div>
    </div>
  );
}
