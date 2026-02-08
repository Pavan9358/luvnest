import type { TimelineSection } from "@/types/lovepage";
import { Clock, Heart } from "lucide-react";
import { BackgroundAudioPlayer } from "./BackgroundAudioPlayer";

interface TimelineViewerProps {
  section: TimelineSection;
}

export function TimelineViewer({ section }: TimelineViewerProps) {
  const { title, events, backgroundAudioUrl } = section.data;

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-muted/30 relative">
      {/* Background Audio */}
      {backgroundAudioUrl && <BackgroundAudioPlayer url={backgroundAudioUrl} />}
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            {title || "Our Journey Together"}
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary transform md:-translate-x-1/2" />

          {/* Events */}
          <div className="space-y-8">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`relative flex items-start gap-4 md:gap-8 animate-fade-in-up ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary transform -translate-x-1/2 z-10 shadow-glow">
                  <Heart className="w-3 h-3 text-primary-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Content */}
                <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:text-right md:pr-8" : "md:pl-8"}`}>
                  <div className="card-romantic p-6 rounded-xl">
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <time className="text-sm text-primary font-medium">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <h3 className="text-lg font-display font-semibold mt-1 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
