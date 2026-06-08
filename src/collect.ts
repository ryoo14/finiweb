import { runCollector } from "./collector/index.ts"

runCollector().then(() => Deno.exit(0))
