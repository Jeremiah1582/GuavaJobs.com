"use client"

import { useActionState, useEffect, useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { CvPasteHelper } from "@/components/profile/cv-paste-helper"
import { ExperienceSection } from "@/components/profile/experience-section"
import { ProfileCompletenessBar } from "@/components/profile/profile-completeness"
import { QuizSection } from "@/components/profile/quiz-section"
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
import { Plus, Trash2 } from "lucide-react"

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
  const [summary, setSummary] = useState(initialProfile.summary ?? "")
  const [skillsText, setSkillsText] = useState(initialProfile.skills.join(", "))
  const [experience, setExperience] = useState<ExperienceEntry[]>(
    parseExperience(initialProfile.experienceJson),
  )
  const [education, setEducation] = useState<EducationEntry[]>(
    parseEducation(initialProfile.educationJson),
  )
  const [quiz, setQuiz] = useState<ProfileQuiz>(
    parseQuiz(initialProfile.quizJson),
  )
  const completeness = initialProfile.completeness

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

  return (
    <div className="space-y-8">
      <ProfileCompletenessBar completeness={completeness} />

      <CvPasteHelper onApply={handleCvPaste} />

      <form action={saveAction} className="space-y-8">
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

        {saveState?.error ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{saveState.error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="summary">Professional summary</Label>
          <textarea
            id="summary"
            name="summary"
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            maxLength={5000}
            placeholder="A short overview of your background and goals…"
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          />
        </div>

        <ExperienceSection entries={experience} onChange={setExperience} />

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-foreground">Skills</h2>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="TypeScript, React, project management…"
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground">Education</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEducation([...education, emptyEducation()])}
            >
              <Plus className="size-4" />
              Add education
            </Button>
          </div>
          {education.map((entry, index) => (
            <div key={index} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setEducation(education.filter((_, i) => i !== index))
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
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
                  placeholder="e.g. 2018 – 2022"
                  onChange={(e) => {
                    const next = [...education]
                    next[index] = { ...entry, endDate: e.target.value }
                    setEducation(next)
                  }}
                />
              </div>
            </div>
          ))}
        </section>

        <QuizSection quiz={quiz} onChange={setQuiz} />

        <Button
          type="submit"
          className="rounded-full bg-guava-pink-gradient text-accent-foreground hover:opacity-90"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save profile"
          )}
        </Button>
      </form>

      <section className="space-y-3 rounded-lg border p-4">
        <h2 className="font-serif text-xl text-foreground">CV file (optional)</h2>
        <p className="text-sm text-muted-foreground">
          Upload a PDF or Word file to Supabase Storage. Parsing is manual for
          now — use paste above to fill fields.
        </p>
        {initialProfile.cvFileUrl ? (
          <p className="text-sm text-foreground">
            Stored file:{" "}
            <code className="text-xs">{initialProfile.cvFileUrl}</code>
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
              className="block text-sm"
            />
          </div>
          <Button type="submit" variant="outline" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading…
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
