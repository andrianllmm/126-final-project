const DEFAULT_RETURN_TO = '/';
const SIGN_IN_PATH = '/sign-in';

function isSafeReturnTo(returnTo: string) {
  return returnTo.startsWith('/') && !returnTo.startsWith('//');
}

export function getCurrentPathWithSearch(
  pathname: string,
  searchParams?: string | URLSearchParams | null,
) {
  const search =
    typeof searchParams === 'string'
      ? searchParams
      : (searchParams?.toString() ?? '');

  return search ? `${pathname}?${search}` : pathname;
}

export function getSafeReturnTo(
  returnTo: string | null | undefined,
  fallback = DEFAULT_RETURN_TO,
) {
  if (!returnTo) return fallback;

  const normalized = returnTo.trim();

  if (!isSafeReturnTo(normalized)) return fallback;

  return normalized;
}

export function createSignInUrl(returnTo?: string | null) {
  const safeReturnTo = getSafeReturnTo(returnTo, '');

  if (!safeReturnTo) return SIGN_IN_PATH;

  return `${SIGN_IN_PATH}?${new URLSearchParams({ returnTo: safeReturnTo }).toString()}`;
}

export function createSignInCallbackURL(returnTo?: string | null) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const safeReturnTo = getSafeReturnTo(returnTo);

  return new URL(safeReturnTo, baseURL).toString();
}
