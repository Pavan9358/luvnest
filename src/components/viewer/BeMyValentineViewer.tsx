 import { useState, useCallback, useRef, useMemo } from "react";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BeMyValentineSection } from "@/types/lovepage";

interface BeMyValentineViewerProps {
  section: BeMyValentineSection;
}

export function BeMyValentineViewer({ section }: BeMyValentineViewerProps) {
  const [accepted, setAccepted] = useState(false);
  const [noButtonStyle, setNoButtonStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

   const { question, yesButtonText, noButtonText } = section.data;
 
   // Predefined romantic acceptance paragraphs
   const romanticParagraphs = useMemo(() => [
     "Yes! A thousand times yes! You've made my heart complete. Every moment with you is a treasure I'll cherish forever. 💕",
     "My heart is dancing with joy! Being your Valentine is the greatest gift I could ever receive. I love you more than words can say. 💖",
     "You've just made me the happiest person in the world! My answer will always be yes when it comes to you. 💗",
     "A million butterflies just took flight in my heart! Yes, I'll be your Valentine today, tomorrow, and forever. 🦋💕",
     "This is the moment I've been dreaming of! You have my whole heart, now and always. I'm yours! 💝",
     "My soul found its home the moment you asked. Yes! Let's write our love story together. ✨💕",
     "Every love song suddenly makes sense now. Yes, my darling, I'm all yours! 🎵💖",
     "You're my favorite hello and my hardest goodbye. Of course I'll be your Valentine! 💗",
     "In a world full of people, my heart chose you. Yes! Forever and always. 💕",
     "This is better than any fairy tale! You're my prince/princess and I'm saying YES with all my heart! 👑💝",
     "My heart has been waiting for this moment. Yes! You complete me in every way. 💖",
     "Love isn't finding someone to live with, it's finding someone you can't live without. That's you! YES! 💕",
     "You're my today and all of my tomorrows. I couldn't say anything but yes! 🌅💗",
     "From this moment, my heart beats only for you. Yes, my Valentine, now and forever! 💝",
     "They say love is blind, but I see everything clearly now - I see you, and I say YES! 👀💕",
     "You're the missing piece to my puzzle. YES! Let's be complete together! 🧩💖",
     "A thousand stars couldn't shine brighter than my love for you. YES! 🌟💕",
     "You asked, my heart answered before my lips could. YES, a million times yes! 💗",
     "Every beat of my heart whispers your name. Yes, I'll be your Valentine forever! 💓",
     "This is the start of our beautiful forever. YES! Let's make every moment magical! ✨💕"
   ], []);
 
   // Get a random paragraph, avoiding the last shown one
   const [lastParagraphIndex, setLastParagraphIndex] = useState(-1);
   const acceptanceParagraph = useMemo(() => {
     if (!accepted) return "";
     let newIndex: number;
     do {
       newIndex = Math.floor(Math.random() * romanticParagraphs.length);
     } while (newIndex === lastParagraphIndex && romanticParagraphs.length > 1);
     return romanticParagraphs[newIndex];
   }, [accepted, romanticParagraphs, lastParagraphIndex]);

   // Get refs for collision detection
   const yesButtonRef = useRef<HTMLButtonElement>(null);
   const questionRef = useRef<HTMLHeadingElement>(null);
   const heartsRef = useRef<HTMLDivElement>(null);
 
   // Check if a position collides with protected elements
   const isPositionValid = useCallback((x: number, y: number, buttonWidth: number, buttonHeight: number) => {
     if (!containerRef.current) return true;
     
     const container = containerRef.current.getBoundingClientRect();
     const padding = 20;
     
     // Check bounds with padding
     if (x < padding || y < padding || 
         x + buttonWidth > container.width - padding || 
         y + buttonHeight > container.height - padding) {
       return false;
     }
     
     // Get protected element rects
     const protectedElements: DOMRect[] = [];
     
     if (yesButtonRef.current) {
       const rect = yesButtonRef.current.getBoundingClientRect();
       // Convert to relative coordinates and add margin
       protectedElements.push(new DOMRect(
         rect.left - container.left - 30,
         rect.top - container.top - 30,
         rect.width + 60,
         rect.height + 60
       ));
     }
     
     if (questionRef.current) {
       const rect = questionRef.current.getBoundingClientRect();
       protectedElements.push(new DOMRect(
         rect.left - container.left - 20,
         rect.top - container.top - 20,
         rect.width + 40,
         rect.height + 40
       ));
     }
     
     if (heartsRef.current) {
       const rect = heartsRef.current.getBoundingClientRect();
       protectedElements.push(new DOMRect(
         rect.left - container.left - 10,
         rect.top - container.top - 10,
         rect.width + 20,
         rect.height + 20
       ));
     }
     
     // Check collision with each protected element
     for (const rect of protectedElements) {
       const overlapsX = x < rect.x + rect.width && x + buttonWidth > rect.x;
       const overlapsY = y < rect.y + rect.height && y + buttonHeight > rect.y;
       if (overlapsX && overlapsY) {
         return false;
       }
     }
     
     return true;
   }, []);
 
   // Generate random position for the NO button with collision detection
  const moveNoButton = useCallback(() => {
     if (!containerRef.current || !noButtonRef.current) return;
 
     const container = containerRef.current.getBoundingClientRect();
     const button = noButtonRef.current.getBoundingClientRect();
 
     const maxX = container.width - button.width - 20;
     const maxY = container.height - button.height - 20;
     
     let attempts = 0;
     const maxAttempts = 50;
     let randomX: number, randomY: number;
     
     // Try to find a valid position
     do {
       randomX = Math.max(20, Math.random() * maxX);
       randomY = Math.max(20, Math.random() * maxY);
       attempts++;
     } while (!isPositionValid(randomX, randomY, button.width, button.height) && attempts < maxAttempts);
     
     // If we couldn't find a valid position, try corners
     if (attempts >= maxAttempts) {
       const corners = [
         { x: 20, y: 20 },
         { x: maxX, y: 20 },
         { x: 20, y: maxY },
         { x: maxX, y: maxY }
       ];
       const validCorner = corners.find(c => isPositionValid(c.x, c.y, button.width, button.height));
       if (validCorner) {
         randomX = validCorner.x;
         randomY = validCorner.y;
       }
     }
 
     setNoButtonStyle({
       position: "absolute",
       left: `${randomX}px`,
       top: `${randomY}px`,
       transition: "all 0.15s ease-out",
       zIndex: 10,
     });
   }, [isPositionValid]);

  // Floating hearts animation data
  const floatingHearts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    duration: `${3 + Math.random() * 2}s`,
    size: 12 + Math.random() * 16,
  }));

  if (accepted) {
    return (
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-soft">
        {/* Floating hearts background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingHearts.map((heart) => (
            <Heart
              key={heart.id}
              className="absolute text-primary/30 animate-float-heart"
              style={{
                left: heart.left,
                bottom: "-50px",
                width: heart.size,
                height: heart.size,
                animationDelay: heart.delay,
                animationDuration: heart.duration,
              }}
              fill="currentColor"
            />
          ))}
        </div>

        {/* Sparkle accents */}
        <Sparkles className="absolute top-20 left-10 w-8 h-8 text-primary/40 animate-pulse" />
        <Sparkles className="absolute top-32 right-16 w-6 h-6 text-primary/30 animate-pulse" style={{ animationDelay: "0.5s" }} />
        <Sparkles className="absolute bottom-40 left-20 w-5 h-5 text-primary/20 animate-pulse" style={{ animationDelay: "1s" }} />
        <Sparkles className="absolute bottom-28 right-24 w-7 h-7 text-primary/35 animate-pulse" style={{ animationDelay: "1.5s" }} />

        {/* Soft glow overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-lg animate-scale-in">
          {/* Decorative top hearts */}
          <div className="flex justify-center gap-4 mb-8">
            <Heart className="w-8 h-8 text-primary animate-heart-beat" fill="currentColor" />
            <Heart className="w-10 h-10 text-primary animate-heart-beat" fill="currentColor" style={{ animationDelay: "0.2s" }} />
            <Heart className="w-8 h-8 text-primary animate-heart-beat" fill="currentColor" style={{ animationDelay: "0.4s" }} />
          </div>

           {/* Main quote */}
           <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-romantic border border-primary/10">
             <p className="text-2xl md:text-3xl font-display text-foreground leading-relaxed">
               {acceptanceParagraph}
             </p>
          </div>

          {/* Decorative bottom */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
            <Heart className="w-5 h-5 text-primary/60" fill="currentColor" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-soft"
    >
      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingHearts.map((heart) => (
          <Heart
            key={heart.id}
            className="absolute text-primary/20 animate-float-heart"
            style={{
              left: heart.left,
              bottom: "-50px",
              width: heart.size,
              height: heart.size,
              animationDelay: heart.delay,
              animationDuration: heart.duration,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      {/* Decorative sparkles */}
      <Sparkles className="absolute top-16 left-8 w-6 h-6 text-primary/30 animate-pulse" />
      <Sparkles className="absolute top-24 right-12 w-5 h-5 text-primary/25 animate-pulse" style={{ animationDelay: "0.7s" }} />
      <Sparkles className="absolute bottom-32 left-16 w-7 h-7 text-primary/20 animate-pulse" style={{ animationDelay: "1.2s" }} />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 animate-fade-in">
           {/* Decorative hearts above question */}
           <div ref={heartsRef} className="flex justify-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-primary/60 animate-bounce" fill="currentColor" style={{ animationDelay: "0s" }} />
          <Heart className="w-8 h-8 text-primary animate-heart-beat" fill="currentColor" />
          <Heart className="w-6 h-6 text-primary/60 animate-bounce" fill="currentColor" style={{ animationDelay: "0.3s" }} />
        </div>

         {/* Question */}
         <h2 ref={questionRef} className="text-3xl md:text-5xl font-display font-bold text-foreground mb-12 leading-tight">
          {question || "Will you be my Valentine?"}
        </h2>

         {/* YES Button - always in center */}
         <Button
           ref={yesButtonRef}
           onClick={() => {
             setLastParagraphIndex(prev => prev);
             setAccepted(true);
           }}
          className="btn-romantic text-white text-xl px-10 py-6 h-auto rounded-full shadow-romantic hover:scale-105 transition-transform"
        >
          {yesButtonText || "Yes 💖"}
        </Button>
      </div>

      {/* NO Button - runs away */}
      <Button
        ref={noButtonRef}
        variant="outline"
        className={cn(
          "text-lg px-8 py-5 h-auto rounded-full border-2 border-muted-foreground/30 hover:border-muted-foreground/50",
          noButtonStyle.position ? "" : "mt-4"
        )}
        style={noButtonStyle}
        onMouseEnter={moveNoButton}
        onTouchStart={(e) => {
          e.preventDefault();
          moveNoButton();
        }}
        onFocus={moveNoButton}
      >
        {noButtonText || "No 😶"}
      </Button>
    </section>
  );
}
