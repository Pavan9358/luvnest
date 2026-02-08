import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PlanLimits {
  planType: string;
  templatesUsed: number;
  maxTemplates: number;
  remaining: number;
  canCreate: boolean;
}

interface EditLimits {
  editCount: number;
  maxEdits: number;
  remaining: number;
  canEdit: boolean;
}

interface PlanLimitsResult {
  planLimits: PlanLimits | null;
  loading: boolean;
  checkCanCreate: () => Promise<{ allowed: boolean; error?: string }>;
  checkCanEdit: (pageId: string) => Promise<{ allowed: boolean; error?: string; editCount?: number }>;
  incrementTemplateCount: () => Promise<boolean>;
  incrementEditCount: (pageId: string) => Promise<boolean>;
  refreshLimits: () => Promise<void>;
}

export function usePlanLimits(): PlanLimitsResult {
  const { user } = useAuth();
  const [planLimits, setPlanLimits] = useState<PlanLimits | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlanLimits = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc("can_create_template", {
        p_user_id: user.id,
      });

      if (error) throw error;

      const result = data as {
        allowed: boolean;
        templates_used?: number;
        max_templates?: number;
        remaining?: number;
        plan_type?: string;
        error?: string;
      };

      setPlanLimits({
        planType: result.plan_type || "free",
        templatesUsed: result.templates_used || 0,
        maxTemplates: result.max_templates || 0,
        remaining: result.remaining || 0,
        canCreate: result.allowed,
      });
    } catch (error) {
      console.error("Error fetching plan limits:", error);
      // Default to blocked state on error for safety
      setPlanLimits({
        planType: "free",
        templatesUsed: 0,
        maxTemplates: 0,
        remaining: 0,
        canCreate: false,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPlanLimits();
  }, [fetchPlanLimits]);

  const checkCanCreate = useCallback(async (): Promise<{ allowed: boolean; error?: string }> => {
    if (!user) return { allowed: false, error: "Not authenticated" };

    try {
      const { data, error } = await supabase.rpc("can_create_template", {
        p_user_id: user.id,
      });

      if (error) throw error;

      const result = data as { allowed: boolean; error?: string };
      return { allowed: result.allowed, error: result.error };
    } catch (error) {
      console.error("Error checking create permission:", error);
      return { allowed: false, error: "Failed to check permissions" };
    }
  }, [user]);

  const checkCanEdit = useCallback(async (pageId: string): Promise<{ allowed: boolean; error?: string; editCount?: number }> => {
    if (!user) return { allowed: false, error: "Not authenticated" };

    try {
      const { data, error } = await supabase.rpc("can_edit_template", {
        p_user_id: user.id,
        p_page_id: pageId,
      });

      if (error) throw error;

      const result = data as { allowed: boolean; error?: string; edit_count?: number };
      return { 
        allowed: result.allowed, 
        error: result.error,
        editCount: result.edit_count 
      };
    } catch (error) {
      console.error("Error checking edit permission:", error);
      return { allowed: false, error: "Failed to check permissions" };
    }
  }, [user]);

  const incrementTemplateCount = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc("increment_template_count", {
        p_user_id: user.id,
      });

      if (error) throw error;

      const result = data as { success?: boolean; allowed?: boolean; error?: string };
      
      if (result.success) {
        await fetchPlanLimits(); // Refresh limits after increment
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error incrementing template count:", error);
      return false;
    }
  }, [user, fetchPlanLimits]);

  const incrementEditCount = useCallback(async (pageId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc("increment_edit_count", {
        p_user_id: user.id,
        p_page_id: pageId,
      });

      if (error) throw error;

      const result = data as { success?: boolean; allowed?: boolean; error?: string };
      return result.success || false;
    } catch (error) {
      console.error("Error incrementing edit count:", error);
      return false;
    }
  }, [user]);

  return {
    planLimits,
    loading,
    checkCanCreate,
    checkCanEdit,
    incrementTemplateCount,
    incrementEditCount,
    refreshLimits: fetchPlanLimits,
  };
}
