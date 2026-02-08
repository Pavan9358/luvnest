import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CountdownSection } from "@/types/lovepage";
import { AIAssistButton } from "@/components/builder/AIAssistButton";

interface CountdownEditorProps {
  section: CountdownSection;
  onUpdate: (updates: Partial<CountdownSection["data"]>) => void;
}

export function CountdownEditor({ section, onUpdate }: CountdownEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${section.id}-title`}>Countdown Title</Label>
        <Input
          id={`${section.id}-title`}
          value={section.data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Counting Down To..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${section.id}-date`}>Target Date</Label>
        <Input
          id={`${section.id}-date`}
          type="datetime-local"
          value={section.data.targetDate}
          onChange={(e) => onUpdate({ targetDate: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Choose the special date you're counting down to
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${section.id}-message`}>Message</Label>
          <AIAssistButton
            sectionType="countdown"
            currentContent={section.data.message}
            onApplySuggestion={(suggestion) => onUpdate({ message: suggestion })}
          />
        </div>
        <Textarea
          id={`${section.id}-message`}
          value={section.data.message}
          onChange={(e) => onUpdate({ message: e.target.value })}
          placeholder="Something special awaits!"
          className="min-h-[60px]"
        />
        <p className="text-xs text-muted-foreground">
          This message will be shown alongside the countdown
        </p>
      </div>

      {/* Preview */}
      {section.data.targetDate && (
        <div className="p-4 bg-primary/5 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-2">Preview</p>
          <div className="grid grid-cols-4 gap-2">
            {["Days", "Hours", "Mins", "Secs"].map((unit) => (
              <div key={unit} className="bg-background rounded p-2">
                <div className="text-2xl font-display font-bold text-primary">
                  00
                </div>
                <div className="text-xs text-muted-foreground">{unit}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
