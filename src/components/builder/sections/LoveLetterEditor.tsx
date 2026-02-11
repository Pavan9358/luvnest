import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Sparkles, Loader2, ChevronDown, Music, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { LoveLetterSection } from "@/types/lovepage";
import { AIAssistButton } from "@/components/builder/AIAssistButton";

interface LoveLetterEditorProps {
  section: LoveLetterSection;
  onUpdate: (updates: Partial<LoveLetterSection["data"]>) => void;
}

const TONES = [
  { value: "poetic", label: "Poetic", description: "Lyrical and metaphorical" },
  { value: "heartfelt", label: "Heartfelt", description: "Genuine and emotional" },
  { value: "playful", label: "Playful", description: "Light and joyful" },
];

export function LoveLetterEditor({ section, onUpdate }: LoveLetterEditorProps) {
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [memories, setMemories] = useState("");
  const [feelings, setFeelings] = useState("");
  const [tone, setTone] = useState<"poetic" | "heartfelt" | "playful">("heartfelt");

  const handleGenerateLetter = async () => {
    if (!memories && !feelings) {
      toast.error("Please share some memories or feelings first");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-love-letter", {
        body: { memories, feelings, tone },
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.letter) {
        onUpdate({ content: data.letter });
        toast.success("Your love letter has been created! 💕");
        setAiPanelOpen(false);
      }
    } catch (error) {
      console.error("Error generating letter:", error);
      toast.error("Failed to generate letter. Please try again.");
    } finally {
      setGenerating(false);
    }
  };


  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${section.id}-title`}>Letter Title</Label>
        <Input
          id={`${section.id}-title`}
          value={section.data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="A Letter From My Heart"
        />
      </div>

      {/* AI Generation Panel */}
      <Collapsible open={aiPanelOpen} onOpenChange={setAiPanelOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Letter Generator
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${aiPanelOpen ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3 p-4 rounded-lg border bg-muted/30">
          <div className="space-y-2">
            <Label>Special Memories</Label>
            <Textarea
              value={memories}
              onChange={(e) => setMemories(e.target.value)}
              placeholder="Our first date at the coffee shop, the way you laugh at my jokes..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Feelings to Express</Label>
            <Textarea
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
              placeholder="How grateful I am, how you make me feel safe, how much I love your smile..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v: typeof tone) => setTone(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <span className="font-medium">{t.label}</span>
                    <span className="text-muted-foreground ml-2 text-sm">- {t.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleGenerateLetter}
            disabled={generating || (!memories && !feelings)}
            className="w-full btn-romantic text-white"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Writing Your Letter...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Love Letter
              </>
            )}
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Main Letter Editor */}
      <div className="space-y-2">
        <Label htmlFor={`${section.id}-content`}>Your Love Letter</Label>
        <Textarea
          id={`${section.id}-content`}
          value={section.data.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Pour your heart out here... Write everything you want your partner to know."
          className="min-h-[200px] resize-y"
        />
      </div>

      {/* AI Assistant */}
      <div className="flex flex-wrap gap-2">
        <AIAssistButton
          sectionType="love-letter"
          currentContent={section.data.content}
          onApplySuggestion={(suggestion) => onUpdate({ content: suggestion })}
        />
      </div>


      {/* Background Audio URL */}
      <div className="space-y-2 pt-4 border-t">
        <Label htmlFor={`${section.id}-audio`} className="flex items-center gap-2">
          <Music className="h-4 w-4 text-primary" />
          Background Music (Optional)
        </Label>
        <Input
          id={`${section.id}-audio`}
          value={section.data.backgroundAudioUrl || ""}
          onChange={(e) => onUpdate({ backgroundAudioUrl: e.target.value })}
          placeholder="Paste Spotify, YouTube, or audio link..."
          className="text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Add a romantic song that plays while reading your letter 🎵
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: Be genuine and speak from the heart. Use AI assistance to enhance your words, not replace them.
      </p>
    </div>
  );
}
