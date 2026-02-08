import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface SparkleEffectProps {
  active?: boolean;
  duration?: number;
  count?: number;
  className?: string;
  onComplete?: () => void;
}

export function SparkleEffect({
  active = false,
  duration = 2000,
  count = 20,
  className,
  onComplete,
}: SparkleEffectProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const generateSparkles = useCallback(() => {
    const newSparkles: Sparkle[] = [];
    for (let i = 0; i < count; i++) {
      newSparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        duration: Math.random() * 1 + 0.5,
        delay: Math.random() * 1,
      });
    }
    setSparkles(newSparkles);
  }, [count]);

  useEffect(() => {
    if (active) {
      generateSparkles();
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration, generateSparkles, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden z-10",
        className
      )}
      aria-hidden="true"
    >
      <style>
        {`
          @keyframes sparkle {
            0%, 100% {
              opacity: 0;
              transform: scale(0);
            }
            50% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animation: `sparkle ${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite`,
          }}
        >
          <svg
            width={sparkle.size}
            height={sparkle.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-primary"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
