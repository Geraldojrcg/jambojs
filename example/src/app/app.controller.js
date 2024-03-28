import { z } from "zod";
import { CreateController } from "../../../index.js";
import { createUserRequestSchema } from "./app.schema.js";

export const appController = {
  hello: CreateController({
    handler: (req, res) => {
      res.send({
        hello: "world",
      });
    },
  }),
  createUser: CreateController({
    validationSchema: z.object({
      body: createUserRequestSchema,
    }),
    handler: (req, res) => {
      res.send(req.body);
    },
  }),
};
