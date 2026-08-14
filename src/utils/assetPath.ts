/**
 * Asset URL helper to ensure compatibility with subpath deployments (e.g. GitHub Pages)
 */
export function getAssetUrl(path: string): string {
  const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
}
