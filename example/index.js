import { JamboExpressApplication } from "../index.js";
import { appRoutes } from "./src/app/app.route.js";

const app = JamboExpressApplication({
  documentation: {
    info: {
      title: "My Api",
      version: "1.0.0",
      description: "simple api",
    },
  },
  routes: [appRoutes],
});

app.listen(3000, () => {
  console.log("app started on http:localhost:3000");
});
