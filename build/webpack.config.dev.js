const path = require('path')
const HtmlWebpackPulgin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, '../demo/index.ts'),
    output: {
        path: path.resolve(__dirname, '../demo/dist'),
        filename: 'bundle.js',
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.vue$/,
                use: ['vue-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
        ]
    },
    plugins:[
        new HtmlWebpackPulgin({
            template: path.resolve(__dirname, '../demo/index.html'),
            filename: 'index.html',
            inject: 'body'
        }),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: false,
            __VUE_PROD_DEVTOOLS__: false,
        }),
    ],
    resolve: {
        extensions: ['.vue', '.ts', '.js']
    }
}