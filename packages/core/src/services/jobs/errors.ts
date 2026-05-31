import { ApiErrorCode } from "../../api/errors";

export class JobsServiceError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "JobsServiceError";
  }
}
