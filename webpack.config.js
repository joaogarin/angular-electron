// @joaogarin

/*
 * Helper: root(), and rootDir() are defined at the bottom
 */
const webpack = require('webpack');
const helpers = require('./helpers');
const path = require('path');

const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');

var METADATA = {
    title: 'Angular2 Minimal Starter',
    baseUrl: '/',
    ENV: 'development'
};

/*
 * Config
 */
var config = {
    // static data for index.html
    metadata: METADATA,
    // for faster builds use 'eval'
    devtool: 'source-map',
    debug: true,
    // cache: false,

    // our angular app
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/app/app'
    },

    // Config for our build files
    output: {
        path: helpers.root('src/app/dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js'
    },

    resolve: {
        // ensure loader extensions match
        extensions: helpers.prepend(['.ts', '.js', '.json', '.css', '.html'], '.async') // ensure .async.ts etc also works
    },

    module: {
        preLoaders: [{
            test: /\.ts$/,
            loader: "tslint"
        }],
        loaders: [
            // Support for .ts files.
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
                exclude: [/\.(spec|e2e)\.ts$/]
            },

            // Support for *.json files.
            {
                test: /\.json$/,
                loader: 'json-loader'
            },

            // Support for .scss files.
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            },

            // support for .html antd .css as raw text
            {
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: [helpers.root('app/index.html')]
            },

            // support for fonts
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader?name=dist/[name]-[hash].[ext]'
            },

            // support for svg icons
            {
                test: /\.svg/,
                loader: 'svg-url-loader'
            }
        ]
    },

    sassLoader: {
        includePaths: [path.resolve(__dirname, "./src/app")]
    },

    plugins: [

        // Plugin: CommonsChunkPlugin
        // Description: Shares common code between the pages.
        // It identifies common modules and put them into a commons chunk.
        //
        // See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
        // See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
        new webpack.optimize.CommonsChunkPlugin({ name: ['vendor', 'polyfills'], minChunks: Infinity }),
    ],
    // Other module loader config
    tslint: {
        emitErrors: true,
        failOnHint: false,
        resourcePath: 'src/*'
    },
    // we need this due to problems with es6-shim
    node: {
        global: 'window',
        progress: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
};

/**
 * Target Electron
 */
config.target = webpackTargetElectronRenderer(config);
module.exports = config;
