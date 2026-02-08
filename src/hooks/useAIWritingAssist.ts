import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AssistType = "quote" | "complete" | "improve" | "poem";

interface UseAIWritingAssistOptions {
  onSuccess?: (result: string) => void;
  onError?: (error: string) => void;
}

export function useAIWritingAssist(options: UseAIWritingAssistOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<AssistType | null>(null);

  const assist = useCallback(
    async (params: {
      type: AssistType;
      text?: string;
      context?: string;
      theme?: string;
    }) => {
      setLoading(true);
      setLoadingType(params.type);

      try {
        const { data, error } = await supabase.functions.invoke("ai-writing-assist", {
          body: params,
        });

        if (error) {
          throw error;
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        if (data?.result) {
          options.onSuccess?.(data.result);
          return data.result;
        }

        throw new Error("No result received");
      } catch (error) {
        const message = error instanceof Error ? error.message : "AI assistance failed";
        options.onError?.(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
        setLoadingType(null);
      }
    },
    [options]
  );

  const getQuotes = useCallback(
    (theme: string) => assist({ type: "quote", theme }),
    [assist]
  );

  const completeText = useCallback(
    (text: string, context?: string) => assist({ type: "complete", text, context }),
    [assist]
  );

  const improveText = useCallback(
    (text: string) => assist({ type: "improve", text }),
    [assist]
  );

  const generatePoem = useCallback(
    (theme: string) => assist({ type: "poem", theme }),
    [assist]
  );

  return {
    assist,
    getQuotes,
    completeText,
    improveText,
    generatePoem,
    loading,
    loadingType,
    isLoading: (type: AssistType) => loadingType === type,
  };
}
