import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { AIStorySection } from "@/types/lovepage";

interface AIStoryEditorProps {
  section: AIStorySection;
  onUpdate: (updates: Partial<AIStorySection["data"]>) => void;
}

const STORY_STYLES = [
  { value: "fairy-tale", label: "Fairy Tale", description: "Once upon a time..." },
  { value: "adventure", label: "Adventure", description: "An epic journey of love" },
  { value: "classic-romance", label: "Classic Romance", description: "Timeless and elegant" },
];

export function AIStoryEditor({ section, onUpdate }: AIStoryEditorProps) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!section.data.promptDetails) {
      toast.error("Please share some details about your love story first");
      return;
    }
    
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-love-story", {
        body: {
          promptDetails: section.data.promptDetails,
          storyStyle: section.data.storyStyle,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.story) {
        onUpdate({ generatedContent: data.story });
        toast.success("Your love story has been created! ✨");
      }
    } catch (error) {
      console.error("Error generating story:", error);
      toast.error("Failed to generate story. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${section.id}-title`}>Story Title</Label>
        <Input
          id={`${section.id}-title`}
          value={section.data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Our Fairy Tale"
        />
      </div>

      <div className="space-y-2">
        <Label>Story Style</Label>
        <Select
          value={section.data.storyStyle}
          onValueChange={(value: "fairy-tale" | "adventure" | "classic-romance") =>
            onUpdate({ storyStyle: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STORY_STYLES.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                <div>
                  <span className="font-medium">{style.label}</span>
                  <span className="text-muted-foreground ml-2 text-sm">
                    - {style.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${section.id}-prompt`}>
          Tell us about your love story
        </Label>
        <Textarea
          id={`${section.id}-prompt`}
          value={section.data.promptDetails || ""}
          onChange={(e) => onUpdate({ promptDetails: e.target.value })}
          placeholder="Share details like: How you met, your names, favorite memories, inside jokes, what makes your relationship special..."
          className="min-h-[120px]"
        />
        <p className="text-xs text-muted-foreground">
          The more details you provide, the more personalized your story will be!
        </p>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!section.data.promptDetails || generating}
        className="w-full btn-romantic text-white"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating Your Story...
          </>
        ) : section.data.generatedContent ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate Story
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate AI Story
          </>
        )}
      </Button>

      {section.data.generatedContent && (
        <div className="space-y-2">
          <Label>Generated Story</Label>
          <Textarea
            value={section.data.generatedContent}
            onChange={(e) => onUpdate({ generatedContent: e.target.value })}
            className="min-h-[200px]"
            placeholder="Your AI-generated story will appear here..."
          />
          <p className="text-xs text-muted-foreground">
            You can edit the generated story to make it perfect!
          </p>
        </div>
      )}
    </div>
  );
}
