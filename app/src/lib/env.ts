const defaultAppUrl = "https://app.guavajobs.com"
const defaultLandingUrl = "https://guavajobs.com"

export const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? defaultAppUrl

export const landingUrl =
  process.env.NEXT_PUBLIC_LANDING_URL?.replace(/\/$/, "") ?? defaultLandingUrl

export const landingPrivacyUrl = `${landingUrl}/privacy`
export const landingTermsUrl = `${landingUrl}/terms`
