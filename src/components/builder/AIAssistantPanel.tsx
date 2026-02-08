import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Sparkles, 
  Send, 
  Loader2, 
  Heart, 
  Smile, 
  MessageCircleHeart,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SectionType } from "@/types/lovepage";

interface AIAssistantPanelProps {
  sectionType: SectionType;
  currentContent?: string;
  onSuggestion: (suggestion: string) => void;
  onClose: () => void;
}

const PERSONALITY_TRAITS = [
  { id: "romantic", label: "Romantic 💕", icon: Heart },
  { id: "funny", label: "Funny 😄", icon: Smile },
  { id: "cute", label: "Cute 🥰", icon: MessageCircleHeart },
];

const SECTION_CONTEXTS: Record<SectionType, { title: string; tips: string[] }> = {
  hero: {
    title: "Hero Section Helper",
    tips: [
      "I can suggest romantic headlines!",
      "Tell me about your love story for personalized suggestions",
      "Need help with the perfect greeting? Just ask!"
    ]
  },
  "love-letter": {
    title: "Love Letter Whisperer",
    tips: [
      "I'll help you pour your heart out ❤️",
      "Share your feelings, I'll make them poetic",
      "Want it funny or deeply romantic? You choose!"
    ]
  },
  timeline: {
    title: "Memory Keeper",
    tips: [
      "I can help describe your special moments",
      "Tell me about a date, I'll make it magical",
      "Need help with milestone descriptions?"
    ]
  },
  gallery: {
    title: "Caption Creator",
    tips: [
      "I'll write beautiful captions for your photos",
      "Describe the moment, get the perfect caption",
      "Funny, romantic, or cute - your choice!"
    ]
  },
  countdown: {
    title: "Excitement Builder",
    tips: [
      "I'll craft exciting countdown messages",
      "Tell me the occasion, I'll make it special",
      "Need a playful or romantic tone?"
    ]
  },
  surprise: {
    title: "Surprise Crafter",
    tips: [
      "Let's create the perfect hidden message!",
      "I love surprises - let me help you plan one",
      "Romantic reveal ideas? I've got plenty!"
    ]
  },
  "ai-story": {
    title: "Story Weaver",
    tips: [
      "I'll write your love story!",
      "Share details for a personalized tale",
      "Fairy tale or adventure - you decide!"
    ]
  },
  magazine: {
    title: "Magazine Editor",
    tips: [
      "I'll help create magazine-worthy content",
      "Headlines, stories, and captions - all covered!",
      "Let's make your love story cover-worthy"
    ]
  },
  "be-my-valentine": {
    title: "Valentine Cupid",
    tips: [
      "I'll help craft the perfect proposal!",
      "Need a romantic acceptance quote? Ask me!",
      "Let's make them say YES! 💕"
    ]
  }
};

export function AIAssistantPanel({ 
  sectionType, 
  currentContent, 
  onSuggestion, 
  onClose 
}: AIAssistantPanelProps) {
  const [userInput, setUserInput] = useState("");
  const [personality, setPersonality] = useState<string>("romantic");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: `Hey there, lovebird! 💕 I'm your AI cupid for the ${SECTION_CONTEXTS[sectionType]?.title || "Love Page"}. ${
        SECTION_CONTEXTS[sectionType]?.tips[0] || "How can I help make your page more magical?"
      }`
    }
  ]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setUserInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-love-assistant", {
        body: {
          sectionType,
          personality,
          userMessage,
          currentContent,
          conversationHistory: messages.slice(-6) // Keep last 3 exchanges
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.response) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
        
        // If there's a suggestion, offer to apply it
        if (data.suggestion) {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: `✨ Here's what I came up with:\n\n"${data.suggestion}"\n\nClick "Use This" to apply it!`
          }]);
        }
      }
    } catch (error) {
      console.error("AI Assistant error:", error);
      toast.error("Oops! My love circuits got tangled. Try again? 💕");
    } finally {
      setLoading(false);
    }
  };

  const extractLastSuggestion = () => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
    if (lastAssistantMessage) {
      const match = lastAssistantMessage.content.match(/"([^"]+)"/);
      if (match) {
        onSuggestion(match[1]);
        toast.success("Applied! 💕");
      }
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-[500px] z-50 shadow-xl border-primary/20 overflow-hidden flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="bg-gradient-romantic p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Love Assistant</h3>
            <p className="text-xs opacity-80">{SECTION_CONTEXTS[sectionType]?.title}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Personality Selector */}
      <div className="p-2 border-b bg-muted/30 flex gap-1 overflow-x-auto">
        {PERSONALITY_TRAITS.map((trait) => (
          <Badge
            key={trait.id}
            variant={personality === trait.id ? "default" : "outline"}
            className={`cursor-pointer text-xs whitespace-nowrap ${
              personality === trait.id ? "bg-primary" : ""
            }`}
            onClick={() => setPersonality(trait.id)}
          >
            {trait.label}
          </Badge>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] max-h-[280px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted rounded-bl-sm"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-2xl rounded-bl-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Thinking with love...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-background">
        <div className="flex gap-2">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask me anything about your love page..."
            className="min-h-[60px] text-sm resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            onClick={handleSend}
            disabled={loading || !userInput.trim()}
            className="flex-1 btn-romantic text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 mr-1" />
                Send
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={extractLastSuggestion}
            disabled={loading}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Use This
          </Button>
        </div>
      </div>
    </Card>
  );
}
