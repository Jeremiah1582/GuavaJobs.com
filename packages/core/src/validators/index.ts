import { z } from "zod";

import { APPLICATION_STATUSES, type ApplicationStatus } from "../types";

export {
  educationEntrySchema,
  experienceEntrySchema,
  profileQuizSchema,
  profileUpdateSchema,
  type EducationEntry,
  type ExperienceEntry,
  type ProfileQuiz,
  type ProfileUpdateInput,
} from "./profile";

export const applicationStatusSchema = z.enum(
  APPLICATION_STATUSES as [ApplicationStatus, ...ApplicationStatus[]],
);

export { jobCountrySchema, jobIdParamSchema, jobSearchSchema } from "./jobs";
export {
  applicationNoteSchema,
  applicationNoteUpdateSchema,
  applicationStatusUpdateSchema,
  applicationUpdateSchema,
  manualApplicationCreateSchema,
  type ApplicationNoteInput,
  type ApplicationUpdateInput,
  type ManualApplicationCreateInput,
} from "./applications";
export {
  savedJobSearchCreateSchema,
  type SavedJobSearchCreateInput,
} from "./saved-job-searches";
export {
  coverLetterContentSchema,
  coverLetterGenerateSchema,
  type CoverLetterContentInput,
  type CoverLetterGenerateInput,
} from "./cover-letters";
