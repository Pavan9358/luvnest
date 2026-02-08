import { useState } from "react";
import type { GallerySection } from "@/types/lovepage";
import { Image, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BackgroundAudioPlayer } from "./BackgroundAudioPlayer";

interface GalleryViewerProps {
  section: GallerySection;
}

export function GalleryViewer({ section }: GalleryViewerProps) {
  const { title, images, layout, backgroundAudioUrl } = section.data;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const goNext = () => setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
  const goPrev = () => setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));

  const getGridClass = () => {
    switch (layout) {
      case "masonry":
        return "columns-2 md:columns-3 gap-4 space-y-4";
      case "carousel":
        return "flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4";
      default:
        return "grid grid-cols-2 md:grid-cols-3 gap-4";
    }
  };

  return (
    <section className="py-16 px-4 relative">
      {/* Background Audio */}
      {backgroundAudioUrl && <BackgroundAudioPlayer url={backgroundAudioUrl} />}
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <Image className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            {title || "Precious Moments"}
          </h2>
        </div>

        <div className={getGridClass()}>
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`animate-fade-in-up cursor-pointer group ${
                layout === "carousel" ? "flex-shrink-0 w-72 snap-center" : layout === "masonry" ? "break-inside-avoid" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden rounded-xl card-romantic">
                <img
                  src={image.url}
                  alt={image.caption || `Memory ${index + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                    <p className="text-foreground text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-4xl p-0 bg-background/98 border-border">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-foreground hover:bg-muted"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
              </Button>

              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-foreground hover:bg-muted"
                    onClick={goPrev}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-foreground hover:bg-muted"
                    onClick={goNext}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              {selectedIndex !== null && (
                <div className="flex items-center justify-center min-h-[60vh] p-8">
                  <img
                    src={images[selectedIndex].url}
                    alt={images[selectedIndex].caption || ""}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  />
                </div>
              )}

              {selectedIndex !== null && images[selectedIndex].caption && (
                <div className="text-center text-foreground p-4">
                  <p>{images[selectedIndex].caption}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
