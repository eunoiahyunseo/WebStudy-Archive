const config = require("./.babelrc.common.js");
config.presets.push("@babel/preset-env");
config.plugins.push("@babel/plugin-transform-runtime");
module.exports = config;
