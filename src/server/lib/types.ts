// types used for the server-side code
import { testSchema } from "@server/validation/test-zod";
import { z } from "zod";

export type ApiEndpoints = "test" | "test/error";

export type TestParams = z.infer<typeof testSchema>;
export type TestData = { message: string };

// Define parameter shapes for each endpoint
export type ApiEndpointParams = {
  test: TestParams; // No parameters
  "test/error": Record<string, never>; // No parameters
};

// Mapped type that provides type-safe parameters based on endpoint
export type ApiSearchParams<T extends ApiEndpoints> = ApiEndpointParams[T];

export type ApiData<T extends ApiEndpoints> = T extends "test"
  ? TestData
  : T extends "test/error"
  ? { error: string }
  : never;

