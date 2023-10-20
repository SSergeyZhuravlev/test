const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => ({
    devServer: {
        historyApiFallback: true,
        hot: true,
    },
    entry: './src/index.js',
    output: {
        filename: 'main.[contenthash].js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ttf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
                  'css-loader',
                  'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'main.[contenthash].css'
        }),
    ],
});