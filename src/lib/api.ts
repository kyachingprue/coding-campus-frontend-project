import type { User } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const API_ORIGIN = new URL(API_URL).origin;

export function resolveMediaUrl(url: string): string {
  return new URL(url, API_ORIGIN).toString();
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const result: unknown = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const message = typeof result === "object" && result !== null && "error" in result &&
      typeof result.error === "string"
      ? result.error
      : "The server could not complete your request.";
    throw new Error(message);
  }
  return result as T;
}

export async function uploadRequest<T = unknown>(
  path: string,
  body: FormData,
  onProgress?: (percent: number) => void,
  retryFailedRequests = true,
): Promise<T> {
  const upload = (attempt: number): Promise<T> => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${API_URL}${path}`);
    request.withCredentials = true;
    request.timeout = 10 * 60 * 1000;
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    request.onerror = () => {
      if (retryFailedRequests && attempt < 2) {
        window.setTimeout(() => void upload(attempt + 1).then(resolve, reject), 500 * (attempt + 1));
      } else {
        reject(new Error("The upload could not reach the server. Check your connection and retry."));
      }
    };
    request.ontimeout = () => reject(new Error("The upload timed out. Check your connection and try again."));
    request.onload = () => {
      let result: unknown;
      try {
        result = request.responseText ? JSON.parse(request.responseText) : null;
      } catch {
        reject(new Error("The server returned an invalid upload response."));
        return;
      }
      if (request.status >= 200 && request.status < 300) {
        resolve(result as T);
        return;
      }
      const message = typeof result === "object" && result !== null && "error" in result &&
        typeof result.error === "string" ? result.error : "The server could not complete the upload.";
      if (retryFailedRequests && attempt < 2 && (request.status === 408 || request.status === 429 || request.status >= 500)) {
        window.setTimeout(() => void upload(attempt + 1).then(resolve, reject), 500 * (attempt + 1));
      } else {
        reject(new Error(message));
      }
    };
    request.send(body);
  });
  return upload(0);
}

export function normalizeUser(user: User & { _id?: string }): User {
  return {
    ...user,
    id: user.id || user._id || "",
    profileImage: user.avatarUrl || "",
    bannerImage: user.coverUrl || "",
  };
}
