import { cn } from "@/lib/utils";

interface ValentineDecorationsProps {
  className?: string;
  variant?: "full" | "minimal";
}

export function ValentineDecorations({ className, variant = "full" }: ValentineDecorationsProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none z-0", className)}>
      {/* Floating hearts - left side */}
      <div className="absolute left-[5%] top-[20%] animate-float-heart" style={{ animationDelay: "0s" }}>
        <span className="text-2xl text-primary/60">💕</span>
      </div>
      <div className="absolute left-[3%] top-[50%] animate-float-heart" style={{ animationDelay: "1s" }}>
        <span className="text-xl text-primary/40">❤️</span>
      </div>
      <div className="absolute left-[8%] top-[70%] animate-float-heart" style={{ animationDelay: "2s" }}>
        <span className="text-lg text-primary/50">💗</span>
      </div>

      {/* Floating hearts - right side */}
      <div className="absolute right-[5%] top-[15%] animate-float-heart" style={{ animationDelay: "0.5s" }}>
        <span className="text-2xl text-primary/50">💖</span>
      </div>
      <div className="absolute right-[3%] top-[45%] animate-float-heart" style={{ animationDelay: "1.5s" }}>
        <span className="text-xl text-primary/40">💕</span>
      </div>
      <div className="absolute right-[7%] top-[75%] animate-float-heart" style={{ animationDelay: "2.5s" }}>
        <span className="text-lg text-primary/60">❤️</span>
      </div>

      {variant === "full" && (
        <>
          {/* Paper airplane decoration */}
          <div className="absolute left-[10%] bottom-[15%] opacity-60">
            <svg width="60" height="60" viewBox="0 0 100 100" className="text-primary/40 animate-float-heart" style={{ animationDuration: "4s" }}>
              <path 
                fill="currentColor" 
                d="M10,50 L40,40 L90,10 L60,60 L40,50 L60,80 L90,10 Z"
              />
            </svg>
          </div>

          {/* Dotted heart path */}
          <svg className="absolute left-[5%] bottom-[20%] w-32 h-32 opacity-30" viewBox="0 0 100 100">
            <path
              d="M50,30 C50,10 80,10 80,35 C80,55 50,75 50,75 C50,75 20,55 20,35 C20,10 50,10 50,30"
              fill="none"
              stroke="hsl(346 77% 49%)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Calendar badge - like in reference */}
          <div className="absolute right-[8%] top-[10%] bg-white rounded-lg shadow-lg p-3 border-2 border-primary/20 transform rotate-6">
            <div className="text-center">
              <div className="border-b border-primary/20 pb-1 mb-1">
                <span className="text-xs text-muted-foreground font-medium">❤️❤️❤️❤️</span>
              </div>
              <span className="text-2xl font-bold text-primary block">14</span>
              <span className="text-sm font-semibold text-primary/80">FEB</span>
            </div>
          </div>

          {/* Cute bunny/character decoration - styled as CSS */}
          <div className="absolute left-1/2 top-[5%] -translate-x-1/2">
            <div className="flex items-end gap-1">
              {/* Bunny 1 */}
              <div className="relative">
                <div className="w-8 h-8 bg-pink-200 rounded-full relative">
                  {/* Ears */}
                  <div className="absolute -top-4 left-1 w-2 h-5 bg-pink-200 rounded-full transform -rotate-12" />
                  <div className="absolute -top-4 right-1 w-2 h-5 bg-pink-200 rounded-full transform rotate-12" />
                  {/* Eyes */}
                  <div className="absolute top-2 left-2 w-1 h-1 bg-gray-800 rounded-full" />
                  <div className="absolute top-2 right-2 w-1 h-1 bg-gray-800 rounded-full" />
                  {/* Blush */}
                  <div className="absolute top-3 left-0.5 w-1.5 h-1 bg-pink-400/50 rounded-full" />
                  <div className="absolute top-3 right-0.5 w-1.5 h-1 bg-pink-400/50 rounded-full" />
                </div>
              </div>
              {/* Heart between */}
              <span className="text-primary text-lg mb-2">💕</span>
              {/* Bunny 2 */}
              <div className="relative">
                <div className="w-8 h-8 bg-blue-200 rounded-full relative">
                  <div className="absolute -top-4 left-1 w-2 h-5 bg-blue-200 rounded-full transform -rotate-12" />
                  <div className="absolute -top-4 right-1 w-2 h-5 bg-blue-200 rounded-full transform rotate-12" />
                  <div className="absolute top-2 left-2 w-1 h-1 bg-gray-800 rounded-full" />
                  <div className="absolute top-2 right-2 w-1 h-1 bg-gray-800 rounded-full" />
                  <div className="absolute top-3 left-0.5 w-1.5 h-1 bg-blue-400/50 rounded-full" />
                  <div className="absolute top-3 right-0.5 w-1.5 h-1 bg-blue-400/50 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function FloatingHeart({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div 
      className={cn("absolute animate-float-heart text-primary/40", className)} 
      style={style}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </div>
  );
}
