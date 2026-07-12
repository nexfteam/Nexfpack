import copyfiles from 'copyfiles'
import fs from 'fs'
import path from 'path'
import os from 'os'
import child_process from 'child_process'
import { createNodewExe } from 'create-nodew-exe'
import { pipeline } from 'stream/promises'
import { packTar } from 'modern-tar/fs'
import * as resedit from 'resedit'
// @ts-ignore
import { inject } from 'postject';
interface NexfpackOptions {
    name?: string,
    metadata?: Record<string, Record<string, string>>,
    root?: string,
    relativeRoot?: boolean,
    noConsole?: boolean,
    log?: boolean,
    entry?: string,
    output?: string,
    tempdir?: string,
    autoDeleteTempFiles?: boolean,
    ignorefile?: string,
    ignore?: string[],
    upxLevel?: number,
    enabledSign?: boolean,
    autoRun?: boolean,
    configFile?: string,
}

interface NexfpackOptionsFilled {
    name: string,
    metadata?: Record<string, Record<string, string>>,
    root: string,
    noConsole: boolean,
    log: boolean,
    entry: string,
    output: string,
    tempdir: string,
    autoDeleteTempFiles: boolean,
    ignore: string[],
    upxLevel: number,
    enabledSign: boolean,
    autoRun: boolean,
}

async function fillOptions(options: NexfpackOptions): Promise<NexfpackOptionsFilled> {
    let cwd: string;
    if (options.root && !options.relativeRoot) {
        cwd = options.root;
    } else if (options.configFile) {
        cwd = path.dirname(options.configFile);
    } else {
        cwd = process.cwd();
    }
    if (options.root && options.relativeRoot) {
        cwd = path.resolve(cwd, options.root);
    }
    function getIgnores() {
        if (options.ignorefile) {
            return fs.readFileSync(path.resolve(cwd, options.ignorefile), 'utf8').split('\n').map(line => {
                return line.split('#')[0].trim();
            }).filter(line => line !== '');
        } else if (options.ignore) {
            return options.ignore;
        } else if (fs.existsSync(path.resolve(cwd, '.nexfpackignore'))) {
            return fs.readFileSync(path.resolve(cwd, '.nexfpackignore'), 'utf8').split('\n').map(line => {
                return line.split('#')[0].trim();
            }).filter(line => line !== '');
        } else {
            return [];
        }
    }
    return {
        name: options.name ?? 'nexfpack-app',
        metadata: options.metadata,
        root: cwd,
        noConsole: options.noConsole ?? false,
        log: options.log ?? true,
        entry: path.resolve(cwd, options.entry ?? 'index.js'),
        output: path.resolve(cwd, options.output ?? 'dist'),
        tempdir: path.resolve(cwd, options.tempdir ?? '.nexfpack-temp'),
        autoDeleteTempFiles: options.autoDeleteTempFiles ?? true,
        ignore: getIgnores(),
        upxLevel: options.upxLevel ?? 0,
        enabledSign: options.enabledSign ?? false,
        autoRun: options.autoRun ?? false,
    }
}

function listAllFiles(dir: string): string[] {
    const result: string[] = [];
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            result.push(...listAllFiles(fullPath));
        } else {
            result.push(fullPath);
        }
    }
    return result;
}

async function nexfpack(options: NexfpackOptions) {
    const platform = os.platform();
    let config: NexfpackOptions;
    if (options.configFile) {
        config = JSON.parse(fs.readFileSync(options.configFile, 'utf8')) as NexfpackOptions;
    } else {
        config = options;
    }
    const filledConfig = await fillOptions(config);
    try {
        if (filledConfig.log) {
            console.log('▶ Start packing...');
            console.log('🧪 Tips: Nexfpack is very experimental. It may have some errors.')
            console.log('   If you encounter any problems, please report them to https://github.com/nexfteam/nexfpack/issues')
        }

        if (!fs.existsSync(filledConfig.tempdir)) {
            fs.mkdirSync(filledConfig.tempdir, { recursive: true });
        } else {
            fs.rmSync(filledConfig.tempdir, { recursive: true, force: true });
            fs.mkdirSync(filledConfig.tempdir, { recursive: true });
        }

        if (filledConfig.log) {
            console.log('📄 Copying files...');
        }

        if (!fs.existsSync(path.join(filledConfig.tempdir, 'source-copy'))) {
            fs.mkdirSync(path.join(filledConfig.tempdir, 'source-copy'), { recursive: true });
        }

        await new Promise<void>((resolve, reject) => {
            copyfiles([filledConfig.root, path.join(filledConfig.tempdir, 'source-copy')], { up: 1, exclude: filledConfig.ignore }, (err) => {
                if (err) {
                    if (filledConfig.log) {
                        console.error('❌ Failed to copy files:', err);
                    }
                    reject(err);
                } else {
                    resolve();
                }
            })
        })

        if (filledConfig.log) {
            console.log('📜 Packing source...');
        }

        const tarStream = packTar(path.join(filledConfig.tempdir, 'source-copy'));
        const writeStream = fs.createWriteStream(path.join(filledConfig.tempdir, 'source.tar'));
        await pipeline(tarStream, writeStream);

        if (filledConfig.log) {
            console.log('📦 Packing executable...');
        }
        fs.writeFileSync(path.join(filledConfig.tempdir, 'package.json'), JSON.stringify({
            name: filledConfig.name,
            version: '1.0.0',
            type: 'commonjs',
            main: 'launcher.cjs',
            dependencies: {
                "modern-tar": "^0.7.6"
            }
        }, null, 2));
        const installSpawnResult = child_process.spawnSync('npm install --omit=dev', { stdio: 'inherit', cwd: filledConfig.tempdir, shell: true });
        if (installSpawnResult.status !== 0) {
            if (filledConfig.log) {
                console.error('❌ Failed to install dependencies');
            }
            throw new Error('Failed to install dependencies');
        }

        const allNodeModulesFiles = listAllFiles(path.join(filledConfig.tempdir, 'node_modules'));
        const seaConfigContent: any =
        {
            "main": "./launcher.cjs",
            "output": "./sea-prep.blob",
            "disableExperimentalSEAWarning": true,
            "assets": {
                "source.tar": "./source.tar",
            }
        };
        for (const file of allNodeModulesFiles) {
            const relativePath = path.relative(path.join(filledConfig.tempdir, 'node_modules'), file);
            seaConfigContent.assets[`node_modules/${relativePath}`] = file;
        }
        fs.writeFileSync(path.join(filledConfig.tempdir, 'sea-config.json'), JSON.stringify(seaConfigContent));
        const launcherContent = `
(async () => {
  const fs = require('fs');
  const path = require('path');
  const os = require('os');
  const { pathToFileURL } = require('url');
  let sea;
  try {
    sea = require('node:sea');
  } catch (e1) {
    try {
      sea = process.getBuiltinModule('sea');
    } catch (e2) {
      try {
        sea = globalThis.process?.getBuiltinModule?.('sea');
      } catch (e3) {
        sea = null;
      }
    }
  }

  const tempDir = path.join(os.tmpdir(), 'TEMP-NEXFPACK-' + Date.now() + '-' + Math.random().toString(36).substring(2));
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    const keys = ${JSON.stringify(Object.keys(seaConfigContent.assets).filter(key => key !== 'source.tar'))};
    for (const key of keys) {
        const data = sea.getRawAsset(key);
        const filePath = path.join(tempDir, 'LANCHER', key);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, Buffer.from(data));
    }

    const tarData = sea.getRawAsset('source.tar');

    const tarFile = path.join(tempDir, 'source.tar');
    fs.writeFileSync(tarFile, Buffer.from(tarData));

    const { unpackTar } = await import(pathToFileURL(path.join(tempDir, 'LANCHER', 'node_modules', 'modern-tar', 'dist', 'fs', 'index.js')));
    const extractStream = unpackTar(tempDir);
    const tarReadStream = fs.createReadStream(tarFile);
    const { pipeline } = require('stream/promises');
    await pipeline(tarReadStream, extractStream);

    const entry = path.resolve(tempDir, ${JSON.stringify(filledConfig.entry)});
    try {
      require(entry);
    } catch {
      await import(pathToFileURL(entry));
    }
  } catch (err) {
    console.error(err);
  }
  fs.rmSync(tempDir, { recursive: true, force: true });
})();
`;
        fs.writeFileSync(path.join(filledConfig.tempdir, 'launcher.cjs'), launcherContent);
        const blobSpawnResult = child_process.spawnSync('node --experimental-sea-config sea-config.json', { stdio: 'inherit', cwd: filledConfig.tempdir, shell: true });
        if (blobSpawnResult.status !== 0) {
            if (filledConfig.log) {
                console.error('❌ Failed to generate blob');
            }
            throw new Error('Failed to generate blob');
        }
        const NODE_SEA_FUSE = 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2';
        const blobData = fs.readFileSync(path.join(filledConfig.tempdir, 'sea-prep.blob'));
        const injectOptions: any = {
            sentinelFuse: NODE_SEA_FUSE,
        };
        if (platform === 'darwin') {
            injectOptions.machoSegmentName = 'NODE_SEA';
        }
        const ext = platform === 'win32' ? '.exe' : '';
        const exePath = path.join(filledConfig.output, filledConfig.name + ext);
        if (!fs.existsSync(filledConfig.output)) {
            fs.mkdirSync(filledConfig.output, { recursive: true });
        }
        fs.copyFileSync(process.execPath, exePath);
        await inject(exePath, 'NODE_SEA_BLOB', blobData, injectOptions);
        if (filledConfig.noConsole && platform === 'win32') {
            createNodewExe({
                src: exePath,
                dst: exePath,
            });
        }
        if (filledConfig.upxLevel > 0) {
            const checkUpxResult = child_process.spawnSync("upx --version", { shell: true });
            if (checkUpxResult.status === 0) {
                if (filledConfig.log) {
                    console.log('🗄️ Running upx compression...');
                }
                const upxResult = child_process.spawnSync(`upx -${filledConfig.upxLevel} \"${exePath}\"`, { stdio: 'inherit', shell: true });
                if (upxResult.status !== 0) {
                    if (filledConfig.log) {
                        console.error('❌ Failed to compress executable file');
                    }
                    throw new Error('Failed to compress executable file');
                }
            } else {
                console.log('⚠️ UPX not found, will skip compression');
                console.log('   You can install UPX on https://github.com/upx/upx/releases/latest');
            }
        }
        if (filledConfig.metadata && platform === 'win32') {
            if (filledConfig.log) {
                console.log('✏️  Writing metadata...');
            }
            const exeContent = fs.readFileSync(exePath);
            const rseExe = resedit.NtExecutable.from(exeContent, { ignoreCert: true });
            const rseRes = resedit.NtExecutableResource.from(rseExe);
            const rseVI = resedit.Resource.VersionInfo.createEmpty();
            for (const lang in filledConfig.metadata) {
                const langMetadata = filledConfig.metadata[Number(lang)];
                for (const key in langMetadata) {
                    if (key === "FileVersion") {
                        rseVI.setFileVersion(langMetadata[key], Number(lang));
                    } else if (key === "ProductVersion") {
                        rseVI.setProductVersion(langMetadata[key], Number(lang));
                    }
                    rseVI.setStringValue({ lang: Number(lang), codepage: 1200 }, key, langMetadata[key]);
                }
            }
            rseVI.outputToResourceEntries(rseRes.entries);
            rseRes.outputResource(rseExe);
            const newExeContent = rseExe.generate();
            fs.writeFileSync(exePath, Buffer.from(newExeContent));
        }
        if (filledConfig.enabledSign) {
            console.log("⚠️ Sorry, we can't sign your executable file. Please sign it by yourself.");
        }
        if (filledConfig.autoDeleteTempFiles) {
            if (filledConfig.log) {
                console.log('♻️ Deleting temp files...');
            }
            fs.rmSync(filledConfig.tempdir, { recursive: true, force: true });
        }
        if (filledConfig.log) {
            console.log('✅ Done!');
        }
        if (filledConfig.autoRun) {
            if (filledConfig.log) {
                console.log('🚀 Auto-run executable...');
            }
            child_process.spawnSync(exePath, { stdio: 'inherit', cwd: filledConfig.output, shell: true });
        }
    } catch (err) {
        if (filledConfig.log) {
            console.error('❌ Nexfpack Failed:', err);
        }
        throw err;
    }
}

export default nexfpack
export { NexfpackOptions, nexfpack }