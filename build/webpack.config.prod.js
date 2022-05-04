const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
module.exports = {
    mode: 'production',
    target: 'web',
    entry: path.resolve(__dirname, '../src/index.ts'),
    experiments: {
        outputModule: true
    },
    output: {
        path: path.resolve(__dirname, '../lib'),
        filename: 'index.js',
        library: {
            type: 'module'
        },
        clean: true
    },
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
            }
        ]
    },
    plugins: [ 
        new VueLoaderPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.js', '.vue']
    }
}