/**
 * Partner API keys for B2B integrations (bootcamps, HR/ATS) — F2+ / V3.
 */

export type PartnerScope = "read:applications" | "write:cover-letters";

export type ApiKeyRecord = {
  id: string;
  partnerId: string;
  scopes: PartnerScope[];
  expiresAt: Date | null;
};

/** Stub: validate bearer token; returns partner context or null. */
export function validateApiKey(_token: string): ApiKeyRecord | null {
  return null;
}
