import { EndpointConfig } from "@server/lib/types";

// generic helper types
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type IIMT<T, D extends string> = { [K in keyof T]: Prettify<{ [P in D]: K } & T[K]> }[keyof T];

// define the api response shapes
type ApiResponses<TData> = {
  success: { response: TData };
  error: { message: string };
  noData: {};
};

// discriminated union type for api responses
export type ApiResponse<TData> = IIMT<ApiResponses<TData>, "status">;

// extract valid endpoints from the config keys
export type ApiEndpoints = keyof EndpointConfig;

// utility type to map endpoints to their configurations
type MapEndpoints<T extends Record<ApiEndpoints, any>, K extends keyof T[ApiEndpoints]> = {
  [Endpoint in ApiEndpoints]: T[Endpoint][K];
};

// map endpoints to their params and response types
export type ApiParams<Endpoint extends ApiEndpoints> = MapEndpoints<EndpointConfig, "params">[Endpoint];
export type ApiData<Endpoint extends ApiEndpoints> = ApiResponse<MapEndpoints<EndpointConfig, "response">[Endpoint]>;

// utility type to check if an endpoint requires parameters
export type HasRequiredParams<T extends ApiEndpoints> = ApiParams<T> extends Record<string, never>
  ? false
  : keyof ApiParams<T> extends never
  ? false
  : true;

// Simple error message that TypeScript will display clearly
export type RequiresParams<T extends ApiEndpoints> = HasRequiredParams<T> extends true
  ? `Endpoint ${T} requires query parameters. Please provide these as the second argument.`
  : T;

