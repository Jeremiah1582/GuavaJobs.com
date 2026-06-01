"use client"

import { useActionState, useEffect, useState } from "react"
import { AlertCircle, Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { CvPasteHelper } from "@/components/profile/cv-paste-helper"
import { ExperienceSection } from "@/components/profile/experience-section"
import { ProfilePicture } from "@/components/profile/profile-picture"
import { ProgressRing } from "@/components/profile/progress-ring"
import { QuizSection } from "@/components/profile/quiz-section"
import { UrlImport } from "@/components/profile/url-import"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  updateProfileAction,
  uploadCvAction,
  type ProfileActionState,
} from "@/lib/profile/actions"
import type {
  EducationEntry,
  ExperienceEntry,
  ProfileDto,
  ProfileQuiz,
} from "@guavajobs/core"

type ProfileFormProps = {
  initialProfile: ProfileDto
}

function parseExperience(value: unknown): ExperienceEntry[] {
  if (!Array.isArray(value)) return []
  return value as ExperienceEntry[]
}

function parseEducation(value: unknown): EducationEntry[] {
  if (!Array.isArray(value)) return []
  return value as EducationEntry[]
}

function parseQuiz(value: unknown): ProfileQuiz {
  if (!value || typeof value !== "object") return {}
  return value as ProfileQuiz
}

const emptyEducation = (): EducationEntry => ({
  institution: "",
})

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [profilePicture, setProfilePicture] = useState<string | null>(
    initialProfile.avatarUrl ?? null
  )
  const [summary, setSummary] = useState(initialProfile.summary ?? "")
  const [skillsText, setSkillsText] = useState(initialProfile.skills.join(", "))
  const [experience, setExperience] = useState<ExperienceEntry[]>(
    parseExperience(initialProfile.experienceJson)
  )
  const [education, setEducation] = useState<EducationEntry[]>(
    parseEducation(initialProfile.educationJson)
  )
  const [quiz, setQuiz] = useState<ProfileQuiz>(
    parseQuiz(initialProfile.quizJson)
  )

  // Calculate completeness dynamically
  const calculateCompleteness = () => {
    let filled = 0
    const total = 5
    if (summary.trim()) filled++
    if (skillsText.trim()) filled++
    if (experience.length > 0) filled++
    if (education.length > 0) filled++
    if (quiz && Object.keys(quiz).length > 0) filled++
    return Math.round((filled / total) * 100)
  }

  const completenessPercent = calculateCompleteness()

  const [saveState, saveAction, isSaving] = useActionState<
    ProfileActionState,
    FormData
  >(updateProfileAction, null)

  const [uploadState, uploadAction, isUploading] = useActionState<
    ProfileActionState,
    FormData
  >(uploadCvAction, null)

  useEffect(() => {
    if (saveState?.success) {
      toast.success("Profile saved")
    }
    if (saveState?.error) {
      toast.error(saveState.error)
    }
  }, [saveState])

  useEffect(() => {
    if (uploadState?.success) {
      toast.success("CV uploaded")
    }
    if (uploadState?.error) {
      toast.error(uploadState.error)
    }
  }, [uploadState])

  function handleCvPaste(data: {
    experience: ExperienceEntry[]
    education: EducationEntry[]
    skills: string[]
  }) {
    if (data.experience.length) {
      setExperience((prev) => [...prev, ...data.experience])
    }
    if (data.education.length) {
      setEducation((prev) => [...prev, ...data.education])
    }
    if (data.skills.length) {
      setSkillsText((prev) => {
        const existing = prev
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
        const merged = [...new Set([...existing, ...data.skills])]
        return merged.join(", ")
      })
    }
    toast.message("CV text applied — review entries and save.")
  }

  function handleUrlImport(data: {
    name?: string | null
    summary?: string | null
    location?: string | null
    skills?: string[]
    experience?: ExperienceEntry[]
    education?: EducationEntry[]
  }) {
    if (data.summary && !summary.trim()) {
      setSummary(data.summary)
    }
    if (data.skills?.length) {
      setSkillsText((prev) => {
        const existing = prev
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
        const merged = [...new Set([...existing, ...data.skills])]
        return merged.join(", ")
      })
    }
    if (data.experience?.length) {
      setExperience((prev) => [...prev, ...data.experience])
    }
    if (data.education?.length) {
      setEducation((prev) => [...prev, ...data.education])
    }
    toast.success("Profile data imported — review and save your changes.")
  }

  return (
    <div className="space-y-10">
      {/* Hero Section with Progress Ring and Avatar */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-guava-pink-light/50 via-muted/30 to-guava-green-light/30 p-6 md:p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
          {/* Profile Picture */}
          <ProfilePicture
            imageUrl={profilePicture}
            onImageChange={setProfilePicture}
          />

          {/* Progress Ring and Info */}
          <div className="flex flex-1 flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <h2 className="font-serif text-2xl text-foreground">
                Your Profile
              </h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                A complete profile helps our AI write better cover letters
                tailored to your experience.
              </p>
              {completenessPercent < 80 && (
                <p className="mt-3 text-sm text-accent">
                  Complete more sections to improve AI accuracy
                </p>
              )}
            </div>
            <ProgressRing percent={completenessPercent} className="shrink-0" />
          </div>
        </div>
      </section>

      {/* Quick Import Section */}
      <section className="space-y-4">
        <UrlImport onImport={handleUrlImport} />
        <CvPasteHelper onApply={handleCvPaste} />
      </section>

      {/* Main Form */}
      <form action={saveAction} className="space-y-10">
        <input
          type="hidden"
          name="experienceJson"
          value={JSON.stringify(experience)}
        />
        <input
          type="hidden"
          name="educationJson"
          value={JSON.stringify(education)}
        />
        <input type="hidden" name="quizJson" value={JSON.stringify(quiz)} />
        <input type="hidden" name="skills" value={skillsText} />
        <input type="hidden" name="avatarUrl" value={profilePicture ?? ""} />

        {saveState?.error ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{saveState.error}</AlertDescription>
          </Alert>
        ) : null}

        {/* Professional Summary Section */}
        <section className="space-y-4 rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-guava-pink-gradient text-xs font-semibold text-accent-foreground">
              1
            </div>
            <h2 className="font-serif text-xl text-foreground">
              Professional Summary
            </h2>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary" className="sr-only">
              Professional summary
            </Label>
            <textarea
              id="summary"
              name="summary"
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={5000}
              placeholder="A short overview of your background and goals..."
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-[120px] w-full rounded-lg border px-4 py-3 text-sm shadow-xs outline-none transition-all duration-300 focus-visible:ring-[3px]"
            />
          </div>
        </section>

        {/* Experience Section */}
        <section className="space-y-4 rounded-xl border border-border/50 bg-gradient-to-br from-card to-guava-green-light/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-guava-green-gradient text-xs font-semibold text-white">
              2
            </div>
            <h2 className="font-serif text-xl text-foreground">Experience</h2>
          </div>
          <ExperienceSection entries={experience} onChange={setExperience} />
        </section>

        {/* Skills Section */}
        <section className="space-y-4 rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-guava-pink-gradient text-xs font-semibold text-accent-foreground">
              3
            </div>
            <h2 className="font-serif text-xl text-foreground">Skills</h2>
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills" className="text-sm text-muted-foreground">
              Separate skills with commas
            </Label>
            <Input
              id="skills"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="TypeScript, React, project management..."
              className="transition-all duration-300"
            />
          </div>
        </section>

        {/* Education Section */}
        <section className="space-y-4 rounded-xl border border-border/50 bg-gradient-to-br from-card to-guava-green-light/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-guava-green-gradient text-xs font-semibold text-white">
                4
              </div>
              <h2 className="font-serif text-xl text-foreground">Education</h2>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEducation([...education, emptyEducation()])}
              className="transition-all duration-300 hover:border-accent"
            >
              <Plus className="size-4" />
              Add
            </Button>
          </div>
          {education.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No education added yet. Click {"\"Add\""} to include your
              qualifications.
            </p>
          ) : (
            <div className="space-y-4">
              {education.map((entry, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-lg border bg-background/50 p-4 transition-all duration-300 sm:grid-cols-2"
                >
                  <div className="flex justify-end sm:col-span-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setEducation(education.filter((_, i) => i !== index))
                      }
                      className="size-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Institution</Label>
                    <Input
                      value={entry.institution}
                      onChange={(e) => {
                        const next = [...education]
                        next[index] = { ...entry, institution: e.target.value }
                        setEducation(next)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input
                      value={entry.degree ?? ""}
                      onChange={(e) => {
                        const next = [...education]
                        next[index] = { ...entry, degree: e.target.value }
                        setEducation(next)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dates</Label>
                    <Input
                      value={entry.endDate ?? entry.startDate ?? ""}
                      placeholder="e.g. 2018 - 2022"
                      onChange={(e) => {
                        const next = [...education]
                        next[index] = { ...entry, endDate: e.target.value }
                        setEducation(next)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quiz Section */}
        <section className="space-y-4 rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-guava-pink-gradient text-xs font-semibold text-accent-foreground">
              5
            </div>
            <h2 className="font-serif text-xl text-foreground">Preferences</h2>
          </div>
          <QuizSection quiz={quiz} onChange={setQuiz} />
        </section>

        {/* Save Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            size="lg"
            className="min-w-[200px] rounded-full bg-guava-pink-gradient text-accent-foreground transition-all duration-700 hover:scale-105 hover:opacity-90"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </form>

      {/* CV Upload Section */}
      <section className="space-y-4 rounded-xl border border-dashed border-border/50 bg-muted/20 p-6">
        <h2 className="font-serif text-lg text-foreground">
          CV File (Optional)
        </h2>
        <p className="text-sm text-muted-foreground">
          Upload a PDF or Word file for reference. Use the paste helper above to
          auto-fill fields.
        </p>
        {initialProfile.cvFileUrl ? (
          <p className="text-sm text-foreground">
            Current file:{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              {initialProfile.cvFileUrl}
            </code>
          </p>
        ) : null}
        {uploadState?.error ? (
          <Alert variant="destructive">
            <AlertDescription>{uploadState.error}</AlertDescription>
          </Alert>
        ) : null}
        <form action={uploadAction} className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="cvFile">Upload CV</Label>
            <input
              id="cvFile"
              name="cvFile"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="block text-sm file:mr-3 file:rounded-full file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/80"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            disabled={isUploading}
            className="transition-all duration-300"
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </form>
      </section>
    </div>
  )
}
