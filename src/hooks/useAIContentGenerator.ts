import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GenerateStoryParams {
  promptDetails: string;
  storyStyle: "fairy-tale" | "adventure" | "classic-romance";
  partnerName1?: string;
  partnerName2?: string;
}

interface GenerateLetterParams {
  memories: string;
  feelings: string;
  tone: "poetic" | "heartfelt" | "playful";
  recipientName?: string;
  senderName?: string;
}

export function useAIContentGenerator() {
  const [generatingStory, setGeneratingStory] = useState(false);
  const [generatingLetter, setGeneratingLetter] = useState(false);

  const generateStory = useCallback(async (params: GenerateStoryParams) => {
    if (!params.promptDetails) {
      toast.error("Please share some details about your love story first");
      return null;
    }

    setGeneratingStory(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-love-story", {
        body: params,
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return null;
      }

      if (data?.story) {
        toast.success("Your love story has been created! ✨");
        return data.story;
      }

      throw new Error("No story received");
    } catch (error) {
      console.error("Error generating story:", error);
      toast.error("Failed to generate story. Please try again.");
      return null;
    } finally {
      setGeneratingStory(false);
    }
  }, []);

  const generateLetter = useCallback(async (params: GenerateLetterParams) => {
    if (!params.memories && !params.feelings) {
      toast.error("Please share some memories or feelings first");
      return null;
    }

    setGeneratingLetter(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-love-letter", {
        body: params,
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return null;
      }

      if (data?.letter) {
        toast.success("Your love letter has been created! 💕");
        return data.letter;
      }

      throw new Error("No letter received");
    } catch (error) {
      console.error("Error generating letter:", error);
      toast.error("Failed to generate letter. Please try again.");
      return null;
    } finally {
      setGeneratingLetter(false);
    }
  }, []);

  return {
    generateStory,
    generateLetter,
    generatingStory,
    generatingLetter,
    isGenerating: generatingStory || generatingLetter,
  };
}
