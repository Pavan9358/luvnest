import { useState } from "react";
import type { MagazineSection } from "@/types/lovepage";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookHeart } from "lucide-react";

interface MagazineViewerProps {
  section: MagazineSection;
}

export function MagazineViewer({ section }: MagazineViewerProps) {
  const { title, coverTitle, pages } = section.data;
  const [currentPage, setCurrentPage] = useState(-1); // -1 = cover
  const totalPages = pages.length;

  if (pages.length === 0) {
    return null;
  }

  const goToNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrev = () => {
    if (currentPage >= -1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const canGoNext = currentPage < totalPages - 1;
  const canGoPrev = currentPage > -1;

  return (
    <section className="py-16 px-4 bg-gradient-soft">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-center mb-8">
          {title || "Our Love Magazine"}
        </h2>

        {/* Magazine Container */}
        <div className="relative perspective-1000">
          {/* Book wrapper */}
          <div className="relative mx-auto" style={{ maxWidth: "600px" }}>
            {/* Cover */}
            {currentPage === -1 && (
              <div className="magazine-page animate-fade-in-up">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 via-background to-primary/10 rounded-xl shadow-romantic border border-primary/20 flex flex-col items-center justify-center p-8 text-center">
                  <BookHeart className="w-20 h-20 text-primary mb-6" />
                  <h3 className="text-3xl font-display font-bold mb-4 text-primary">
                    {coverTitle || "Our Love Story"}
                  </h3>
                  <p className="text-muted-foreground">
                    A magazine of our precious memories
                  </p>
                  <div className="mt-8 text-sm text-muted-foreground">
                    {totalPages} pages
                  </div>
                </div>
              </div>
            )}

            {/* Pages */}
            {currentPage >= 0 && pages[currentPage] && (
              <div
                key={pages[currentPage].id}
                className="magazine-page animate-page-flip"
              >
                <div className="aspect-[3/4] bg-background rounded-xl shadow-romantic border overflow-hidden">
                  {/* Page content */}
                  <div className="h-full flex flex-col">
                    {/* Image area */}
                    {pages[currentPage].imageUrl && (
                      <div className="flex-1 min-h-0">
                        <img
                          src={pages[currentPage].imageUrl}
                          alt={pages[currentPage].title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Text area */}
                    <div className="p-6 bg-background">
                      <h4 className="text-xl font-display font-semibold mb-3 text-primary">
                        {pages[currentPage].title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {pages[currentPage].content}
                      </p>
                    </div>

                    {/* Page number */}
                    <div className="py-2 text-center text-xs text-muted-foreground border-t">
                      Page {currentPage + 1} of {totalPages}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={goToPrev}
                disabled={!canGoPrev}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {currentPage === 0 ? "Cover" : "Previous"}
              </Button>

              {/* Page indicators */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(-1)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentPage === -1 ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  aria-label="Go to cover"
                />
                {pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentPage === index ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={goToNext}
                disabled={!canGoNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
