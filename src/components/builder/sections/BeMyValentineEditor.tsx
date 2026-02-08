import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BeMyValentineSection } from "@/types/lovepage";

interface BeMyValentineEditorProps {
  section: BeMyValentineSection;
  onUpdate: (updates: Partial<BeMyValentineSection["data"]>) => void;
}

export function BeMyValentineEditor({ section, onUpdate }: BeMyValentineEditorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          value={section.data.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Will you be my Valentine?"
        />
        <p className="text-xs text-muted-foreground">
          The romantic question to ask your special someone
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="acceptanceQuote">Acceptance Quote</Label>
        <Textarea
          id="acceptanceQuote"
          value={section.data.acceptanceQuote}
          onChange={(e) => onUpdate({ acceptanceQuote: e.target.value })}
          placeholder="Yes! A thousand times yes! You've made my heart complete..."
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          The romantic message shown when they say YES 💖
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="yesButtonText">Yes Button Text</Label>
        <Input
          id="yesButtonText"
          value={section.data.yesButtonText}
          onChange={(e) => onUpdate({ yesButtonText: e.target.value })}
          placeholder="Yes 💖"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="noButtonText">No Button Text</Label>
        <Input
          id="noButtonText"
          value={section.data.noButtonText}
          onChange={(e) => onUpdate({ noButtonText: e.target.value })}
          placeholder="No 😶"
        />
        <p className="text-xs text-muted-foreground">
          Don't worry — the No button runs away! 😄
        </p>
      </div>
    </div>
  );
}
