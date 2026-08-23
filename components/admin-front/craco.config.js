const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('lodash/merge');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const THEME_OVERRIDES_PATH = path.resolve(__dirname, 'src/application/theme.overrides.json');

// Dev-only endpoint backing the Style Guide's "Bake" action: persists a theme-shaped diff
// (colors/typography) into theme.overrides.json, which theme.js merges over its base object.
// This only exists under `npm start` — it's never part of the production build.
const registerBakeThemeEndpoint = (app) => {
  app.post('/__dev/bake-theme', (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const incoming = JSON.parse(body || '{}');
        const current = JSON.parse(fs.readFileSync(THEME_OVERRIDES_PATH, 'utf8') || '{}');
        const merged = merge({}, current, incoming);
        fs.writeFileSync(THEME_OVERRIDES_PATH, `${JSON.stringify(merged, null, 2)}\n`);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true }));
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, error: error.message }));
      }
    });
  });
};

module.exports = {
  eslint: {
    enable: false
  },
  devServer: (devServerConfig) => {
    const previousSetupMiddlewares = devServerConfig.setupMiddlewares;
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      registerBakeThemeEndpoint(devServer.app);
      return previousSetupMiddlewares ? previousSetupMiddlewares(middlewares, devServer) : middlewares;
    };
    return devServerConfig;
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        (plugin) => !(plugin instanceof ModuleScopePlugin)
      );

      webpackConfig.resolve.symlinks = false;

      // Custom source directory resolution
      webpackConfig.resolve.modules = [
        path.resolve(__dirname, 'src/application'),
        path.resolve(__dirname, 'node_modules/core'),
        path.resolve(__dirname, 'src'),
        'node_modules'
      ];

      // `core` is a symlinked local package (packages/front-core), edited constantly during
      // development — unlike real third-party deps, it must NOT be treated as immutable.
      // Without this, webpack's persistent filesystem cache silently serves stale bundles
      // for edits under packages/front-core until node_modules/.cache is cleared by hand.
      webpackConfig.snapshot = {
        ...webpackConfig.snapshot,
        managedPaths: [/^(.+?[\\/]node_modules[\\/](?!core[\\/]))/]
      };

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser.js'
        })
      );

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer']
        })
      );

      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      });

      // Essential Node.js polyfills for browser
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        process: require.resolve('process/browser'),
        util: require.resolve('util/'),
        vm: require.resolve('vm-browserify'),
      };

      webpackConfig.ignoreWarnings = [
        (warning) =>
          warning.message.includes('Failed to parse source map') &&
          warning.module &&
          warning.module.resource &&
          (warning.module.resource.includes('@fast-csv/parse') ||
            warning.module.resource.includes('@jridgewell') ||
            warning.module.resource.includes('react-datasheet-grid') ||
            warning.module.resource.includes('ace-builds/src-noconflict/worker-coffee.js'))
      ];

      webpackConfig.output = {
        ...webpackConfig.output,
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js'
      };

      webpackConfig.module.rules.push({
        test: /\.worker\.(js|ts)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'static/js/[name].[contenthash].worker.js'
          }
        }
      });

      const appOrSrcLoader = webpackConfig.module.rules
        .find((rule) => Array.isArray(rule.oneOf))
        ?.oneOf.find(
          (rule) =>
            rule.loader && rule.loader.includes('babel-loader') && rule.include === paths.appSrc
        );

      if (appOrSrcLoader) {
        appOrSrcLoader.test = /\.(js|mjs|jsx|ts|tsx)$/;
        console.log('Found and set test for app babel-loader rule.');
      } else {
        console.error(
          "CRITICAL ERROR: Could not find app babel-loader rule to set 'test' property."
        );
      }

      const dependencyLoader = webpackConfig.module.rules
        .find((rule) => Array.isArray(rule.oneOf))
        ?.oneOf.find(
          (rule) =>
            rule.loader &&
            rule.loader.includes('babel-loader') &&
            rule.exclude &&
            typeof rule.exclude === 'object' &&
            Object.keys(rule.exclude).length === 0
        );

      if (dependencyLoader) {
        dependencyLoader.test = /\.(js|mjs|jsx|ts|tsx)$/;
        console.log('Found and set test for dependency babel-loader rule.');
      } else {
        console.warn(
          "WARNING: Could not find dependency babel-loader rule to set 'test' property. This might be fine if only appSrc is problematic."
        );
      }

      return webpackConfig;
    }
  },
  babel: {
    presets: [
      ['@babel/preset-env', {
        modules: false,
        useBuiltIns: 'entry',
        corejs: 3
      }],
      ['@babel/preset-react', { runtime: 'automatic' }]
    ],
    plugins: [
      ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: true }],
      ['@babel/plugin-proposal-optional-chaining', { loose: true }],
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }]
    ],
  }
};
