import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { AIAssistantPanel } from "@/components/builder/AIAssistantPanel";
import type { SectionType } from "@/types/lovepage";

interface AIAssistButtonProps {
  sectionType: SectionType;
  currentContent?: string;
  onApplySuggestion: (suggestion: string) => void;
}

export function AIAssistButton({ sectionType, currentContent, onApplySuggestion }: AIAssistButtonProps) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPanel(true)}
        className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
      >
        <Bot className="h-4 w-4" />
        AI Assistant
      </Button>

      {showPanel && (
        <AIAssistantPanel
          sectionType={sectionType}
          currentContent={currentContent}
          onSuggestion={onApplySuggestion}
          onClose={() => setShowPanel(false)}
        />
      )}
    </>
  );
}
