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
  manualApplicationCreateSchema,
  type ManualApplicationCreateInput,
} from "./applications";
