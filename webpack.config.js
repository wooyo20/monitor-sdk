const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index.js', //入口文件
    context: process.cwd(), //上下文目录
    mode: 'development', //开发模式
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'monitor.js'
    },
    devServer: {
        // contentBase: path.resolve(__dirname, 'dist'),
        static: 'dist',
        onBeforeSetupMiddleware: (devServer) => {
            devServer.app.get('/success', (req, res) => {
                res.json({ id: 1 })
            });
            devServer.app.get('/fail', (req, res) => {
                res.sendStatus(5000)
            });
        }
    },
    plugins: [
        new HtmlWebpackPlugin({ //自动打包html
            template: './src/index.html',
            inject: 'head'
        })
    ]
}