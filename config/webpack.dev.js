const paths = require('./paths');

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
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
        open: true,
        compress: true,
        hot: true,
        port: 8080
    },

    plugins: [
        // Only update what has changed on hot reload
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.REACT_APP_OPENCAGE_API_KEY': JSON.stringify(
                process.env.REACT_APP_OPENCAGE_API_KEY
            ),
            'process.env.REACT_APP_FIREBASE_API_KEY': JSON.stringify(
                process.env.REACT_APP_FIREBASE_API_KEY
            ),
            'process.env.REACT_APP_FIREBASE_AUTH_DOMAIN': JSON.stringify(
                process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
            ),
            'process.env.REACT_APP_PROJECT_ID': JSON.stringify(
                process.env.REACT_APP_PROJECT_ID
            ),
            'process.env.REACT_APP_FIREBASE_STORAGE_BUCKET': JSON.stringify(
                process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
            ),
            'process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID':
                JSON.stringify(
                    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
                ),
            'process.env.REACT_APP_FIREBASE_API_ID': JSON.stringify(
                process.env.REACT_APP_FIREBASE_API_ID
            )
        })
    ]
});
