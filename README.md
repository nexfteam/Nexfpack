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
    "autoRun": true,
    "metadata": {
        "1033": {
            "FileVersion": "1.0.0.0",
            "ProductVersion": "1.0.0.0",
            "CompanyName": "Your Company",
            "FileDescription": "My Application"
        }
    }
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
| upxLevel | number | UPX compression level, range `0-9`, `0` means no UPX compression, ensure [UPX](https://github.com/upx/upx/releases/latest) is installed before using | `0` |
| metadata | Record&lt;string, Record&lt;string, string&gt;&gt; | **Windows-only** executable metadata. See "Metadata" section for details | `undefined` |
| enabledSign | boolean | Whether to enable signing (not yet supported) | `false` |
| autoRun | boolean | Whether to automatically run the packaged executable after build | `false` |

## Metadata

The `metadata` option allows you to set Windows executable metadata (Version Information) for your packaged application. This information is displayed in the file properties dialog on Windows.

### Structure

The `metadata` option is a nested object where:

- The **outer key** is the language ID (LCID), e.g., `1033` for English (US), `2057` for English (UK)
- The **inner key** is the metadata field name
- The **value** is the string content for that field

### Supported Fields

| Field | Description |
| --- | --- |
| `FileVersion` | File version number (e.g., `1.0.0.0`) |
| `ProductVersion` | Product version number (e.g., `1.0.0.0`) |
| `CompanyName` | Company name |
| `FileDescription` | File description |
| `ProductName` | Product name |
| `LegalCopyright` | Copyright information |
| `LegalTrademarks` | Trademark information |
| `OriginalFilename` | Original filename |
| `InternalName` | Internal name |
| `Comments` | Comments |
| `PrivateBuild` | Private build information |
| `SpecialBuild` | Special build information |

### Example

```json
{
    "metadata": {
        "1033": {
            "FileVersion": "1.0.0.0",
            "ProductVersion": "1.0.0.0",
            "CompanyName": "Your Company",
            "FileDescription": "My Application",
            "ProductName": "My Application",
            "LegalCopyright": "Copyright (c) 2026 Your Company"
        },
        "2057": {
            "FileVersion": "1.0.0.0",
            "ProductVersion": "1.0.0.0",
            "CompanyName": "Your Company",
            "FileDescription": "My Application",
            "ProductName": "My Application",
            "LegalCopyright": "Copyright (c) 2026 Your Company"
        }
    }
}
```

### Language IDs (LCID)

> **Note:** This is a partial list of common LCIDs. Microsoft Windows supports many more language IDs. Refer to [Microsoft's documentation](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-lcid/70feba9f-294e-491e-b6eb-56532684c37f) for a complete list.

| LCID | Language & Region |
| ----- | -------------------------- |
| `1033` | English (United States) |
| `2057` | English (United Kingdom) |
| `3081` | English (Australia) |
| `4105` | English (Canada) |
| `6153` | English (New Zealand) |
| `2052` | Simplified Chinese (China Mainland) |
| `1028` | Traditional Chinese (Taiwan, China) |
| `3076` | Traditional Chinese (Hong Kong SAR, China) |
| `5124` | Traditional Chinese (Macao SAR, China) |
| `1031` | German (Germany) |
| `1036` | French (France) |
| `1040` | Italian (Italy) |
| `1041` | Japanese (Japan) |
| `1042` | Korean (South Korea) |
| `1043` | Dutch (Netherlands) |
| `1045` | Polish (Poland) |
| `1053` | Swedish (Sweden) |

## Requirements

- Node.js >= 20.12.0

## License

MIT
