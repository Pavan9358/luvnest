import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";

interface LoveLetterEnvelopeProps {
  letterContent: string;
  onOpen: () => void;
}

export function LoveLetterEnvelope({ letterContent, onOpen }: LoveLetterEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  // Get preview text (first 100 chars for the letter preview)
  const previewText = letterContent?.slice(0, 150) || "A special love letter awaits you...";

  const handleEnvelopeClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setHasOpened(true);
      // Trigger the parent callback after animation completes
      setTimeout(() => {
        onOpen();
      }, 1800);
    } else {
      // Toggle close on second tap
      setIsOpen(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[450px] py-8">
      {/* Floating hearts decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <Heart
            key={i}
            className={`absolute text-primary/20 fill-primary/10 animate-float-heart`}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              width: `${16 + (i % 3) * 8}px`,
              height: `${16 + (i % 3) * 8}px`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Envelope Container */}
      <div
        className="envelope-container cursor-pointer select-none"
        onClick={handleEnvelopeClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleEnvelopeClick()}
        aria-label={isOpen ? "Close envelope" : "Open envelope"}
      >
        {/* The Envelope */}
        <div className={`envelope ${isOpen ? 'open' : ''}`}>
          {/* Envelope Back */}
          <div className="envelope-back" />
          
          {/* Letter that slides out */}
          <div className={`letter ${isOpen ? 'slide-out' : ''}`}>
            <div className="letter-content">
              {/* Decorative header */}
              <div className="letter-header">
                <Heart className="w-5 h-5 text-primary fill-primary" />
                <span className="letter-title">With Love</span>
                <Heart className="w-5 h-5 text-primary fill-primary" />
              </div>
              
              {/* Letter text preview */}
              <p className="letter-text">
                {previewText}
                {letterContent && letterContent.length > 150 && "..."}
              </p>
              
              {/* Signature */}
              <div className="letter-footer">
                <span>💕</span>
              </div>
            </div>
          </div>
          
          {/* Envelope Front (bottom part) */}
          <div className="envelope-front" />
          
          {/* Envelope Flap (top triangle) */}
          <div className={`envelope-flap ${isOpen ? 'open' : ''}`}>
            {/* Heart seal */}
            <div className={`heart-seal ${isOpen ? 'hide' : ''}`}>
              <Heart className="w-6 h-6 text-white fill-white drop-shadow-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Instruction text */}
      <div className="mt-8 text-center">
        {!hasOpened ? (
          <p className="text-primary/80 font-medium flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span className="font-handwritten text-lg">Tap to open your surprise</span>
            <Sparkles className="w-4 h-4" />
          </p>
        ) : isOpen ? (
          <p className="text-primary/60 text-sm font-handwritten">
            Opening with love... 💕
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Tap to open again
          </p>
        )}
      </div>
    </div>
  );
}
