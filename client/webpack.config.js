const merge = require('webpack-merge');
const dev = require('./webpack/webpack.dev.js');
const prod = require('./webpack/webpack.prod.js');

module.exports = env => merge(env.NODE_ENV === 'development' ? dev : prod);