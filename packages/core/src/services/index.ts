/**
 * Domain services — business logic only (no HTTP).
 * Route Handlers in app/ call these; external clients use the same via REST.
 */

export { usersService } from "./users";
export { jobsService, JobsServiceError, JUNIOR_DEFAULT_WHAT } from "./jobs";
export type {
  JobCountry,
  JobListing,
  JobSalary,
  JobSearchInput,
  JobSearchResult,
  JobSortBy,
} from "./jobs";

export {
  applicationsService,
  ApplicationsServiceError,
} from "./applications";
export { getApplicationRowClass } from "../applications/row-styles";
export {
  PIPELINE_APPLICATION_STATUSES,
  PIPELINE_STATUS_OPTIONS,
  STAGE_ORDER,
  formatApplicationStatusLabel,
} from "../applications/constants";
export type {
  ApplicationDetail,
  ApplicationListItem,
  ApplicationNoteDto,
} from "./applications";
export type {
  ApplicationNoteInput,
  ApplicationUpdateInput,
  InterviewUpdateInput,
  ManualApplicationCreateInput,
} from "../validators/applications";

/** Alias for interview panel payloads. */
export type { InterviewUpdateInput as InterviewDetailsInput } from "../validators/applications";

export { savedJobSearchesService } from "./saved-job-searches";
export type { SavedJobSearchDto } from "./saved-job-searches";
export type { SavedJobSearchCreateInput } from "../validators/saved-job-searches";

export const coverLettersService = {
  /** F8/F9 */
  generate: async (_input: unknown) => {
    throw new Error("coverLettersService.generate: not implemented (F9)");
  },
};

export {
  profileService,
  computeCompleteness,
  type ProfileCompleteness,
  type ProfileDto,
} from "./profile";

export const usageService = {
  /** F10 — 5 AI letters/month on freemium */
  getRemainingAiLetters: async (_userId: string) => {
    throw new Error("usageService.getRemainingAiLetters: not implemented (F10)");
  },
};

export const billingService = {
  /** F11 */
  createCheckoutSession: async (_userId: string, _tier: string) => {
    throw new Error("billingService.createCheckoutSession: not implemented (F11)");
  },
};
