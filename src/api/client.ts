import { API_BASE_URL } from "./config";

import { getToken } from "../mock/storage";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  auth?: boolean;
};

function joinUrl(base: string, path: string) {
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}`;
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as JsonValue;
  } catch {
    return text;
  }
}

export async function requestJson<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : joinUrl(API_BASE_URL, path);

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers ?? {}),
  };

  const token = options.auth ? await getToken() : null;
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const hasBody = options.body !== undefined;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (hasBody && !isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method: options.method ?? (hasBody ? "POST" : "GET"),
    headers,
    body: hasBody
      ? isFormData
        ? (options.body as any)
        : JSON.stringify(options.body)
      : undefined,
  });

  const data = await parseBody(res);

  if (!res.ok) {
    const message =
      (data as any)?.message ??
      (data as any)?.error ??
      res.statusText ??
      "Request failed";
    throw new ApiError(String(message), res.status, data);
  }

  return data as T;
}

export async function requestFirstOk<T>(
  paths: string[],
  options: RequestOptions = {},
): Promise<T> {
  let lastErr: unknown;

  for (const path of paths) {
    try {
      return await requestJson<T>(path, options);
    } catch (err) {
      lastErr = err;
      if (err instanceof ApiError && err.status === 404) continue;
      throw err;
    }
  }

  throw lastErr instanceof Error
    ? lastErr
    : new Error("No matching endpoint found");
}
