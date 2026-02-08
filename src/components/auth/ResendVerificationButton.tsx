import { Button } from "@/components/ui/button";
import { useResendVerification } from "@/hooks/useResendVerification";
import { Loader2, Mail, CheckCircle, AlertCircle } from "lucide-react";

interface ResendVerificationButtonProps {
  email: string;
}

export function ResendVerificationButton({ email }: ResendVerificationButtonProps) {
  const {
    resendVerification,
    cooldown,
    isLoading,
    error,
    success,
    isRateLimited,
    attemptsRemaining,
    canResend,
  } = useResendVerification(email);

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={resendVerification}
        disabled={!canResend}
        className="w-full h-10"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : cooldown > 0 ? (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Resend in {cooldown}s
          </>
        ) : isRateLimited ? (
          <>
            <AlertCircle className="mr-2 h-4 w-4" />
            Try again later
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Resend Verification Email
          </>
        )}
      </Button>

      {/* Status messages */}
      {success && (
        <p className="text-sm text-primary flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5" />
          Verification email sent! Check your inbox.
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}

      {!isRateLimited && !success && attemptsRemaining < 3 && attemptsRemaining > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {attemptsRemaining} resend{attemptsRemaining !== 1 ? "s" : ""} remaining
        </p>
      )}
    </div>
  );
}
