export function isLocalizedNavItemActive(pathname: string, localizedHref: string): boolean {
  const segments = localizedHref.split("/").filter(Boolean);

  if (segments.length <= 1) {
    return pathname === localizedHref;
  }

  return pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
}
