const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const { override, addBabelPlugins, babelInclude, removeModuleScopePlugin } = require('customize-cra');

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const modulesPath = path.resolve(__dirname, '../../node_modules');

const appIncludes = [
  resolveApp('src'),
  resolveApp('../common/src')
]

const registerGlobals = vars => config => {
  config.module.rules[0].include = appIncludes
  config.module.rules[1] = null
  config.module.rules[2].oneOf[1].include = appIncludes
  config.module.rules[2].oneOf[1].options.plugins = [
    require.resolve('babel-plugin-react-native-web'),
  ].concat(config.module.rules[2].oneOf[1].options.plugins)
  config.module.rules = config.module.rules.filter(Boolean)

  if (!Array.isArray(config.plugins)) config.plugins = [];
  config.plugins.push(new webpack.DefinePlugin(vars));

  return config;
};

module.exports = override(
  removeModuleScopePlugin(),
  registerGlobals({
    __DEV__: process.env.NODE_ENV !== 'production',
  }),
  babelInclude([
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, '../common/src'),

    path.resolve(modulesPath, 'react-native-web'),
    path.resolve(modulesPath, 'react-native-elements'),
    path.resolve(modulesPath, 'react-native-vector-icons'),
    path.resolve(modulesPath, 'react-native-ratings'),
  ]),
  ...addBabelPlugins('@babel/plugin-proposal-class-properties'),
);
