const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetUrl(path: string) {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
