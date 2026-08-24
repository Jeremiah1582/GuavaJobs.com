/** Post-track destination: application detail with continue prompt. */
export function trackedApplicationPath(applicationId: string): string {
  return `/applications/${applicationId}?tracked=1`
}
