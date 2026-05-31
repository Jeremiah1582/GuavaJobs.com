"use server"

import {
  isSupabaseConfigured,
  createSupabaseAdmin,
  usersService,
} from "@guavajobs/core"
import { redirect } from "next/navigation"

import { getSession } from "@/lib/auth/get-session"
import { resolveNextParam } from "@/lib/auth/routes"
import { appUrl, landingUrl } from "@/lib/env"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export type AuthActionState = {
  error?: string
  success?: string
} | null

function friendlySignInError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Incorrect email or password."
  }
  if (message.includes("Email not confirmed")) {
    return "Please confirm your email before signing in."
  }
  return message
}

function friendlySignUpError(message: string): string {
  if (message.includes("User already registered")) {
    return "An account with this email already exists."
  }
  if (message.includes("Password should be at least")) {
    return "Password must be at least 6 characters."
  }
  return message
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const next = resolveNextParam(
    String(formData.get("next") ?? "") || null,
  )

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: friendlySignInError(error.message) }
  }

  if (data.user?.email) {
    try {
      await usersService.ensureUser({ id: data.user.id, email: data.user.email })
    } catch {
      // DB sync failure should not block auth.
    }
  }

  redirect(next)
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")
  const next = resolveNextParam(
    String(formData.get("next") ?? "") || null,
  )

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." }
  }

  const supabase = await createServerSupabaseClient()
  const emailRedirectTo = `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  })

  if (error) {
    return { error: friendlySignUpError(error.message) }
  }

  if (data.session && data.user?.email) {
    try {
      await usersService.ensureUser({ id: data.user.id, email: data.user.email })
    } catch {
      // DB sync failure should not block auth.
    }
    redirect(next)
  }

  const params = new URLSearchParams({
    email,
    next,
  })
  redirect(`/sign-up/confirm-email?${params.toString()}`)
}

export async function resendConfirmationAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim()
  const next = resolveNextParam(
    String(formData.get("next") ?? "") || null,
  )

  if (!email) {
    return { error: "Email is required." }
  }

  const supabase = await createServerSupabaseClient()
  const emailRedirectTo = `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: "Confirmation email sent. Check your inbox." }
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function deleteAccountAction(
  confirmEmail: string,
): Promise<{ error?: string }> {
  const session = await getSession()
  if (!session) {
    return { error: "Not authenticated" }
  }

  if (confirmEmail.trim().toLowerCase() !== session.email.toLowerCase()) {
    return { error: "Email confirmation does not match your account." }
  }

  try {
    await usersService.deleteUser(session.id)

    if (isSupabaseConfigured()) {
      const admin = createSupabaseAdmin()
      const { error } = await admin.auth.admin.deleteUser(session.id)
      if (error) {
        return { error: error.message }
      }
    }

    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete account"
    return { error: message }
  }

  redirect(landingUrl)
}
