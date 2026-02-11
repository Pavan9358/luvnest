import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PremiumFeature {
  id: string;
  name: string;
  cost: number;
}

const PREMIUM_FEATURES: Record<string, PremiumFeature> = {
  "premium-theme": { id: "premium-theme", name: "Premium Theme", cost: 20 },
  "ai-story": { id: "ai-story", name: "AI Story Generation", cost: 5 },
  "ai-letter": { id: "ai-letter", name: "AI Love Letter", cost: 5 },
  "password-protection": { id: "password-protection", name: "Password Protection", cost: 10 },
  "custom-slug": { id: "custom-slug", name: "Custom URL Slug", cost: 15 },
  "pdf-export": { id: "pdf-export", name: "PDF Magazine Export", cost: 25 },
};

export function usePremiumFeatures() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setBalance(data?.balance || 0);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user, fetchBalance]);

  const canAfford = (featureId: string): boolean => {
    const feature = PREMIUM_FEATURES[featureId];
    if (!feature) return true; // Unknown features are free
    return balance >= feature.cost;
  };

  const getFeatureCost = (featureId: string): number => {
    return PREMIUM_FEATURES[featureId]?.cost || 0;
  };

  const purchaseFeature = async (featureId: string): Promise<boolean> => {
    if (!user) return false;

    const feature = PREMIUM_FEATURES[featureId];
    if (!feature) return true;

    if (!canAfford(featureId)) {
      return false;
    }

    try {
      // Use secure server-side function for credit deduction via admin-actions
      const { data, error } = await supabase.functions.invoke('admin-actions', {
        body: {
          action: 'deduct-credits',
          payload: {
            userId: user.id,
            amount: feature.cost,
            featureId: featureId // Pass featureId for potential logging
          }
        }
      });

      if (error) throw error;

      const result = data as { success: boolean; new_balance?: number; error?: string };

      if (!result.success) {
        console.error("Credit deduction failed:", result.error);
        return false;
      }

      // Update local balance with the value from server
      if (result.new_balance !== undefined) {
        setBalance(result.new_balance);
      } else {
        // Fallback: refetch balance
        await fetchBalance();
      }

      return true;
    } catch (error) {
      console.error("Error purchasing feature:", error);
      return false;
    }
  };

  return {
    balance,
    loading,
    canAfford,
    getFeatureCost,
    purchaseFeature,
    refreshBalance: fetchBalance,
    PREMIUM_FEATURES,
  };
}
