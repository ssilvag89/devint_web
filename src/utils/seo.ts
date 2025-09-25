// SEO utility functions
export function buildTitle(
  pageTitle: string,
  siteName: string = "Devint"
): string {
  if (pageTitle.includes(siteName)) {
    return pageTitle;
  }
  return `${pageTitle} | ${siteName}`;
}

export function buildCanonical(
  path: string,
  baseUrl: string = "https://devint.cl"
): string {
  // Remove trailing slash except for root
  const cleanPath = path === "/" ? "/" : path.replace(/\/$/, "");
  return `${baseUrl}${cleanPath}`;
}

export function truncateDescription(
  description: string,
  maxLength: number = 160
): string {
  if (description.length <= maxLength) {
    return description;
  }

  // Find the last space before the limit to avoid cutting words
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return truncated.substring(0, lastSpace) + "...";
}

export function generateBreadcrumbs(
  path: string
): Array<{ label: string; href: string }> {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs: Array<{ label: string; href: string }> = [];

  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;

    // Convert slug to readable label
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  }

  return breadcrumbs;
}

export function extractKeywords(
  content: string,
  maxKeywords: number = 10
): string[] {
  // Simple keyword extraction - in production, you might want to use a more sophisticated approach
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);

  // Count word frequency
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

export function generateMetaRobots(
  noindex: boolean = false,
  nofollow: boolean = false
): string {
  const robots = [];

  if (noindex) robots.push("noindex");
  if (nofollow) robots.push("nofollow");

  return robots.length > 0 ? robots.join(", ") : "index, follow";
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}
