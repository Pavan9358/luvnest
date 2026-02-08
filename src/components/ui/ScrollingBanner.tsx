import { cn } from "@/lib/utils";

interface ScrollingBannerProps {
  text: string;
  className?: string;
}

export function ScrollingBanner({ text, className }: ScrollingBannerProps) {
  return (
    <div className={cn(
      "relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-y border-primary/20",
      className
    )}>
      <div className="animate-scroll-left whitespace-nowrap py-2.5 flex items-center gap-8">
        {[...Array(8)].map((_, i) => (
          <span 
            key={i} 
            className="inline-flex items-center gap-2 text-sm font-medium text-primary/80"
          >
            <span className="text-primary">✨</span>
            {text}
            <span className="text-primary">💕</span>
          </span>
        ))}
      </div>
    </div>
  );
}
