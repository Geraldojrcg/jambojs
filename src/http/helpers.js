import isISODate from "is-iso-date";
import { z } from "zod";

export const booleanValidation = z.coerce.boolean();

export const dateTimeValidation = z
  .string()
  .refine((v) => (v ? isISODate(v) : true))
  .openapi({
    type: "string",
    format: "date-time",
    pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z",
    example: "2023-01-01T00:00:00.000Z",
  });

export const numberValidation = z.coerce.number();

/**
 * @param {z.ZodObject} schema
 */
export const PaginatedOpenApiSchema = (schema) =>
  z.object({
    data: schema.array(),
    total: z.number(),
    limit: z.number(),
    page: z.number(),
    pages: z.number(),
  });
