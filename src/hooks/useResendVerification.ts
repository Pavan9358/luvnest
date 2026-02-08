import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

interface ResendState {
  attempts: number;
  lastAttemptTime: number;
  windowStart: number;
}

const STORAGE_KEY = "resend_verification_state";

function getStoredState(): ResendState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored) as ResendState;
      // Reset if window has expired
      if (Date.now() - state.windowStart > RATE_LIMIT_WINDOW_MS) {
        return { attempts: 0, lastAttemptTime: 0, windowStart: Date.now() };
      }
      return state;
    }
  } catch {
    // Ignore parse errors
  }
  return { attempts: 0, lastAttemptTime: 0, windowStart: Date.now() };
}

function saveState(state: ResendState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useResendVerification(email: string) {
  const [cooldown, setCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Check initial state
  useEffect(() => {
    const state = getStoredState();
    
    // Check if rate limited
    if (state.attempts >= MAX_ATTEMPTS) {
      setIsRateLimited(true);
      return;
    }

    // Check if still in cooldown
    const elapsed = Math.floor((Date.now() - state.lastAttemptTime) / 1000);
    if (elapsed < COOLDOWN_SECONDS && state.lastAttemptTime > 0) {
      setCooldown(COOLDOWN_SECONDS - elapsed);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const resendVerification = useCallback(async () => {
    if (!email || cooldown > 0 || isLoading) return;

    const state = getStoredState();

    // Check rate limit
    if (state.attempts >= MAX_ATTEMPTS) {
      setIsRateLimited(true);
      setError("Too many attempts. Please try again later.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (resendError) {
        // Handle rate limit errors from Supabase
        if (
          resendError.message.toLowerCase().includes("rate") ||
          resendError.message.toLowerCase().includes("too many") ||
          resendError.message.toLowerCase().includes("exceeded")
        ) {
          setError("Too many verification requests. Please wait a few minutes and try again.");
          setIsRateLimited(true);
        } else {
          setError(resendError.message);
        }
        return;
      }

      // Update state on success
      const newState: ResendState = {
        attempts: state.attempts + 1,
        lastAttemptTime: Date.now(),
        windowStart: state.windowStart,
      };
      saveState(newState);

      setCooldown(COOLDOWN_SECONDS);
      setSuccess(true);

      if (newState.attempts >= MAX_ATTEMPTS) {
        setIsRateLimited(true);
      }
    } catch (err) {
      setError("Failed to resend verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [email, cooldown, isLoading]);

  const attemptsRemaining = Math.max(0, MAX_ATTEMPTS - getStoredState().attempts);

  return {
    resendVerification,
    cooldown,
    isLoading,
    error,
    success,
    isRateLimited,
    attemptsRemaining,
    canResend: cooldown === 0 && !isLoading && !isRateLimited && !!email,
  };
}
