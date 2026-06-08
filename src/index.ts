import { app } from "./api.ts"
import * as logger from "./logger.ts"
import { startScheduler } from "./scheduler.ts"

const port = parseInt(Deno.env.get("PORT") ?? "3000", 10)

Deno.serve({ port, onListen: () => logger.log(`[finiweb] http://localhost:${port}`) }, (req) =>
  app.fetch(req),
)

startScheduler()
