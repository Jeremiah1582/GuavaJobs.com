import { redirect } from "next/navigation"
import { profileService, usersService } from "@guavajobs/core"

import { PageHeader } from "@/components/page-header"
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
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <PageHeader
        title="Profile"
        description="Build your profile for better AI cover letters and future job matching."
      />
      <ProfileForm initialProfile={profile} />
    </div>
  )
}
