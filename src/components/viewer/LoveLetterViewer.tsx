import { useState } from "react";
import type { LoveLetterSection } from "@/types/lovepage";
import { BackgroundAudioPlayer } from "./BackgroundAudioPlayer";
import { LoveLetterEnvelope } from "./LoveLetterEnvelope";
import { motion, AnimatePresence } from "framer-motion";

interface LoveLetterViewerProps {
  section: LoveLetterSection;
}

export function LoveLetterViewer({ section }: LoveLetterViewerProps) {
  const { title, content, backgroundAudioUrl } = section.data;
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section className="py-16 px-4 relative bg-gradient-to-b from-secondary/30 to-background">
      {/* Background Audio */}
      {backgroundAudioUrl && <BackgroundAudioPlayer url={backgroundAudioUrl} />}
      
      <div className="max-w-2xl mx-auto">
        {/* Title with Heart decoration */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary flex items-center justify-center gap-2">
            <span className="text-primary/60">Words from my</span>{" "}
            <span className="underline decoration-primary decoration-2 underline-offset-4">Heart</span>
          </h2>
          {/* XOXO decoration */}
          <div className="absolute right-[10%] top-8 text-2xl font-handwritten text-primary/70 rotate-6 hidden md:block">
            XOXO
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isRevealed ? (
            /* Show animated envelope first */
            <motion.div
              key="envelope"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoveLetterEnvelope 
                letterContent={content}
                onOpen={() => setIsRevealed(true)}
              />
            </motion.div>
          ) : (
            /* Revealed Love Letter */
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Handwritten Letter on Lined Paper */}
              <div 
                className="card-romantic p-8 md:p-12 rounded-xl relative overflow-hidden" 
              >
                {/* Lined paper effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, hsl(var(--border) / 0.4) 31px, hsl(var(--border) / 0.4) 32px)',
                      backgroundSize: '100% 32px',
                    }}
                  />
                  {/* Red margin line */}
                  <div 
                    className="absolute top-0 bottom-0 left-12 w-px"
                    style={{ backgroundColor: 'hsl(0 70% 70% / 0.5)' }}
                  />
                </div>

                {/* Letter content */}
                <div 
                className="relative z-10 pl-6 whitespace-pre-wrap leading-8 text-surface-foreground"
                  style={{ 
                    fontFamily: "'Pacifico', 'Cormorant Garamond', cursive",
                    fontSize: '1.1rem',
                    lineHeight: '2rem',
                  }}
                >
                  {content || "Your heartfelt message will appear here..."}
                </div>

                {/* Small heart decorations */}
                <div className="absolute bottom-4 left-4 flex gap-1">
                  <span className="text-primary text-lg">💕</span>
                  <span className="text-primary/60 text-sm">💗</span>
                </div>

                {/* Signature line */}
                <div className="mt-8 pt-8 border-t border-border/30 relative z-10">
                  <p 
                    className="text-right text-primary italic"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                  >
                    With all my love 💕
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
