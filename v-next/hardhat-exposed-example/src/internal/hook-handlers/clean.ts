import fs from "node:fs";

import type { CleanHooks } from "hardhat/types/hooks";

export default async (): Promise<Partial<CleanHooks>> => ({
  onClean: (context) => fs.promises.rm(context.config.exposed.outDir, { recursive: true, force: true }),
});
