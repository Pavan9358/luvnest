/**
 * Maps raw Supabase auth errors to user-friendly messages
 */
export function getAuthErrorMessage(error: Error | unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  // Rate limit errors
  if (
    message.includes("rate") ||
    message.includes("too many") ||
    message.includes("exceeded") ||
    message.includes("limit")
  ) {
    return "Too many requests. Please wait a few minutes and try again.";
  }

  // Invalid credentials
  if (message.includes("invalid login") || message.includes("invalid credentials")) {
    return "Invalid email or password. Please check your credentials.";
  }

  // Email not confirmed
  if (message.includes("email not confirmed") || message.includes("not confirmed")) {
    return "Please verify your email before signing in. Check your inbox for the verification code.";
  }

  // User already exists
  if (message.includes("already registered") || message.includes("already exists")) {
    return "An account with this email already exists. Try signing in instead.";
  }

  // Invalid email
  if (message.includes("invalid email")) {
    return "Please enter a valid email address.";
  }

  // Weak password
  if (message.includes("password") && (message.includes("weak") || message.includes("short"))) {
    return "Password must be at least 6 characters long.";
  }

  // Network errors
  if (message.includes("network") || message.includes("fetch")) {
    return "Connection error. Please check your internet and try again.";
  }

  // Default fallback - don't expose raw error
  return "Something went wrong. Please try again.";
}
