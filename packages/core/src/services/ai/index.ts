export { AiClientError, chatCompletion, type ChatMessage } from "./client";
export {
  buildCoverLetterUserPrompt,
  COVER_LETTER_SYSTEM_PROMPT,
  parseCoverLetterGeneration,
  type CoverLetterCitation,
  type CoverLetterGenerationResult,
} from "./cover-letter-prompt";
export {
  generateCoverLetterWithOpenAI,
  profileSnapshotToPromptText,
  type GenerateCoverLetterAiResult,
  type GenerateCoverLetterInput,
} from "./openai-client";
export { isProfileReadyForAi, profileSnapshotToPromptJson } from "./profile-readiness";
