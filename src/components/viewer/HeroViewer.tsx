import type { HeroSection } from "@/types/lovepage";
import { Heart } from "lucide-react";
import { ValentineDecorations } from "@/components/ui/ValentineDecorations";

interface HeroViewerProps {
  section: HeroSection;
}

export function HeroViewer({ section }: HeroViewerProps) {
  const { partnerName1, partnerName2, headline, coverImageUrl } = section.data;

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Valentine Decorations */}
      <ValentineDecorations variant="full" />
      
      {/* Background Image */}
      {coverImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImageUrl})` }}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 py-16 animate-fade-in-up">
         {/* Cute bunny characters at top */}
         <div className="flex items-end justify-center gap-2 mb-8">
           {/* Bunny 1 */}
           <div className="relative">
             <div className="w-12 h-12 bg-secondary rounded-full relative shadow-lg">
               <div className="absolute -top-5 left-2 w-3 h-7 bg-secondary rounded-full transform -rotate-12" />
               <div className="absolute -top-5 right-2 w-3 h-7 bg-secondary rounded-full transform rotate-12" />
               <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-foreground rounded-full" />
               <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-foreground rounded-full" />
               <div className="absolute top-4 left-1 w-2 h-1 bg-primary/50 rounded-full" />
               <div className="absolute top-4 right-1 w-2 h-1 bg-primary/50 rounded-full" />
               <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
             </div>
           </div>
           <span className="text-primary text-2xl mb-3 animate-heart-beat">💕</span>
           {/* Bunny 2 */}
           <div className="relative">
             <div className="w-12 h-12 bg-accent rounded-full relative shadow-lg">
               <div className="absolute -top-5 left-2 w-3 h-7 bg-accent rounded-full transform -rotate-12" />
               <div className="absolute -top-5 right-2 w-3 h-7 bg-accent rounded-full transform rotate-12" />
               <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-foreground rounded-full" />
               <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-foreground rounded-full" />
               <div className="absolute top-4 left-1 w-2 h-1 bg-accent-foreground/30 rounded-full" />
               <div className="absolute top-4 right-1 w-2 h-1 bg-accent-foreground/30 rounded-full" />
               <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-foreground/50 rounded-full" />
             </div>
           </div>
         </div>

        {/* Greeting text */}
        <p className="text-primary text-xl md:text-2xl font-display mb-4 animate-fade-in-up">
          Hey there,
        </p>

        {/* Main headline */}
        <h1 className="text-2xl md:text-4xl font-display font-bold text-primary mb-8">
          {headline || "Will you be my Valentine?"}
        </h1>

        {/* Names with heart */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-2xl md:text-4xl font-display font-bold text-foreground">
            {partnerName1 || "Your Name"}
          </span>
          <Heart className="w-8 h-8 md:w-10 md:h-10 text-primary animate-heart-beat fill-primary" />
          <span className="text-2xl md:text-4xl font-display font-bold text-foreground">
            {partnerName2 || "Partner's Name"}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3 bg-primary/20 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-romantic">
            YES OF COURSE
          </button>
          <button className="px-8 py-3 bg-muted border-2 border-muted-foreground/20 text-muted-foreground font-semibold rounded-full hover:border-primary/50 transition-all duration-300">
            NO THANK YOU
          </button>
        </div>

        {/* Decorative element */}
        <div className="mt-12 flex justify-center">
          <div className="w-24 h-1 bg-gradient-romantic rounded-full" />
        </div>
      </div>

       {/* Calendar badge */}
       <div className="absolute right-[5%] top-[10%] bg-card rounded-xl shadow-xl p-3 border-2 border-primary/20 transform rotate-6 hidden md:block">
         <div className="text-center">
           <div className="border-b border-primary/20 pb-1 mb-1">
             <span className="text-xs text-primary font-medium">❤️❤️❤️❤️</span>
           </div>
           <span className="text-3xl font-bold text-primary block">14</span>
           <span className="text-sm font-semibold text-primary/80">FEB</span>
         </div>
       </div>

      {/* Paper airplane decoration */}
      <div className="absolute left-[8%] bottom-[15%] opacity-70 hidden md:block">
        <svg width="50" height="50" viewBox="0 0 100 100" className="text-primary/50 animate-float-heart" style={{ animationDuration: "4s" }}>
          <path 
            fill="currentColor" 
            d="M10,50 L40,40 L90,10 L60,60 L40,50 L60,80 L90,10 Z"
          />
        </svg>
        {/* Dotted trail */}
        <svg className="absolute -bottom-8 -left-4 w-16 h-16 opacity-40" viewBox="0 0 100 100">
          <path
            d="M50,30 C50,10 80,10 80,35 C80,55 50,75 50,75 C50,75 20,55 20,35 C20,10 50,10 50,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="text-primary"
          />
        </svg>
      </div>
    </section>
  );
}
