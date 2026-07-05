# Nexfpack

Language: English(now) | [简体中文](https://github.com/nexfteam/Nexfpack/blob/main/README-CN.md)

A tool for packaging Node.js scripts or modules into a single executable file.

## Installation

```bash
npm install -g nexfpack
# or
pnpm add -g nexfpack
# or
yarn global add nexfpack
```

## Quick Start

### CLI Usage

Create a `nexfpack.config.json` configuration file and run the following CLI command:

```bash
nexfpack nexfpack.config.json
```

### CommonJS API

```javascript
const nexfpack = require('nexfpack');

const config = {
    "name": "my-app",
    "entry": "index.js",
    "output": "dist",
    "ignore": [".gitignore", "README.md"],
    "autoRun": true
};

nexfpack(config);

// Or use a config file
// nexfpack({configFile: 'nexfpack.config.json'})
```

### ESM API

```javascript
import nexfpack from 'nexfpack';

const config = {
    "name": "my-app",
    "entry": "index.js",
    "output": "dist",
    "ignore": [".gitignore", "README.md"],
    "autoRun": true
};

nexfpack(config);

// Or use a config file
// nexfpack({configFile: 'nexfpack.config.json'})
```

### Configuration File Example

```json
{
    "name": "my-app",
    "entry": "index.js",
    "output": "dist",
    "ignore": [".gitignore", "README.md"],
    "autoRun": true
}
```

## Options

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| name | string | Application name | `nexfpack-app` |
| root | string | Root directory | The directory of the config file if specified, otherwise `process.cwd()` |
| relativeRoot | boolean | Whether `root` is a relative path | `false` |
| noConsole | boolean | Whether Windows executables should hide the console window | `false` |
| log | boolean | Whether to print logs | `true` |
| entry | string | Entry file path | `index.js` |
| output | string | Output directory | `dist` |
| tempdir | string | Temporary directory for the build process | `.nexfpack-temp` |
| autoDeleteTempFiles | boolean | Whether to auto-delete temporary files | `true` |
| ignorefile | string | Ignore file path, takes precedence over `ignore` | `.nexfpackignore` |
| ignore | array | Files or directories to ignore, supports glob syntax | `[]` |
| enabledSign | boolean | Whether to enable signing (not yet supported) | `false` |
| autoRun | boolean | Whether to automatically run the packaged executable after build | `false` |

## Requirements

- Node.js >= 20.12.0

## License

MIT
