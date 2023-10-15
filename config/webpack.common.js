const paths = require('./paths');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require("path");

module.exports = () => {
    return {
        // Where webpack looks to start building the bundle
        entry: ['./src/index.tsx'],

        // Where webpack outputs the assets and bundles
        output: {
            path: paths.build,
            filename: 'bundle.js',
            publicPath: '/'
        },

        // Customize the webpack build process
        plugins: [
            // Removes/cleans build folders and unused assets when rebuilding
            new CleanWebpackPlugin(),
            new Dotenv({
                path: '.env.development'
            }),
            // Copies files from target to destination folder
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: paths.src + '/assets',
                        to: 'assets',
                        globOptions: {
                            ignore: ['*.DS_Store']
                        }
                    }
                ]
            }),

            // Generates an HTML file from a template
            // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
            new HtmlWebpackPlugin({
                favicon: paths.src + '/assets/icons/favicon.png',
                template: './index.html', // template file
                filename: 'index.html' // output file
            })
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            modules: [
                // path.join(__dirname, 'src/local'),
                // path.join(__dirname, 'src/global'),
                path.join(__dirname, 'src/api'),
                path.join(__dirname, 'src/assets'),
                path.join(__dirname, 'src/Map'),
                path.join(__dirname, 'src/modules'),
                path.join(__dirname, 'src/static'),
                'node_modules'
            ],
        },

        // Determine how modules within the project are treated
        module: {
            rules: [
                // JavaScript: Use Babel to transpile JavaScript files
                {
                    test: /\.(js|jsx|tsx|ts)$/,
                    exclude: /node_modules/,
                    use: 'ts-loader'
                },

                // Styles: Inject CSS into the head with source maps
                {
                    test: /\.(scss|css)$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true, importLoaders: 1 }
                        },
                        { loader: 'sass-loader', options: { sourceMap: true } }
                    ]
                },

                // Images: Copy image files to build folder
                {
                    test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                    type: 'asset/resource'
                },

                // Fonts and SVGs: Inline files
                { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' }
            ]
        }
    };
};
