import * as Express from "express";
import { HTTPMethod } from "http-method-enum";
import z from "zod";
import { registry, bearerAuthOpenApiComponent } from "../documentation/index.js";

function formatDocRequestBody(request) {
  const formated = {};
  if (!request) {
    return undefined;
  }
  if (request.query) {
    formated.query = request.query;
  }
  if (request.params) {
    formated.params = request.params;
  }
  if (request.body) {
    if (request.body.content) {
      formated.body = request.body;
    } else {
      formated.body = {
        content: {
          "application/json": {
            schema: request.body,
          },
        },
      };
    }
  }
  return formated;
}

function formatDocResponses(responses, isPublic) {
  if (!isPublic && !responses[401]) {
    responses[401] = {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    };
  }
  if (!responses[400]) {
    responses[400] = {
      description: "Bad request",
      content: {
        "application/json": {
          schema: z.object({
            errors: z
              .object({
                code: z.string(),
                message: z.string(),
                path: z.string(),
              })
              .array(),
          }),
        },
      },
    };
  }
  if (!responses[500]) {
    responses[500] = {
      description: "Internal server error",
    };
  }
  return responses;
}

function formatDocumentationPath(path) {
  const rawParams = path.match(/(:)\w+/g);
  let newPath = path;
  if (rawParams) {
    rawParams.forEach((param) => {
      newPath = newPath.replace(param, `{${param.slice(1)}}`);
    });
  }
  return newPath;
}

export const HttpMethods = HTTPMethod;

/**
 * @typedef RouteDocumentation
 * @property {string} description - route description openapi documentation
 * @property {string} summary - route summary openapi documentation
 * @property {import('@asteasolutions/zod-to-openapi').RouteConfig['request']} request - route request openapi documentation
 * @property {import('@asteasolutions/zod-to-openapi').RouteConfig['responses']} responses - route responses openapi documentation
 * @typedef Route
 * @property {HTTPMethod} method - HTTP method of this route
 * @property {string} path - path of the route
 * @property {boolean} public - indicates if this route is public to access
 * @property {Function[]} middlewares - list of middlewares that will apllied in this routes
 * @property {(req: Express.Request, res: Express.Response, next: Express.NextFunction) => Promise<any>} controller - Controller function
 * @property {RouteDocumentation} documentation - OpenApi documentation of this route
 * @typedef CreateRoutesParams
 * @property {string} name - the name of resource group
 * @property {string} basePath - the base path of resource group
 * @property {Route[]} routes - list of routes
 * @property {Function[]} globalMiddlewares
 * @param {CreateRoutesParams} params - Object with a list of routes and global middlwreas
 * @param {string} params.name - the name of resource group
 * @param {string} params.basePath - the base path of resource group
 * @param {Route[]} params.routes - list of routes
 * @param {Function[]} params.globalMiddlewares - list of middlewares that will apllied in all routes
 * @returns {Express.Router} Router
 * @example
 * module.exports = (app) => {
    app.use(
        '/api',
        CreateRoutes({
          name: 'My Resource',
          basePath: '/my-resource',
          routes: [
            {
              method: HttpMethods.GET,
              path: '/my-resource',
              controller: MyController.findAll,
              documentation: {
                description: 'My resource description',
                responses: {
                  200: {
                    description: 'Response description',
                    content: {
                      'application/json': {
                        schema: MyOpenApiSchema,
                      },
                    },
                  },
                },
              },
            },
          ],
        })
      );
  *}
*/
export const CreateRoutes = ({
  name = "default",
  basePath = "/",
  routes,
  globalMiddlewares = [],
}) => {
  const router = Express.Router();
  if (globalMiddlewares.length) {
    router.use(basePath, ...globalMiddlewares);
  }
  routes.forEach((route) => {
    if (route.documentation) {
      registry.registerPath({
        tags: [name],
        method: route.method.toLowerCase(),
        path: formatDocumentationPath(route.path),
        description: route.documentation.description,
        summary: route.documentation.summary || route.documentation.description,
        request: formatDocRequestBody(route.documentation.request),
        responses: formatDocResponses(route.documentation.responses || {}, route.public),
        security: route.public ? undefined : [{ [bearerAuthOpenApiComponent.name]: [] }],
      });
    }
    router[route.method.toLowerCase()](
      route.path,
      ...(route.middlewares || []),
      route.controller,
    );
  });
  return router;
};
