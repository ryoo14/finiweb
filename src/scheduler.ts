import cron from "node-cron"
import { runCollector } from "./collector/index.js"
import * as logger from "./logger.js"
import { sendDailyDigest } from "./notifier/discord.js"

export function startScheduler() {
  const collectCron = process.env.COLLECT_CRON ?? "0 7 * * *"
  const notifyCron = process.env.NOTIFY_CRON ?? "0 8 * * *"

  cron.schedule(collectCron, async () => {
    logger.log("[scheduler] Running daily collection")
    await runCollector()
  })

  cron.schedule(notifyCron, async () => {
    logger.log("[scheduler] Running Discord notification")
    await sendDailyDigest()
  })

  logger.log(`[scheduler] collect=${collectCron}  notify=${notifyCron}`)
}
