const { override, overrideDevServer, } = require('customize-cra');
const { name } = require('./package');
// module.exports = function override(config, env) {
//     //do stuff with the webpack config...
//     return config;
//   }

const addOutput = () => (config) => {
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    config.output.jsonpFunction = `webpackJsonp_${name}`;
    config.output.globalObject = 'window';
    return config;
}

const addProxy = () => (configFunction) => {
    configFunction.proxy = {
        '/threejs/': {
            target: 'http://www.yanhuangxueyuan.com',
            changeOrigin: true,
            pathRewrite: { '': '' },
        },
    };
    configFunction.port =  9000;
    configFunction.headers = {  'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept'
      }
    return configFunction;
}
  module.exports = {
    webpack: override(addOutput()),
    devServer: overrideDevServer(
        addProxy()
    )
  }  