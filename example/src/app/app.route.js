import { CreateRoutes, HttpMethods } from "../../../index.js";
import { appController } from "./app.controller.js";
import {
  createUserRequestSchema,
  createUserResponseSchema,
  helloResponseSchema,
} from "./app.schema.js";

export const appRoutes = CreateRoutes({
  name: "My app",
  basePath: "/",
  routes: [
    {
      method: HttpMethods.GET,
      path: "/hello",
      controller: appController.hello,
      documentation: {
        description: "Returns hello world",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: helloResponseSchema,
              },
            },
          },
        },
      },
    },
    {
      method: HttpMethods.POST,
      path: "/user",
      controller: appController.createUser,
      documentation: {
        description: "Returns the user created",
        request: {
          body: {
            content: {
              "application/json": {
                schema: createUserRequestSchema,
              },
            },
          },
        },
        responses: {
          200: {
            content: {
              "application/json": {
                schema: createUserResponseSchema,
              },
            },
          },
        },
      },
    },
  ],
});
