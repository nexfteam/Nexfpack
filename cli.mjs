#!/usr/bin/env node
import nexfpack from "./index.mjs";

const args = process.argv.slice(2);
if(args.length === 0) {
  console.log("Usage: nexfpack <config-file-path>");
  process.exit(1);
}
const configFilePath = args[0];

nexfpack({
  configFile: configFilePath,
});