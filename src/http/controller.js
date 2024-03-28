import { StatusCodes } from "http-status-codes";
import * as Express from "express";
import { validateObjectRecursive } from "../utils/validation.js";
import z from "zod";

/**
 * @typedef CreateControllerParams
 * @property {z.ZodObject} validationSchema - zod.object schema validation
 * @property {(req: Express.Request, res: Express.Response, next: Express.NextFunction) => Promise<void>} handler - controller handler function
 * @param {CreateControllerParams} params - Object with validationSchema and handler function
 * @param {z.ZodObject} params.validationSchema - zod.object schema validation
 * @param {(req: Express.Request, res: Express.Response, next: Express.NextFunction) => Promise<void>} params.handler - controller handler function
 * @returns {(req: Express.Request, res: Express.Response, next: Express.NextFunction) => Promise<any>}
 * @example
 * module.exports = {
 *  findById: CreateController({
      validationSchema: z.object({
        params: z.object({
          id: z.string().refine(isValidObjectId),
        }),
      }),
      handler: async (req, res) => {
        const data = await MyService.findById(req.params.id);
        return res.send(data);
      },
    }),
 * };
 */
export const CreateController =
  ({ validationSchema, handler }) =>
  async (req, res, next) => {
    try {
      if (validationSchema) {
        validateObjectRecursive(req.body);
        validateObjectRecursive(req.params);
        validateObjectRecursive(req.query);
        const parsed = validationSchema.parse({
          body: req.body,
          params: req.params,
          query: req.query,
        });
        if (parsed?.body) {
          req.body = parsed.body;
        }
        if (parsed?.params) {
          req.params = parsed.params;
        }
        if (parsed?.query) {
          req.query = parsed.query;
        }
      }
      return Promise.resolve(handler(req, res, next)).catch((err) => next(err));
    } catch (error) {
      let err = error;
      if (error.issues) {
        err = {
          errors: error.issues.map((i) => ({
            code: i.code,
            message: i.message,
            path: i.path.join("."),
          })),
        };
        return res.status(StatusCodes.BAD_REQUEST).send(err);
      }
      return next(err);
    }
  };
