# Nexfpack

语言: [English](https://github.com/nexfteam/Nexfpack/blob/main/README.md) | 简体中文(当前)

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

## 配置项

| 名称 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| name | string | 应用名称 | `nexfpack-app` |
| root | string | 根目录 | 若使用配置文件，则为文件所在目录，否则为 `process.cwd()` |
| relativeRoot | boolean | `root` 是否为相对路径 | `false` |
| noConsole | boolean | Windows 可执行文件是否隐藏控制台窗口 | `false` |
| log | boolean | 是否打印日志 | `true` |
| entry | string | 入口文件路径 | `index.js` |
| output | string | 输出目录 | `dist` |
| tempdir | string | 打包过程中的临时目录 | `.nexfpack-temp` |
| autoDeleteTempFiles | boolean | 是否自动删除临时文件 | `true` |
| ignorefile | string | 忽略文件路径，优先级高于 `ignore` | `.nexfpackignore` |
| ignore | array | 忽略的文件或目录，支持 glob 语法 | `[]` |
| upxLevel | number | UPX 压缩等级，范围 `0-9`，`0` 表示不启用 UPX 压缩，使用 UPX 压缩前需确保已安装 [UPX](https://github.com/upx/upx/releases/latest) | `0` |
| metadata | Record&lt;string, Record&lt;string, string&gt;&gt; | **仅 Windows** 可执行文件元数据。详见 “元数据” 章节 | `undefined` |
| enabledSign | boolean | 是否启用签名（暂不支持） | `false` |
| autoRun | boolean | 是否自动运行打包后的可执行文件 | `false` |

## 元数据

`metadata` 选项允许您为打包后的应用程序设置 Windows 可执行文件元数据（版本信息）。这些信息会显示在 Windows 的文件属性对话框中。

### 结构

`metadata` 选项是一个嵌套对象，其中：

- **外层键**是语言 ID（LCID），例如 `1033` 表示英语，`2052` 表示中文
- **内层键**是元数据字段名
- **值**是该字段的字符串内容

### 支持的字段

| 字段 | 描述 |
| --- | --- |
| `FileVersion` | 文件版本号（例如 `1.0.0.0`） |
| `ProductVersion` | 产品版本号（例如 `1.0.0.0`） |
| `CompanyName` | 公司名称 |
| `FileDescription` | 文件描述 |
| `ProductName` | 产品名称 |
| `LegalCopyright` | 版权信息 |
| `LegalTrademarks` | 商标信息 |
| `OriginalFilename` | 原始文件名 |
| `InternalName` | 内部名称 |
| `Comments` | 注释 |
| `PrivateBuild` | 私有版本信息 |
| `SpecialBuild` | 特殊版本信息 |

### 示例

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
        "2052": {
            "FileVersion": "1.0.0.0",
            "ProductVersion": "1.0.0.0",
            "CompanyName": "你的公司",
            "FileDescription": "我的应用",
            "ProductName": "我的应用",
            "LegalCopyright": "版权所有 (c) 2026 你的公司"
        }
    }
}
```

### 语言 ID（LCID）

> **注：** 这是常见 LCID 的部分列表。Microsoft Windows 支持更多语言 ID。完整列表请参考 [Microsoft 文档](https://learn.microsoft.com/zh-cn/openspecs/windows_protocols/ms-lcid/70feba9f-294e-491e-b6eb-56532684c37f)。

| LCID | 语言 & 区域 |
| --- | --- |
| `1033` | 英语（美国） |
| `2057` | 英语（英国） |
| `3081` | 英语（澳大利亚） |
| `4105` | 英语（加拿大） |
| `6153` | 英语（新西兰） |
| `2052` | 简体中文（中国大陆） |
| `1028` | 繁体中文（中国台湾） |
| `3076` | 繁体中文（中国香港） |
| `5124` | 繁体中文（中国澳门） |
| `1031` | 德语（德国） |
| `1036` | 法语（法国） |
| `1040` | 意大利语（意大利） |
| `1041` | 日语（日本） |
| `1042` | 韩语（韩国） |
| `1043` | 荷兰语（荷兰） |
| `1045` | 波兰语（波兰） |
| `1053` | 瑞典语（瑞典） |

## 环境要求

- Node.js >= 20.12.0

## License

MIT
