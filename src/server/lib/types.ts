// types used for the server-side code
import { testQuerySchema, testResponseSchema } from "@server/validation/test-zod";
import { z } from "zod";

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

// all valid api endpoints
export type ApiEndpoints = "test" | "test/error";

// types for the "test" endpoint
export type TestQuery = z.infer<typeof testQuerySchema>;
export type TestResponse = z.infer<typeof testResponseSchema>;

// map endpoints to their params and response types
export type ApiParams<Endpoint extends ApiEndpoints> = Endpoint extends "test"
  ? TestQuery
  : Endpoint extends "test/error"
  ? Record<string, never>
  : never;

export type ApiData<Endpoint extends ApiEndpoints> = Endpoint extends "test"
  ? ApiResponse<TestResponse>
  : Endpoint extends "test/error"
  ? ApiResponse<null>
  : never;

// Utility type to check if an endpoint requires parameters
export type HasRequiredParams<T extends ApiEndpoints> = ApiParams<T> extends Record<string, never>
  ? false
  : keyof ApiParams<T> extends never
  ? false
  : true;

