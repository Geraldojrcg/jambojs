import Express from "express";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import * as swaggerUi from "swagger-ui-express";
import { getOpenAPIDocumentation } from "../documentation/index.js";

extendZodWithOpenApi(z);

/**
 * @typedef JamboApplicationParams
 * @property {Express.Router[]} routes
 * @property {import('@asteasolutions/zod-to-openapi/dist/v3.1/openapi-generator').OpenAPIObjectConfigV31} documentation
 * @param {JamboApplicationParams} params
 * @returns {Express.Application}
 */
export function JamboExpressApplication({ routes, documentation }) {
  const app = Express();

  app.use(Express.json());

  routes.forEach((route) => {
    app.use(route);
  });

  if (process.env.NODE_ENV !== "production") {
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(getOpenAPIDocumentation(documentation)),
    );
    app.use("/swagger", (req, res) => {
      res.json(getOpenAPIDocumentation(documentation));
    });
  }

  return app;
}
