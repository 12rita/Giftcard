const paths = require('./paths');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// const env = dotenv.config({ path: paths.envPath }).parsed;
//
// // reduce it to a nice object, the same as before
// const envKeys = Object.keys(env).reduce((prev, next) => {
//     prev[`process.env.${next}`] = JSON.stringify(env[next]);
//     return prev;
// }, {});

module.exports = merge(common(), {
    // Set the mode to development or production
    mode: 'development',

    // Control how source maps are generated
    devtool: 'inline-source-map',

    // Spin up a server for quick development
    devServer: {
        historyApiFallback: true,
        static: {
            directory: paths.public
        },
        headers: {
            'Cross-Origin-Embedder-Policy': 'unsafe-none'
        },
        open: true,
        compress: true,
        hot: true,
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://localhost:3000'
            }
        }
    },

    plugins: [
        // Only update what has changed on hot reload

        new webpack.HotModuleReplacementPlugin()
        // new webpack.DefinePlugin(envKeys)
    ]
});
