import { redirect } from "next/navigation"
import { profileService, usersService } from "@guavajobs/core"

import { ProfileForm } from "@/components/profile/profile-form"
import { getSession } from "@/lib/auth/get-session"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Profile",
}

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) {
    redirect("/sign-in?next=/profile")
  }

  await usersService.ensureUser(session)

  await profileService.getOrCreateForUser(session.id)
  const profile = await profileService.getByUserId(session.id)

  if (!profile) {
    redirect("/sign-in?next=/profile")
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="font-serif text-3xl text-foreground md:text-4xl">
          Build Your Profile
        </h1>
        <p className="mt-2 text-muted-foreground">
          Complete your profile for better AI-powered cover letters and job matching.
        </p>
      </header>
      <ProfileForm initialProfile={profile} />
    </div>
  )
}
