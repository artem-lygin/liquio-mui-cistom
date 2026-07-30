import path from 'node:path';
import { Log } from '@liquio/back-core';

export interface InstallOptions {
  configDir: string;
  envConfigPrefix: string;
  installDir: string;
  registry: string;
}

export interface InstallDependencies {
  existsSync: (p: string) => boolean;
  loadConfig: (configDir: string, envConfigPrefix: string) => Record<string, unknown>;
  mkdirSync: (p: string) => void;
  writeFileSync: (p: string, contents: string) => void;
  execFileSync: (cmd: string, args: string[], opts: { cwd: string; stdio: 'inherit' }) => void;
  log: Log['save'];
}

export async function installPlugins(options: InstallOptions, deps: InstallDependencies): Promise<void> {
  if (!deps.existsSync(options.configDir)) {
    deps.log('plugin-installer-no-config-dir', { configDir: options.configDir });
    return;
  }

  const config = deps.loadConfig(options.configDir, options.envConfigPrefix);
  const pluginsConfig = config.plugins as { plugins?: { package: string; version: string; isEnabled: boolean }[] } | undefined;

  if (!pluginsConfig) {
    deps.log('plugin-installer-no-plugins-config', { configDir: options.configDir });
    return;
  }

  const plugins = (pluginsConfig.plugins || []).filter((p) => p.isEnabled);

  if (plugins.length === 0) {
    deps.log('plugin-installer-no-enabled-plugins');
    return;
  }

  deps.mkdirSync(options.installDir);
  deps.writeFileSync(
    path.join(options.installDir, 'package.json'),
    JSON.stringify({ name: 'installed-plugins', version: '0.0.0', private: true }, null, 2),
  );

  const specs = plugins.map((p) => `${p.package}@${p.version}`);
  deps.log('plugin-installer-installing', { plugins: specs });

  deps.execFileSync('npm', ['install', '--omit=dev', '--registry', options.registry, ...specs], {
    cwd: options.installDir,
    stdio: 'inherit',
  });

  deps.log('plugin-installer-done', { plugins: specs });
}
