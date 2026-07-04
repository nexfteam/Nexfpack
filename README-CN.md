# Nexfpack

一个用于将Node.js脚本或模块打包为单个可执行文件的工具。

## 安装

```bash
npm install -g nexfpack
# or
pnpm add -g nexfpack
# or
yarn global add nexfpack
```

## 快速开始

### CLI命令

创建 `nexfpack.config.json` 配置文件并运行以下CLI命令：

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

// 或者使用配置文件
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

// 或者使用配置文件
// nexfpack({configFile: 'nexfpack.config.json'})
```

### 配置文件示例

```json
{
    "name": "my-app",
    "entry": "index.js",
    "output": "dist",
    "ignore": [".gitignore", "README.md"],
    "autoRun": true
}
```

## 配置项

| 名称 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| name | string | 应用名称 | `nexfpack-app` |
| root | string | 根目录 | 若使用配置文件，则为文件所在目录，否则为 `process.cwd()` |
| relativeRoot | boolean | `root` 是否为相对路径 | `false` |
| entry | string | 入口文件路径 | `index.js` |
| output | string | 输出目录 | `dist` |
| tempdir | string | 打包过程中的临时目录 | `.nexfpack-temp` |
| autoDeleteTempFiles | boolean | 是否自动删除临时文件 | `true` |
| ignorefile | string | 忽略文件路径，优先级高于 `ignore` | `.nexfpackignore` |
| ignore | array | 忽略的文件或目录，支持 glob 语法 | `[]` |
| enabledSign | boolean | 是否启用签名（暂不支持） | `false` |
| autoRun | boolean | 是否自动运行打包后的可执行文件 | `false` |

## 环境要求

- Node.js >= 20.12.0

## License

MIT
