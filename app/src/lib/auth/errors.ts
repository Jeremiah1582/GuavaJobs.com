/** Map Supabase auth errors to user-friendly messages. */
export function mapAuthError(message: string): string {
  const normalized = message.toLowerCase()

  if (normalized.includes("invalid login credentials")) {
    return "Incorrect email or password."
  }
  if (normalized.includes("user already registered")) {
    return "An account with this email already exists."
  }
  if (normalized.includes("password should be at least")) {
    return "Password must be at least 6 characters."
  }
  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email before signing in."
  }
  if (normalized.includes("rate limit")) {
    return "Too many attempts. Please try again later."
  }

  return message
}
