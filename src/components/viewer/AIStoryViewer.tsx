import type { AIStorySection } from "@/types/lovepage";
import { BookOpen, Heart, Stars } from "lucide-react";

interface AIStoryViewerProps {
  section: AIStorySection;
}

export function AIStoryViewer({ section }: AIStoryViewerProps) {
  const { title, storyStyle, generatedContent } = section.data;

  if (!generatedContent) {
    return null;
  }

  const getStyleLabel = (style: string) => {
    switch (style) {
      case "fairy-tale":
        return "✨ A Fairy Tale";
      case "adventure":
        return "🌍 An Adventure";
      case "classic-romance":
        return "💕 A Classic Romance";
      default:
        return "Our Story";
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-soft relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-8 left-8 opacity-10">
        <Heart className="w-24 h-24 text-primary animate-pulse" />
      </div>
      <div className="absolute bottom-12 right-8 opacity-10">
        <Heart className="w-16 h-16 text-primary animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>
      <div className="absolute top-1/4 right-1/4 opacity-5">
        <Stars className="w-32 h-32 text-primary" />
      </div>
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-20 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            {title || "Our Love Story"}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 inline-flex items-center gap-2">
            <span className="w-12 h-px bg-primary/30" />
            {getStyleLabel(storyStyle)}
            <span className="w-12 h-px bg-primary/30" />
          </p>
        </div>

        <div 
          className="relative card-romantic p-8 md:p-12 rounded-xl animate-fade-in-up overflow-hidden" 
          style={{ animationDelay: "0.2s" }}
        >
          {/* Inner decorative corner hearts */}
          <div className="absolute top-4 left-4 opacity-20">
            <Heart className="w-6 h-6 text-primary fill-primary/20" />
          </div>
          <div className="absolute top-4 right-4 opacity-20">
            <Heart className="w-6 h-6 text-primary fill-primary/20" />
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <Heart className="w-6 h-6 text-primary fill-primary/20" />
          </div>
          <div className="absolute bottom-4 right-4 opacity-20">
            <Heart className="w-6 h-6 text-primary fill-primary/20" />
          </div>
          
          {/* Story content */}
          <div 
            className="prose prose-lg max-w-none text-foreground leading-relaxed"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              whiteSpace: "pre-wrap",
            }}
          >
            {generatedContent}
          </div>

          {/* Elegant bottom divider */}
          <div className="mt-8 pt-6 flex items-center justify-center gap-3">
            <span className="w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <Heart className="w-4 h-4 text-primary/40 fill-primary/20" />
            <span className="w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
