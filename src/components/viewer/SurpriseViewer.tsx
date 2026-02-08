import { useState } from "react";
import type { SurpriseSection } from "@/types/lovepage";
import { RevealAnimation } from "@/components/effects/RevealAnimation";
import { Gift } from "lucide-react";

interface SurpriseViewerProps {
  section: SurpriseSection;
}

export function SurpriseViewer({ section }: SurpriseViewerProps) {
  const { title, hiddenMessage, revealAnimation } = section.data;
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            {title || "A Little Surprise"}
          </h2>
        </div>

        <RevealAnimation
          type={revealAnimation || "hearts"}
          isRevealed={isRevealed}
          onReveal={() => setIsRevealed(true)}
        >
          <div className="card-romantic p-8 md:p-12 rounded-xl text-center">
            <p 
              className="text-xl md:text-2xl font-display leading-relaxed"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {hiddenMessage || "Your surprise message..."}
            </p>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
}
