import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, PartyPopper, Sparkles } from "lucide-react";
import type { SurpriseSection } from "@/types/lovepage";
import { AIAssistButton } from "@/components/builder/AIAssistButton";

interface SurpriseEditorProps {
  section: SurpriseSection;
  onUpdate: (updates: Partial<SurpriseSection["data"]>) => void;
}

const ANIMATION_OPTIONS = [
  { value: "hearts", label: "Floating Hearts", icon: Heart },
  { value: "confetti", label: "Confetti Burst", icon: PartyPopper },
  { value: "sparkle", label: "Sparkle Effect", icon: Sparkles },
];

export function SurpriseEditor({ section, onUpdate }: SurpriseEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${section.id}-title`}>Reveal Button Text</Label>
        <Input
          id={`${section.id}-title`}
          value={section.data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="A Little Surprise"
        />
        <p className="text-xs text-muted-foreground">
          This text appears on the button your partner clicks to reveal the surprise
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${section.id}-message`}>Hidden Message</Label>
          <AIAssistButton
            sectionType="surprise"
            currentContent={section.data.hiddenMessage}
            onApplySuggestion={(suggestion) => onUpdate({ hiddenMessage: suggestion })}
          />
        </div>
        <Textarea
          id={`${section.id}-message`}
          value={section.data.hiddenMessage}
          onChange={(e) => onUpdate({ hiddenMessage: e.target.value })}
          placeholder="Write the surprise message that will be revealed..."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Reveal Animation</Label>
        <Select
          value={section.data.revealAnimation}
          onValueChange={(value: "hearts" | "confetti" | "sparkle") =>
            onUpdate({ revealAnimation: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ANIMATION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <option.icon className="h-4 w-4" />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Preview */}
      <div className="p-4 bg-primary/5 rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-3">Preview</p>
        <button className="px-6 py-3 bg-gradient-romantic text-white rounded-full font-medium shadow-romantic hover:shadow-romantic-hover transition-all">
          {section.data.title || "Click to Reveal"} ✨
        </button>
      </div>
    </div>
  );
}
