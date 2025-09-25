// Middleware for handling canonical URLs and basic security
import type { APIRoute, MiddlewareNext } from "astro";

// Configuration - Use environment-specific URLs
// If deploying to Render, set RENDER_EXTERNAL_URL in the environment
const SITE_URL = import.meta.env.PROD
  ? import.meta.env.RENDER_EXTERNAL_URL ||
    "https://generacion-urbano-costu.onrender.com"
  : import.meta.env.DEV
  ? "http://localhost:4321"
  : "http://127.0.0.1:4321";
const CSP_POLICY = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  media-src 'self' https:;
  object-src 'none';
  frame-src 'self' https://www.youtube.com https://www.google.com;
  connect-src 'self' https://www.google-analytics.com;
  worker-src 'self' blob:;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`
  .replace(/\s+/g, " ")
  .trim();

export async function onRequest(context: any, next: MiddlewareNext) {
  const { request, url, locals } = context;

  // Security headers
  const headers = new Headers();

  // Only apply strict security headers in production
  if (import.meta.env.PROD) {
    // Content Security Policy
    headers.set("Content-Security-Policy", CSP_POLICY);

    // Other security headers
    headers.set("X-Frame-Options", "DENY");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-XSS-Protection", "1; mode=block");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=()"
    );

    // HSTS for HTTPS
    if (url.protocol === "https:") {
      headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
      );
    }
  }

  // No canonical URL or redirect logic

  // Rate limiting (only in production)
  if (import.meta.env.PROD) {
    const clientIP = getClientIP(request);
    if (isRateLimited(clientIP)) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": "60",
          ...Object.fromEntries(headers.entries()),
        },
      });
    }
  }

  // Process the request
  const response = await next();

  // Add security headers to response (only in production)
  if (import.meta.env.PROD) {
    for (const [key, value] of headers.entries()) {
      response.headers.set(key, value);
    }
  }

  return response;
}

function normalizeUrl(url: URL): string {
  // In development, use the current origin
  const baseUrl = import.meta.env.PROD ? SITE_URL : url.origin;

  // Remove trailing slash except for root
  let pathname = url.pathname;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  // Remove index.html
  pathname = pathname.replace(/\/index\.html?$/, "");

  // Build canonical URL
  return `${baseUrl}${pathname}${url.search}`;
}

function shouldRedirect(currentUrl: URL, canonicalUrl: string): boolean {
  const currentFull = `${currentUrl.origin}${currentUrl.pathname}${currentUrl.search}`;

  // Check if we need to redirect
  return (
    // Trailing slash redirect
    (currentUrl.pathname.length > 1 && currentUrl.pathname.endsWith("/")) ||
    // Index.html redirect
    currentUrl.pathname.includes("/index.html") ||
    // Different domain (if applicable)
    currentFull !== canonicalUrl
  );
}

function getClientIP(request: Request): string {
  // Try various headers to get real IP
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-client-ip") ||
    "unknown"
  );
}

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = 100; // requests per window
  const windowMs = 15 * 60 * 1000; // 15 minutes

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= limit) {
    return true;
  }

  record.count++;
  return false;
}

function addCanonicalLink(html: string, canonicalUrl: string): string {
  // Check if canonical link already exists
  if (html.includes('<link rel="canonical"')) {
    return html;
  }

  // Add canonical link before closing head tag
  const canonicalTag = `  <link rel="canonical" href="${canonicalUrl}">`;
  return html.replace("</head>", `${canonicalTag}\n</head>`);
}

// Utility function to clean up rate limit map periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

// Export types for use in other files
export interface MiddlewareLocals {
  canonicalUrl: string;
}

declare global {
  namespace App {
    interface Locals extends MiddlewareLocals {}
  }
}
