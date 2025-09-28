import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiData, ApiEndpoints, ApiSearchParams } from "@server/lib/types";

// Define the config type for useQuery customization
export type ApiConfig<T = any> = Partial<UseQueryOptions<T, Error>>;

// Overload 1: Just endpoint (for endpoints with no params)
export function useApi<T extends ApiEndpoints>(endpoint: T): ReturnType<typeof useQuery<ApiData<T>, Error>>;

// Overload 2: Endpoint and params
export function useApi<T extends ApiEndpoints>(
  endpoint: T,
  params: ApiSearchParams<T>
): ReturnType<typeof useQuery<ApiData<T>, Error>>;

// Overload 3: Endpoint and config
export function useApi<T extends ApiEndpoints>(
  endpoint: T,
  config: ApiConfig<ApiData<T>>
): ReturnType<typeof useQuery<ApiData<T>, Error>>;

// Overload 4: Endpoint, params, and config
export function useApi<T extends ApiEndpoints>(
  endpoint: T,
  params: ApiSearchParams<T>,
  config: ApiConfig<ApiData<T>>
): ReturnType<typeof useQuery<ApiData<T>, Error>>;

// Implementation
export function useApi<T extends ApiEndpoints>(
  endpoint: T,
  paramsOrConfig?: ApiSearchParams<T> | ApiConfig<ApiData<T>>,
  config?: ApiConfig<ApiData<T>>
) {
  // Determine if second parameter is params or config
  const isSecondParamConfig =
    paramsOrConfig &&
    typeof paramsOrConfig === "object" &&
    ("enabled" in paramsOrConfig ||
      "retry" in paramsOrConfig ||
      "staleTime" in paramsOrConfig ||
      "refetchOnWindowFocus" in paramsOrConfig);

  const params = (isSecondParamConfig ? {} : paramsOrConfig || {}) as ApiSearchParams<T>;
  const queryConfig = (isSecondParamConfig ? paramsOrConfig : config) as ApiConfig<ApiData<T>> | undefined;

  const searchParams = new URLSearchParams(params as Record<string, string>);
  const queryString = searchParams.toString();
  const apiUrl = `/api/${endpoint}${queryString ? `?${queryString}` : ""}`;

  const fetchData = async (): Promise<ApiData<T>> => {
    const fetchedData = await fetch(apiUrl)
      .then((res) => {
        if (res.status === 200) return res.json();
        else throw new Error(`Error ${res.status}: ${res.statusText}`);
      })
      .then((data) => data)
      .catch((err: Error) => ({ error: err.message }));
    return fetchedData as ApiData<T>;
  };

  return useQuery({
    queryKey: [endpoint, params],
    queryFn: fetchData,
    ...queryConfig,
  });
}

