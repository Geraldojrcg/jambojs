import { OpenAPIRegistry, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";

export const registry = new OpenAPIRegistry();

export const bearerAuthOpenApiComponent = registry.registerComponent(
  "securitySchemes",
  "bearerAuth",
  {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  },
);

/**
 * @param {import('@asteasolutions/zod-to-openapi/dist/v3.1/openapi-generator').OpenAPIObjectConfigV31} config
 * @returns {import('openapi3-ts/oas31').OpenAPIObject}
 */
export function getOpenAPIDocumentation(config) {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  const docs = generator.generateDocument({
    openapi: "3.1.0",
    ...config,
  });
  return JSON.parse(JSON.stringify(docs));
}
