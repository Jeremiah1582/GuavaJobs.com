/**
 * Domain services — business logic only (no HTTP).
 * Route Handlers in app/ call these; external clients use the same via REST.
 */

export { usersService } from "./users";
export { jobsService, JobsServiceError } from "./jobs";
export type {
  JobCountry,
  JobListing,
  JobSalary,
  JobSearchInput,
  JobSearchResult,
} from "./jobs";

export { applicationsService } from "./applications";
export type { ApplicationListItem } from "./applications";
export type { ManualApplicationCreateInput } from "../validators/applications";

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
