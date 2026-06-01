const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_TIMEOUT_MS = 60_000;

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatCompletionOptions = {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  responseFormat?: "json_object" | "text";
  timeoutMs?: number;
};

export class AiClientError extends Error {
  constructor(
    message: string,
    public readonly code: "MISSING_API_KEY" | "TIMEOUT" | "MODERATION" | "PROVIDER_ERROR",
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AiClientError";
  }
}

function getApiKey(): string {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    throw new AiClientError(
      "AI provider is not configured (OPENAI_API_KEY)",
      "MISSING_API_KEY",
    );
  }
  return key;
}

function getModel(override?: string): string {
  return override?.trim() || process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

async function fetchCompletionOnce(
  options: ChatCompletionOptions,
): Promise<string> {
  const apiKey = getApiKey();
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: getModel(options.model),
        temperature: options.temperature ?? 0.4,
        messages: options.messages,
        response_format:
          options.responseFormat === "json_object"
            ? { type: "json_object" }
            : undefined,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      if (response.status === 429 || response.status >= 500) {
        throw new AiClientError(
          "AI provider temporarily unavailable",
          "PROVIDER_ERROR",
          response.status,
        );
      }
      if (response.status === 400 && body.includes("content_policy")) {
        throw new AiClientError(
          "Content could not be generated due to moderation rules",
          "MODERATION",
          400,
        );
      }
      throw new AiClientError(
        `AI provider error (${response.status})`,
        "PROVIDER_ERROR",
        response.status,
      );
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string | null } }[];
    };
    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new AiClientError("AI provider returned empty content", "PROVIDER_ERROR");
    }
    return content;
  } catch (error) {
    if (error instanceof AiClientError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new AiClientError("AI request timed out", "TIMEOUT");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/** Server-only OpenAI chat completion with one retry on transient failures. */
export async function chatCompletion(options: ChatCompletionOptions): Promise<string> {
  try {
    return await fetchCompletionOnce(options);
  } catch (error) {
    const retryable =
      error instanceof AiClientError &&
      (error.code === "TIMEOUT" || error.code === "PROVIDER_ERROR");
    if (!retryable) throw error;
    return fetchCompletionOnce(options);
  }
}
