const baseUrl = import.meta.env.BASE_URL;

export function assetPath(path: string): string {
  return `${baseUrl}${path.replace(/^\//, "")}`;
}
