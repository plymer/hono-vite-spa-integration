import { UseSuspenseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ApiData, ApiEndpoints, ApiParams, RequiresParams } from "@shared/lib/types";
import { MINUTE } from "@shared/lib/constants";

/**
 * A hook to fetch data from the API with type safety and React Query integration. Default refetch interval is 5 minutes.
 *
 * @example
 * // For endpoints without params:
 * const { data } = useApi("test/error");
 *
 * // For endpoints with params:
 * const { data } = useApi("test", { name: "value" });
 *
 * // For endpoints with params, with config:
 * const { data } = useApi("test", { name: "value" }, { refetchInterval: 360_000 });
 */

// Overload 1: Just endpoint (ONLY for endpoints with no required params)
export function useApi<T extends ApiEndpoints>(
  endpoint: RequiresParams<T>
): ReturnType<typeof useSuspenseQuery<ApiData<T>, Error>>;

// Overload 2: Endpoint and params (for any endpoint)
export function useApi<T extends ApiEndpoints>(
  endpoint: T,
  params: ApiParams<T>
): ReturnType<typeof useSuspenseQuery<ApiData<T>, Error>>;

// Overload 3: Endpoint and config (ONLY for endpoints with no required params)
export function useApi<T extends ApiEndpoints>(
  endpoint: RequiresParams<T>,
  config: Omit<UseSuspenseQueryOptions, "queryKey" | "queryFn">
): ReturnType<typeof useSuspenseQuery<ApiData<T>, Error>>;

// Overload 4: Endpoint, params, and config (for any endpoint)
export function useApi<T extends ApiEndpoints>(
  endpoint: T,
  params: ApiParams<T>,
  config: Omit<UseSuspenseQueryOptions, "queryKey" | "queryFn">
): ReturnType<typeof useSuspenseQuery<ApiData<T>, Error>>;

// Implementation
export function useApi<T extends ApiEndpoints>(
  endpoint: T,
  arg2?: ApiParams<T> | Omit<UseSuspenseQueryOptions, "queryKey" | "queryFn">,
  arg3?: Omit<UseSuspenseQueryOptions, "queryKey" | "queryFn">
) {
  // Determine if second parameter is params or config
  const isSecondParamConfig =
    arg2 &&
    typeof arg2 === "object" &&
    ("enabled" in arg2 || "retry" in arg2 || "staleTime" in arg2 || "refetchOnWindowFocus" in arg2);

  const params = (isSecondParamConfig ? {} : arg2 || {}) as ApiParams<T>;
  const queryConfig = (isSecondParamConfig ? arg2 : arg3) as
    | Omit<UseSuspenseQueryOptions, "queryKey" | "queryFn">
    | undefined;

  // convert params to string values for URLSearchParams
  const stringParams = Object.fromEntries(
    Object.entries(params as Record<string, string | number | boolean>).map(([key, value]) => [key, String(value)])
  );

  const searchParams = new URLSearchParams(stringParams);
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

  return useSuspenseQuery({
    queryKey: [endpoint, params],
    queryFn: fetchData,
    refetchInterval: queryConfig?.refetchInterval ?? 5 * MINUTE,
    ...queryConfig,
  });
}

