const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable Tamagui
config.resolver.alias = {
  ...config.resolver.alias,
};

module.exports = config;
