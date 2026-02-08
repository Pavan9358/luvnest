import { useState } from "react";
import { HeartParticles } from "./HeartParticles";
import { ConfettiEffect } from "./ConfettiEffect";
import { SparkleEffect } from "./SparkleEffect";
import { cn } from "@/lib/utils";

type RevealType = "hearts" | "confetti" | "sparkle";

interface RevealAnimationProps {
  type: RevealType;
  children: React.ReactNode;
  isRevealed: boolean;
  onReveal: () => void;
  className?: string;
}

export function RevealAnimation({
  type,
  children,
  isRevealed,
  onReveal,
  className,
}: RevealAnimationProps) {
  const [showEffect, setShowEffect] = useState(false);

  const handleReveal = () => {
    if (!isRevealed) {
      setShowEffect(true);
      onReveal();
    }
  };

  const renderEffect = () => {
    switch (type) {
      case "hearts":
        return (
          <div className="absolute inset-0 pointer-events-none">
            {showEffect && (
              <div className="relative w-full h-full">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-float-heart"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      opacity: Math.random() * 0.5 + 0.3,
                    }}
                  >
                    <svg
                      width={Math.random() * 20 + 10}
                      height={Math.random() * 20 + 10}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-primary"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "confetti":
        return (
          <ConfettiEffect
            active={showEffect}
            onComplete={() => setShowEffect(false)}
          />
        );
      case "sparkle":
        return (
          <SparkleEffect
            active={showEffect}
            onComplete={() => setShowEffect(false)}
          />
        );
    }
  };

  return (
    <div className={cn("relative", className)}>
      {renderEffect()}
      
      {!isRevealed ? (
        <button
          onClick={handleReveal}
          className="w-full p-8 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] group"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:animate-pulse-glow">
              <svg
                width={32}
                height={32}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="text-primary"
              >
                <rect x="3" y="8" width="18" height="12" rx="2" />
                <path d="M12 8v-4" />
                <path d="M8 8V6a4 4 0 0 1 8 0v2" />
                <circle cx="12" cy="14" r="2" />
              </svg>
            </div>
            <span className="text-lg font-display text-primary">
              Tap to reveal your surprise
            </span>
          </div>
        </button>
      ) : (
        <div className="animate-scale-in">
          {children}
        </div>
      )}
    </div>
  );
}
