// API utilities for data fetching and error handling

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  success: boolean;
}

export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T = any>(
  url: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", headers = {}, body, timeout = 10000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      signal: controller.signal,
    };

    if (body && method !== "GET") {
      fetchOptions.body =
        typeof body === "string" ? body : JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    let data: T;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = (await response.text()) as unknown as T;
    }

    if (!response.ok) {
      return {
        error: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        success: false,
      };
    }

    return {
      data,
      status: response.status,
      success: true,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          error: "Request timeout",
          status: 408,
          success: false,
        };
      }

      return {
        error: error.message,
        status: 0,
        success: false,
      };
    }

    return {
      error: "Unknown error",
      status: 0,
      success: false,
    };
  }
}

export async function get<T = any>(
  url: string,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: "GET", headers });
}

export async function post<T = any>(
  url: string,
  body?: any,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: "POST", body, headers });
}

export async function put<T = any>(
  url: string,
  body?: any,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: "PUT", body, headers });
}

export async function del<T = any>(
  url: string,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: "DELETE", headers });
}

export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, any>
): string {
  const url = new URL(path, baseUrl);

  if (params) {
    const queryString = buildQueryString(params);
    if (queryString) {
      url.search = queryString;
    }
  }

  return url.toString();
}

export async function retryRequest<T = any>(
  requestFn: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> {
  let lastError: ApiResponse<T>;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await requestFn();

      if (result.success) {
        return result;
      }

      lastError = result;

      // Don't retry on client errors (4xx)
      if (result.status >= 400 && result.status < 500) {
        break;
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, attempt))
        );
      }
    } catch (error) {
      lastError = {
        error: error instanceof Error ? error.message : "Unknown error",
        status: 0,
        success: false,
      };
    }
  }

  return lastError!;
}

export function isNetworkError(error: ApiResponse): boolean {
  return error.status === 0 || error.status === 408;
}

export function isServerError(error: ApiResponse): boolean {
  return error.status >= 500;
}

export function isClientError(error: ApiResponse): boolean {
  return error.status >= 400 && error.status < 500;
}

export async function uploadFile(
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            data,
            status: xhr.status,
            success: true,
          });
        } catch {
          resolve({
            data: xhr.responseText,
            status: xhr.status,
            success: true,
          });
        }
      } else {
        resolve({
          error: `Upload failed: ${xhr.statusText}`,
          status: xhr.status,
          success: false,
        });
      }
    });

    xhr.addEventListener("error", () => {
      resolve({
        error: "Upload failed",
        status: 0,
        success: false,
      });
    });

    xhr.open("POST", url);
    xhr.send(formData);
  });
}
