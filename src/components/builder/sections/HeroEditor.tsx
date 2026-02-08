import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { HeroSection } from "@/types/lovepage";
import { AIAssistButton } from "@/components/builder/AIAssistButton";

interface HeroEditorProps {
  section: HeroSection;
  onUpdate: (updates: Partial<HeroSection["data"]>) => void;
}

export function HeroEditor({ section, onUpdate }: HeroEditorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${section.id}-name1`}>Your Name</Label>
          <Input
            id={`${section.id}-name1`}
            value={section.data.partnerName1}
            onChange={(e) => onUpdate({ partnerName1: e.target.value })}
            placeholder="Enter your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${section.id}-name2`}>Partner's Name</Label>
          <Input
            id={`${section.id}-name2`}
            value={section.data.partnerName2}
            onChange={(e) => onUpdate({ partnerName2: e.target.value })}
            placeholder="Enter partner's name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${section.id}-headline`}>Headline</Label>
          <AIAssistButton
            sectionType="hero"
            currentContent={section.data.headline}
            onApplySuggestion={(suggestion) => onUpdate({ headline: suggestion })}
          />
        </div>
        <Input
          id={`${section.id}-headline`}
          value={section.data.headline}
          onChange={(e) => onUpdate({ headline: e.target.value })}
          placeholder="Will you be my Valentine?"
        />
      </div>

      <div className="space-y-2">
        <Label>Cover Image</Label>
        <ImageUpload
          value={section.data.coverImageUrl}
          onChange={(url) => onUpdate({ coverImageUrl: url })}
          aspectRatio="video"
        />
      </div>
    </div>
  );
}
