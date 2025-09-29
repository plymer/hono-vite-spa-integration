import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiData, ApiEndpoints, ApiParams, HasRequiredParams } from "@server/lib/types";

// Overload 1: Just endpoint (ONLY for endpoints with no required params)
export function useApi<T extends ApiEndpoints>(
  endpoint: HasRequiredParams<T> extends false ? T : never
): ReturnType<typeof useQuery<ApiData<T>, Error>>;

// Overload 2: Endpoint and params (for any endpoint)
export function useApi<T extends ApiEndpoints>(
  endpoint: T,
  params: ApiParams<T>
): ReturnType<typeof useQuery<ApiData<T>, Error>>;

// Overload 3: Endpoint and config (ONLY for endpoints with no required params)
export function useApi<T extends ApiEndpoints>(
  endpoint: HasRequiredParams<T> extends false ? T : never,
  config: UseQueryOptions
): ReturnType<typeof useQuery<ApiData<T>, Error>>;

// Overload 4: Endpoint, params, and config (for any endpoint)
export function useApi<T extends ApiEndpoints>(
  endpoint: T,
  params: ApiParams<T>,
  config: UseQueryOptions
): ReturnType<typeof useQuery<ApiData<T>, Error>>;

// Implementation
export function useApi<T extends ApiEndpoints>(
  endpoint: T,
  arg2?: ApiParams<T> | UseQueryOptions,
  arg3?: UseQueryOptions
) {
  // Determine if second parameter is params or config
  const isSecondParamConfig =
    arg2 &&
    typeof arg2 === "object" &&
    ("enabled" in arg2 || "retry" in arg2 || "staleTime" in arg2 || "refetchOnWindowFocus" in arg2);

  const params = (isSecondParamConfig ? {} : arg2 || {}) as ApiParams<T>;
  const queryConfig = (isSecondParamConfig ? arg2 : arg3) as UseQueryOptions | undefined;

  const searchParams = new URLSearchParams(params as Record<string, string>);
  const queryString = searchParams.toString();
  const apiUrl = `/api/${endpoint}${queryString ? `?${queryString}` : ""}`;

  const fetchData = async () => {
    const fetchedData: ApiData<T> = await fetch(apiUrl)
      .then((res) => {
        if (res.status === 200) return res.json();
        else throw new Error(`Error ${res.status}: ${res.statusText}`);
      })
      .then((data) => data)
      .catch((err: Error) => ({ status: "error", message: err.message }));
    return fetchedData;
  };

  return useQuery({
    queryKey: [endpoint, params],
    queryFn: fetchData,
    ...queryConfig,
  });
}

