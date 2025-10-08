const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
};

config.resolver = {
  ...config.resolver,
  blacklistRE: /.*node_modules[\/\\]expo[\/\\]src[\/\\]errors[\/\\].*/,
};

module.exports = config;
