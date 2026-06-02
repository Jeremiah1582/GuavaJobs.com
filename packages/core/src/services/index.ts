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
export {
  EMPLOYMENT_TYPE_VALUES,
  JOB_CATEGORY_VALUES,
  formatEmploymentTypeLabel,
  formatJobCategoryLabel,
} from "../applications/job-taxonomy";
export type {
  EmploymentType,
  JobCategory,
  LanguageProficiency,
  RelocationWillingness,
  RightToWorkStatus,
  SalaryPeriod,
  SeniorityLevel,
} from "../generated/prisma";
export type {
  ApplicationBundle,
  ApplicationBundleFlags,
  ApplicationDetail,
  ApplicationListItem,
  ApplicationNoteDto,
  ApplicationProfileSnapshotDto,
  JobListingSnapshot,
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

export {
  coverLettersService,
  CoverLettersServiceError,
  generateForApplication,
  generateCoverLetterForBody,
  previewCoverLetterContent,
  type CoverLetterDto,
  type CoverLetterCitation,
  type GenerateCoverLetterOptions,
  type GenerateCoverLetterResult,
  type LetterPayload,
  type ManualCoverLetterPayload,
} from "./cover-letters";
export type {
  CoverLetterContentInput,
  CoverLetterGenerateInput,
} from "../validators/cover-letters";

export {
  profileService,
  computeCompleteness,
  isProfileReadyForAi,
  type ProfileCompleteness,
  type ProfileDto,
} from "./profile";

export { usageService } from "./usage";

export const billingService = {
  /** F11 */
  createCheckoutSession: async (_userId: string, _tier: string) => {
    throw new Error("billingService.createCheckoutSession: not implemented (F11)");
  },
};
