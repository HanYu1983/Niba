const path = require('path');
module.exports = {
    entry: './src/main.go',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './'),
    },
    module: {
        rules: [
            { test: /\.go$/, loader: 'gopherjs-loader' },
        ]
    }
};