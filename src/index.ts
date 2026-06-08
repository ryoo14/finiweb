import { serve } from "@hono/node-server"
import { app } from "./api.js"
import * as logger from "./logger.js"
import { startScheduler } from "./scheduler.js"

const port = parseInt(process.env.PORT ?? "3000", 10)

serve({ fetch: app.fetch, port }, () => {
  logger.log(`[finiweb] http://localhost:${port}`)
})

startScheduler()
