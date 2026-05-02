/**
 * Prevents open redirects when sending users back to an app-internal path
 * (e.g. after session expiry on a deep link).
 */
export function safeReturnPath(raw: string | null | undefined): string {
  if (raw == null || raw === '') {
    return '/';
  }
  try {
    const path = decodeURIComponent(raw);
    if (
      path.startsWith('/') &&
      !path.startsWith('//') &&
      !path.startsWith('/\\') &&
      !path.includes('://') &&
      // eslint-disable-next-line no-control-regex
      !/[\x00-\x1f\\]/.test(path)
    ) {
      return path;
    }
  } catch {
    return '/';
  }
  return '/';
}
