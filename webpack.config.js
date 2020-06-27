const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let common_config = {
    node: {
        __dirname: true
    },
    mode: process.env.ENV || 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    watch: true,
    devtool: 'inline-source-map'
};

module.exports = [
    Object.assign({}, common_config, {
        target: 'electron-main',
        entry: {
            renderrer: './src/main/main.ts',
        },
        output: {
            filename: '[name]-bundle.js',
            path: path.resolve(__dirname, 'dist/main')
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: [
                        /node_modules/,
                        path.resolve(__dirname, "src/ui")
                    ]
                }
            ]
        }
    }),
    Object.assign({}, common_config, {
        target: 'electron-renderer',
        entry: {
            ui: './src/renderer/main.ts',
        },
        output: {
            filename: '[name]-bundle.js',
            path: path.resolve(__dirname, 'dist/renderer')
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: [
                        /node_modules/,
                        path.resolve(__dirname, "src/ui")
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
                },
                {
                    test: /\.mp3$/,
                    loader: "file-loader",
                    options: {
                        name: '[path][name].[ext]',
                    },
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                }
            ]
        },
        resolve: {
            modules: [path.join(__dirname, "./node_modules"), path.join(__dirname, "./src/renderer")],
            extensions: ['.tsx', '.ts', '.js', ".css", ".scss"],
            alias: {
                vue: 'vue/dist/vue.js'
            }
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/renderer/index.htm"
            }),
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css',
            }),
        ]
    })
]