/**
 * Supported HTTP methods for API requests.
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Query string parameters.
 */
type QueryParams = Record<string, string | number | boolean | null | undefined>;

/**
 * Options for API requests.
 */
type ApiClientOptions<TBody = unknown> = Omit<RequestInit, 'body'> & {
  baseUrl?: string;
  params?: QueryParams;
  body?: TBody;
};

/**
 * Standard API error wrapper.
 *
 * @template TError - Shape of error payload returned by API
 */
class ApiError<TError = unknown> extends Error {
  status: number;
  data: TError | null;

  constructor(message: string, status: number, data: TError | null) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === 'string' && data) return data;

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const message = record.message;

    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof record.error === 'string') return record.error;
  }

  return fallback;
}

/**
 * Converts query parameter object into URL query string.
 */
function buildQuery(params?: QueryParams): string {
  if (!params) return '';

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      search.append(key, String(value));
    }
  }

  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Core HTTP request handler.
 *
 * - Handles JSON and text responses
 * - Automatically serializes request body
 * - Throws ApiError on non-2xx responses
 *
 * @template TResponse - Expected response type
 * @template TBody - Request body type
 */
async function request<TResponse, TBody = unknown>(
  endpoint: string,
  method: HttpMethod,
  options: ApiClientOptions<TBody> = {},
): Promise<TResponse> {
  const baseUrl = options.baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? '';
  const url = `${baseUrl}${endpoint}${buildQuery(options.params)}`;
  const isFormDataBody =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const requestBody: BodyInit | undefined =
    options.body === undefined
      ? undefined
      : isFormDataBody
        ? (options.body as FormData)
        : JSON.stringify(options.body);

  const res = await fetch(url, {
    ...options,
    credentials: options.credentials ?? 'include',
    method,
    headers: isFormDataBody
      ? options.headers
      : {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
    body: requestBody,
  });

  const contentType = res.headers.get('content-type');

  const data: unknown = contentType?.includes('application/json')
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new ApiError(
      getErrorMessage(data, `Request failed with status ${res.status}`),
      res.status,
      data as TResponse,
    );
  }

  return data as TResponse;
}

/**
 * Typed API client wrapper around fetch.
 */
export const apiClient = {
  /**
   * Perform GET request
   */
  get: <TResponse>(url: string, options?: Omit<ApiClientOptions, 'body'>) =>
    request<TResponse>(url, 'GET', options),

  /**
   * Perform POST request
   */
  post: <TResponse, TBody = unknown>(
    url: string,
    body: TBody,
    options?: ApiClientOptions<TBody>,
  ) => request<TResponse, TBody>(url, 'POST', { ...options, body }),

  /**
   * Perform PUT request
   */
  put: <TResponse, TBody = unknown>(
    url: string,
    body: TBody,
    options?: ApiClientOptions<TBody>,
  ) => request<TResponse, TBody>(url, 'PUT', { ...options, body }),

  /**
   * Perform PATCH request
   */
  patch: <TResponse, TBody = unknown>(
    url: string,
    body: TBody,
    options?: ApiClientOptions<TBody>,
  ) => request<TResponse, TBody>(url, 'PATCH', { ...options, body }),

  /**
   * Perform DELETE request
   */
  delete: <TResponse>(url: string, options?: Omit<ApiClientOptions, 'body'>) =>
    request<TResponse>(url, 'DELETE', options),
};
