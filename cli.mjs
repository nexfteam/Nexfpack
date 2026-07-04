#!/usr/bin/env node
import nexfpack from "./index.mjs";
import fs from "fs";

const args = process.argv.slice(2);
if(args.length === 0) {
  console.log("Usage: nexfpack <config-file-path>");
  console.log("Use nexfpack --help for more info.")
  process.exit(1);
}
const configFilePath = args[0];

if(configFilePath === "--help" || configFilePath === "-h") {
  console.log(
`
    __      _       __    _
   /  \\    / /\\_____\\ \\  / /
  / /\\ \\  / / / ____/\\ \\/ /
 / / /\\ \\/ / / /____\\/\\  /_____
/_/ /  \\__/ / ____/\\  /  \\  ___\\
\\_\\/    \\_\\/ /____\\/ / /\\ \\ \\__/
          /_____/\\  /_/  \\_\\  __\\
          \\_____\\/        \\ \\ \\_/
                           \\ \\_\\
 _______            _____   \\/_/__
|  ___  |   /\\     |  ___| | | / /
| |___| |  /  \\    | |     | |/ /
|  _____| / /\\ \\   | |     |   |
| |      / ____ \\  | |___  | |\\ \\
|_|     /_/    \\_\\ |_____| |_| \\_\\

`)
  console.log("Nexfpack - A tool for building single executable files from Node.js scripts or modules.");

  console.log("Version: " + JSON.parse(fs.readFileSync("./package.json", "utf8")).version);

  const helpText = `
Usage: nexfpack <config-file-path>

Arguments:
  configFile    Path to JSON config file (default: ./nexfpack.config.json)

Options:
  --help        Show this help message

Examples:
  nexfpack ./my-config.json    # Use custom config file

Config file example (nexfpack.config.json):
{
  "name": "my-app",
  "entry": "index.js",
  "output": "dist",
  "ignore": [".gitignore", "README.md"],
  "autoRun": true
}

For more details, visit: https://github.com/nexfteam/Nexfpack`
  console.log(helpText);
  process.exit(0);
}

nexfpack({
  configFile: configFilePath,
});