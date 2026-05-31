const defaultAppUrl = "https://app.guavajobs.com";

export const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? defaultAppUrl;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://guavajobs.com";

export const appJobsUrl = `${appUrl}/jobs`;
export const appSignUpUrl = `${appUrl}/sign-up`;
export const appSignInUrl = `${appUrl}/sign-in`;
export const appDashboardUrl = `${appUrl}/dashboard`;
export const appPricingUrl = `${appUrl}/pricing`;
