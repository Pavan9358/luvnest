import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

interface ConfettiEffectProps {
  active?: boolean;
  duration?: number;
  count?: number;
  className?: string;
  onComplete?: () => void;
}

const CONFETTI_COLORS = [
  "hsl(346 77% 49%)", // rose
  "hsl(340 82% 65%)", // pink
  "hsl(15 70% 75%)",  // peach
  "hsl(45 100% 70%)", // gold
  "hsl(180 60% 70%)", // mint
  "hsl(280 70% 60%)", // purple
];

export function ConfettiEffect({
  active = false,
  duration = 3000,
  count = 50,
  className,
  onComplete,
}: ConfettiEffectProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const generateConfetti = useCallback(() => {
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < count; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: Math.random() * 10 + 5,
        duration: Math.random() * 2 + 2,
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
      });
    }
    setPieces(newPieces);
  }, [count]);

  useEffect(() => {
    if (active) {
      generateConfetti();
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration, generateConfetti, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none overflow-hidden z-50",
        className
      )}
      aria-hidden="true"
    >
      <style>
        {`
          @keyframes confetti-fall {
            0% {
              transform: translateY(-100%) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: 0,
            width: piece.size,
            height: piece.size * 0.6,
            backgroundColor: piece.color,
            borderRadius: "2px",
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${piece.duration}s ease-out ${piece.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
