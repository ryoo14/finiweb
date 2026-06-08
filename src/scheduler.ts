import cron from "node-cron"
import { runCollector } from "./collector/index.ts"
import * as logger from "./logger.ts"
import { sendDailyDigest } from "./notifier/discord.ts"

export function startScheduler() {
  const collectCron = Deno.env.get("COLLECT_CRON") ?? "0 7 * * *"
  const notifyCron = Deno.env.get("NOTIFY_CRON") ?? "0 8 * * *"

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
