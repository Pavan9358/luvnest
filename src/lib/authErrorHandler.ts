/**
 * Maps raw Supabase auth errors to user-friendly messages
 */
export function getAuthErrorMessage(error: Error | unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  // Check for specific error codes or messages
  if (message.includes("interaction_required") || message.includes("consent_required")) {
    return "Please log in again to continue.";
  }

  // Rate limit errors
  if (
    message.includes("rate") ||
    message.includes("too many") ||
    message.includes("exceeded") ||
    message.includes("limit") ||
    message.includes("429")
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
  if (message.includes("already registered") || message.includes("already exists") || message.includes("user_already_exists")) {
    return "An account with this email already exists. Try signing in instead.";
  }

  // Invalid email
  if (message.includes("invalid email") || message.includes("validation failed")) {
    return "Please enter a valid email address.";
  }

  // Weak password
  if (message.includes("password") && (message.includes("weak") || message.includes("short") || message.includes("min"))) {
    return "Password must be at least 6 characters long.";
  }

  // Network errors
  if (message.includes("network") || message.includes("fetch") || message.includes("load failed")) {
    return "Connection error. Please check your internet and try again.";
  }

  // Auth callback errors
  if (message.includes("auth_callback_failed")) {
    return "Authentication failed during callback. Please try again.";
  }

  // Default fallback - include technical details for debugging if it's "something went wrong"
  // formatting it to be slightly more user friendly but still useful
  return `Something went wrong: ${message.replace("authapierror: ", "")}`;
}
