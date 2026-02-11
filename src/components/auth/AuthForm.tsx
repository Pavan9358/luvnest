import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signIn, signUp, signInWithOtp, verifyOtp, signInWithGoogle } from "@/lib/auth";

import { HeartIcon } from "@/components/ui/HeartIcon";
import { Loader2, Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { getAuthErrorMessage } from "@/lib/authErrorHandler";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type AuthMode = "login" | "signup" | "verify-pending" | "verify-otp";

interface AuthFormProps {
  isAdmin?: boolean;
}

export function AuthForm({ isAdmin = false }: AuthFormProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // If not admin, force login mode (since signup is also manual)
  useEffect(() => {
    if (!isAdmin && mode === "signup") {
      setMode("login");
    }
  }, [isAdmin, mode]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Update mode when URL parameter changes
  useEffect(() => {
    const urlMode = searchParams.get("mode") === "signup" ? "signup" : "login";
    // Don't override verification modes
    if (mode !== "verify-pending" && mode !== "verify-otp") {
      setMode(urlMode);
    }

    // Check for errors in URL
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description") || searchParams.get("details"); // Fallback to details for backward compatibility

    if (error) {
      let title = "Authentication Error";
      let description = errorDescription || "An error occurred during authentication.";

      // Make error messages user-friendly
      if (error === "access_denied") {
        title = "Access Denied";
        description = "You denied the access request or your email is not verified.";
      } else if (error === "auth_callback_failed") {
        title = "Login Failed";
      }

      // Avoid showing toast immediately on strict mode double-effect, 
      // but simpler to just show it. 
      // To prevent persistent toasts on refresh, clean params? 
      // For now just show it.

      // Delay slightly to ensure UI is ready
      setTimeout(() => {
        toast({
          title,
          description: decodeURIComponent(description),
          variant: "destructive",
        });

        // Optional: Clean up URL
        // const newParams = new URLSearchParams(searchParams);
        // newParams.delete("error");
        // newParams.delete("error_description");
        // newParams.delete("details");
        // setSearchParams(newParams);
      }, 500);
    }
  }, [searchParams, mode, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        try {
          await signIn(email, password);
          toast({ title: "Welcome back! 💕", description: "Successfully signed in." });
          navigate(isAdmin ? "/admin" : "/dashboard");
        } catch (err: unknown) {
          const loginError = err as { message?: string };
          // If email is not confirmed, trigger OTP and switch to verification mode
          const msg = loginError?.message?.toLowerCase() || "";
          if (msg.includes("confirm") || msg.includes("verified")) {
            await signInWithOtp(email);
            setPendingEmail(email);
            setMode("verify-otp");
            toast({
              title: "Verification Required",
              description: "Please enter the code sent to your email to verify your account.",
            });
          } else {
            throw loginError;
          }
        }
      } else if (mode === "signup") {
        // Step 1: Create user with password
        await signUp(email, password, fullName);

        // Step 2: Trigger OTP for verification
        // This ensures the user gets a 6-digit code even if signUp sends a link
        await signInWithOtp(email);

        setPendingEmail(email);
        setMode("verify-otp");
        toast({
          title: "Account created! 💌",
          description: "We sent a verification code to your email.",
        });
      }
    } catch (error: unknown) {
      console.error("Signup/Login Error:", error);
      const friendlyMessage = getAuthErrorMessage(error);
      toast({
        title: "Error",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit code sent to your email.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(pendingEmail, otp);
      toast({ title: "Verified! 🎉", description: "Your email has been verified successfully." });
      navigate("/dashboard");
    } catch (error: unknown) {
      const friendlyMessage = getAuthErrorMessage(error);
      toast({
        title: "Verification Failed",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await signInWithOtp(pendingEmail);
      toast({
        title: "Code Resent 📨",
        description: "We sent a new verification code to your email.",
      });
    } catch (error: unknown) {
      const friendlyMessage = getAuthErrorMessage(error);
      toast({
        title: "Error",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Note: No need to navigate or toast here because OAuth redirects the page.
    } catch (error: unknown) {
      console.error("Google Sign-In Error:", error);
      const friendlyMessage = getAuthErrorMessage(error);
      toast({
        title: "Error",
        description: friendlyMessage,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Verify OTP View
  if (mode === "verify-otp") {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-6">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Enter Verification Code
          </h1>
          <p className="text-muted-foreground">
            We sent a 6-digit code to
          </p>
          <p className="text-foreground font-medium mt-1">{pendingEmail}</p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="submit"
            className="w-full h-12 btn-romantic text-white shadow-romantic"
            disabled={loading || otp.length !== 6}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>

          <div className="text-center space-y-4">
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-sm text-primary hover:underline font-medium"
              disabled={loading}
            >
              Resend Code
            </button>

            <div className="pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setMode("login");
                  setPendingEmail("");
                  setOtp("");
                }}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Legacy Verify-pending view (Fallback if needed, or just removed/redirected logic)
  if (mode === "verify-pending") {
    // We shouldn't reach here normally with the new flow, but keeping basic fallback or redirecting
    setMode("verify-otp");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-6">
          <HeartIcon size="xl" className="text-primary animate-heart-beat" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-3 w-3 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          {mode === "login" && "Welcome Back"}
          {mode === "signup" && "Create Account"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "login" && "Sign in to continue your love story"}
          {mode === "signup" && "Start creating beautiful memories"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isAdmin && (
          <>
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-12 bg-muted/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-muted/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-muted/50 border-border/50 focus:border-primary"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 btn-romantic text-white shadow-romantic group"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "login" && "Sign In"}
              {mode === "signup" && "Create Account"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </>
        )}
      </form>

      {isAdmin && (
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-4 text-xs uppercase text-muted-foreground tracking-wider">
              Or continue with
            </span>
          </div>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full h-12 border-2 hover:bg-secondary/50"
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="mt-8 text-center text-sm">
        {isAdmin && (
          <>
            {mode === "login" && (
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setSearchParams({ mode: "signup" })}
                  className="text-primary hover:underline font-semibold"
                >
                  Sign up free
                </button>
              </p>
            )}
            {mode === "signup" && (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setSearchParams({ mode: "login" })}
                  className="text-primary hover:underline font-semibold"
                >
                  Sign in
                </button>
              </p>
            )}
          </>
        )}
      </div>

      {/* Legal Links */}
      <div className="mt-6 text-center text-xs text-muted-foreground">
        <p>
          By continuing, you agree to our{" "}
          <Link to="/terms-and-conditions" className="text-primary hover:underline">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link to="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
