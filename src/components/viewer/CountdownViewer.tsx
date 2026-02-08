import { useState, useEffect } from "react";
import type { CountdownSection } from "@/types/lovepage";
import { Timer, Heart } from "lucide-react";

interface CountdownViewerProps {
  section: CountdownSection;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownViewer({ section }: CountdownViewerProps) {
  const { title, targetDate, message } = section.data;
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsPast(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-fade-in-up">
          <Timer className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">
            {title || "Counting Down To..."}
          </h2>
        </div>

        {isPast ? (
          <div className="card-romantic p-8 rounded-xl animate-scale-in">
            <Heart className="w-16 h-16 text-primary mx-auto mb-4 animate-heart-beat fill-primary" />
            <p className="text-xl font-display">{message || "The moment has arrived! 💕"}</p>
          </div>
        ) : timeLeft ? (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hours" },
                { value: timeLeft.minutes, label: "Minutes" },
                { value: timeLeft.seconds, label: "Seconds" },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="card-romantic p-4 md:p-6 rounded-xl animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-3xl md:text-5xl font-bold text-primary">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {message && (
              <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                {message}
              </p>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
}
