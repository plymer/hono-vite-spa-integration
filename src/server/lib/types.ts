// types used for the server-side code
import { testQuerySchema, testResponseSchema } from "@server/validation/test-zod";
import { z } from "zod";

// configuration mapping for all endpoints in the api
export type EndpointConfig = {
  test: {
    params: z.infer<typeof testQuerySchema>;
    response: z.infer<typeof testResponseSchema>;
  };
  "test/error": {
    params: null;
    response: null;
  };
};

