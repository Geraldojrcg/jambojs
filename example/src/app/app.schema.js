import { z } from "zod";
import { registry, numberValidation } from "../../../index.js";

export const helloResponseSchema = registry.register(
  "Hello",
  z.object({
    hello: z.string(),
  }),
);

export const createUserRequestSchema = z.object({
  name: z.string(),
  age: numberValidation,
});

export const createUserResponseSchema = registry.register(
  "User",
  createUserRequestSchema,
);
